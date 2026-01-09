import { ModelDefinition } from '../types';

export const interpolateThroughput = (model: ModelDefinition, hwKey: string, batchSize: number): number => {
    const lookup = model.throughputByBatch[hwKey];
    if (!lookup) return 0;

    const batches = Object.keys(lookup).map(Number).sort((a, b) => a - b);
    if (batchSize <= batches[0]) return lookup[batches[0]];
    if (batchSize >= batches[batches.length - 1]) return lookup[batches[batches.length - 1]];

    for (let i = 0; i < batches.length - 1; i++) {
        const b1 = batches[i];
        const b2 = batches[i + 1];
        if (batchSize >= b1 && batchSize <= b2) {
            const t1 = lookup[b1];
            const t2 = lookup[b2];
            const ratio = (batchSize - b1) / (b2 - b1);
            return t1 + (t2 - t1) * ratio;
        }
    }
    return lookup[batches[0]];
};

export const getLatencyPenalty = (latencyClass: 'interactive' | 'batch', batchSize: number): number => {
    if (latencyClass === "batch") return 1.0;
    if (batchSize <= 1) return 1.0;
    if (batchSize <= 4) return 0.85;
    if (batchSize <= 16) return 0.65;
    if (batchSize <= 64) return 0.45;
    return 0.3;
};

export const getQuantizationSpeedup = (quantization: string, modelSize: number): number => {
    if (quantization === "FP16") return 1.0;
    if (quantization === "FP8") return modelSize <= 30 ? 1.5 : 1.2;
    if (quantization === "INT8") return modelSize <= 30 ? 1.4 : 1.15;
    if (quantization === "GPTQ-4bit") return modelSize <= 30 ? 2.2 : 1.6;
    return 1.0;
};

export const estimateLatencyMs = (batchSize: number, contextLength: number, tokensPerUser: number): number => {
    const contextReadTime = contextLength / 50000;
    const generationTime = tokensPerUser / 100;
    const queueWaitTime = batchSize * 0.02;
    return (contextReadTime + generationTime + queueWaitTime) * 1000;
};
