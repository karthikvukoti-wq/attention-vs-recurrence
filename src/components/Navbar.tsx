import React, { useState } from 'react';
import { Cpu, Zap, Activity, Info, Sparkles, BookOpen } from 'lucide-react';

interface NavbarProps {
  onOpenArchitectureModal: () => void;
  selectedDataset: string;
  onSelectDataset: (dataset: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenArchitectureModal,
  selectedDataset,
  onSelectDataset,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#07090e]/85 border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-white tracking-tight">
                Attention <span className="text-blue-400 font-mono text-sm">vs</span> Recurrence
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Demo Benchmark
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              LSTM vs Transformer for Text Classification
            </p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300 font-medium">
          <a
            href="#live-lab"
            className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
          >
            <Activity className="h-4 w-4 text-blue-400" />
            Live Lab
          </a>
          <a
            href="#dashboard"
            className="hover:text-blue-400 transition-colors"
          >
            Metrics
          </a>
          <a
            href="#charts"
            className="hover:text-blue-400 transition-colors"
          >
            Scaling Charts
          </a>
          <a
            href="#insights"
            className="hover:text-blue-400 transition-colors"
          >
            Insights
          </a>
          <a
            href="#recommender"
            className="hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            Decision Guide
          </a>
          <a
            href="#conclusion"
            className="hover:text-blue-400 transition-colors"
          >
            Conclusion
          </a>
        </nav>

        {/* Right Action: Dataset Selector & Integration Guide */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 bg-slate-900/80 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-300">
            <span className="text-slate-500 font-mono">Dataset:</span>
            <select
              value={selectedDataset}
              onChange={(e) => onSelectDataset(e.target.value)}
              aria-label="Benchmark Dataset Selection"
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-medium"
            >
              <option value="IMDB Sentiment" className="bg-slate-900 text-white">IMDB Sentiment (50k)</option>
              <option value="SST-2 (Short Sentences)" className="bg-slate-900 text-white">SST-2 Short Sentences</option>
              <option value="AG News (Topic Classification)" className="bg-slate-900 text-white">AG News Topic (120k)</option>
              <option value="Long-Doc Context Stress Test" className="bg-slate-900 text-white">Long-Doc Context (800+ tokens)</option>
            </select>
          </div>

          <button
            onClick={onOpenArchitectureModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 transition-all hover:border-blue-400/40"
            title="Inspect project architecture and model connection"
          >
            <BookOpen className="h-3.5 w-3.5 text-blue-400" />
            <span className="hidden sm:inline">ML Spec & API</span>
          </button>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            <Cpu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#07090e]/95 px-4 py-3 space-y-2">
          <div className="pb-2 mb-2 border-b border-white/10">
            <label className="block text-xs font-mono text-slate-400 mb-1">Select Dataset</label>
            <select
              value={selectedDataset}
              onChange={(e) => {
                onSelectDataset(e.target.value);
                setMobileMenuOpen(false);
              }}
              className="w-full bg-slate-800 text-white text-xs rounded p-2 border border-white/10"
            >
              <option value="IMDB Sentiment">IMDB Sentiment (50k)</option>
              <option value="SST-2 (Short Sentences)">SST-2 Short Sentences</option>
              <option value="AG News (Topic Classification)">AG News Topic (120k)</option>
              <option value="Long-Doc Context Stress Test">Long-Doc Context (800+ tokens)</option>
            </select>
          </div>
          <a
            href="#live-lab"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm text-slate-300 hover:text-blue-400"
          >
            Live Classification Lab
          </a>
          <a
            href="#dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm text-slate-300 hover:text-blue-400"
          >
            Performance Metrics
          </a>
          <a
            href="#charts"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm text-slate-300 hover:text-blue-400"
          >
            Visual Comparison Charts
          </a>
          <a
            href="#insights"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm text-slate-300 hover:text-blue-400"
          >
            Architecture Insights
          </a>
          <a
            href="#recommender"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm text-slate-300 hover:text-purple-400"
          >
            Which Model Should I Choose?
          </a>
          <a
            href="#conclusion"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm text-slate-300 hover:text-blue-400"
          >
            Conclusion & Final Report
          </a>
        </div>
      )}
    </header>
  );
};
