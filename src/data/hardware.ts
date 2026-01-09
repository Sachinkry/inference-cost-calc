import { HardwareDefinition } from '../types';

export const Hardware: Record<string, HardwareDefinition> = {
    "NVIDIA H200 SXM (141GB)": { id: 'h200', vram: 141, bw: 4800, power: 700, cost_hr: 3.50, type: 'h100' },
    "NVIDIA H100 SXM (80GB)": { id: 'h100', vram: 80, bw: 3350, power: 700, cost_hr: 2.90, type: 'h100' },
    "NVIDIA A100 SXM (80GB)": { id: 'a100', vram: 80, bw: 2039, power: 400, cost_hr: 1.20, type: 'a100' },
    "NVIDIA L40S (48GB)": { id: 'l40s', vram: 48, bw: 864, power: 350, cost_hr: 1.20, type: 'l40s' },
};
