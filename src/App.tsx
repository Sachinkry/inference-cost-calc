import { useState, useRef } from "react";
import { Header } from "./components/Header";
import { ConfigPanel } from "./components/ConfigPanel";
import { KpiCards } from "./components/KpiCards";
import { ComparisonTable } from "./components/ComparisonTable";
import { InstanceTopology } from "./components/InstanceTopology";
import { MemoryAnalysis } from "./components/MemoryAnalysis";
import { MethodologyNotes } from "./components/MethodologyNotes";
import { useInferencePlanner } from "./hooks/useInferencePlanner";

import { Info, Copy, Check, Download, Github, Map } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Analytics } from "@vercel/analytics/react"

function App() {
  const {
    config,
    metrics,
    isStale,
    updateConfig,
    handleCalculate,
    comparisonMode,
    toggleComparison,
    baselineMetrics
  } = useInferencePlanner();

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [exportData, setExportData] = useState("");
  const [copied, setCopied] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const onCalculateWrapper = () => {
    // Scroll to the content area (just below header)
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setIsCalculating(true);
    // Add artificial delay for visual feedback
    setTimeout(() => {
      handleCalculate();
      setIsCalculating(false);
    }, 600);
  };

  const handleExport = () => {
    const data = {
      version: "5.1",
      timestamp: new Date().toISOString(),
      config,
      results: {
        requiredGpus: metrics?.requiredGpus,
        monthlyCost: metrics?.monthlyCost
      }
    };
    setExportData(JSON.stringify(data, null, 2));
    setIsExportOpen(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadJson = () => {
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inference-config-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-mono p-4 md:p-8 selection:bg-rose-900 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <Header onExport={handleExport} onAbout={() => setIsAboutOpen(true)} />

        <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
          <DialogContent className="max-w-2xl bg-neutral-950 border-neutral-800 text-neutral-200">
            <DialogHeader>
              <DialogTitle className="text-rose-500">Export Configuration</DialogTitle>
              <DialogDescription>
                Copy the JSON below or download it as a file.
              </DialogDescription>
            </DialogHeader>
            <div className="relative mt-4">
              <pre className="bg-neutral-900 p-4 rounded-md overflow-x-auto text-xs font-mono border border-neutral-800 h-64 overflow-y-auto">
                {exportData}
              </pre>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 hover:bg-neutral-800"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-neutral-400" />}
              </Button>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsExportOpen(false)} className="border-neutral-700 hover:bg-neutral-800 text-neutral-400">
                Cancel
              </Button>
              <Button onClick={downloadJson} className="bg-rose-600 hover:bg-rose-700 text-white gap-2">
                <Download className="h-4 w-4" /> Download JSON
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
          <DialogContent className="max-w-2xl bg-neutral-950 border-neutral-800 text-neutral-200">
            <DialogHeader>
              <DialogTitle className="text-rose-500 flex items-center gap-2"><Info className="w-5 h-5" /> About Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
                <h4 className="font-semibold text-rose-400 mb-2 flex items-center gap-2">
                  <Github className="w-4 h-4" /> Open Source
                </h4>
                <p className="text-sm text-neutral-400">
                  This project is open source and available on GitHub. Contributions, bug reports, and feature requests are welcome.
                </p>
                <div className="mt-3">
                  <a href="https://github.com/Sachinkry/inference-cost-calc" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="border-neutral-700 bg-black hover:bg-neutral-800 text-neutral-300 hover:text-rose-400">
                      <Github className="w-4 h-4 mr-2" /> View Repository
                    </Button>
                  </a>
                </div>
              </div>

              <div className="p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
                <h4 className="font-semibold text-rose-400 mb-2 flex items-center gap-2">
                  <Map className="w-4 h-4" /> Roadmap
                </h4>
                <ul className="list-disc list-inside text-sm text-neutral-400 space-y-1">
                  <li><span className="text-green-500">✓</span> <strong>Physics-Based Kernels</strong>: Accurate VRAM & Compute estimation using model architecture.</li>
                  <li><span className="text-green-500">✓</span> <strong>Throughput Modeling</strong>: Bandwidth vs Compute constraints on H100/A100.</li>
                  <li><span className="text-green-500">✓</span> <strong>KV Cache</strong>: Simulation of GQA and PagedAttention overheads.</li>
                  <li><span className="text-neutral-500">○</span> <strong>HF Model Inference</strong>: Direct inference cost estimation from Hugging Face model IDs.</li>
                  <li><span className="text-neutral-500">○</span> <strong>Distributed Training</strong>: Cost modeling for Pre-training, SFT, and RLHF.</li>
                  <li><span className="text-neutral-500">○</span> <strong>Custom Hardware</strong>: Support for TPU v5, MI300X, and custom clusters.</li>
                  <li><span className="text-neutral-500">○</span> <strong>TCO Analysis</strong>: Power, cooling, and networking cost calculators.</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsAboutOpen(false)} className="bg-neutral-800 hover:bg-neutral-700 text-white">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div ref={scrollRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column (GRAY/NEUTRAL) */}
          <div className="lg:col-span-4 space-y-6">
            <ConfigPanel
              config={config}
              metrics={metrics}
              updateConfig={updateConfig}
              onCalculate={onCalculateWrapper}
              isStale={isStale}
              comparisonMode={comparisonMode}
              onToggleComparison={toggleComparison}
            />
          </div>

          {/* Results Column (PINK-RED CALCULATED / BLUE OUTPUTS) */}
          <div className="lg:col-span-8 space-y-6">

            {comparisonMode && metrics && baselineMetrics && (
              <ComparisonTable current={metrics} baseline={baselineMetrics} />
            )}

            <KpiCards metrics={metrics} />

            <InstanceTopology metrics={metrics} config={config} isCalculating={isCalculating} />

            {metrics && (
              <MemoryAnalysis metrics={metrics} config={config} isCalculating={isCalculating} />
            )}

            {metrics && (
              <MethodologyNotes metrics={metrics} config={config} />
            )}
          </div>
        </div>
      </div>
      <Analytics />
    </div>
  );
}

export default App;
