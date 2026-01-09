# Inference Cost Calculator ⚡️

![Version](https://img.shields.io/badge/version-1.0.0-rose.svg)
![License](https://img.shields.io/badge/license-MIT-neutral.svg)

**Inference Cost Calculator** is an infrastructure planning tool designed for LLM (Large Language Model) deployments. It helps engineers and architects estimate the hardware requirements, throughput, and costs for serving open-source models (Llama 3, Qwen 3, Mixtral, etc.) on enterprise hardware (H100, A100, L40S).

## 🚀 Features

- **Modeling**: Calculates VRAM usage based on model architecture (layers, hidden size, KV heads) and quantization (FP16, FP8, INT8, GPTQ).
- **Throughput Estimation**: Estimates tokens/sec based on hardware memory bandwidth and compute capacity.
- **Latency Estimator**: Predicts "Interactive" vs "Batch" latency based on concurrent user load.
- **Cost Analysis**: Projects hourly and monthly costs for reserved instances.
- **Comparative Mode**: Compare two different configurations side-by-side (e.g., H100 vs A100).
- **Import/Export**: Save your scenarios to JSON and share them with your team.
- **Modern UI**: Built with a "Netrunner" cyberpunk aesthetic using **Shadcn UI** and **Tailwind CSS**.

## 🛠️ Supported Hardware
- NVIDIA H200 SXM (141GB)
- NVIDIA H100 SXM (80GB)
- NVIDIA A100 SXM (80GB)
- NVIDIA L40S (48GB)

## 📦 Supported Models
- **Llama 3.1** (8B, 70B)
- **Qwen 3** (0.6B - 235B)
- **Mixtral** (8x7B)
- **Falcon** (180B)

## 🗺️ Roadmap

- [x] **Physics-Based Kernels**: Accurate VRAM & Compute estimation using model architecture.
- [x] **Throughput Modeling**: Bandwidth vs Compute constraints on H100/A100.
- [x] **KV Cache**: Simulation of GQA and PagedAttention overheads.
- [ ] **Distributed Training**: Cost modeling for Pre-training, SFT, and RLHF.
- [ ] **Custom Hardware**: Support for TPU v5, MI300X, and custom clusters.
- [ ] **TCO Analysis**: Power, cooling, and networking cost calculators.

## 🏁 Quick Start

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/inference-cost-calculator.git
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the dev server**:
    ```bash
    npm run dev
    ```

## 💻 Tech Stack
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI (Radix Primitives)
- **Icons**: Lucide React

## 🤝 Contributing

Contributions are welcome! Please check out [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
