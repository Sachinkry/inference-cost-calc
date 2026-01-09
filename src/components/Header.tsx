import { Download, HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface HeaderProps {
    onExport: () => void;
    onAbout: () => void;
}

export function Header({ onExport, onAbout }: HeaderProps) {
    return (
        <header className="border-b-2 border-rose-600 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 overflow-hidden">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-rose-500 flex items-center gap-3">
                    <img src="/logo.svg" alt="Logo" className="w-8 h-8 md:w-10 md:h-10 text-rose-500" />
                    INFERENCE_COST_CALC <span className="text-xs bg-rose-900/40 text-rose-400 px-2 py-1 rounded">V1</span>
                </h1>
                {/* <p className="text-neutral-500 mt-1 text-sm opacity-80">Infrastructure Cost Calculator</p> */}
            </div>
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onAbout}
                    className="flex items-center gap-2 border-neutral-700 bg-black hover:bg-neutral-800 text-neutral-400 text-xs"
                >
                    <HelpCircle className="w-3 h-3" /> About
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onExport}
                    className="flex items-center gap-2 border-neutral-700 bg-black hover:bg-neutral-800 text-neutral-400 text-xs"
                >
                    <Download className="w-3 h-3" /> Export JSON
                </Button>
                <div className="text-right hidden md:block">
                    <div className="text-[10px] text-neutral-600">SYS.STATUS: ONLINE</div>
                    <div className="text-[10px] text-neutral-600">KERNEL: MANUAL_MODE</div>
                </div>
            </div>
        </header>
    );
}
