import React from 'react';
import { RotateCcw, Zap, ArrowDown } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="overview" className="relative pt-12 pb-14 bg-radial-glow border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Main Title */}
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-slate-900 tracking-tight">
          Attention <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">vs</span> Recurrence
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-lg sm:text-2xl font-semibold text-slate-700">
          LSTM vs Transformer for Text Classification
        </p>

        {/* Short Explanation */}
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Compare recurrent sequence processing with self-attention using the same text classification task.
        </p>

        {/* Visual Architecture Comparison: Input Text -> LSTM vs Transformer */}
        <div className="mt-10 max-w-3xl mx-auto">
          {/* Top Shared Input Node */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-mono shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Shared Input Text Sequence: <strong>x = [x₁, x₂, ..., xₙ]</strong></span>
          </div>

          {/* Diverging Paths */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4 text-left">
            {/* Path A: LSTM (Blue) */}
            <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-blue-600 border-slate-200 bg-blue-50/40 hover:border-blue-300 transition-all shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700 border border-blue-200">
                    <RotateCcw className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-base text-slate-900">LSTM Architecture</h2>
                    <span className="text-xs font-mono text-blue-600 font-semibold">Sequential Recurrence</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 font-semibold">
                  O(N) Steps
                </span>
              </div>

              {/* Sequential Flow Diagram */}
              <div className="mt-3 p-3 rounded-xl bg-white border border-blue-200 text-xs font-mono text-slate-700 flex items-center justify-between shadow-xs">
                <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-600">x₁</span>
                <span className="text-blue-600">→</span>
                <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">h(t-1)</span>
                <span className="text-blue-600">→</span>
                <span className="px-2 py-1 rounded bg-blue-600 text-white font-bold shadow-xs">h(t)</span>
                <span className="text-blue-600">→</span>
                <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-600">y</span>
              </div>

              <p className="mt-2.5 text-xs text-slate-600 leading-snug">
                Step-by-step recurrent loop. Information flows sequentially through a hidden memory bottleneck vector.
              </p>
            </div>

            {/* Path B: Transformer (Purple) */}
            <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-purple-600 border-slate-200 bg-purple-50/40 hover:border-purple-300 transition-all shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-700 border border-purple-200">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-base text-slate-900">Transformer Architecture</h2>
                    <span className="text-xs font-mono text-purple-600 font-semibold">Self-Attention</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 font-semibold">
                  O(1) Path
                </span>
              </div>

              {/* Self-Attention Network Diagram */}
              <div className="mt-3 p-3 rounded-xl bg-white border border-purple-200 text-xs font-mono text-slate-700 flex items-center justify-between shadow-xs">
                <span className="px-2 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200 font-bold">Q₁ · K₁</span>
                <span className="text-purple-600">↔</span>
                <span className="px-2 py-1 rounded bg-purple-600 text-white font-bold shadow-xs">softmax(QKᵀ/√d)</span>
                <span className="text-purple-600">↔</span>
                <span className="px-2 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200 font-bold">V · y</span>
              </div>

              <p className="mt-2.5 text-xs text-slate-600 leading-snug">
                All-to-all pairwise attention. All tokens interact in parallel across attention heads simultaneously.
              </p>
            </div>
          </div>
        </div>

        {/* CTA to start workflow */}
        <div className="mt-8 flex justify-center">
          <a
            href="#workflow"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Start Guided Experiment Workflow
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};
