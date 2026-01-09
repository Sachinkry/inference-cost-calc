import { Layers, HelpCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Metrics, AppConfig } from "../types";
import { Hardware } from "../data/hardware";
import { formatNum } from "../utils/format";

interface InstanceTopologyProps {
    metrics: Metrics | null;
    config: AppConfig;
}

export function InstanceTopology({ metrics, config }: InstanceTopologyProps) {
    const [showAssumptions, setShowAssumptions] = useState(false);

    if (!metrics) return null;

    const totalVramPerInstance = metrics.minGpusPerInstance * Hardware[config.hardware].vram * config.utilizationTarget;
    const weightsPct = (metrics.modelWeightsMem / totalVramPerInstance) * 100;
    const kvPct = 100 - weightsPct;

    return (
        <>
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-6 text-rose-500 border-b border-neutral-800 pb-2">
                    <Layers className="w-5 h-5" />
                    <h2 className="text-xl font-bold">Instance Topology (Replica)</h2>
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
                                className="h-full bg-neutral-700 border-r border-black/50 relative group flex items-center justify-center"
                                style={{ width: `${weightsPct}%` }}
                            >
                                <span className="text-[10px] text-white font-bold drop-shadow-md whitespace-nowrap px-1 overflow-hidden">Weights</span>
                            </div>
                            {/* KV Cache Space (Dynamic/Pink) */}
                            <div
                                className="h-full bg-rose-900/40 relative group flex items-center justify-center"
                                style={{ width: `${kvPct}%` }}
                            >
                                <span className="text-[10px] text-rose-500/70 font-bold whitespace-nowrap px-1 overflow-hidden">Available for KV Cache</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-[10px] text-neutral-600 mt-2">
                            <span>Model: {formatNum(metrics.modelWeightsMem)} GB</span>
                            <span>Replica Capacity: {formatNum(totalVramPerInstance)} GB (Usable)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assumptions */}
            <div className="border border-neutral-800 rounded bg-black/20 overflow-hidden mt-6">
                <button
                    onClick={() => setShowAssumptions(!showAssumptions)}
                    className="w-full flex items-center justify-between p-3 text-xs text-neutral-500 hover:bg-neutral-900 transition-colors"
                >
                    <span className="flex items-center gap-2"><HelpCircle className="w-3 h-3" /> Physics & Data Sources</span>
                    {showAssumptions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {showAssumptions && (
                    <div className="p-4 text-[11px] text-neutral-400 leading-relaxed space-y-2 bg-black/40 border-t border-neutral-800">
                        <p><strong>Assumptions Applied to Your Config:</strong></p>
                        <ul className="list-disc pl-4 space-y-1 mb-2 text-neutral-500">
                            <li>KV Cache: {config.pagedAttention ? "PAGED" : "FULL CONTEXT"} (~{Math.round(metrics.kvPerUserGB * 1000)} MB/user)</li>
                            <li>Batch Size: {config.batchSize} (latency penalty: {Math.round((1 - metrics.latencyPenalty) * 100)}%)</li>
                            <li>Quantization Speedup: {metrics.quantMult.toFixed(2)}x (batch-adjusted)</li>
                            <li>Tensor Parallelism: {metrics.recommendedTP}x (across {metrics.minGpusPerInstance / metrics.recommendedTP} replicas)</li>
                            <li>Active Decoders: ~{Math.round(config.concurrentUsers * config.activeDecodeFraction)} of {config.concurrentUsers} users</li>
                        </ul>
                        <p><strong>Throughput Data Source:</strong> Interpolated from {Hardware[config.hardware].type.toUpperCase()} benchmarks at Batch 1, 8, 32, 128.</p>
                    </div>
                )}
            </div>
        </>
    );
}
