export type ClassificationLabel = 'Positive' | 'Negative' | 'Neutral';

export interface ModelPrediction {
  label: ClassificationLabel;
  confidence: number;
  inferenceMs: number;
  probabilities: {
    positive: number;
    negative: number;
    neutral: number;
  };
  features: {
    name: string;
    value: string | number;
  }[];
}

export interface TokenAnalysis {
  token: string;
  attentionWeight: number; // 0 to 1 for Transformer
  lstmForgetGate: number;  // 0 to 1 for LSTM
  lstmHiddenNorm: number;  // sequential magnitude
  sentimentPolarity: number; // -1 to 1
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  trainingTimeSec: number;
  inferenceTimeMs: number;
  memoryUsageMb: number;
  parametersMillion: number;
}

export interface BenchmarkMetricsData {
  datasetName: string;
  sampleCount: number;
  sequenceAvgLength: number;
  lstm: ModelMetrics;
  transformer: ModelMetrics;
  winner: Record<keyof ModelMetrics, 'LSTM' | 'Transformer' | 'Tie'>;
}

export interface ClassifyResponse {
  text: string;
  dataset: string;
  lstm: ModelPrediction;
  transformer: ModelPrediction;
  tokens: TokenAnalysis[];
  metrics: BenchmarkMetricsData;
  isDemoBenchmark: boolean;
  timestamp: string;
}

export interface RecommenderInput {
  datasetSize: 'tiny' | 'small' | 'medium' | 'large';
  sequenceLength: 'short' | 'medium' | 'long';
  latencyBudget: 'ultra-low' | 'balanced' | 'relaxed';
  hardware: 'cpu-edge' | 'single-gpu' | 'cluster';
  accuracyPriority: 'moderate' | 'high' | 'maximum';
}

export interface RecommendationResult {
  winner: 'LSTM' | 'Transformer' | 'Hybrid';
  confidenceScore: number;
  headline: string;
  summary: string;
  keyReasons: string[];
  caveats: string[];
  lstmScore: number;
  transformerScore: number;
}
