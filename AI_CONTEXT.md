# AI Context & Architecture Guide 🤖

> **For AI Agents:** Read this document to understand the codebase structure, core logic, and design patterns before attempting modifications.

## 1. Project Overview
**Inference Cost Calculator** is a React/Vite application that estimates hardware requirements for serving Large Language Models. It uses physics-based heuristics (memory bandwidth, FLOPS, VRAM capabilities) rather than simple lookups.

## 2. Tech Stack
- **Framework**: React 19 + Vite (SWC)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS + Shadcn UI (Radix Primitives)
- **Icons**: Lucide React
- **Fonts**: Inter (UI), JetBrains Mono (Data/Terminal elements)

## 3. Directory Structure
- **`src/data/`**: Static definitions.
    - `models.ts`: Model architectures (layers, hidden size, vocab). **Add new models here.**
    - `hardware.ts`: GPU specs (VRAM, Bandwidth, Cost). **Add new GPUs here.**
- **`src/hooks/`**: Business logic.
    - `useInferencePlanner.ts`: **The Brain**. Contains `calculateMetrics()`. All math for VRAM/Throughput/Cost happens here. State management (`config`, `metrics`) is also here.
- **`src/components/`**: UI.
    - `ConfigPanel.tsx`: Main form (Inputs, Sliders).
    - `InstanceTopology.tsx`: Visual representation of the cluster (GPUs/Nodes).
    - `KpiCards.tsx`: High-level summary stats (Cost, T/s).
    - `ui/`: Shadcn UI primitives.

## 4. Core Logic (`useInferencePlanner.ts`)
The calculation flow is:
1.  **Inputs**: Model, HW, Concurrent Users, Batch Size, etc.
2.  **Memory Calculation**:
    - `Model Weights` = Parameters * Precision (FP16=2 bytes, INT8=1 byte).
    - `KV Cache` = 2 * Layers * KV_Heads * Head_Dim * Precision * Context_Length.
    - `Total VRAM` = Weights + (KV_Cache * Users).
3.  **Throughput Calculation**:
    - Bounded by **Memory Bandwidth** (for low batch) or **Compute** (for high batch).
    - Uses linear interpolation based on `throughputByBatch` lookup in `models.ts`.
4.  **Outputs**: `requiredGpus`, `monthlyCost`, `estLatency`.

## 5. Design Guidelines ("Netrunner Theme")
- **Dark Mode Only**: The app is hardcoded to dark mode (`bg-neutral-950`).
- **Primary Color**: Rose (`#e11d48` / `rose-600`). Used for primary actions, active states, and borders.
- **Secondary**: Neutral Grays.
- **Typography**:
    - Use `font-sans` (Inter) for labels and copy.
    - Use `font-mono` (JetBrains Mono) for **numbers, codes, and data**.
- **Components**:
    - Use Shadcn components (`<Slider>`, `<Select>`, `<Button>`) instead of native HTML.
    - Popovers/Tooltips are used for complex technical terms.

## 6. Common Tasks via AI
- **Add a Model**: Edit `src/data/models.ts`. You need the architecture details and rough throughput benchmarks.
- **Add a Logic Feature**: Edit `src/hooks/useInferencePlanner.ts`. Add the field to `AppConfig` interface in `types.ts` first.
- **UI Tweak**: Edit `ConfigPanel.tsx` (controls) or `App.tsx` (layout). Ensure you maintain the "Netrunner" aesthetic.

## 7. Key Files for Context
- `src/types.ts`: Domain models (`AppConfig`, `Metrics`, `ModelDefinition`).
- `src/utils/math.ts`: Helper functions for rounding/calculation.
- `src/index.css`: Global theme variables.
