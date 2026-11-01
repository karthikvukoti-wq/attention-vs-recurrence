import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { BenchmarkMetricsData } from '../types.ts';

interface PerformanceBenchmarkProps {
  metricsData: BenchmarkMetricsData;
  selectedDataset: string;
  onSelectDataset: (dataset: string) => void;
}

interface DetailedMetricInfo {
  key: keyof BenchmarkMetricsData['lstm'];
  label: string;
  unit: string;
  tooltip: string;
  lowerIsBetter?: boolean;
}

const DETAILED_METRICS: DetailedMetricInfo[] = [
  {
    key: 'accuracy',
    label: 'Accuracy',
    unit: '%',
    tooltip: 'The percentage of test sentences classified with the correct label.',
  },
  {
    key: 'precision',
    label: 'Precision',
    unit: '%',
    tooltip: 'How many of the model’s positive assertions were actually true positives.',
  },
  {
    key: 'recall',
    label: 'Recall',
    unit: '%',
    tooltip: 'How many of all actual positive sentences the model successfully caught.',
  },
  {
    key: 'f1',
    label: 'F1 Score',
    unit: '%',
    tooltip: 'The harmonic balance between precision and recall (unbiased overall score).',
  },
  {
    key: 'trainingTimeSec',
    label: 'Training Time',
    unit: 's',
    lowerIsBetter: true,
    tooltip: 'Wall-clock seconds needed to train one full epoch over the training dataset.',
  },
  {
    key: 'inferenceTimeMs',
    label: 'Inference Time',
    unit: 'ms',
    lowerIsBetter: true,
    tooltip: 'Latency in milliseconds to evaluate a single text query.',
  },
  {
    key: 'memoryUsageMb',
    label: 'Memory Usage',
    unit: 'MB',
    lowerIsBetter: true,
    tooltip: 'Active RAM/VRAM required during inference execution.',
  },
];

