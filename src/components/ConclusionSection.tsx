import React, { useState } from 'react';
import { Quote, Copy, Check, FileText, Share2, Layers, BookCheck } from 'lucide-react';
import { BenchmarkMetricsData } from '../types.ts';

interface ConclusionSectionProps {
  currentBenchmark: BenchmarkMetricsData;
}

export const ConclusionSection: React.FC<ConclusionSectionProps> = ({ currentBenchmark }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyReport = () => {
    const reportText = `# Attention vs Recurrence: Comparative Benchmark Summary
Dataset: ${currentBenchmark.datasetName} (${currentBenchmark.sampleCount} samples, avg sequence: ${currentBenchmark.sequenceAvgLength} tokens)

## Empirical Findings:
- LSTM: Accuracy: ${currentBenchmark.lstm.accuracy}%, F1: ${currentBenchmark.lstm.f1}%, Training Time: ${currentBenchmark.lstm.trainingTimeSec}s, Single-Sample Latency: ${currentBenchmark.lstm.inferenceTimeMs}ms, Memory: ${currentBenchmark.lstm.memoryUsageMb}MB, Params: ${currentBenchmark.lstm.parametersMillion}M
- Transformer: Accuracy: ${currentBenchmark.transformer.accuracy}%, F1: ${currentBenchmark.transformer.f1}%, Training Time: ${currentBenchmark.transformer.trainingTimeSec}s, Single-Sample Latency: ${currentBenchmark.transformer.inferenceTimeMs}ms, Memory: ${currentBenchmark.transformer.memoryUsageMb}MB, Params: ${currentBenchmark.transformer.parametersMillion}M

## Core Conclusion:
"There is no universal winner. Model selection depends on dataset size, accuracy, latency and available computational resources."
- Choose LSTM for: edge/embedded deployment, low RAM budgets (<50MB), tiny datasets (<5k samples), and sequential streaming.
- Choose Transformer for: state-of-the-art accuracy, large datasets (>50k samples), GPU batch throughput, and long-range syntactic dependencies.
`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="conclusion" className="py-20 bg-[#0a0e17] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Highlighted Core Takeaway Banner */}
        <div className="glass-panel p-8 sm:p-12 border border-blue-500/30 relative overflow-hidden text-center max-w-4xl mx-auto shadow-2xl bg-gradient-to-b from-blue-950/30 to-purple-950/20">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-6 text-blue-400">
            <Quote className="h-6 w-6" />
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold mb-3 block">
            Executive Research Verdict
          </span>

          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight leading-snug">
            “There is no universal winner. Model selection depends on dataset size, accuracy, latency and available computational resources.”
          </h2>

          <p className="mt-5 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Neither model makes the other obsolete. While Transformers define modern state-of-the-art NLP for high-accuracy cloud services, LSTMs remain indispensable in memory-constrained, low-power edge environments.
          </p>

          {/* Action to Copy / Export Report */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleCopyReport}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/15 text-xs font-semibold font-mono transition-all hover:border-blue-400"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-300">Report Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-blue-400" />
                  <span>Copy Benchmark Summary (Markdown)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dual Condition Matrices */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Under What Conditions LSTM Wins */}
          <div className="glass-panel p-6 border-l-4 border-l-cyan-400 border-white/10">
            <h3 className="font-display font-bold text-lg text-white mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              When to Select LSTM:
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Best suited for resource-bounded constraints and sequential streaming:
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold font-mono">1.</span>
                <span><strong>Hardware Constraints:</strong> Running directly on CPU, edge MCUs, or smartphones with minimal RAM budgets (&lt;50MB).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold font-mono">2.</span>
                <span><strong>Tiny Data Scale:</strong> When you only have 1,000 to 10,000 labeled training instances and cannot use heavy pre-trained weights.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold font-mono">3.</span>
                <span><strong>Streaming Inference:</strong> When input tokens arrive sequentially one-by-one over a live socket without needing to re-attend all past tokens.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold font-mono">4.</span>
                <span><strong>Short Documents:</strong> Short customer feedback, transaction descriptions, or sensor readings where distant context is negligible.</span>
              </li>
            </ul>
          </div>

          {/* Under What Conditions Transformer Wins */}
          <div className="glass-panel p-6 border-l-4 border-l-purple-400 border-white/10">
            <h3 className="font-display font-bold text-lg text-white mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              When to Select Transformer:
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Best suited for maximum accuracy and rich context comprehension:
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold font-mono">1.</span>
                <span><strong>Maximum Accuracy Demand:</strong> State-of-the-art sentiment, complex multi-label classification, and nuance detection.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold font-mono">2.</span>
                <span><strong>Long-Range Context:</strong> Documents &gt;200 tokens with cross-clause negations, subtle sarcasm, or distant pronoun references.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold font-mono">3.</span>
                <span><strong>GPU Batch Throughput:</strong> High-volume production microservices serving hundreds of concurrent requests via batching.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold font-mono">4.</span>
                <span><strong>Pre-trained Transfer Learning:</strong> Fine-tuning existing foundation checkpoints (BERT, RoBERTa, DeBERTa, ModernBERT) in hours.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
          <div>
            Attention vs Recurrence • Machine Learning Comparative Benchmark
          </div>
          <div className="flex items-center gap-4">
            <span>Standardized Evaluation Split</span>
            <span>•</span>
            <span>Demo Benchmark Ready</span>
          </div>
        </div>
      </div>
    </section>
  );
};
