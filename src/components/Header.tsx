import React from 'react';
import { Zap, BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenArchitectureModal: () => void;
  selectedDataset: string;
  onSelectDataset: (dataset: string) => void;
  activeStep: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenArchitectureModal,
  selectedDataset,
  onSelectDataset,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <a href="#overview" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Zap className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="font-display font-bold text-base text-slate-900 tracking-tight block leading-tight">
                Attention <span className="text-blue-600 font-mono text-xs">vs</span> Recurrence
              </span>
              <span className="text-[11px] text-slate-500 font-mono hidden sm:block">
                Guided ML Comparative Lab
              </span>
            </div>
          </a>
        </div>

        {/* Minimal Navigation: Overview, Classify, Compare, Insights */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-600 font-medium">
          <a
            href="#overview"
            className="hover:text-slate-900 transition-colors"
          >
            Overview
          </a>
          <a
            href="#classify-step"
            className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Classify
          </a>
          <a
            href="#benchmark-step"
            className="hover:text-purple-600 transition-colors flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
            Compare
          </a>
          <a
            href="#insights-step"
            className="hover:text-emerald-600 transition-colors flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Insights
          </a>
        </nav>

        {/* Right side: Models Ready Status & Dataset Selector */}
        <div className="flex items-center gap-3">
          {/* Models Ready Indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Models Ready</span>
          </div>

          {/* Quick Dataset Switcher */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700">
            <span className="text-slate-500 font-mono text-[11px]">Dataset:</span>
            <select
              value={selectedDataset}
              onChange={(e) => onSelectDataset(e.target.value)}
              aria-label="Benchmark Dataset Selection"
              className="bg-transparent text-slate-800 focus:outline-none cursor-pointer font-medium"
            >
              <option value="IMDB Sentiment" className="bg-white text-slate-900">IMDB (50k)</option>
              <option value="SST-2 (Short Sentences)" className="bg-white text-slate-900">SST-2</option>
              <option value="AG News (Topic Classification)" className="bg-white text-slate-900">AG News</option>
              <option value="Long-Doc Context Stress Test" className="bg-white text-slate-900">Long-Doc (800+)</option>
            </select>
          </div>

          {/* API / Spec trigger */}
          <button
            onClick={onOpenArchitectureModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer hover:border-blue-300"
            title="Inspect project architecture and API spec"
          >
            <BookOpen className="h-3.5 w-3.5 text-blue-600" />
            <span className="hidden sm:inline font-mono">Spec & API</span>
          </button>
        </div>
      </div>
    </header>
  );
};