export const PerformanceBenchmark: React.FC<PerformanceBenchmarkProps> = ({
  metricsData,
  selectedDataset,
  onSelectDataset,
}) => {
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(false);

  const lstm = metricsData.lstm;
  const transformer = metricsData.transformer;
  const winners = metricsData.winner;

  // Simple clean percentage helpers for bar charts
  const maxTrainTime = Math.max(lstm.trainingTimeSec, transformer.trainingTimeSec) * 1.15;
  const maxInferTime = Math.max(lstm.inferenceTimeMs, transformer.inferenceTimeMs) * 1.15;
  const maxMemory = Math.max(lstm.memoryUsageMb, transformer.memoryUsageMb) * 1.15;

  return (
    <section id="benchmark-step" className="py-12 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Badge & Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
              STEP 04
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-2">
              Model Performance
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Both models evaluated on the same dataset and task.
            </p>
          </div>

          {/* Dataset Switcher */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {['IMDB Sentiment', 'SST-2 (Short Sentences)', 'AG News (Topic Classification)', 'Long-Doc Context Stress Test'].map((ds) => (
              <button
                key={ds}
                onClick={() => onSelectDataset(ds)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedDataset === ds
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {ds.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            FOUR PRIMARY METRIC CARDS (Light Theme)
           ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* 1. Accuracy Card */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-slate-50/60 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-slate-600 font-bold">Accuracy</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Winner: {winners.accuracy}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 my-2">
                <div className="p-2.5 rounded-xl bg-white border border-blue-200 shadow-2xs">
                  <span className="text-[10px] font-mono text-blue-700 block font-semibold">LSTM</span>
                  <span className="text-xl font-display font-bold text-slate-900">{lstm.accuracy}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-purple-200 shadow-2xs">
                  <span className="text-[10px] font-mono text-purple-700 block font-semibold">Transformer</span>
                  <span className="text-xl font-display font-bold text-slate-900">{transformer.accuracy}%</span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-slate-600 leading-snug">
              Transformer achieves +{(transformer.accuracy - lstm.accuracy).toFixed(1)}% higher correctness via attention.
            </p>
          </div>

          {/* 2. Training Time Card */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-slate-50/60 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-slate-600 font-bold">Training Time</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Winner: {winners.trainingTimeSec}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 my-2">
                <div className="p-2.5 rounded-xl bg-white border border-blue-200 shadow-2xs">
                  <span className="text-[10px] font-mono text-blue-700 block font-semibold">LSTM</span>
                  <span className="text-xl font-display font-bold text-slate-900">{lstm.trainingTimeSec}s</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-purple-200 shadow-2xs">
                  <span className="text-[10px] font-mono text-purple-700 block font-semibold">Transformer</span>
                  <span className="text-xl font-display font-bold text-slate-900">{transformer.trainingTimeSec}s</span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-slate-600 leading-snug">
              Transformer trains {(lstm.trainingTimeSec / transformer.trainingTimeSec).toFixed(1)}x faster on GPU via parallel tensor ops.
            </p>
          </div>

          {/* 3. Inference Time Card */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-slate-50/60 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-slate-600 font-bold">Inference Time</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Winner: {winners.inferenceTimeMs}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 my-2">
                <div className="p-2.5 rounded-xl bg-white border border-blue-200 shadow-2xs">
                  <span className="text-[10px] font-mono text-blue-700 block font-semibold">LSTM</span>
                  <span className="text-xl font-display font-bold text-slate-900">{lstm.inferenceTimeMs}ms</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-purple-200 shadow-2xs">
                  <span className="text-[10px] font-mono text-purple-700 block font-semibold">Transformer</span>
                  <span className="text-xl font-display font-bold text-slate-900">{transformer.inferenceTimeMs}ms</span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-slate-600 leading-snug">
              Single-sample evaluation latency across GPU matrix execution kernels.
            </p>
          </div>

          {/* 4. Memory Usage Card */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-slate-50/60 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-slate-600 font-bold">Memory Usage</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Winner: {winners.memoryUsageMb}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 my-2">
                <div className="p-2.5 rounded-xl bg-white border border-blue-200 shadow-2xs">
                  <span className="text-[10px] font-mono text-blue-700 block font-semibold">LSTM</span>
                  <span className="text-xl font-display font-bold text-slate-900">{lstm.memoryUsageMb} MB</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-purple-200 shadow-2xs">
                  <span className="text-[10px] font-mono text-purple-700 block font-semibold">Transformer</span>
                  <span className="text-xl font-display font-bold text-slate-900">{transformer.memoryUsageMb} MB</span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-slate-600 leading-snug">
              LSTM uses {Math.round(((transformer.memoryUsageMb - lstm.memoryUsageMb) / transformer.memoryUsageMb) * 100)}% less RAM/VRAM due to linear O(N) hidden states.
            </p>
          </div>
        </div>

        {/* =========================================================================
            SIMPLE PROFESSIONAL BAR CHARTS (Light Theme)
           ========================================================================= */}
        <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Benchmark Metric Comparisons
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Simple bar visualizer highlighting the winning model on each axis.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-blue-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> LSTM
              </span>
              <span className="flex items-center gap-1.5 text-purple-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Transformer
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1: Accuracy */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-semibold text-slate-800">1. Accuracy Comparison (Higher is better)</span>
                <span className="text-emerald-700 font-mono text-[11px] font-semibold">Winner: Transformer</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="w-16 text-blue-700 font-medium">LSTM</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-4 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${lstm.accuracy}%` }} />
                  </div>
                  <span className="w-12 text-right text-slate-700 font-semibold">{lstm.accuracy}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-16 text-purple-700 font-medium">Transf.</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-4 overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: `${transformer.accuracy}%` }} />
                  </div>
                  <span className="w-12 text-right text-purple-900 font-bold">{transformer.accuracy}%</span>
                </div>
              </div>
            </div>

            {/* Chart 2: Training Time */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-semibold text-slate-800">2. Training Time Comparison (Lower is better)</span>
                <span className="text-emerald-700 font-mono text-[11px] font-semibold">Winner: Transformer</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="w-16 text-blue-700 font-medium">LSTM</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-4 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(lstm.trainingTimeSec / maxTrainTime) * 100}%` }} />
                  </div>
                  <span className="w-12 text-right text-slate-700 font-semibold">{lstm.trainingTimeSec}s</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-16 text-purple-700 font-medium">Transf.</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-4 overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: `${(transformer.trainingTimeSec / maxTrainTime) * 100}%` }} />
                  </div>
                  <span className="w-12 text-right text-purple-900 font-bold">{transformer.trainingTimeSec}s</span>
                </div>
              </div>
            </div>

            {/* Chart 3: Inference Speed */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-semibold text-slate-800">3. Inference Speed Comparison (Lower latency is better)</span>
                <span className="text-emerald-700 font-mono text-[11px] font-semibold">Winner: {winners.inferenceTimeMs}</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="w-16 text-blue-700 font-medium">LSTM</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-4 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(lstm.inferenceTimeMs / maxInferTime) * 100}%` }} />
                  </div>
                  <span className="w-12 text-right text-slate-700 font-semibold">{lstm.inferenceTimeMs}ms</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-16 text-purple-700 font-medium">Transf.</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-4 overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: `${(transformer.inferenceTimeMs / maxInferTime) * 100}%` }} />
                  </div>
                  <span className="w-12 text-right text-purple-900 font-bold">{transformer.inferenceTimeMs}ms</span>
                </div>
              </div>
            </div>

            {/* Chart 4: Memory Usage */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-semibold text-slate-800">4. Memory Usage Comparison (Lower footprint is better)</span>
                <span className="text-emerald-700 font-mono text-[11px] font-semibold">Winner: LSTM</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="w-16 text-blue-700 font-bold">LSTM</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-4 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(lstm.memoryUsageMb / maxMemory) * 100}%` }} />
                  </div>
                  <span className="w-16 text-right text-blue-700 font-bold">{lstm.memoryUsageMb}MB</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-16 text-purple-700 font-medium">Transf.</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-4 overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: `${(transformer.memoryUsageMb / maxMemory) * 100}%` }} />
                  </div>
                  <span className="w-16 text-right text-slate-700">{transformer.memoryUsageMb}MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            EXPANDABLE DETAILED METRICS SECTION WITH TOOLTIPS
           ========================================================================= */}
        <div className="mt-6">
          <button
            onClick={() => setShowDetailedMetrics(!showDetailedMetrics)}
            className="w-full py-3 px-5 rounded-2xl glass-panel border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:text-slate-900 flex items-center justify-between transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Expand Full Evaluation Metrics Table (Accuracy, Precision, Recall, F1, Memory)</span>
            </div>
            {showDetailedMetrics ? (
              <ChevronUp className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            )}
          </button>

          {showDetailedMetrics && (
            <div className="mt-3 glass-panel p-5 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                <thead className="text-[11px] font-mono uppercase bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Metric Name</th>
                    <th className="py-2.5 px-3 text-blue-700">LSTM Value</th>
                    <th className="py-2.5 px-3 text-purple-700">Transformer Value</th>
                    <th className="py-2.5 px-3">Winner</th>
                    <th className="py-2.5 px-3">Definition & Meaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs">
                  {DETAILED_METRICS.map((m) => {
                    const winner = winners[m.key];
                    return (
                      <tr key={m.key} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 font-sans font-semibold text-slate-900 flex items-center gap-1.5">
                          <span>{m.label}</span>
                          <span
                            title={m.tooltip}
                            className="text-slate-400 hover:text-blue-600 cursor-help"
                          >
                            <Info className="h-3 w-3" />
                          </span>
                        </td>
                        <td className="py-3 px-3 text-blue-700 font-bold">
                          {lstm[m.key]} {m.unit}
                        </td>
                        <td className="py-3 px-3 text-purple-700 font-bold">
                          {transformer[m.key]} {m.unit}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            winner === 'Transformer'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}>
                            {winner}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-sans text-xs text-slate-600">
                          {m.tooltip}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
