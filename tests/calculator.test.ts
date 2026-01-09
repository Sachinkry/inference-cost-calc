import { describe, it, expect } from 'vitest';
import { calculateInferenceMetrics } from '@/utils/calculator';
import { AppConfig } from '@/types';

const BASE_CONFIG: AppConfig = {
    model: "Llama-3.1-70B-Instruct",
    hardware: "NVIDIA H100 SXM (80GB)",
    concurrentUsers: 1,
    activeDecodeFraction: 1.0,
    tokensPerUser: 100,
    batchSize: 1,
    pagedAttention: true,
    avgContextLength: 4096,
    quantization: "FP16",
    latencyClass: "interactive",
    utilizationTarget: 0.85
};

describe('calculateInferenceMetrics', () => {
    it('calculates metrics for a single user base case', () => {
        const metrics = calculateInferenceMetrics(BASE_CONFIG);
        expect(metrics).toBeDefined();
        expect(metrics.requiredGpus).toBeGreaterThan(0);
        expect(metrics.hourlyCost).toBeGreaterThan(0);
    });

    it('scales VRAM usage with context length', () => {
        // Test that increasing context length increases VRAM usage (or decreases users per GPU)
        const smallContextMetrics = calculateInferenceMetrics({ ...BASE_CONFIG, avgContextLength: 1000 });
        const largeContextMetrics = calculateInferenceMetrics({ ...BASE_CONFIG, avgContextLength: 32000 });

        // Larger context = more KV cache = fewer users per instance OR more memory usage.
        // Since we only have 1 user, let's look at kvPerUserGB
        expect(largeContextMetrics.kvPerUserGB).toBeGreaterThan(smallContextMetrics.kvPerUserGB);
    });

    it('shows efficiency gain from PagedAttention', () => {
        // PagedAttention OFF should result in higher overhead -> potentially more GPUs or fewer users per GPU.
        // Our logic: MEMORY_OVERHEAD_PCT = cfg.pagedAttention ? 1.05 : 1.25;

        // Let's use a scenario where memory is tight.
        const config = { ...BASE_CONFIG, concurrentUsers: 100 };

        const withPA = calculateInferenceMetrics({ ...config, pagedAttention: true });
        const withoutPA = calculateInferenceMetrics({ ...config, pagedAttention: false });

        // Without PA, overhead is higher, so we might need more GPUs or check instances.
        // Or check minGpusPerInstance which is directly affected by overhead.

        // minGpusPerInstance = ceil((weights * overhead) / vram)
        // larger overhead might push it up.

        // Let's just verify the logic we changed: overhead factor.
        // We can't access internal vars, but we can check results.
        // If overhead is higher, `availableKvPerInstance` should be lower.
        // maxUsersPerInstance = floor(availableKvPerInstance / kvPerUserGB)

        expect(withPA.maxUsersPerInstance).toBeGreaterThanOrEqual(withoutPA.maxUsersPerInstance);
    });

    it('scales costs accurately', () => {
        const singleGpuCost = calculateInferenceMetrics(BASE_CONFIG).hourlyCost;
        // Force 2 GPUs by picking a huge model or just mocking hardware cost scaling?
        // Let's just check that if we double users and trigger more instances, cost goes up.

        // 1000 users should require more GPUs than 1 user
        const heavyLoad = calculateInferenceMetrics({ ...BASE_CONFIG, concurrentUsers: 1000 });
        const lightLoad = calculateInferenceMetrics({ ...BASE_CONFIG, concurrentUsers: 1 });

        expect(heavyLoad.hourlyCost).toBeGreaterThan(lightLoad.hourlyCost);
    });
});
