import { describe, it, expect } from 'vitest';
import { interpolateThroughput, getLatencyPenalty, getQuantizationSpeedup, estimateLatencyMs } from '@/utils/math';
import { ModelDefinition } from '@/types';

describe('math utils', () => {
    describe('interpolateThroughput', () => {
        // Mock model with throughput data
        const mockModel: ModelDefinition = {
            size: 10,
            layers: 10,
            hidden: 10,
            kv_heads: 10,
            head_dim: 10,
            throughputByBatch: {
                'test-gpu': { 1: 100, 8: 200, 32: 400 }
            }
        } as any;

        it('returns 0 if hardware not found', () => {
            expect(interpolateThroughput(mockModel, 'unknown-gpu', 1)).toBe(0);
        });

        it('returns exact value for known batch size', () => {
            expect(interpolateThroughput(mockModel, 'test-gpu', 8)).toBe(200);
        });

        it('interpolates linearly between batch sizes', () => {
            // 1->100, 8->200. Range is 7. Value diff is 100.
            // Batch 4.5 (midpoint) should be 150.
            expect(interpolateThroughput(mockModel, 'test-gpu', 4.5)).toBe(150);
        });

        it('clamps to min batch size', () => {
            expect(interpolateThroughput(mockModel, 'test-gpu', 0.5)).toBe(100);
        });

        it('clamps to max batch size', () => {
            expect(interpolateThroughput(mockModel, 'test-gpu', 64)).toBe(400);
        });
    });

    describe('getLatencyPenalty', () => {
        it('returns 1.0 for batch mode', () => {
            expect(getLatencyPenalty('batch', 32)).toBe(1.0);
        });

        it('penalizes distinctively in interactive mode', () => {
            expect(getLatencyPenalty('interactive', 1)).toBe(1.0);
            expect(getLatencyPenalty('interactive', 4)).toBe(0.85); // Small batch penalty
            expect(getLatencyPenalty('interactive', 32)).toBe(0.45); // Large batch penalty
        });
    });

    describe('getQuantizationSpeedup', () => {
        it('returns 1.0 for FP16', () => {
            expect(getQuantizationSpeedup('FP16', 70)).toBe(1.0);
        });

        it('gives higher speedup for small models on FP8', () => {
            expect(getQuantizationSpeedup('FP8', 7)).toBe(1.5); // Small
            expect(getQuantizationSpeedup('FP8', 70)).toBe(1.2); // Large
        });

        it('gives massive speedup for GPTQ-4bit on small models', () => {
            expect(getQuantizationSpeedup('GPTQ-4bit', 7)).toBe(2.2);
        });
    });

    describe('estimateLatencyMs', () => {
        it('calculates latency based on formula', () => {
            // contextReadTime = 50000/50000 = 1s
            // generationTime = 100/100 = 1s
            // queueWaitTime = 1 * 0.02 = 0.02s
            // Total = 2.02s = 2020ms
            expect(estimateLatencyMs(1, 50000, 100)).toBeCloseTo(2020);
        });
    });
});
