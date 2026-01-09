import { ModelDefinition } from '../types';

export const Models: Record<string, ModelDefinition> = {
    "Llama-3-8B-Instruct": {
        size: 8,
        layers: 32,
        hidden: 4096,
        kv_heads: 8,
        head_dim: 128,
        recommendedTP: 1,
        throughputByBatch: {
            h100: { 1: 1200, 8: 3000, 32: 4200, 128: 4500 },
            a100: { 1: 400, 8: 1200, 32: 1800, 128: 2000 },
            l40s: { 1: 300, 8: 900, 32: 1400, 128: 1600 }
        },
        description: "Efficient edge/small-server model. Low VRAM footprint."
    },
    "Llama-3-70B-Instruct": {
        size: 70,
        layers: 80,
        hidden: 8192,
        kv_heads: 8,
        head_dim: 128,
        recommendedTP: 2,
        throughputByBatch: {
            h100: { 1: 160, 8: 280, 32: 450, 128: 600 },
            a100: { 1: 60, 8: 100, 32: 180, 128: 240 },
            l40s: { 1: 40, 8: 70, 32: 120, 128: 160 }
        },
        description: "Standard enterprise chat. Heavy compute, efficient KV thanks to GQA."
    },
    "Llama-3.1-70B-Instruct": {
        size: 70,
        layers: 80,
        hidden: 8192,
        kv_heads: 8,
        head_dim: 128,
        recommendedTP: 2,
        throughputByBatch: {
            h100: { 1: 160, 8: 280, 32: 450, 128: 600 },
            a100: { 1: 60, 8: 100, 32: 180, 128: 240 },
            l40s: { 1: 40, 8: 70, 32: 120, 128: 160 }
        },
        description: "128k context support. Same base compute/memory profile."
    },
    "Mixtral-8x7B": {
        size: 47,
        layers: 32,
        hidden: 4096,
        kv_heads: 8,
        head_dim: 128,
        recommendedTP: 1,
        throughputByBatch: {
            h100: { 1: 200, 8: 350, 32: 550, 128: 700 },
            a100: { 1: 80, 8: 150, 32: 250, 128: 320 },
            l40s: { 1: 60, 8: 120, 32: 200, 128: 260 }
        },
        description: "Sparse MoE. Fast generation, high VRAM usage for weights."
    },
    "Falcon-180B": {
        size: 180,
        layers: 80,
        hidden: 14848,
        kv_heads: 8,
        head_dim: 128,
        recommendedTP: 4,
        throughputByBatch: {
            h100: { 1: 80, 8: 140, 32: 220, 128: 300 },
            a100: { 1: 20, 8: 40, 32: 70, 128: 90 },
            l40s: { 1: 15, 8: 30, 32: 50, 128: 70 }
        },
        description: "Massive open model. Heavy compute/memory requirements."
    },
    "Qwen3-0.6B-Instruct": {
        size: 0.6,
        layers: 24,
        hidden: 896,
        kv_heads: 2,
        head_dim: 64,
        recommendedTP: 1,
        throughputByBatch: {
            h100: { 1: 3500, 8: 8000, 32: 12000, 128: 15000 },
            a100: { 1: 1500, 8: 4000, 32: 6000, 128: 7000 },
            l40s: { 1: 1200, 8: 3000, 32: 5000, 128: 6000 }
        },
        description: "Tiny edge model. Extreme throughput."
    },
    "Qwen3-1.7B-Instruct": {
        size: 1.7,
        layers: 24,
        hidden: 2048,
        kv_heads: 2,
        head_dim: 128,
        recommendedTP: 1,
        throughputByBatch: {
            h100: { 1: 2500, 8: 6000, 32: 9000, 128: 11000 },
            a100: { 1: 1000, 8: 2500, 32: 4000, 128: 5000 },
            l40s: { 1: 800, 8: 2000, 32: 3500, 128: 4500 }
        },
        description: "Mobile-class model. Very fast."
    },
    "Qwen3-4B-Instruct": {
        size: 4,
        layers: 40,
        hidden: 2560,
        kv_heads: 4,
        head_dim: 128,
        recommendedTP: 1,
        throughputByBatch: {
            h100: { 1: 1800, 8: 4500, 32: 6500, 128: 7500 },
            a100: { 1: 700, 8: 1800, 32: 2800, 128: 3200 },
            l40s: { 1: 500, 8: 1400, 32: 2200, 128: 2500 }
        },
        description: "Efficient desktop-class model."
    },
    "Qwen3-8B-Instruct": {
        size: 8,
        layers: 32,
        hidden: 4096,
        kv_heads: 8,
        head_dim: 128,
        recommendedTP: 1,
        throughputByBatch: {
            h100: { 1: 1200, 8: 3000, 32: 4200, 128: 4500 },
            a100: { 1: 400, 8: 1200, 32: 1800, 128: 2000 },
            l40s: { 1: 300, 8: 900, 32: 1400, 128: 1600 }
        },
        description: "General purpose. Equivalent to Llama-3-8B."
    },
    "Qwen3-14B-Instruct": {
        size: 14,
        layers: 40,
        hidden: 5120,
        kv_heads: 8,
        head_dim: 128,
        recommendedTP: 1,
        throughputByBatch: {
            h100: { 1: 800, 8: 2000, 32: 2800, 128: 3200 },
            a100: { 1: 250, 8: 800, 32: 1200, 128: 1400 },
            l40s: { 1: 200, 8: 600, 32: 900, 128: 1100 }
        },
        description: "Balanced power/performance."
    },
    "Qwen3-30B-Instruct": {
        size: 30,
        layers: 60,
        hidden: 6144,
        kv_heads: 8,
        head_dim: 128,
        recommendedTP: 2,
        throughputByBatch: {
            h100: { 1: 400, 8: 1000, 32: 1500, 128: 1800 },
            a100: { 1: 150, 8: 400, 32: 600, 128: 700 },
            l40s: { 1: 120, 8: 300, 32: 450, 128: 550 }
        },
        description: "Mid-weight dense model."
    },
    "Qwen3-32B-Instruct": {
        size: 32,
        layers: 64,
        hidden: 6144,
        kv_heads: 8,
        head_dim: 128,
        recommendedTP: 2,
        throughputByBatch: {
            h100: { 1: 380, 8: 950, 32: 1400, 128: 1700 },
            a100: { 1: 140, 8: 380, 32: 550, 128: 650 },
            l40s: { 1: 110, 8: 280, 32: 420, 128: 500 }
        },
        description: "Optimized 32B variant."
    },
    "Qwen3-235B-Instruct": {
        size: 235,
        layers: 80,
        hidden: 12288,
        kv_heads: 8,
        head_dim: 128,
        recommendedTP: 8,
        throughputByBatch: {
            h100: { 1: 60, 8: 120, 32: 200, 128: 250 },
            a100: { 1: 15, 8: 30, 32: 50, 128: 60 },
            l40s: { 1: 10, 8: 20, 32: 30, 128: 40 }
        },
        description: "Massive foundation model. Requires multi-node or 8xH100."
    }
};
