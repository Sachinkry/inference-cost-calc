import { SplitSquareHorizontal } from 'lucide-react';
import { Metrics } from "../types";
import { formatCurrency, formatNum } from "../utils/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ComparisonTableProps {
    current: Metrics;
    baseline: Metrics;
}

export function ComparisonTable({ current, baseline }: ComparisonTableProps) {
    return (
        <div className="bg-gradient-to-br from-neutral-900 to-black border border-neutral-700 rounded-lg mb-6 overflow-hidden shadow-lg">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-neutral-800">
                <h3 className="text-lg font-bold text-neutral-300 flex items-center gap-2">
                    <SplitSquareHorizontal className="w-5 h-5 text-neutral-500" /> Comparison
                </h3>
                <div className="flex gap-4 text-xs">
                    <span className="text-neutral-500 font-mono">Baseline (Locked)</span>
                    <span className="text-rose-400 font-bold font-mono">Current</span>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow className="border-neutral-800 hover:bg-transparent">
                        <TableHead className="text-neutral-500 font-mono text-xs uppercase w-[150px]">Metric</TableHead>
                        <TableHead className="text-neutral-500 font-mono text-xs uppercase">Baseline</TableHead>
                        <TableHead className="text-neutral-500 font-mono text-xs uppercase">Current</TableHead>
                        <TableHead className="text-neutral-500 font-mono text-xs uppercase text-right">Diff</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[
                        { label: "Total GPUs", base: baseline.requiredGpus, curr: current.requiredGpus, format: (v: number) => v, unit: "" },
                        { label: "Monthly Cost", base: baseline.monthlyCost, curr: current.monthlyCost, format: formatCurrency, unit: "" },
                        { label: "Cost / 1M Out", base: baseline.costPer1MOutput, curr: current.costPer1MOutput, format: (v: number) => `$${v.toFixed(2)}`, unit: "" },
                        { label: "Cost / 1M In", base: baseline.costPer1MInput, curr: current.costPer1MInput, format: (v: number) => `$${v.toFixed(2)}`, unit: "" },
                        { label: "Throughput", base: baseline.totalTpsDemand, curr: current.totalTpsDemand, format: formatNum, unit: " T/s" },
                    ].map((row, i) => {
                        const diff = row.curr - row.base;
                        const color = diff > 0 ? "text-rose-500" : "text-neutral-600";


                        return (
                            <TableRow key={i} className="border-t border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                                <TableCell className="text-neutral-500 font-mono text-xs font-medium">{row.label}</TableCell>
                                <TableCell className="text-neutral-600 font-mono text-xs">{row.format(row.base)}{row.unit}</TableCell>
                                <TableCell className="text-neutral-300 font-bold font-mono text-xs">{row.format(row.curr)}{row.unit}</TableCell>
                                <TableCell className={`text-right font-mono text-xs ${color}`}>
                                    {diff > 0 ? "+" : ""}{row.label.includes("Cost") ? row.format(diff) : formatNum(diff)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
