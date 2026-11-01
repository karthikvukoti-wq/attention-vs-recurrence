import React from 'react';
import { Edit3, Cpu, CheckCircle2, BarChart2, Lightbulb } from 'lucide-react';

interface WorkflowNavProps {
  currentStage: '01' | '02' | '03' | '04' | '05';
  onSelectStage?: (stage: '01' | '02' | '03' | '04' | '05') => void;
}

const STEPS = [
  { id: '01', title: 'Input', subtitle: 'Enter Text', icon: Edit3, anchor: '#classify-step' },
  { id: '02', title: 'Process', subtitle: 'Dual Pipeline', icon: Cpu, anchor: '#classify-step' },
  { id: '03', title: 'Results', subtitle: 'Predictions', icon: CheckCircle2, anchor: '#classify-step' },
  { id: '04', title: 'Benchmark', subtitle: 'Performance', icon: BarChart2, anchor: '#benchmark-step' },
  { id: '05', title: 'Insights', subtitle: 'Trade-offs', icon: Lightbulb, anchor: '#insights-step' },
] as const;

export const WorkflowNav: React.FC<WorkflowNavProps> = ({ currentStage }) => {
  return (
    <div id="workflow" className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Horizontal Desktop Bar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          {STEPS.map((step, idx) => {
            const isActive = currentStage === step.id;
            const isPassed = parseInt(step.id) < parseInt(currentStage);

            return (
              <React.Fragment key={step.id}>
                <a
                  href={step.anchor}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : isPassed
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <span
                    className={`font-mono font-bold text-[11px] px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-blue-800 text-white'
                        : isPassed
                        ? 'bg-emerald-200 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {step.id}
                  </span>

                  <span className="font-semibold">{step.title}</span>

                  <span className={`hidden lg:inline text-[10px] font-normal ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                    • {step.subtitle}
                  </span>
                </a>

                {idx < STEPS.length - 1 && (
                  <span className="hidden sm:inline-block text-slate-400 text-xs shrink-0">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
