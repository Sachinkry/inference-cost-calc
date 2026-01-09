export interface ThroughputMap {
    [key: number]: number;
}

export interface ModelDefinition {
    size: number;
    layers: number;
    hidden: number;
    kv_heads: number;
    head_dim: number;
    recommendedTP: number;
    throughputByBatch: {
        h100: ThroughputMap;
        a100: ThroughputMap;
        l40s?: ThroughputMap;
        [key: string]: ThroughputMap | undefined;
    };
    description: string;
}

export interface HardwareDefinition {
    id: string;
    vram: number;
    bw: number;
    power: number;
    cost_hr: number;
    type: 'h100' | 'a100' | 'l40s';
}

export interface AppConfig {
    model: string;
    hardware: string;
    concurrentUsers: number;
    activeDecodeFraction: number;
    tokensPerUser: number;
    batchSize: number;
    pagedAttention: boolean;
    avgContextLength: number;
    quantization: string;
    latencyClass: 'interactive' | 'batch';
    utilizationTarget: number;
}

export interface Metrics {
    requiredGpus: number;
    minGpusPerInstance: number;
    instancesNeededForMem: number;
    maxUsersPerInstance: number;
    modelWeightsMem: number;
    kvPerUserGB: number;
    gpusForMem: number;
    gpusForCompute: number;
    hourlyCost: number;
    monthlyCost: number;
    costPer1MInput: number;
    costPer1MOutput: number;
    effectiveThroughputPerGpu: number;
    totalTpsDemand: number;
    estLatency: number;
    recommendedTP: number;
    latencyPenalty: number;
    quantMult: number;
    baseThroughput: number;
}
