import { useState } from "react";
import { Header } from "./components/Header";
import { ConfigPanel } from "./components/ConfigPanel";
import { KpiCards } from "./components/KpiCards";
import { ComparisonTable } from "./components/ComparisonTable";
import { InstanceTopology } from "./components/InstanceTopology";
import { useInferencePlanner } from "./hooks/useInferencePlanner";

import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Info, ChevronDown, ChevronUp, Copy, Check, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportData, setExportData] = useState("");
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `netrunner_v5_1.json`;
    a.click();
    setIsExportOpen(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-mono p-4 md:p-8 selection:bg-rose-900 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <Header onExport={handleExport} />

        <Alert className="border-rose-900/50 bg-rose-950/10 transition-all duration-200">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsDisclaimerOpen(!isDisclaimerOpen)}>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-rose-500" />
              <AlertTitle className="text-rose-500 mb-0">Note</AlertTitle>
            </div>
            {isDisclaimerOpen ? (
              <ChevronUp className="h-4 w-4 text-rose-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-rose-500" />
            )}
          </div>
          {isDisclaimerOpen && (
            <AlertDescription className="text-neutral-400 mt-2">
              Results are based on theoretical hardware specs and model architecture math. Real-world performance may vary due to quantization kernels, server overhead, and specific cloud pricing. Use as a baseline planning tool.
            </AlertDescription>
          )}
        </Alert>

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column (GRAY/NEUTRAL) */}
          <div className="lg:col-span-4 space-y-6">
            <ConfigPanel
              config={config}
              metrics={metrics}
              updateConfig={updateConfig}
              onCalculate={handleCalculate}
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

            <InstanceTopology metrics={metrics} config={config} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
