import { Layers, Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Metrics, AppConfig } from "../types";
import { Hardware } from "../data/hardware";
import { formatNum } from "../utils/format";

interface InstanceTopologyProps {
    metrics: Metrics | null;
    config: AppConfig;
    isCalculating?: boolean;
}

export function InstanceTopology({ metrics, config, isCalculating }: InstanceTopologyProps) {

    if (!metrics) return null;

    const totalVramPerInstance = metrics.minGpusPerInstance * Hardware[config.hardware].vram * config.utilizationTarget;
    const weightsPct = (metrics.modelWeightsMem / totalVramPerInstance) * 100;
    const kvPct = 100 - weightsPct;

    return (
        <>
            <div className={`bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 p-6 rounded-lg shadow-lg transition-opacity duration-300 ${isCalculating ? 'opacity-80' : 'opacity-100'}`}>
                <div className="flex items-center gap-2 mb-6 text-neutral-300 border-b border-neutral-800 pb-2">
                    <Layers className="w-5 h-5 text-neutral-500" />
                    <h2 className="text-xl font-bold">Instance Topology (Replica)</h2>
                    <Popover>
                        <PopoverTrigger>
                            <Info className="w-4 h-4 text-neutral-500 hover:text-neutral-300 cursor-pointer ml-1" />
                        </PopoverTrigger>
                        <PopoverContent className="w-64 bg-neutral-900 border-neutral-800 text-neutral-300 p-3">
                            <div className="space-y-2 text-xs">
                                <p><span className="font-bold text-rose-400">Replica Topology:</span></p>
                                <p>A self-contained unit of GPUs (e.g., 4x or 8x) that holds one full copy of the model weights and can serve a batch of users independently.</p>
                                <p className="text-neutral-500 italic">More users → More replicas needed.</p>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-8">
                    {/* VRAM Bar */}
                    <div>
                        <div className="flex justify-between text-sm mb-2 text-neutral-400">
                            <span>VRAM Usage Per Replica ({metrics.minGpusPerInstance}x GPU)</span>
                            <span>{metrics.maxUsersPerInstance} Users Max / Instance</span>
                        </div>
                        <div className="relative h-12 bg-black rounded overflow-hidden border border-neutral-800 flex">
                            {/* Weights (Static/Gray) */}
                            <div
                                className={`h-full bg-neutral-700 border-r border-black/50 relative group flex items-center justify-center transition-all duration-500 ease-out ${isCalculating ? 'w-[5%] animate-pulse' : ''}`}
                                style={{ width: isCalculating ? '20%' : `${weightsPct}%` }}
                            >
                                {!isCalculating && <span className="text-[10px] text-white font-bold drop-shadow-md whitespace-nowrap px-1 overflow-hidden">Weights</span>}
                            </div>
                            {/* KV Cache Space (Dynamic/Neutral) */}
                            <div
                                className={`h-full bg-neutral-800 relative group flex items-center justify-center transition-all duration-500 ease-out ${isCalculating ? 'animate-pulse bg-neutral-900' : ''}`}
                                style={{ width: isCalculating ? '80%' : `${kvPct}%` }}
                            >
                                {!isCalculating && <span className="text-[10px] text-neutral-500 font-bold whitespace-nowrap px-1 overflow-hidden">Available for KV Cache</span>}
                                {isCalculating && <span className="text-[10px] text-neutral-600 font-bold animate-pulse">Calculating...</span>}
                            </div>
                        </div>
                        <div className="flex justify-between text-[10px] text-neutral-600 mt-2">
                            <span>Model: {formatNum(metrics.modelWeightsMem)} GB</span>
                            <span>Replica Capacity: {formatNum(totalVramPerInstance)} GB (Usable)</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
