import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { WorkflowNav } from './components/WorkflowNav.tsx';
import { ClassifierLab } from './components/ClassifierLab.tsx';
import { PerformanceBenchmark } from './components/PerformanceBenchmark.tsx';
import { ModelInsights } from './components/ModelInsights.tsx';
import { FinalTakeaway } from './components/FinalTakeaway.tsx';
import { ArchitectureModal } from './components/ArchitectureModal.tsx';
import { ClassifyResponse, BenchmarkMetricsData } from './types.ts';
import { getBenchmarkMetrics, scoreText } from './utils/benchmark.ts';

const DEFAULT_PROMPT =
  'Although the initial setup was terrible and the battery died quickly, the customer service replaced it immediately and now I absolutely adore this gadget!';

export default function App() {
  const [selectedDataset, setSelectedDataset] = useState<string>('IMDB Sentiment');
  const [currentResult, setCurrentResult] = useState<ClassifyResponse | null>(null);
  const [metricsData, setMetricsData] = useState<BenchmarkMetricsData>(getBenchmarkMetrics('IMDB Sentiment'));
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [workflowStage, setWorkflowStage] = useState<'01' | '02' | '03' | '04' | '05'>('01');

  // Initial load
  useEffect(() => {
    // Seed default result immediately for zero-lag rendering
    const initialSeed = scoreText(DEFAULT_PROMPT, selectedDataset);
    setCurrentResult({
      ...initialSeed,
      timestamp: new Date().toISOString(),
    });

    const loadBackendData = async () => {
      try {
        const metricsRes = await fetch(`/api/metrics?dataset=${encodeURIComponent(selectedDataset)}`);
        if (metricsRes.ok) {
          const data = await metricsRes.json();
          if (data?.currentBenchmark) {
            setMetricsData(data.currentBenchmark);
          }
        }
      } catch (err) {
        console.warn('Backend API warming up, using local benchmark cache:', err);
      }
    };

    loadBackendData();
  }, []);

  // Handle classification request
  const handleClassify = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          dataset: selectedDataset,
        }),
      });

      if (res.ok) {
        const data: ClassifyResponse = await res.json();
        setCurrentResult(data);
        if (data.metrics) {
          setMetricsData(data.metrics);
        }
      } else {
        const fallback = scoreText(text, selectedDataset);
        setCurrentResult({
          ...fallback,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (e) {
      const fallback = scoreText(text, selectedDataset);
      setCurrentResult({
        ...fallback,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle dataset switch
  const handleSelectDataset = (dataset: string) => {
    setSelectedDataset(dataset);
    const newMetrics = getBenchmarkMetrics(dataset);
    setMetricsData(newMetrics);

    if (currentResult?.text) {
      const updated = scoreText(currentResult.text, dataset);
      setCurrentResult({
        ...updated,
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 bg-grid-pattern selection:bg-blue-100 selection:text-blue-900">
      {/* 1. HEADER (Overview, Classify, Compare, Insights, Models Ready) */}
      <Header
        onOpenArchitectureModal={() => setIsModalOpen(true)}
        selectedDataset={selectedDataset}
        onSelectDataset={handleSelectDataset}
        activeStep={workflowStage}
      />

      {/* 2. HERO / OVERVIEW (Visual Architecture: Input Text -> LSTM vs Transformer) */}
      <Hero />

      {/* 3. EXPERIMENT WORKFLOW STEPPER (01 Input -> 02 Process -> 03 Results -> 04 Benchmark -> 05 Insights) */}
      <WorkflowNav
        currentStage={workflowStage}
        onSelectStage={(s) => setWorkflowStage(s)}
      />

      <main className="space-y-4">
        {/* STEP 01 INPUT, STEP 02 PROCESS, STEP 03 RESULTS */}
        <ClassifierLab
          currentResult={currentResult}
          loading={loading}
          onClassify={handleClassify}
          selectedDataset={selectedDataset}
          onStageChange={(s) => setWorkflowStage(s)}
        />

        {/* STEP 04 — PERFORMANCE BENCHMARK (4 primary cards + simple bar charts + expandable metrics) */}
        <PerformanceBenchmark
          metricsData={metricsData}
          selectedDataset={selectedDataset}
          onSelectDataset={handleSelectDataset}
        />

        {/* STEP 05 — INSIGHTS & MODEL SELECTION ("What does the comparison tell us?" & "Which model should you choose?") */}
        <ModelInsights metricsData={metricsData} />

        {/* FINAL TAKEAWAY ("There is no universal winner.") */}
        <FinalTakeaway currentBenchmark={metricsData} />
      </main>

      {/* Spec & REST API Modal */}
      <ArchitectureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
