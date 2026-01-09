import { Card, CardContent } from "@/components/ui/card";
import { Metrics } from "../types";
import { formatCurrency, formatNum } from "../utils/format";

interface KpiCardsProps {
    metrics: Metrics | null;
}

export function KpiCards({ metrics }: KpiCardsProps) {
    if (!metrics) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* UNIT COSTS CARD - Blue/Gray Split */}
            <Card className="bg-gradient-to-br from-neutral-900 to-black border-neutral-800">
                <CardContent className="p-4">
                    <div className="text-neutral-500 text-xs uppercase tracking-widest mb-1">Unit Costs (1M)</div>
                    {/* Output (Blue) */}
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="text-[10px] text-blue-400 uppercase font-bold">Output (Gen)</span>
                        <span className="text-2xl font-bold text-blue-500">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(metrics.costPer1MOutput)}
                        </span>
                    </div>
                    {/* Input (Gray) */}
                    <div className="flex justify-between items-baseline pt-1 border-t border-neutral-800">
                        <span className="text-[10px] text-neutral-500 uppercase font-bold">Input (Ctx)</span>
                        <span className="text-lg font-bold text-neutral-400">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(metrics.costPer1MInput)}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* MONTHLY BURN - Pink/Red */}
            <Card className="bg-gradient-to-br from-rose-950/40 to-black border-rose-900/50">
                <CardContent className="p-4">
                    <div className="text-rose-400 text-xs uppercase tracking-widest mb-1">Monthly Burn</div>
                    <div className="text-3xl font-bold text-rose-500">
                        {formatCurrency(metrics.monthlyCost)}
                    </div>
                    <div className="text-[10px] text-rose-700 mt-2">
                        {formatCurrency(metrics.hourlyCost)} / hour
                    </div>
                </CardContent>
            </Card>

            {/* TOTAL GPUs - Pink/Red */}
            <Card className="bg-gradient-to-br from-rose-950/40 to-black border-rose-900/50 relative overflow-hidden">
                <CardContent className="p-4">
                    <div className="text-rose-400 text-xs uppercase tracking-widest mb-1">Total GPUs</div>
                    <div className="text-3xl font-bold text-rose-500 flex items-baseline gap-2">
                        {metrics.requiredGpus}
                    </div>
                    <div className="text-[10px] text-rose-700 mt-2">
                        {metrics.instancesNeededForMem} Replicas x {metrics.minGpusPerInstance} GPUs
                    </div>
                </CardContent>
            </Card>

            {/* THROUGHPUT - Blue (Perf) */}
            <Card className="bg-gradient-to-br from-blue-950/40 to-black border-blue-900/50">
                <CardContent className="p-4">
                    <div className="text-blue-400 text-xs uppercase tracking-widest mb-1">Throughput</div>
                    <div className="text-3xl font-bold text-blue-500 flex items-baseline gap-2">
                        {formatNum(metrics.totalTpsDemand)}
                        <span className="text-sm font-normal text-blue-700">T/s</span>
                    </div>
                    <div className="text-[10px] text-blue-700 mt-2">
                        Est. Latency: {Math.round(metrics.estLatency)} ms
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
