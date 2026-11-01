import React, { useState } from 'react';
import { BarChart3, TrendingUp, HardDrive, Clock, Sliders, Zap, RotateCcw } from 'lucide-react';
import { SCALING_CURVES } from '../utils/benchmark.ts';

export const VisualComparisonCharts: React.FC = () => {
  const [activeChartTab, setActiveChartTab] = useState<'accuracy' | 'seq-length' | 'batch-size' | 'memory'>('accuracy');
  const [interactiveSeqIndex, setInteractiveSeqIndex] = useState<number>(3); // 256 tokens default
  const [interactiveBatchIndex, setInteractiveBatchIndex] = useState<number>(3); // 32 batch default

  const seqData = SCALING_CURVES.sequenceLength;
  const currentSeq = seqData[interactiveSeqIndex] || seqData[3];

  const batchData = SCALING_CURVES.batchSizeInference;
  const currentBatch = batchData[interactiveBatchIndex] || batchData[3];

  return (
    <section id="charts" className="py-20 bg-[#07090e] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
                Quantitative Analytics
              </span>
              <span className="text-xs font-mono text-slate-400">
                Asymptotic Complexity & Hardware Scaling
              </span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              Visual Architectural Comparison
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Explore how sequential recurrence O(N) versus all-to-all self-attention O(N²) scale across token lengths, batch sizes, and memory boundaries.
            </p>
          </div>

          {/* Chart View Switcher */}
          <div className="flex flex-wrap gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 self-start md:self-auto text-xs shadow-lg">
            <button
              onClick={() => setActiveChartTab('accuracy')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeChartTab === 'accuracy'
                  ? 'bg-blue-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Task Accuracy
            </button>
            <button
              onClick={() => setActiveChartTab('seq-length')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeChartTab === 'seq-length'
                  ? 'bg-blue-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              Sequence Scaling
            </button>
            <button
              onClick={() => setActiveChartTab('batch-size')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeChartTab === 'batch-size'
                  ? 'bg-blue-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Batch Throughput
            </button>
            <button
              onClick={() => setActiveChartTab('memory')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeChartTab === 'memory'
                  ? 'bg-blue-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HardDrive className="h-3.5 w-3.5" />
              Memory Footprint
            </button>
          </div>
        </div>

        {/* Chart Container Panel */}
        <div className="glass-panel p-6 sm:p-8 border border-white/15 bg-gradient-to-b from-[#0e1422] to-[#0a0e18] shadow-2xl">
          {/* TAB 1: Task Accuracy across 4 NLP benchmarks */}
          {activeChartTab === 'accuracy' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Classification Accuracy across Datasets
                  </h3>
                  <p className="text-xs text-slate-400">
                    Comparing LSTM vs Transformer across varying sentence lengths and task complexities
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-cyan-400 inline-block" />
                    <span className="text-slate-300">LSTM Baseline</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-purple-500 inline-block" />
                    <span className="text-slate-300">Transformer</span>
                  </div>
                </div>
              </div>

              {/* Bar visualization */}
              <div className="space-y-6 pt-2">
                {[
                  { dataset: 'IMDB Movie Reviews (Avg: 234 words)', lstm: 89.4, trans: 94.8, delta: '+5.4%' },
                  { dataset: 'Stanford Sentiment Treebank SST-2 (Avg: 21 words)', lstm: 87.8, trans: 92.6, delta: '+4.8%' },
                  { dataset: 'AG News Topic Corpus (Avg: 45 words)', lstm: 91.2, trans: 94.9, delta: '+3.7%' },
                  { dataset: 'Long-Doc Context Stress Test (Avg: 840 words)', lstm: 78.6, trans: 93.1, delta: '+14.5%' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-200">{item.dataset}</span>
                      <span className="font-mono text-purple-400 font-semibold">
                        Transformer Lead: {item.delta}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {/* LSTM Bar */}
                      <div className="flex items-center gap-3">
                        <span className="w-16 text-[11px] font-mono text-cyan-400 font-semibold">LSTM</span>
                        <div className="flex-1 bg-slate-950 rounded-full h-4 overflow-hidden p-0.5 border border-white/5">
                          <div
                            className="bg-gradient-to-r from-cyan-700 to-cyan-400 h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2 text-[10px] font-mono font-bold text-slate-950 shadow-sm shadow-cyan-400/30"
                            style={{ width: `${item.lstm}%` }}
                          >
                            {item.lstm}%
                          </div>
                        </div>
                      </div>

                      {/* Transformer Bar */}
                      <div className="flex items-center gap-3">
                        <span className="w-16 text-[11px] font-mono text-purple-400 font-semibold">Transf.</span>
                        <div className="flex-1 bg-slate-950 rounded-full h-4 overflow-hidden p-0.5 border border-white/5">
                          <div
                            className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-400 h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2 text-[10px] font-mono font-bold text-white shadow-sm shadow-purple-400/30"
                            style={{ width: `${item.trans}%` }}
                          >
                            {item.trans}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Insight callout */}
              <div className="mt-8 p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
                <Zap className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-purple-300 font-semibold">Empirical Finding:</strong> Notice how the accuracy gap expands dramatically on the <em>Long-Doc Context Stress Test</em> (+14.5% lead). When sequences exceed 500 tokens, recurrent vanishing gradients cause LSTMs to lose opening context, while Transformer self-attention maintains an unbroken O(1) receptive path.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Sequence Length Scaling with Interactive Stepper */}
          {activeChartTab === 'seq-length' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Training Time & Memory Scaling vs. Sequence Length
                  </h3>
                  <p className="text-xs text-slate-400">
                    Observe how sequential O(N) unroll compares with parallel O(N²) attention matrices
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Select Length:</span>
                  <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-white/10">
                    {seqData.map((d, idx) => (
                      <button
                        key={d.length}
                        onClick={() => setInteractiveSeqIndex(idx)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                          interactiveSeqIndex === idx
                            ? 'bg-blue-600 text-white font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {d.length}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Interactive Focus Card */}
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-blue-500/30 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-[11px] font-mono uppercase text-slate-400 block">Current Sequence Scope</span>
                  <span className="text-2xl font-display font-extrabold text-white">
                    {currentSeq.length} <span className="text-xs font-normal text-slate-400">Tokens</span>
                  </span>
                  <span className="text-xs text-slate-400 block mt-1">
                    {currentSeq.length <= 128 ? 'Short sentence/tweet' : currentSeq.length <= 512 ? 'Standard paragraph/review' : 'Long article/document'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40">
                  <span className="text-[10px] font-mono uppercase text-cyan-400 block font-semibold">LSTM Telemetry</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold font-mono text-white">{currentSeq.lstmTrainTime}s</span>
                    <span className="text-xs text-slate-400">train time</span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-300 block mt-1">
                    VRAM: {currentSeq.lstmMemoryMb} MB (Strictly Linear)
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/40">
                  <span className="text-[10px] font-mono uppercase text-purple-400 block font-semibold">Transformer Telemetry</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold font-mono text-white">{currentSeq.transformerTrainTime}s</span>
                    <span className="text-xs text-slate-400">train time</span>
                  </div>
                  <span className="text-[11px] font-mono text-purple-300 block mt-1">
                    VRAM: {currentSeq.transformerMemoryMb} MB (Quadratic O(N²))
                  </span>
                </div>
              </div>

              {/* Scaling Plot Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {seqData.map((d, idx) => (
                  <button
                    key={d.length}
                    onClick={() => setInteractiveSeqIndex(idx)}
                    className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                      interactiveSeqIndex === idx
                        ? 'bg-blue-950/50 border-blue-400 ring-2 ring-blue-500/20'
                        : 'bg-slate-950/70 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xs font-mono text-slate-300 block mb-2 font-bold">
                      {d.length} Tokens
                    </span>

                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="bg-cyan-950/40 p-1.5 rounded border border-cyan-800/30">
                        <span className="text-[9px] text-cyan-400 block">LSTM</span>
                        <span className="font-bold text-white">{d.lstmTrainTime}s</span>
                      </div>
                      <div className="bg-purple-950/40 p-1.5 rounded border border-purple-800/30">
                        <span className="text-[9px] text-purple-400 block">Transf</span>
                        <span className="font-bold text-white">{d.transformerTrainTime}s</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Batch Throughput Scaling with Interactive Stepper */}
          {activeChartTab === 'batch-size' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Inference Throughput (Samples / Second) vs. Batch Size
                  </h3>
                  <p className="text-xs text-slate-400">
                    Demonstrating GPU saturation: As batch size scales from 1 to 128 samples
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Select Batch:</span>
                  <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-white/10">
                    {batchData.map((b, idx) => (
                      <button
                        key={b.batch}
                        onClick={() => setInteractiveBatchIndex(idx)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                          interactiveBatchIndex === idx
                            ? 'bg-blue-600 text-white font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {b.batch}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Interactive Focus Card */}
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-blue-500/30 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-[11px] font-mono uppercase text-slate-400 block">Selected Batch Size</span>
                  <span className="text-2xl font-display font-extrabold text-white">
                    {currentBatch.batch} <span className="text-xs font-normal text-slate-400">Samples/req</span>
                  </span>
                  <span className="text-xs text-slate-400 block mt-1">
                    {currentBatch.batch === 1 ? 'Single-sample interactive mode' : 'Production API server batching'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40">
                  <span className="text-[10px] font-mono uppercase text-cyan-400 block font-semibold">LSTM Throughput</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold font-mono text-white">{currentBatch.lstmThroughput}</span>
                    <span className="text-xs text-slate-400">samples/sec</span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-300 block mt-1">
                    Batch Latency: {currentBatch.lstmMsPerBatch} ms
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/40">
                  <span className="text-[10px] font-mono uppercase text-purple-400 block font-semibold">Transformer Throughput</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold font-mono text-white">{currentBatch.transformerThroughput}</span>
                    <span className="text-xs text-slate-400">samples/sec</span>
                  </div>
                  <span className="text-[11px] font-mono text-purple-300 block mt-1">
                    {(currentBatch.transformerThroughput / currentBatch.lstmThroughput).toFixed(1)}x Higher Throughput
                  </span>
                </div>
              </div>

              {/* Throughput Bar comparison */}
              <div className="space-y-4">
                {batchData.map((b, idx) => (
                  <button
                    key={b.batch}
                    onClick={() => setInteractiveBatchIndex(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer ${
                      interactiveBatchIndex === idx
                        ? 'bg-blue-950/40 border-blue-400/80'
                        : 'bg-slate-950/60 border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="w-28 shrink-0">
                      <span className="text-xs font-mono text-white font-bold block">
                        Batch {b.batch}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {(b.transformerThroughput / b.lstmThroughput).toFixed(1)}x speedup
                      </span>
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-[10px] font-mono text-cyan-400">LSTM</span>
                        <div className="flex-1 bg-slate-900 rounded-full h-3.5 overflow-hidden">
                          <div
                            className="bg-cyan-500 h-full rounded-full transition-all"
                            style={{ width: `${(b.lstmThroughput / 1200) * 100}%` }}
                          />
                        </div>
                        <span className="w-24 text-[11px] font-mono text-right text-slate-300">
                          {b.lstmThroughput} samp/s
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-12 text-[10px] font-mono text-purple-400">Transf</span>
                        <div className="flex-1 bg-slate-900 rounded-full h-3.5 overflow-hidden">
                          <div
                            className="bg-purple-500 h-full rounded-full transition-all"
                            style={{ width: `${(b.transformerThroughput / 1200) * 100}%` }}
                          />
                        </div>
                        <span className="w-24 text-[11px] font-mono text-right text-purple-300 font-bold">
                          {b.transformerThroughput} samp/s
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Memory Usage */}
          {activeChartTab === 'memory' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Memory Footprint & Resource Utilization Breakdown
                  </h3>
                  <p className="text-xs text-slate-400">
                    VRAM & RAM allocations across model components
                  </p>
                </div>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded border border-cyan-800/60 font-semibold">
                  LSTM Overall Winner for Constrained RAM
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LSTM Footprint Card */}
                <div className="p-6 rounded-2xl bg-slate-950/80 border border-cyan-500/30">
                  <div className="flex items-center gap-2.5 mb-4">
                    <RotateCcw className="h-5 w-5 text-cyan-400" />
                    <h4 className="font-display font-bold text-white text-base">LSTM Resource Allocation</h4>
                  </div>
                  
                  <div className="space-y-4 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1.5 font-mono">
                        <span>Weights & Embeddings (3.4M Params)</span>
                        <span className="text-white font-bold">~14 MB (FP32)</span>
                      </div>
                      <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full w-[15%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-1.5 font-mono">
                        <span>Recurrent Hidden State Activations (Linear O(N))</span>
                        <span className="text-white font-bold">~45 MB (Batch 32)</span>
                      </div>
                      <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 rounded-full w-[35%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-1.5 font-mono">
                        <span>Peak Training VRAM</span>
                        <span className="text-white font-bold">620 MB</span>
                      </div>
                      <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-600 rounded-full w-[45%]" />
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 pt-3.5 border-t border-white/5 text-[11px] text-slate-400 leading-relaxed">
                    Can run effortlessly on low-power microcontrollers, Raspberry Pi, Android/iOS CPU, and embedded devices without special quantization.
                  </p>
                </div>

                {/* Transformer Footprint Card */}
                <div className="p-6 rounded-2xl bg-slate-950/80 border border-purple-500/30">
                  <div className="flex items-center gap-2.5 mb-4">
                    <Zap className="h-5 w-5 text-purple-400" />
                    <h4 className="font-display font-bold text-white text-base">Transformer Resource Allocation</h4>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1.5 font-mono">
                        <span>Weights & Embeddings (66.4M Params)</span>
                        <span className="text-white font-bold">~265 MB (FP32)</span>
                      </div>
                      <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full w-[65%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-1.5 font-mono">
                        <span>Attention Matrices QKᵀ (Quadratic O(N²))</span>
                        <span className="text-white font-bold">~180 MB - 1,200 MB</span>
                      </div>
                      <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-400 rounded-full w-[85%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-1.5 font-mono">
                        <span>Peak Training VRAM</span>
                        <span className="text-white font-bold">890 MB - 3,450 MB</span>
                      </div>
                      <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full w-[90%]" />
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 pt-3.5 border-t border-white/5 text-[11px] text-slate-400 leading-relaxed">
                    Demands dedicated GPU VRAM (NVIDIA CUDA / Apple Metal). On sequence lengths &gt;1024, quadratic memory scaling can cause Out-Of-Memory (OOM) errors without gradient checkpointing or FlashAttention.
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
