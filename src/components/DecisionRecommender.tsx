import React, { useState, useId } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, Zap, Sliders, Cpu } from 'lucide-react';
import { calculateRecommendation } from '../utils/benchmark.ts';
import { RecommenderInput } from '../types.ts';

export const DecisionRecommender: React.FC = () => {
  const datasetSelectId = useId();
  const hardwareSelectId = useId();
  const sequenceSelectId = useId();
  const latencySelectId = useId();
  const accuracySelectId = useId();

  const [inputs, setInputs] = useState<RecommenderInput>({
    datasetSize: 'small',
    hardware: 'single-gpu',
    sequenceLength: 'medium',
    latencyBudget: 'balanced',
    accuracyPriority: 'high',
  });

  const recommendation = calculateRecommendation(inputs);

  return (
    <section id="recommender" className="py-16 bg-[#07090e] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Decision-Oriented Guidance
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
            Which Model Should I Choose?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 leading-relaxed">
            Configure your project's data scale, compute budget, latency limits, and accuracy demands to receive an instant, objective architecture recommendation.
          </p>
        </div>

        {/* Two-Column Interactive Tool: Form on Left, Dynamic Verdict on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 glass-panel p-6 border border-white/10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="font-display font-bold text-sm text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-blue-400" />
                Workload Parameters
              </span>
              <span className="text-[11px] font-mono text-slate-400">Interactive Tuner</span>
            </div>

            {/* 1. Dataset Size */}
            <div>
              <label htmlFor={datasetSelectId} className="block text-xs font-semibold text-slate-300 mb-1.5">
                Dataset Training Volume
              </label>
              <select
                id={datasetSelectId}
                value={inputs.datasetSize}
                onChange={(e) =>
                  setInputs({ ...inputs, datasetSize: e.target.value as RecommenderInput['datasetSize'] })
                }
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="tiny">Tiny (&lt;5,000 labeled samples)</option>
                <option value="small">Small (5,000 - 50,000 samples)</option>
                <option value="medium">Medium (50,000 - 500,000 samples)</option>
                <option value="large">Large (&gt;500,000 samples / Big Data)</option>
              </select>
            </div>

            {/* 2. Available Hardware */}
            <div>
              <label htmlFor={hardwareSelectId} className="block text-xs font-semibold text-slate-300 mb-1.5">
                Compute & Hardware Infrastructure
              </label>
              <select
                id={hardwareSelectId}
                value={inputs.hardware}
                onChange={(e) =>
                  setInputs({ ...inputs, hardware: e.target.value as RecommenderInput['hardware'] })
                }
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="cpu-edge">CPU Only / Edge Device / Mobile / Low RAM</option>
                <option value="single-gpu">Single Workstation GPU (T4 / RTX 3060 / 4090)</option>
                <option value="cluster">Multi-GPU Cluster / Cloud TPUs / High VRAM</option>
              </select>
            </div>

            {/* 3. Sequence Length */}
            <div>
              <label htmlFor={sequenceSelectId} className="block text-xs font-semibold text-slate-300 mb-1.5">
                Typical Text Sequence Length
              </label>
              <select
                id={sequenceSelectId}
                value={inputs.sequenceLength}
                onChange={(e) =>
                  setInputs({ ...inputs, sequenceLength: e.target.value as RecommenderInput['sequenceLength'] })
                }
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="short">Short (&lt;50 tokens: tweets, titles, search queries)</option>
                <option value="medium">Medium (50 - 300 tokens: reviews, paragraphs)</option>
                <option value="long">Long (&gt;500 tokens: research papers, full legal docs)</option>
              </select>
            </div>

            {/* 4. Latency Budget */}
            <div>
              <label htmlFor={latencySelectId} className="block text-xs font-semibold text-slate-300 mb-1.5">
                Inference Latency Constraint
              </label>
              <select
                id={latencySelectId}
                value={inputs.latencyBudget}
                onChange={(e) =>
                  setInputs({ ...inputs, latencyBudget: e.target.value as RecommenderInput['latencyBudget'] })
                }
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="ultra-low">Ultra-low latency (&lt;10ms per sample)</option>
                <option value="balanced">Balanced interactive latency (~25-50ms)</option>
                <option value="relaxed">Relaxed / Offline batch processing</option>
              </select>
            </div>

            {/* 5. Accuracy Target */}
            <div>
              <label htmlFor={accuracySelectId} className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Accuracy Expectation
              </label>
              <select
                id={accuracySelectId}
                value={inputs.accuracyPriority}
                onChange={(e) =>
                  setInputs({ ...inputs, accuracyPriority: e.target.value as RecommenderInput['accuracyPriority'] })
                }
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="moderate">Acceptable (~85-88% baseline)</option>
                <option value="high">High (~90-93% solid benchmark)</option>
                <option value="maximum">Maximum SOTA (State-of-the-art accuracy)</option>
              </select>
            </div>
          </div>

          {/* Dynamic Verdict Column (7 cols) */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 border border-white/15 relative overflow-hidden">
            {/* Ambient Winner Accent Glow */}
            <div
              className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
                recommendation.winner === 'Transformer'
                  ? 'bg-purple-600/15'
                  : recommendation.winner === 'LSTM'
                  ? 'bg-cyan-600/15'
                  : 'bg-blue-600/15'
              }`}
            />

            {/* Verdict Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-xl border ${
                    recommendation.winner === 'Transformer'
                      ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                      : recommendation.winner === 'LSTM'
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                      : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}
                >
                  {recommendation.winner === 'Transformer' ? (
                    <Zap className="h-6 w-6" />
                  ) : recommendation.winner === 'LSTM' ? (
                    <RotateCcw className="h-6 w-6" />
                  ) : (
                    <Cpu className="h-6 w-6" />
                  )}
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                    Recommended Architecture
                  </span>
                  <h3 className="font-display font-extrabold text-2xl text-white">
                    {recommendation.winner}
                  </h3>
                </div>
              </div>

              <div className="text-right sm:text-right">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Decision Confidence</span>
                <span className="text-xl font-display font-bold text-emerald-400 font-mono">
                  {recommendation.confidenceScore}% Fit
                </span>
              </div>
            </div>

            {/* Headline and Summary */}
            <h4 className="text-base font-semibold text-white mb-2">{recommendation.headline}</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              {recommendation.summary}
            </p>

            {/* Relative Score Bar */}
            <div className="mb-6 p-4 rounded-xl bg-slate-950/70 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-semibold flex items-center gap-1">
                  <RotateCcw className="h-3 w-3" /> LSTM Fit: {recommendation.lstmScore} pts
                </span>
                <span className="text-purple-400 font-semibold flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Transformer Fit: {recommendation.transformerScore} pts
                </span>
              </div>

              <div className="h-3 bg-slate-900 rounded-full overflow-hidden flex border border-white/10">
                <div
                  className="bg-cyan-500 h-full transition-all duration-500"
                  style={{
                    width: `${
                      (recommendation.lstmScore / (recommendation.lstmScore + recommendation.transformerScore)) * 100
                    }%`,
                  }}
                />
                <div
                  className="bg-purple-500 h-full transition-all duration-500"
                  style={{
                    width: `${
                      (recommendation.transformerScore /
                        (recommendation.lstmScore + recommendation.transformerScore)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Key Rationale Points */}
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2 font-semibold">
                  Primary Decision Drivers:
                </span>
                <ul className="space-y-2">
                  {recommendation.keyReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Caveats */}
              <div className="pt-3 border-t border-white/5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 block mb-2 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Engineering Caveats to Note:
                </span>
                <ul className="space-y-1.5">
                  {recommendation.caveats.map((cav, idx) => (
                    <li key={idx} className="text-xs text-slate-400 pl-4 border-l-2 border-amber-500/40">
                      {cav}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
