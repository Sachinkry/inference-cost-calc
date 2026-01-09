import { Terminal, Download, HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface HeaderProps {
    onExport: () => void;
    onAbout: () => void;
}

export function Header({ onExport, onAbout }: HeaderProps) {
    return (
        <header className="border-b-2 border-rose-600 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 overflow-hidden">
            <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-rose-500 flex items-center gap-3">
                    <Terminal className="w-10 h-10 md:w-12 md:h-12 animate-pulse" />
                    INFERENCE_COST_CALC <span className="text-sm bg-rose-900/40 text-rose-400 px-2 py-1 rounded">V1</span>
                </h1>
                <p className="text-neutral-500 mt-2 opacity-80">Infrastructure Cost Calculator</p>
            </div>
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onAbout}
                    className="flex items-center gap-2 border-neutral-700 bg-black hover:bg-neutral-800 text-neutral-400"
                >
                    <HelpCircle className="w-4 h-4" /> About
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onExport}
                    className="flex items-center gap-2 border-neutral-700 bg-black hover:bg-neutral-800 text-neutral-400"
                >
                    <Download className="w-4 h-4" /> Export JSON
                </Button>
                <div className="text-right hidden md:block">
                    <div className="text-xs text-neutral-600">SYS.STATUS: ONLINE</div>
                    <div className="text-xs text-neutral-600">KERNEL: MANUAL_MODE</div>
                </div>
            </div>
        </header>
    );
}
