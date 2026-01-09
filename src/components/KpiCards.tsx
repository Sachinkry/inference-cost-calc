import { Card, CardContent } from "@/components/ui/card";
import { Metrics } from "../types";
import { formatCurrency, formatNum } from "../utils/format";
import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
                        <span className="text-[10px] text-neutral-400 uppercase font-bold">Output (Gen)</span>
                        <span className="text-2xl font-bold text-neutral-200">
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

            {/* MONTHLY BURN - Neutral */}
            <Card className="bg-gradient-to-br from-neutral-900 to-black border-neutral-800">
                <CardContent className="p-4">
                    <div className="text-neutral-500 text-xs uppercase tracking-widest mb-1">Monthly Burn</div>
                    <div className="text-3xl font-bold text-neutral-200">
                        {formatCurrency(metrics.monthlyCost)}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-2">
                        {formatCurrency(metrics.hourlyCost)} / hour
                    </div>
                </CardContent>
            </Card>

            {/* TOTAL GPUs - Neutral */}
            <Card className="bg-gradient-to-br from-neutral-900 to-black border-neutral-800 relative overflow-hidden">
                <CardContent className="p-4">
                    <div className="text-neutral-500 text-xs uppercase tracking-widest mb-1">Total GPUs</div>
                    <div className="text-3xl font-bold text-neutral-200 flex items-baseline gap-2">
                        {metrics.requiredGpus}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-2">
                        {metrics.instancesNeededForMem} Replicas x {metrics.minGpusPerInstance} GPUs
                    </div>
                </CardContent>
            </Card>

            {/* THROUGHPUT - Blue (Perf) */}
            {/* THROUGHPUT - Rose/Neutral (Perf) */}
            <Card className="bg-gradient-to-br from-neutral-900 to-black border-neutral-800">
                <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="text-neutral-500 text-xs uppercase tracking-widest">Throughput Demand</div>
                        <Popover>
                            <PopoverTrigger>
                                <Info className="w-3 h-3 text-neutral-500 hover:text-neutral-300 cursor-pointer" />
                            </PopoverTrigger>
                            <PopoverContent className="w-64 bg-neutral-900 border-neutral-800 text-neutral-300 p-3">
                                <div className="space-y-2 text-xs">
                                    <p><span className="font-bold text-rose-400">Total Throughput Demand:</span> The aggregate generation speed required to serve all active users simultaneously.</p>
                                    <p className="text-neutral-500 font-mono">Users * Active % * T/s per User</p>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="text-3xl font-bold text-neutral-200 flex items-baseline gap-2">
                        {formatNum(metrics.totalTpsDemand)}
                        <span className="text-sm font-normal text-neutral-500">T/s</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-2">
                        Est. Latency: {Math.round(metrics.estLatency)} ms
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
