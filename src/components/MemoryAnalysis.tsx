import { useMemo } from 'react';
import { Metrics, AppConfig } from '../types';
import { formatNum } from '../utils/format';
import { Hardware } from '../data/hardware';

interface MemoryAnalysisProps {
    metrics: Metrics;
    config: AppConfig;
    isCalculating?: boolean;
}

export function MemoryAnalysis({ metrics, config, isCalculating }: MemoryAnalysisProps) {
    const data = useMemo(() => {
        // ... (keep usage as is)
        const hwDef = Hardware[config.hardware];
        const vramPerGpu = hwDef ? hwDef.vram : 80;
        const totalSystemVram = metrics.requiredGpus * vramPerGpu;
        const totalWeights = metrics.modelWeightsMem * metrics.instancesNeededForMem;
        const totalKv = metrics.kvPerUserGB * config.concurrentUsers;
        const totalUsed = totalWeights + totalKv;
        const percentUsed = Math.min(100, (totalUsed / totalSystemVram) * 100);

        return {
            totalSystemVram,
            totalWeights,
            totalKv,
            totalUsed,
            percentUsed,
            weightsPercent: (totalWeights / totalSystemVram) * 100,
            kvPercent: (totalKv / totalSystemVram) * 100
        };
    }, [metrics, config]);

    return (
        <div className={`border border-rose-900/30 rounded-lg overflow-hidden font-mono text-sm bg-gradient-to-br from-rose-950/30 to-black shadow-lg transition-opacity duration-300 ${isCalculating ? 'opacity-80' : 'opacity-100'}`}>
            {/* Header */}
            <div className="bg-transparent border-b border-rose-900/30 p-3 flex justify-between items-center px-4">
                <div className="text-rose-400 font-bold tracking-widest uppercase text-xs">
                    Inference Memory Estimate
                </div>
                <div className="text-[10px] text-rose-500/50 uppercase tracking-widest">
                    {metrics.requiredGpus}x {config.hardware.split('(')[0]}
                </div>
            </div>

            <div className="divide-y divide-rose-900/30">
                {/* Total Row */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3 text-rose-200 font-bold text-xs uppercase tracking-wider">Total Memory Requirements</div>
                    <div className="md:col-span-9 space-y-2">
                        <div className="flex justify-between text-xs font-mono text-rose-300/70">
                            <span><span className="text-rose-100">{formatNum(data.totalUsed)} GB</span> Used</span>
                            <span>{formatNum(data.totalSystemVram)} GB Capacity</span>
                        </div>
                        <div className="h-4 bg-black/50 rounded-sm overflow-hidden border border-rose-900/30 relative">
                            <div
                                className={`h-full bg-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.5)] transition-all duration-500 ${isCalculating ? 'w-[10%] animate-pulse' : ''}`}
                                style={{ width: isCalculating ? '10%' : `${data.percentUsed}% ` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Weights Row */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3">
                        <div className="text-rose-300 font-bold text-xs uppercase tracking-wider">Model Weights</div>
                        <div className="text-[10px] text-rose-500/50 uppercase">{config.quantization} • {metrics.instancesNeededForMem} Replicas</div>
                    </div>
                    <div className="md:col-span-9 space-y-2">
                        <div className="flex justify-between text-xs font-mono">
                            <div className="flex items-baseline gap-2">
                                <span className="text-rose-100">{formatNum(data.totalWeights)} GB</span>
                                <span className="text-rose-400/60">({formatNum(data.weightsPercent)}%)</span>
                            </div>
                            <span className="text-rose-500/50">Static</span>
                        </div>
                        <div className="h-6 bg-black/50 rounded-sm overflow-hidden border border-rose-900/30 relative group">
                            <div
                                className={`h-full bg-amber-500/80 transition-all duration-500 ${isCalculating ? 'bg-amber-500/30 animate-pulse w-[20%]' : ''}`}
                                style={{ width: isCalculating ? '20%' : `${(data.totalWeights / data.totalSystemVram) * 100}% ` }}
                            ></div>
                            {/* Striped pattern overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.1)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.1)_75%,transparent_75%,transparent)] bg-[length:10px_10px] opacity-30"></div>

                            <div className="absolute inset-0 flex items-center px-3 text-[10px] text-black font-bold tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                                Model Parameters
                            </div>
                        </div>
                    </div>
                </div>

                {/* KV Cache Row */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3">
                        <div className="text-rose-300 font-bold text-xs uppercase tracking-wider">KV Cache</div>
                        <div className="text-[10px] text-rose-500/50 uppercase">Context Window</div>
                    </div>
                    <div className="md:col-span-9 space-y-2">
                        <div className="flex justify-between text-xs font-mono">
                            <div className="flex items-baseline gap-2">
                                <span className="text-rose-100">{formatNum(data.totalKv)} GB</span>
                                <span className="text-rose-400/60">({formatNum(data.kvPercent)}%)</span>
                            </div>
                            <span className="text-rose-500/50">{config.concurrentUsers} Concurrent Users</span>
                        </div>
                        <div className="h-6 bg-black/50 rounded-sm overflow-hidden border border-rose-900/30 relative group">
                            <div
                                className={`h-full bg-rose-500/60 transition-all duration-500 ${isCalculating ? 'bg-rose-500/20 animate-pulse w-[40%]' : ''}`}
                                style={{ width: isCalculating ? '40%' : `${(data.totalKv / data.totalSystemVram) * 100}% ` }}
                            ></div>
                            {/* Striped pattern overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.1)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.1)_75%,transparent_75%,transparent)] bg-[length:10px_10px] opacity-30"></div>

                            <div className="absolute inset-0 flex items-center px-3 text-[10px] text-white/90 font-bold tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                                Context Memory
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
