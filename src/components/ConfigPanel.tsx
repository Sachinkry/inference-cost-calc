import { Settings2, Calculator, SplitSquareHorizontal, AlertTriangle, Clock, Info } from 'lucide-react';
import { AppConfig, Metrics } from '../types';
import { Models } from '../data/models';
import { Hardware } from '../data/hardware';
import { formatCurrency, formatNum } from '../utils/format';

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ConfigPanelProps {
    config: AppConfig;
    metrics: Metrics | null;
    updateConfig: (key: keyof AppConfig, value: any) => void;
    onCalculate: () => void;
    isStale: boolean;
    comparisonMode: boolean;
    onToggleComparison: () => void;
}

export function ConfigPanel({
    config,
    metrics,
    updateConfig,
    onCalculate,
    isStale,
    comparisonMode,
    onToggleComparison
}: ConfigPanelProps) {

    return (
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-6 text-neutral-300 border-b border-neutral-800 pb-2">
                <div className="flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-neutral-400" />
                    <h2 className="text-xl font-bold">Configuration</h2>
                    <Popover>
                        <PopoverTrigger>
                            <Info className="w-4 h-4 text-neutral-500 hover:text-neutral-300 cursor-pointer ml-1" />
                        </PopoverTrigger>
                        <PopoverContent className="w-80 bg-neutral-900 border-neutral-800 text-neutral-300 p-3">
                            <div className="space-y-2 text-xs">
                                <p><span className="font-bold text-rose-400">Baseline Estimation:</span> Results are based on theoretical hardware specs and model architecture math.</p>
                                <p className="text-neutral-500">Real-world performance may vary due to quantization kernels, server overhead, and specific cloud pricing. Use as a baseline planning tool.</p>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                {comparisonMode && (
                    <Badge variant="outline" className="text-xs bg-rose-900/40 text-rose-400 border-rose-900/50">
                        EDITING CURRENT
                    </Badge>
                )}
            </div>

            <div className="space-y-6">
                {/* Hardware Group */}
                <div className="space-y-4 border-b border-neutral-800 pb-6">
                    <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-neutral-500">Target Model</Label>
                        <Select value={config.model} onValueChange={(val) => updateConfig('model', val)}>
                            <SelectTrigger className="w-full bg-black border-neutral-700 font-mono text-xs">
                                <SelectValue placeholder="Select Model" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(Models).map(m => <SelectItem key={m} value={m} className="font-mono text-xs">{m}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-neutral-500">Hardware Unit</Label>
                        <Select value={config.hardware} onValueChange={(val) => updateConfig('hardware', val)}>
                            <SelectTrigger className="w-full bg-black border-neutral-700 font-mono text-xs">
                                <SelectValue placeholder="Select Hardware" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(Hardware).map(h => (
                                    <SelectItem key={h} value={h} className="font-mono text-xs">
                                        {h} - {formatCurrency(Hardware[h].cost_hr)}/hr
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-neutral-500">Quantization</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {['FP16', 'FP8', 'INT8', 'GPTQ-4bit'].map((q) => (
                                <Button
                                    key={q}
                                    variant={config.quantization === q ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => updateConfig('quantization', q)}
                                    className={`text-xs font-mono ${config.quantization === q ? 'bg-neutral-800 text-white border-neutral-500' : 'bg-black border-neutral-800 text-neutral-500 hover:text-neutral-300'}`}
                                >
                                    {q}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Workload Group */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-neutral-500">Concurrent Users</Label>
                        <Input
                            type="number"
                            value={config.concurrentUsers}
                            onChange={(e) => updateConfig('concurrentUsers', Math.max(1, parseInt(e.target.value) || 0))}
                            className="bg-black border-neutral-700 text-neutral-300 font-bold font-mono"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-neutral-500">T/s per User</Label>
                        <Input
                            type="number"
                            value={config.tokensPerUser}
                            onChange={(e) => updateConfig('tokensPerUser', Math.max(1, parseInt(e.target.value) || 0))}
                            className="bg-black border-neutral-700 text-neutral-300 font-mono"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="text-xs uppercase tracking-wider text-neutral-500">Batch Size (Inference)</Label>
                            <span className="text-neutral-300 text-sm font-mono bg-neutral-800 px-2 py-0.5 rounded">{config.batchSize}</span>
                        </div>
                        <Slider
                            value={[config.batchSize]}
                            min={1} max={256} step={1}
                            onValueChange={(vals) => updateConfig('batchSize', vals[0])}
                            className="py-2"
                        />
                        <div className="text-[10px] text-neutral-600 text-right font-mono">Higher batch = throughput ↑ latency ↑</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Label className="text-[10px] uppercase tracking-wider text-neutral-500">Active Decode %</Label>
                                <Popover>
                                    <PopoverTrigger>
                                        <Info className="w-3 h-3 text-neutral-500 hover:text-neutral-300 cursor-pointer" />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64 bg-neutral-900 border-neutral-800 text-neutral-300 p-3">
                                        <div className="space-y-2 text-xs">
                                            <p><span className="font-bold text-rose-400">Utilization Factor:</span> The % of users simultaneously generating tokens.</p>
                                            <p className="text-neutral-500">Real-world usage is rarely 100%. Lowering this allows more users per GPU.</p>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <span className="text-xs text-neutral-300 font-mono bg-neutral-800 px-2 py-0.5 rounded">{Math.round(config.activeDecodeFraction * 100)}%</span>
                        </div>
                        <Slider
                            value={[config.activeDecodeFraction * 100]}
                            min={5} max={100} step={5}
                            onValueChange={(vals) => updateConfig('activeDecodeFraction', vals[0] / 100)}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Label className="text-[10px] uppercase tracking-wider text-neutral-500">Latency Mode</Label>
                            <Popover>
                                <PopoverTrigger>
                                    <Info className="w-3 h-3 text-neutral-500 hover:text-neutral-300 cursor-pointer" />
                                </PopoverTrigger>
                                <PopoverContent className="w-64 bg-neutral-900 border-neutral-800 text-neutral-300 p-3">
                                    <div className="space-y-2 text-xs">
                                        <p><span className="font-bold text-rose-400">Interactive:</span> Optimizes for lowest Time-To-First-Token (TTFT). Uses smaller batches.</p>
                                        <p><span className="font-bold text-rose-400">Batch:</span> Maximizes total throughput. Latency will be higher.</p>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateConfig('latencyClass', config.latencyClass === "interactive" ? "batch" : "interactive")}
                            className={`w-full text-xs h-8 font-mono ${config.latencyClass === "interactive" ? "bg-neutral-800 border-neutral-500 text-white" : "bg-black border-neutral-800 text-neutral-500"}`}
                        >
                            {config.latencyClass === "interactive" ? "Interactive" : "Batch"}
                        </Button>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs uppercase tracking-wider text-neutral-500">Avg. Context Length</Label>
                        <span className="text-neutral-300 text-sm font-mono bg-neutral-800 px-2 py-0.5 rounded">{formatNum(config.avgContextLength)}</span>
                    </div>
                    <Slider
                        value={[config.avgContextLength]}
                        min={512} max={32768} step={512}
                        onValueChange={(vals) => updateConfig('avgContextLength', vals[0])}
                    />
                    <div className="flex items-center gap-2 mt-2 pt-2">
                        <Switch
                            checked={config.pagedAttention}
                            onCheckedChange={(checked) => updateConfig('pagedAttention', checked)}
                        />
                        <div className="flex items-center gap-2">
                            <Label className="text-xs text-neutral-500">Use Paged Attention (vLLM)</Label>
                            <Popover>
                                <PopoverTrigger>
                                    <Info className="w-3 h-3 text-neutral-500 hover:text-neutral-300 cursor-pointer" />
                                </PopoverTrigger>
                                <PopoverContent className="w-64 bg-neutral-900 border-neutral-800 text-neutral-300 p-3">
                                    <div className="space-y-2 text-xs">
                                        <p><span className="font-bold text-rose-400">Paged Attention:</span> Manages KV cache in non-contiguous blocks (like OS paging).</p>
                                        <p className="text-neutral-500">Significantly reduces memory fragmentation (overhead), allowing <span className="text-neutral-300">more tokens to fit</span> in VRAM.</p>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>

                {/* Calculate Button (Manual Trigger) */}
                <Button
                    size="lg"
                    onClick={onCalculate}
                    className={`w-full font-bold gap-2 transition-all shadow-md ${isStale
                        ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse border-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.3)]'
                        : 'bg-neutral-200 hover:bg-white text-neutral-900 border-neutral-200'
                        }`}
                >
                    <Calculator className="w-5 h-5" />
                    {isStale ? "INITIALIZE CALCULATION" : "PROJECTIONS UPDATED"}
                </Button>

                {/* Comparison Action */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleComparison}
                    className={`w-full gap-2 text-xs border-dashed border-neutral-600 uppercase tracking-wider ${comparisonMode
                        ? 'bg-rose-950/30 text-rose-400 border-rose-800 border-solid'
                        : 'bg-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 hover:border-neutral-500'
                        }`}
                >
                    <SplitSquareHorizontal className="w-4 h-4" />
                    {comparisonMode ? "Stop Comparison" : "Add Comparison"}
                </Button>
            </div>

            {/* Warnings Area */}
            {metrics && (
                <div className="space-y-4 mt-6 pt-6 border-t border-neutral-800">
                    {(metrics.gpusForMem > metrics.gpusForCompute) && (
                        <Alert variant="default" className="bg-neutral-900/50 border-neutral-800">
                            <AlertTriangle className="h-4 w-4 !text-rose-500/40" />
                            <AlertTitle className="text-neutral-400 font-bold mb-1">Memory Bound</AlertTitle>
                            <AlertDescription className="text-neutral-500 text-xs">
                                Limited by VRAM. {metrics.instancesNeededForMem} replicas needed.
                            </AlertDescription>
                        </Alert>
                    )}
                    {config.batchSize > 16 && config.latencyClass === "interactive" && (
                        <Alert variant="default" className="bg-neutral-900/50 border-neutral-800">
                            <Clock className="h-4 w-4 !text-rose-500/40" />
                            <AlertTitle className="text-neutral-400 font-bold mb-1">High Latency Risk</AlertTitle>
                            <AlertDescription className="text-neutral-500 text-xs">
                                Batch {config.batchSize} is high for Interactive. Est {Math.round(metrics.estLatency)}ms+ latency.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            )}
        </div>
    );
}
