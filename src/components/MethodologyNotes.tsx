import { HelpCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Metrics, AppConfig } from "../types";
import { Hardware } from "../data/hardware";

interface MethodologyNotesProps {
    metrics: Metrics | null;
    config: AppConfig;
}

export function MethodologyNotes({ metrics, config }: MethodologyNotesProps) {
    const [showAssumptions, setShowAssumptions] = useState(false);

    if (!metrics) return null;

    return (
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
    );
}
