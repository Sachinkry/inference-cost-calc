import { useState, useEffect, useCallback } from 'react';
import { Models } from '../data/models';
import { Hardware } from '../data/hardware';
import { AppConfig, Metrics } from '../types';
import { interpolateThroughput, getLatencyPenalty, getQuantizationSpeedup, estimateLatencyMs } from '../utils/math';

const DEFAULT_CONFIG: AppConfig = {
    model: "Llama-3.1-70B-Instruct",
    hardware: "NVIDIA H100 SXM (80GB)",
    concurrentUsers: 100,
    activeDecodeFraction: 0.25,
    tokensPerUser: 20,
    batchSize: 32,
    pagedAttention: true,
    avgContextLength: 4096,
    quantization: "FP16",
    latencyClass: "interactive",
    utilizationTarget: 0.85
};

export function useInferencePlanner() {
    const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [isStale, setIsStale] = useState(false);

    // Comparison State
    const [comparisonMode, setComparisonMode] = useState(false);
    const [baselineMetrics, setBaselineMetrics] = useState<Metrics | null>(null);
    const [, setBaselineConfig] = useState<AppConfig | null>(null);

    const calculateMetrics = useCallback((cfg: AppConfig): Metrics => {
        const model = Models[cfg.model];
        const hw = Hardware[cfg.hardware];

        // 1. Quantization
        let weightQuantFactor = 1.0;
        let kvQuantFactor = 1.0;
        if (cfg.quantization === "FP8") { weightQuantFactor = 0.5; kvQuantFactor = 0.5; }
        if (cfg.quantization === "INT8") { weightQuantFactor = 0.5; kvQuantFactor = 1.0; }
        if (cfg.quantization === "GPTQ-4bit") { weightQuantFactor = 0.35; kvQuantFactor = 1.0; }

        const MEMORY_OVERHEAD_PCT = 1.10;

        // 2. Memory
        const modelWeightsMem = model.size * weightQuantFactor * 2;
        let kvTokensPerUser = cfg.avgContextLength;
        if (cfg.pagedAttention) {
            const avgGeneratedLength = Math.min(cfg.avgContextLength, cfg.tokensPerUser * 5);
            kvTokensPerUser = avgGeneratedLength;
        }
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
    }, []);

    const handleCalculate = useCallback(() => {
        const calculated = calculateMetrics(config);
        setMetrics(calculated);
        setIsStale(false);
    }, [config, calculateMetrics]);

    // Update metrics when model/hw changes significantly if desired, 
    // but original code only auto-calculated on mount, then manual?
    // Original: useEffect mount -> handleCalculate. updateConfig -> setIsStale(true).

    useEffect(() => {
        handleCalculate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateConfig = (key: keyof AppConfig, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
        setIsStale(true);
    };

    const toggleComparison = () => {
        if (!comparisonMode) {
            setBaselineConfig({ ...config });
            setBaselineMetrics(metrics ? { ...metrics } : null);
            setComparisonMode(true);
        } else {
            setComparisonMode(false);
            setBaselineMetrics(null);
            setBaselineConfig(null);
        }
    };

    return {
        config,
        metrics,
        isStale,
        comparisonMode,
        baselineMetrics,
        updateConfig,
        handleCalculate,
        toggleComparison
    };
}
