# Contributing to Inference Cost Calculator

Thank you for your interest in contributing! We welcome community contributions to make LLM infrastructure planning more accessible.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/YOUR_USERNAME/inference-cost-calculator.git
    cd inference-cost-calculator
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Start the development server**:
    ```bash
    npm run dev
    ```

## Development Guidelines

- **Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS, Shadcn UI.
- **Code Style**: Please follow existing patterns. We use ESLint and Prettier.
- **Commits**: Use descriptive commit messages (e.g., `feat: add mistral model support`, `fix: slider visibility issue`).

## Pull Requests

1.  Create a new branch for your feature: `git checkout -b feature/amazing-feature`.
2.  Commit your changes.
3.  Push to the branch: `git push origin feature/amazing-feature`.
4.  Open a Pull Request against the `main` branch.

## Adding New Models

To add new models, edit `src/data/models.ts`. Ensure you have:
- Parameter counts (size, layers, hidden dim).
- Estimated throughput benchmarks for H100/A100/L40S.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
