import { useState, useEffect, useCallback } from 'react';
import { AppConfig, Metrics } from '../types';
import { calculateInferenceMetrics } from '../utils/calculator';

const DEFAULT_CONFIG: AppConfig = {
    model: "Llama-3.1-70B-Instruct",
    hardware: "NVIDIA H100 SXM (80GB)",
    concurrentUsers: 100,
    activeDecodeFraction: 0.25,
    tokensPerUser: 20,
    batchSize: 32,
    pagedAttention: true,
    avgContextLength: 4096,
    quantization: "FP16",
    latencyClass: "interactive",
    utilizationTarget: 0.85
};

export function useInferencePlanner() {
    const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [isStale, setIsStale] = useState(false);

    // Comparison State
    const [comparisonMode, setComparisonMode] = useState(false);
    const [baselineMetrics, setBaselineMetrics] = useState<Metrics | null>(null);
    const [, setBaselineConfig] = useState<AppConfig | null>(null);

    const calculateMetrics = useCallback((cfg: AppConfig): Metrics => {
        return calculateInferenceMetrics(cfg);
    }, []);

    const handleCalculate = useCallback(() => {
        const calculated = calculateMetrics(config);
        setMetrics(calculated);
        setIsStale(false);
    }, [config, calculateMetrics]);

    // Update metrics when model/hw changes significantly if desired, 
    // but original code only auto-calculated on mount, then manual?
    // Original: useEffect mount -> handleCalculate. updateConfig -> setIsStale(true).

    useEffect(() => {
        handleCalculate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateConfig = (key: keyof AppConfig, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
        setIsStale(true);
    };

    const toggleComparison = () => {
        if (!comparisonMode) {
            setBaselineConfig({ ...config });
            setBaselineMetrics(metrics ? { ...metrics } : null);
            setComparisonMode(true);
        } else {
            setComparisonMode(false);
            setBaselineMetrics(null);
            setBaselineConfig(null);
        }
    };

    return {
        config,
        metrics,
        isStale,
        comparisonMode,
        baselineMetrics,
        updateConfig,
        handleCalculate,
        toggleComparison
    };
}
