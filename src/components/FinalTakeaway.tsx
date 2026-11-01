import React, { useState } from 'react';
import { Quote, Copy, Check } from 'lucide-react';
import { BenchmarkMetricsData } from '../types.ts';

interface FinalTakeawayProps {
  currentBenchmark: BenchmarkMetricsData;
}

export const FinalTakeaway: React.FC<FinalTakeawayProps> = ({ currentBenchmark }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `# Attention vs Recurrence: Benchmark Summary
Dataset: ${currentBenchmark.datasetName} (${currentBenchmark.sampleCount} samples)

## Metrics:
- LSTM: Accuracy: ${currentBenchmark.lstm.accuracy}%, F1: ${currentBenchmark.lstm.f1}%, Latency: ${currentBenchmark.lstm.inferenceTimeMs}ms, Memory: ${currentBenchmark.lstm.memoryUsageMb}MB, Params: ${currentBenchmark.lstm.parametersMillion}M
- Transformer: Accuracy: ${currentBenchmark.transformer.accuracy}%, F1: ${currentBenchmark.transformer.f1}%, Latency: ${currentBenchmark.transformer.inferenceTimeMs}ms, Memory: ${currentBenchmark.transformer.memoryUsageMb}MB, Params: ${currentBenchmark.transformer.parametersMillion}M

## Conclusion:
"There is no universal winner. Model selection depends on accuracy requirements, dataset size, latency and available computational resources."
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 bg-white border-t border-slate-200 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4 text-white shadow-md">
          <Quote className="h-5 w-5" />
        </div>

        <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold block mb-2">
          Final Research Takeaway
        </span>

        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
          There is no universal winner.
        </h2>

        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          “Model selection depends on accuracy requirements, dataset size, latency and available computational resources.”
        </p>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300 text-xs font-mono transition-all cursor-pointer shadow-xs"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Benchmark Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-blue-600" />
                <span>Copy Experiment Summary</span>
              </>
            )}
          </button>
        </div>

        {/* Minimal Footer */}
        <div className="mt-14 pt-6 border-t border-slate-200 text-xs text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Attention vs Recurrence • Guided ML Experiment</span>
          <span>Standardized Evaluation Split • Demo Benchmark</span>
        </div>
      </div>
    </section>
  );
};
