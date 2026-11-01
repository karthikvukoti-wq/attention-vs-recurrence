import React, { useState } from 'react';
import {
  Zap,
  RotateCcw,
  ArrowRight,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { ClassifyResponse } from '../types.ts';

interface ClassifierLabProps {
  currentResult: ClassifyResponse | null;
  loading: boolean;
  onClassify: (text: string) => Promise<void>;
  selectedDataset: string;
  onStageChange?: (stage: '01' | '02' | '03' | '04' | '05') => void;
}

const PRESET_PROMPTS = [
  {
    name: 'Long-Range Contrast & Negation',
    category: 'Stress Test',
    text: 'Although the initial setup was terrible and the battery died quickly, the customer service replaced it immediately and now I absolutely adore this gadget!',
  },
  {
    name: 'Positive Film Critique',
    category: 'Sentiment',
    text: 'The movie was breathtaking, deeply emotional, with brilliant cinematography and an unforgettable musical score that stays with you forever.',
  },
  {
    name: 'Harsh Software Review',
    category: 'Negative',
    text: 'An absolute disaster of product design: clunky interface, painful bugs, sluggish load times, and completely useless error messages.',
  },
  {
    name: 'Sarcasm / Suffix Negation Trap',
    category: 'Subtle Context',
    text: 'The food was bad, really bad, extremely bad... is what I would say if I were lying, because it was sensational and delightful!',
  },
];

export const ClassifierLab: React.FC<ClassifierLabProps> = ({
  currentResult,
  loading: parentLoading,
  onClassify,
  onStageChange,
}) => {
  const [inputText, setInputText] = useState(
    currentResult?.text ||
      'Although the initial setup was terrible and the battery died quickly, the customer service replaced it immediately and now I absolutely adore this gadget!'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<number>(0);
  const [inspectorTab, setInspectorTab] = useState<'transformer-attention' | 'lstm-gates'>('transformer-attention');
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number | null>(null);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  const lstm = currentResult?.lstm;
  const transformer = currentResult?.transformer;
  const tokens = currentResult?.tokens || [];

  // Determine inference comparison winner
  let comparisonWinner: 'Transformer' | 'LSTM' | 'Tie' = 'Transformer';
  let comparisonReason = 'Higher contextual confidence via self-attention routing.';
  if (lstm && transformer) {
    if (transformer.confidence > lstm.confidence + 0.02) {
      comparisonWinner = 'Transformer';
      comparisonReason = `Transformer achieved ${(transformer.confidence * 100).toFixed(1)}% confidence (+${((transformer.confidence - lstm.confidence) * 100).toFixed(1)}% over LSTM) with unbroken contextual attention.`;
    } else if (lstm.confidence > transformer.confidence) {
      comparisonWinner = 'LSTM';
      comparisonReason = `LSTM reached stronger conviction with lower parameter footprint for this specific sentence.`;
    } else {
      comparisonWinner = 'Tie';
      comparisonReason = 'Both models agreed on the classification with identical conviction.';
    }
  }

  // Handle Run Comparison
  const handleRunComparison = async (textToRun: string) => {
    if (!textToRun.trim() || isProcessing) return;

    setIsProcessing(true);
    onStageChange?.('02');

    // Step 2 parallel animated flow
    setProcessingStage(1);
    await new Promise((r) => setTimeout(r, 200));
    setProcessingStage(2);
    await new Promise((r) => setTimeout(r, 240));
    setProcessingStage(3);
    await new Promise((r) => setTimeout(r, 340));
    setProcessingStage(4);

    // Call API
    await onClassify(textToRun);

    await new Promise((r) => setTimeout(r, 180));
    setIsProcessing(false);
    onStageChange?.('03');
  };

  const handleSelectPreset = (text: string) => {
    setInputText(text);
    handleRunComparison(text);
  };

  return (
    <div id="classify-step" className="space-y-12">
      {/* =========================================================================
          STEP 01 — TEXT INPUT (Light Theme)
         ========================================================================= */}
      <section className="pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step Badge & Header */}
          <div className="mb-4">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 border border-blue-200">
              STEP 01
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-2">
              Enter Text
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Both models will classify the exact same input.
            </p>
          </div>

          {/* Clean Experiment Card */}
          <div className="glass-panel p-6 sm:p-7 border border-slate-200 bg-white rounded-2xl shadow-sm relative">
            {/* Top Toolbar: Presets & Word Count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 text-xs text-slate-500 font-mono">
              <span className="text-slate-700 font-semibold">Test Input Sequence</span>
              <div className="flex items-center gap-4">
                <span>{wordCount} words</span>
                <span>{charCount} characters</span>
                <button
                  onClick={() => setInputText('')}
                  className="text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Clear textarea"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear
                </button>
              </div>
            </div>

            {/* Large Textarea */}
            <textarea
              id="classification-input"
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste any sentence for classification (e.g. a product review, opinion, or sentiment phrase)..."
              className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl p-4 text-slate-900 text-base leading-relaxed placeholder:text-slate-400 focus:outline-none transition-all resize-y font-sans shadow-2xs"
            />

            {/* Presets Row */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono text-slate-500">Examples:</span>
                {PRESET_PROMPTS.map((preset, idx) => {
                  const isActive = inputText.trim() === preset.text.trim();
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectPreset(preset.text)}
                      disabled={isProcessing}
                      className={`text-[11px] px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      {preset.name}
                    </button>
                  );
                })}
              </div>

              {/* Primary Run Button (Main CTA) */}
              <button
                onClick={() => handleRunComparison(inputText)}
                disabled={isProcessing || !inputText.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Pipelines...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Run Comparison</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          STEP 02 — MODEL PROCESSING (Parallel Animated Flow in Light Theme)
         ========================================================================= */}
      <section className="py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-purple-100 text-purple-700 border border-purple-200">
              STEP 02
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-2">
              Model Processing
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Visualizing sequential recurrence vs parallel self-attention computation.
            </p>
          </div>

          <div className="glass-panel p-6 border border-slate-200 bg-white rounded-2xl shadow-sm space-y-6">
            {/* Visual contrast statement */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 pb-3 border-b border-slate-100 font-mono gap-2">
              <span>
                <strong className="text-blue-600">LSTM processes sequentially</strong> one token at a time.
              </span>
              <span>
                <strong className="text-purple-600">Transformer uses attention</strong> across all tokens in parallel.
              </span>
            </div>

            {/* Pipeline A: LSTM Sequential */}
            <div className={`p-4 rounded-xl border transition-all ${
              isProcessing && processingStage >= 2
                ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-100'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                    <RotateCcw className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
                  </div>
                  <span className="text-xs font-bold text-slate-900 font-display">LSTM Pipeline</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 font-semibold">
                    Sequential Unroll
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">O(N) Steps</span>
              </div>

              {/* Step Flow Nodes */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono mt-3">
                <div className={`p-2.5 rounded-lg border transition-all ${
                  isProcessing && processingStage >= 1 ? 'bg-blue-100 border-blue-400 text-blue-900 font-bold' : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  1. Text
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${
                  isProcessing && processingStage >= 2 ? 'bg-blue-100 border-blue-400 text-blue-900 font-bold' : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  2. Tokens
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${
                  isProcessing && processingStage >= 3 ? 'bg-blue-600 text-white font-bold shadow-xs' : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  3. Sequential (h_t)
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${
                  isProcessing && processingStage >= 4 ? 'bg-emerald-100 border-emerald-400 text-emerald-800 font-bold' : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  4. Classification
                </div>
              </div>
            </div>

            {/* Pipeline B: Transformer Self-Attention */}
            <div className={`p-4 rounded-xl border transition-all ${
              isProcessing && processingStage >= 2
                ? 'bg-purple-50/70 border-purple-400 ring-2 ring-purple-100'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                    <Zap className={`h-4 w-4 ${isProcessing ? 'animate-pulse text-purple-600' : ''}`} />
                  </div>
                  <span className="text-xs font-bold text-slate-900 font-display">Transformer Pipeline</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 font-semibold">
                    Self-Attention
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">O(1) Direct Path</span>
              </div>

              {/* Step Flow Nodes */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono mt-3">
                <div className={`p-2.5 rounded-lg border transition-all ${
                  isProcessing && processingStage >= 1 ? 'bg-purple-100 border-purple-400 text-purple-900 font-bold' : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  1. Text
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${
                  isProcessing && processingStage >= 2 ? 'bg-purple-100 border-purple-400 text-purple-900 font-bold' : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  2. Tokens
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${
                  isProcessing && processingStage >= 3 ? 'bg-purple-600 text-white font-bold shadow-xs' : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  3. Self-Attention (QKᵀ)
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${
                  isProcessing && processingStage >= 4 ? 'bg-emerald-100 border-emerald-400 text-emerald-800 font-bold' : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  4. Classification
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          STEP 03 — CLASSIFICATION RESULTS (Light Theme)
         ========================================================================= */}
      {currentResult && lstm && transformer && (
        <section className="py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
              <div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                  STEP 03
                </span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-2">
                  Classification Results
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Side-by-side inference prediction and confidence comparison for this exact input.
                </p>
              </div>

              {/* Small summary badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono shadow-xs">
                <span className="text-slate-500">Confidence Lead:</span>
                <strong className="text-emerald-700 font-semibold">
                  {comparisonWinner === 'Transformer'
                    ? `Transformer (+${((transformer.confidence - lstm.confidence) * 100).toFixed(1)}%)`
                    : comparisonWinner === 'LSTM'
                    ? `LSTM (+${((lstm.confidence - transformer.confidence) * 100).toFixed(1)}%)`
                    : 'Equal'}
                </strong>
              </div>
            </div>

            {/* Two Large Side-by-Side Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LSTM CARD (Blue) */}
              <div className={`glass-panel p-6 sm:p-7 rounded-2xl border-l-4 border-l-blue-600 border-slate-200 bg-blue-50/30 relative transition-all shadow-xs ${
                comparisonWinner === 'LSTM' ? 'ring-2 ring-emerald-500/40 shadow-md' : ''
              }`}>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 border border-blue-200">
                      <RotateCcw className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-slate-900">LSTM</h3>
                      <span className="text-xs font-mono text-blue-600 font-semibold">Sequential Recurrence</span>
                    </div>
                  </div>

                  {comparisonWinner === 'LSTM' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-mono font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Higher Confidence
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-slate-500 bg-white px-2.5 py-1 rounded border border-slate-200">
                      Baseline
                    </span>
                  )}
                </div>

                {/* Main Prediction & Confidence */}
                <div className="mt-5 grid grid-cols-2 gap-4 items-baseline">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-slate-500 block font-semibold">
                      Prediction
                    </span>
                    <span className={`text-3xl font-display font-extrabold tracking-tight ${
                      lstm.label === 'Positive' ? 'text-emerald-700' : lstm.label === 'Negative' ? 'text-rose-600' : 'text-slate-700'
                    }`}>
                      {lstm.label}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-mono uppercase text-slate-500 block font-semibold">
                      Confidence
                    </span>
                    <span className="text-3xl font-display font-extrabold text-blue-600 font-mono">
                      {(lstm.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Confidence Progress Bar */}
                <div className="mt-4">
                  <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, Math.max(5, lstm.confidence * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Inference time & Meta */}
                <div className="mt-5 pt-4 border-t border-blue-100 flex items-center justify-between text-xs font-mono text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-blue-600" />
                    <span>Inference Time: <strong>{lstm.inferenceMs} ms</strong></span>
                  </div>
                  <span className="text-slate-500">Tokens unrolled: <strong>{tokens.length}</strong></span>
                </div>
              </div>

              {/* TRANSFORMER CARD (Purple) */}
              <div className={`glass-panel p-6 sm:p-7 rounded-2xl border-l-4 border-l-purple-600 border-slate-200 bg-purple-50/30 relative transition-all shadow-xs ${
                comparisonWinner === 'Transformer' ? 'ring-2 ring-emerald-500/40 shadow-md' : ''
              }`}>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700 border border-purple-200">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-slate-900">Transformer</h3>
                      <span className="text-xs font-mono text-purple-600 font-semibold">Self-Attention</span>
                    </div>
                  </div>

                  {comparisonWinner === 'Transformer' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-mono font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Higher Confidence
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-slate-500 bg-white px-2.5 py-1 rounded border border-slate-200">
                      Baseline
                    </span>
                  )}
                </div>

                {/* Main Prediction & Confidence */}
                <div className="mt-5 grid grid-cols-2 gap-4 items-baseline">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-slate-500 block font-semibold">
                      Prediction
                    </span>
                    <span className={`text-3xl font-display font-extrabold tracking-tight ${
                      transformer.label === 'Positive' ? 'text-emerald-700' : transformer.label === 'Negative' ? 'text-rose-600' : 'text-slate-700'
                    }`}>
                      {transformer.label}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-mono uppercase text-slate-500 block font-semibold">
                      Confidence
                    </span>
                    <span className="text-3xl font-display font-extrabold text-purple-600 font-mono">
                      {(transformer.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Confidence Progress Bar */}
                <div className="mt-4">
                  <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, Math.max(5, transformer.confidence * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Inference time & Meta */}
                <div className="mt-5 pt-4 border-t border-purple-100 flex items-center justify-between text-xs font-mono text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-purple-600" />
                    <span>Inference Time: <strong>{transformer.inferenceMs} ms</strong></span>
                  </div>
                  <span className="text-slate-500">Attention Heads: <strong>12 Heads</strong></span>
                </div>
              </div>
            </div>

            {/* Interactive Token Inspection View */}
            <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white mt-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-bold text-slate-900 font-display">
                    Interactive Activation Inspector
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                  <button
                    onClick={() => setInspectorTab('transformer-attention')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      inspectorTab === 'transformer-attention'
                        ? 'bg-purple-600 text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Self-Attention Heatmap
                  </button>
                  <button
                    onClick={() => setInspectorTab('lstm-gates')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      inspectorTab === 'lstm-gates'
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    LSTM Forget Gates & Memory
                  </button>
                </div>
              </div>

              {inspectorTab === 'transformer-attention' ? (
                <div>
                  <p className="text-xs text-slate-600 mb-2">
                    Normalized Self-Attention weights A(i, j). Click any token to inspect its query-key attention attribution:
                  </p>
                  <div className="flex flex-wrap gap-2 py-1">
                    {tokens.map((t, idx) => {
                      const intensity = Math.min(1, t.attentionWeight * 4.5);
                      const isSelected = selectedTokenIndex === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedTokenIndex(isSelected ? null : idx)}
                          className={`flex flex-col items-center p-2 rounded-xl border transition-all text-left cursor-pointer ${
                            isSelected ? 'ring-2 ring-purple-600 scale-105 z-10' : ''
                          }`}
                          style={{
                            backgroundColor: `rgba(124, 58, 237, ${0.08 + intensity * 0.35})`,
                            borderColor: isSelected ? '#7c3aed' : `rgba(124, 58, 237, ${0.2 + intensity * 0.4})`,
                          }}
                        >
                          <span className="text-xs font-semibold text-slate-900">{t.token}</span>
                          <span className="text-[10px] font-mono text-purple-700 mt-0.5 font-bold">
                            {(t.attentionWeight * 100).toFixed(1)}%
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-slate-600 mb-2">
                    LSTM Forget Gate f_t ∈ [0, 1] and Hidden State Norm ||h_t|| unrolled sequentially from left to right:
                  </p>
                  <div className="flex flex-wrap gap-2 py-1">
                    {tokens.map((t, idx) => {
                      const isSelected = selectedTokenIndex === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedTokenIndex(isSelected ? null : idx)}
                          className={`flex flex-col items-center p-2 rounded-xl bg-slate-50 border transition-all cursor-pointer ${
                            isSelected ? 'border-blue-600 ring-2 ring-blue-300 scale-105' : 'border-blue-200'
                          }`}
                        >
                          <span className="text-xs font-medium text-slate-900">{t.token}</span>
                          <div className="flex items-center gap-2 mt-1 text-[10px] font-mono">
                            <span className="text-blue-700 font-semibold" title="Forget Gate retention rate">
                              f:{t.lstmForgetGate}
                            </span>
                            <span className="text-slate-500" title="Hidden State norm">
                              |h|:{t.lstmHiddenNorm}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
