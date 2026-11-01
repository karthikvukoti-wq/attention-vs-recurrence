import React, { useState } from 'react';
import {
  Trophy,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  Database,
  Award,
  Zap,
  RotateCcw,
  SlidersHorizontal,
  Flame,
} from 'lucide-react';
import { BenchmarkMetricsData } from '../types.ts';

interface PerformanceDashboardProps {
  metricsData: BenchmarkMetricsData;
  selectedDataset: string;
  onSelectDataset: (dataset: string) => void;
}

interface MetricCardConfig {
  key: keyof BenchmarkMetricsData['lstm'];
  label: string;
  unit: string;
  category: 'quality' | 'speed' | 'hardware';
  lowerIsBetter?: boolean;
  description: string;
  whyWinnerWon: (winner: string) => string;
}

const METRICS_CONFIG: MetricCardConfig[] = [
  {
    key: 'accuracy',
    label: 'Test Accuracy',
    unit: '%',
    category: 'quality',
    description: 'Overall classification correctness on held-out test split.',
    whyWinnerWon: (w) =>
      w === 'Transformer'
        ? 'Self-attention resolves non-local syntactic dependencies and subtle sentiment modifiers.'
        : 'Recurrent gating prevents overfitting on smaller sequence distributions.',
  },
  {
    key: 'precision',
    label: 'Precision',
    unit: '%',
    category: 'quality',
    description: 'Proportion of true positive predictions among all positive assertions.',
    whyWinnerWon: (w) =>
      w === 'Transformer'
        ? 'Denser representations reduce false positive trigger noise from isolated keywords.'
        : 'Carefully tuned cell capacity rejects uncorroborated positive triggers.',
  },
  {
    key: 'recall',
    label: 'Recall',
    unit: '%',
    category: 'quality',
    description: 'Proportion of actual positive samples accurately detected.',
    whyWinnerWon: (w) =>
      w === 'Transformer'
        ? 'Direct all-to-all attention catches buried sentiment cues anywhere in the sequence.'
        : 'Recurrent accumulation catches steady thematic repetition.',
  },
  {
    key: 'f1',
    label: 'F1 Score (Harmonic Mean)',
    unit: '%',
    category: 'quality',
    description: 'Balanced metric combining precision and recall for unbiased evaluation.',
    whyWinnerWon: (w) =>
      w === 'Transformer'
        ? 'Provides superior trade-off balance across unbalanced sentiment classes.'
        : 'Maintains consistent harmonic balance without requiring huge data volumes.',
  },
  {
    key: 'trainingTimeSec',
    label: 'Training Time (Epoch)',
    unit: ' s',
    category: 'speed',
    lowerIsBetter: true,
    description: 'Wall-clock time to train 1 epoch on standard accelerator hardware.',
    whyWinnerWon: (w) =>
      w === 'Transformer'
        ? 'GPU tensor cores compute all tokens in parallel, avoiding step-by-step unroll synchronization.'
        : 'Fewer total parameters (3.4M vs 66M) reduces aggregate backward pass FLOPs.',
  },
  {
    key: 'inferenceTimeMs',
    label: 'Single-Sample Latency',
    unit: ' ms',
    category: 'speed',
    lowerIsBetter: true,
    description: 'Time required to compute classification forward pass for a single request.',
    whyWinnerWon: (w) =>
      w === 'Transformer'
        ? 'Highly optimized batched matrix kernels on modern GPU drivers.'
        : 'Extremely lightweight matrix dimensions require minimal cache loads.',
  },
  {
    key: 'memoryUsageMb',
    label: 'Active Memory Footprint',
    unit: ' MB',
    category: 'hardware',
    lowerIsBetter: true,
    description: 'Peak VRAM/RAM allocation during inference and batch processing.',
    whyWinnerWon: (w) =>
      w === 'LSTM'
        ? 'Linear O(N) hidden states use vastly less memory than quadratic O(N²) attention matrices.'
        : 'Compressed KV cache implementation.',
  },
  {
    key: 'parametersMillion',
    label: 'Model Parameter Scale',
    unit: 'M',
    category: 'hardware',
    lowerIsBetter: true,
    description: 'Total trainable weight count (Embeddings + Core layers + Head).',
    whyWinnerWon: (w) =>
      w === 'LSTM'
        ? 'LSTM architecture achieves high performance with just ~3.4M weights (19x more compact!).'
        : 'Higher parameter capacity.',
  },
];

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  metricsData,
  selectedDataset,
  onSelectDataset,
}) => {
  const [metricFilter, setMetricFilter] = useState<'all' | 'quality' | 'speed' | 'hardware'>('all');

  const lstm = metricsData.lstm;
  const transformer = metricsData.transformer;
  const winners = metricsData.winner;

  // Filter metrics
  const displayedMetrics =
    metricFilter === 'all'
      ? METRICS_CONFIG
      : METRICS_CONFIG.filter((m) => m.category === metricFilter);

  // Count total wins
  let lstmWins = 0;
  let transformerWins = 0;
  Object.values(winners).forEach((w) => {
    if (w === 'LSTM') lstmWins++;
    if (w === 'Transformer') transformerWins++;
  });

  return (
    <section id="dashboard" className="py-20 bg-[#0a0e17] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-purple-400 uppercase tracking-wider bg-purple-500/10 px-2.5 py-1 rounded border border-purple-500/20">
                Empirical Evaluation
              </span>
              <span className="text-xs font-mono text-slate-400">
                Identical Train/Test Splits & Hardware Baseline
              </span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              Model Performance Dashboard
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Standardized head-to-head leaderboard. Every metric identifies the architectural winner with quantitative deltas and engineering rationale.
            </p>
          </div>

          {/* Leaderboard Scoreboard */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-3 flex items-center gap-5 text-xs font-mono shadow-xl">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                <span className="text-slate-200 font-bold">LSTM: {lstmWins} Wins</span>
              </div>
              <div className="h-4 w-[1px] bg-white/15" />
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-400 shadow-sm shadow-purple-400" />
                <span className="text-slate-200 font-bold">Transformer: {transformerWins} Wins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dataset Selection Tabs & Category Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'IMDB Sentiment', label: 'IMDB Sentiment (50k)' },
              { id: 'SST-2 (Short Sentences)', label: 'SST-2 Short Sentences' },
              { id: 'AG News (Topic Classification)', label: 'AG News Topic (120k)' },
              { id: 'Long-Doc Context Stress Test', label: 'Long-Doc Stress Test (800+)' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectDataset(item.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  selectedDataset === item.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/40 font-semibold'
                    : 'bg-slate-900/70 text-slate-400 hover:text-white border border-white/5 hover:border-white/15'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setMetricFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                metricFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Metrics
            </button>
            <button
              onClick={() => setMetricFilter('quality')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                metricFilter === 'quality' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Accuracy & F1
            </button>
            <button
              onClick={() => setMetricFilter('speed')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                metricFilter === 'speed' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Speed & Latency
            </button>
            <button
              onClick={() => setMetricFilter('hardware')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                metricFilter === 'hardware' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Memory & Params
            </button>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayedMetrics.map((config) => {
            const lstmVal = lstm[config.key];
            const transVal = transformer[config.key];
            const winner = winners[config.key];

            const isTransWinner = winner === 'Transformer';
            const isLstmWinner = winner === 'LSTM';

            // Calculate delta
            let deltaText = '';
            if (config.key === 'accuracy' || config.key === 'precision' || config.key === 'recall' || config.key === 'f1') {
              const diff = Math.abs(transVal - lstmVal).toFixed(1);
              deltaText = `+${diff}% higher`;
            } else if (config.key === 'trainingTimeSec') {
              const ratio = (Math.max(transVal, lstmVal) / Math.min(transVal, lstmVal)).toFixed(1);
              deltaText = `${ratio}x faster`;
            } else if (config.key === 'inferenceTimeMs') {
              const diff = Math.abs(transVal - lstmVal);
              deltaText = `${diff}ms lower latency`;
            } else if (config.key === 'memoryUsageMb') {
              const pct = Math.round((Math.abs(transVal - lstmVal) / Math.max(transVal, lstmVal)) * 100);
              deltaText = `${pct}% less RAM/VRAM`;
            } else if (config.key === 'parametersMillion') {
              const ratio = (Math.max(transVal, lstmVal) / Math.min(transVal, lstmVal)).toFixed(0);
              deltaText = `${ratio}x more compact`;
            }

            return (
              <div
                key={config.key}
                className="glass-panel p-5 sm:p-6 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  {/* Card Title & Winner Badge */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
                      {config.label}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm ${
                        isTransWinner
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : isLstmWinner
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <Trophy className="h-3 w-3" />
                      {winner}
                    </span>
                  </div>

                  {/* Values Side-by-Side */}
                  <div className="grid grid-cols-2 gap-2.5 my-3">
                    {/* LSTM Box */}
                    <div
                      className={`p-3 rounded-xl border transition-all ${
                        isLstmWinner
                          ? 'bg-cyan-950/40 border-cyan-500/60 shadow-inner'
                          : 'bg-slate-950/60 border-white/5 opacity-75'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1 font-semibold">
                        <RotateCcw className="h-3 w-3" />
                        LSTM
                      </span>
                      <div className="text-xl font-display font-bold text-white mt-1">
                        {lstmVal}
                        <span className="text-xs font-normal text-slate-400">{config.unit}</span>
                      </div>
                    </div>

                    {/* Transformer Box */}
                    <div
                      className={`p-3 rounded-xl border transition-all ${
                        isTransWinner
                          ? 'bg-purple-950/40 border-purple-500/60 shadow-inner'
                          : 'bg-slate-950/60 border-white/5 opacity-75'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-purple-400 flex items-center gap-1 font-semibold">
                        <Zap className="h-3 w-3" />
                        Transformer
                      </span>
                      <div className="text-xl font-display font-bold text-white mt-1">
                        {transVal}
                        <span className="text-xs font-normal text-slate-400">{config.unit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Winner Delta Callout */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 my-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {winner} wins: <strong>{deltaText}</strong>
                    </span>
                  </div>
                </div>

                {/* Engineering Rationale Footnote */}
                <p className="mt-3.5 pt-3 border-t border-white/5 text-[11px] text-slate-400 leading-snug">
                  {config.whyWinnerWon(winner)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
