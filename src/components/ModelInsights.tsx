import React, { useState } from 'react';
import {
  Check,
  X,
  Lightbulb,
  Compass,
  RotateCcw,
  Zap,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { BenchmarkMetricsData, RecommenderInput } from '../types.ts';
import { calculateRecommendation } from '../utils/benchmark.ts';

interface ModelInsightsProps {
  metricsData: BenchmarkMetricsData;
}

export const ModelInsights: React.FC<ModelInsightsProps> = ({ metricsData }) => {
  const [showInteractiveTuner, setShowInteractiveTuner] = useState(false);
  const [inputs, setInputs] = useState<RecommenderInput>({
    datasetSize: 'small',
    hardware: 'single-gpu',
    sequenceLength: 'medium',
    latencyBudget: 'balanced',
    accuracyPriority: 'high',
  });

  const recommendation = calculateRecommendation(inputs);

  return (
    <section id="insights-step" className="py-14 border-b border-slate-200 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Badge & Header */}
        <div className="mb-6">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-purple-100 text-purple-700 border border-purple-200">
            STEP 05
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-2">
            What does the comparison tell us?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Empirical trade-offs between sequential recurrence and parallel self-attention.
          </p>
        </div>

        {/* =========================================================================
            CONCISE RESULT SUMMARY (Transformer vs LSTM)
           ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Transformer Summary Card */}
          <div className="p-6 rounded-2xl border-l-4 border-l-purple-600 border border-purple-200 bg-purple-50/40 shadow-xs">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-purple-200/60">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-700 border border-purple-300">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">Transformer</h3>
                <span className="text-xs font-mono text-purple-700 font-semibold">Self-Attention Architecture</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-slate-800">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                  ✓
                </span>
                <span><strong>Higher accuracy:</strong> {metricsData.transformer.accuracy}% on benchmark (+{(metricsData.transformer.accuracy - metricsData.lstm.accuracy).toFixed(1)}% lead)</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-800">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                  ✓
                </span>
                <span><strong>Faster training:</strong> Parallel matrix calculations saturate GPU tensor cores</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-800">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                  ✓
                </span>
                <span><strong>Faster inference:</strong> High batched throughput for cloud serving</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-700">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 border border-rose-300 flex items-center justify-center font-bold text-xs shrink-0">
                  ✗
                </span>
                <span><strong>Higher memory usage:</strong> {metricsData.transformer.memoryUsageMb} MB VRAM (quadratic O(N²) attention matrices)</span>
              </div>
            </div>
          </div>

          {/* LSTM Summary Card */}
          <div className="p-6 rounded-2xl border-l-4 border-l-blue-600 border border-blue-200 bg-blue-50/40 shadow-xs">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-blue-200/60">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-700 border border-blue-300">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">LSTM</h3>
                <span className="text-xs font-mono text-blue-700 font-semibold">Sequential Recurrence</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-slate-800">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                  ✓
                </span>
                <span><strong>Lower memory usage:</strong> {metricsData.lstm.memoryUsageMb} MB ({Math.round(((metricsData.transformer.memoryUsageMb - metricsData.lstm.memoryUsageMb) / metricsData.transformer.memoryUsageMb) * 100)}% lighter RAM/VRAM footprint)</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-800">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                  ✓
                </span>
                <span><strong>Simpler sequential architecture:</strong> Built-in word order bias, ~3.4M compact parameters</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-700">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 border border-rose-300 flex items-center justify-center font-bold text-xs shrink-0">
                  ✗
                </span>
                <span><strong>Slower sequential processing:</strong> Cannot parallelize training over sequence tokens</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-700">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 border border-rose-300 flex items-center justify-center font-bold text-xs shrink-0">
                  ✗
                </span>
                <span><strong>Lower benchmark accuracy:</strong> Bottlenecked memory vector forgets distant clauses in long text</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MODEL SELECTION: Which model should you choose?
           ========================================================================= */}
        <div className="mb-8">
          <div className="mb-4">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 border border-blue-200">
              DECISION GUIDE
            </span>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 tracking-tight mt-2">
              Which model should you choose?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Choose LSTM When Card */}
            <div className="p-6 rounded-2xl border border-blue-200 bg-white shadow-xs">
              <h4 className="font-display font-bold text-base text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                Choose LSTM when:
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Dataset is relatively small:</strong> Converges stably without requiring massive pre-training.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Hardware resources are limited:</strong> Runs comfortably on CPU, mobile phones, or microcontrollers (&lt;50MB RAM).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Sequential processing is appropriate:</strong> Stream-based inputs arriving token-by-token over sockets.</span>
                </li>
              </ul>
            </div>

            {/* Choose Transformer When Card */}
            <div className="p-6 rounded-2xl border border-purple-200 bg-white shadow-xs">
              <h4 className="font-display font-bold text-base text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                Choose Transformer when:
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Dataset is large:</strong> High model parameter capacity unlocks deep semantic relationships.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Context understanding is important:</strong> Documents with long-range dependencies, negations, or sarcasm.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Higher accuracy is preferred:</strong> State-of-the-art results for mission-critical production.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Parallel training is useful:</strong> Accelerating turnaround using modern GPU/TPU infrastructure.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Optional Expandable Decision Tuner for Presentation */}
        <div className="mt-6">
          <button
            onClick={() => setShowInteractiveTuner(!showInteractiveTuner)}
            className="w-full py-3 px-5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:text-slate-900 flex items-center justify-between transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <Sliders className="h-4 w-4 text-purple-600" />
              <span>Interactive Decision Tuner (Configure Your Constraints)</span>
            </div>
            {showInteractiveTuner ? (
              <ChevronUp className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            )}
          </button>

          {showInteractiveTuner && (
            <div className="mt-4 p-6 rounded-2xl border border-slate-200 bg-white shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tuner Controls */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dataset Size</label>
                  <select
                    value={inputs.datasetSize}
                    onChange={(e) => setInputs({ ...inputs, datasetSize: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="tiny">Tiny (&lt;5k samples)</option>
                    <option value="small">Small (5k - 50k samples)</option>
                    <option value="medium">Medium (50k - 500k samples)</option>
                    <option value="large">Large (&gt;500k samples)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hardware Budget</label>
                  <select
                    value={inputs.hardware}
                    onChange={(e) => setInputs({ ...inputs, hardware: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cpu-edge">CPU / Edge / Low RAM (&lt;50MB)</option>
                    <option value="single-gpu">Single Workstation GPU</option>
                    <option value="cluster">Multi-GPU Cluster / Cloud TPUs</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sequence Length</label>
                  <select
                    value={inputs.sequenceLength}
                    onChange={(e) => setInputs({ ...inputs, sequenceLength: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="short">Short (&lt;50 tokens: tweets, titles)</option>
                    <option value="medium">Medium (50 - 300 tokens: reviews)</option>
                    <option value="long">Long (&gt;500 tokens: papers, reports)</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Recommendation Output */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block font-semibold">Live Recommendation</span>
                  <div className="text-xl font-display font-bold text-slate-900 mt-1 flex items-center gap-2">
                    <span className={recommendation.winner === 'Transformer' ? 'text-purple-600' : 'text-blue-600'}>
                      {recommendation.winner}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
                      {recommendation.confidenceScore}% Fit
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {recommendation.summary}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
