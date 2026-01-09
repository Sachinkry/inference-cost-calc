import { AppConfig, Metrics } from '../types';
import { Models } from '../data/models';
import { Hardware } from '../data/hardware';
import { interpolateThroughput, getLatencyPenalty, getQuantizationSpeedup, estimateLatencyMs } from './math';

export const calculateInferenceMetrics = (cfg: AppConfig): Metrics => {
    const model = Models[cfg.model];
    const hw = Hardware[cfg.hardware];

    // 1. Quantization
    let weightQuantFactor = 1.0;
    let kvQuantFactor = 1.0;
    if (cfg.quantization === "FP8") { weightQuantFactor = 0.5; kvQuantFactor = 0.5; }
    if (cfg.quantization === "INT8") { weightQuantFactor = 0.5; kvQuantFactor = 1.0; }
    if (cfg.quantization === "GPTQ-4bit") { weightQuantFactor = 0.35; kvQuantFactor = 1.0; }

    // Lower overhead with PagedAttention (fragmentation reduction)
    const MEMORY_OVERHEAD_PCT = cfg.pagedAttention ? 1.05 : 1.25;

    // 2. Memory
    const modelWeightsMem = model.size * weightQuantFactor * 2;
    // KV Tokens per user is strictly the context length, PagedAttention just helps fit them.
    const kvTokensPerUser = cfg.avgContextLength;

    const bytesPerTokenKV = 2 * model.layers * model.kv_heads * model.head_dim * 2 * kvQuantFactor;
    const kvPerUserGB = (bytesPerTokenKV * kvTokensPerUser) / 1e9;

    // TP & Instances
    const recommendedTP = model.recommendedTP || 1;
    const availableVramPerGpu = hw.vram * cfg.utilizationTarget;
    const effectiveWeightsPerGpu = modelWeightsMem / recommendedTP;
    let minGpusPerInstance = Math.ceil((effectiveWeightsPerGpu * MEMORY_OVERHEAD_PCT) / availableVramPerGpu) * recommendedTP;
    minGpusPerInstance = Math.max(minGpusPerInstance, recommendedTP);

    const totalVramPerInstance = minGpusPerInstance * availableVramPerGpu;
    const availableKvPerInstance = totalVramPerInstance - (modelWeightsMem * MEMORY_OVERHEAD_PCT);
    const maxUsersPerInstance = Math.floor(availableKvPerInstance / kvPerUserGB);

    const instancesNeededForMem = maxUsersPerInstance > 0
        ? Math.ceil(cfg.concurrentUsers / maxUsersPerInstance)
        : 999;
    const gpusForMem = instancesNeededForMem * minGpusPerInstance;

    // 3. Compute
    const totalTpsDemand = cfg.concurrentUsers * cfg.activeDecodeFraction * cfg.tokensPerUser;
    const hwType = hw.type || 'a100';
    const baseThroughput = interpolateThroughput(model, hwType, cfg.batchSize);
    const quantMult = getQuantizationSpeedup(cfg.quantization, model.size);
    const latencyPenalty = getLatencyPenalty(cfg.latencyClass, cfg.batchSize);
    const effectiveThroughputPerGpu = baseThroughput * quantMult * latencyPenalty;
    const gpusForCompute = Math.ceil(totalTpsDemand / (effectiveThroughputPerGpu * cfg.utilizationTarget));

    // 4. Results
    const requiredGpus = Math.max(gpusForMem, gpusForCompute);
    const hourlyCost = requiredGpus * hw.cost_hr;
    const monthlyCost = hourlyCost * 24 * 30;

    const requestsPerMin = 2;
    const inputTokensPerHour = cfg.concurrentUsers * (requestsPerMin * 60) * cfg.avgContextLength;
    const costPer1MInput = inputTokensPerHour > 0 ? (hourlyCost / inputTokensPerHour) * 1000000 : 0;
    const outputTokensPerHour = totalTpsDemand * 3600;
    const costPer1MOutput = outputTokensPerHour > 0 ? (hourlyCost / outputTokensPerHour) * 1000000 : 0;
    const estLatency = estimateLatencyMs(cfg.batchSize, cfg.avgContextLength, cfg.tokensPerUser);

    return {
        requiredGpus,
        minGpusPerInstance,
        instancesNeededForMem,
        maxUsersPerInstance,
        modelWeightsMem,
        kvPerUserGB,
        gpusForMem,
        gpusForCompute,
        hourlyCost,
        monthlyCost,
        costPer1MInput,
        costPer1MOutput,
        effectiveThroughputPerGpu,
        totalTpsDemand,
        estLatency,
        recommendedTP,
        latencyPenalty,
        quantMult,
        baseThroughput
    };
};
