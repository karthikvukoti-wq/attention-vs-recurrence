import {
  BenchmarkMetricsData,
  ClassificationLabel,
  ClassifyResponse,
  ModelMetrics,
  RecommenderInput,
  RecommendationResult,
  TokenAnalysis,
} from '../types.js';

// Sentiment Lexicon
const POSITIVE_WORDS = new Set([
  'good', 'great', 'amazing', 'excellent', 'love', 'loved', 'wonderful', 'best',
  'happy', 'fantastic', 'useful', 'success', 'brilliant', 'delightful', 'outstanding',
  'superb', 'enjoyed', 'impressive', 'stellar', 'positive', 'sensational', 'adore',
  'flawless', 'masterpiece', 'fast', 'smooth', 'effective', 'flawlessly', 'exceptional'
]);

const NEGATIVE_WORDS = new Set([
  'bad', 'terrible', 'awful', 'hate', 'hated', 'worst', 'poor', 'sad',
  'horrible', 'fail', 'failure', 'boring', 'disaster', 'dreadful', 'slow',
  'broken', 'useless', 'flawed', 'defect', 'garbage', 'disappointing', 'ugly',
  'buggy', 'crash', 'annoying', 'waste', 'clunky', 'drained', 'painful', 'suck'
]);

const NEGATION_WORDS = new Set([
  'not', 'no', 'never', 'neither', 'barely', 'hardly', 'scarcely', 'without', 'cannot', "didn't", "won't", "isn't", "wasn't"
]);

const CONTRAST_WORDS = new Set([
  'but', 'however', 'although', 'though', 'yet', 'nevertheless', 'despite', 'whereas', 'still'
]);

/**
 * Tokenize text into words with punctuation stripped
 */
export function tokenize(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .map(w => w.replace(/[^\w'-]/g, ''))
    .filter(Boolean);
}

/**
 * Score text with simulated LSTM vs Transformer dynamics
 */
export function scoreText(text: string, dataset = 'IMDB Sentiment'): Omit<ClassifyResponse, 'timestamp'> {
  const cleanTokens = tokenize(text);
  const rawWords = text.trim().split(/\s+/).filter(Boolean);

  if (cleanTokens.length === 0) {
    return {
      text,
      dataset,
      isDemoBenchmark: true,
      tokens: [],
      lstm: {
        label: 'Neutral',
        confidence: 0.5,
        inferenceMs: 8,
        probabilities: { positive: 0.33, negative: 0.33, neutral: 0.34 },
        features: [{ name: 'Input', value: 'Empty input provided' }],
      },
      transformer: {
        label: 'Neutral',
        confidence: 0.5,
        inferenceMs: 12,
        probabilities: { positive: 0.33, negative: 0.33, neutral: 0.34 },
        features: [{ name: 'Input', value: 'Empty input provided' }],
      },
      metrics: getBenchmarkMetrics(dataset),
    };
  }

  // Sentiment scoring with contextual negation and contrast weight
  let negationActive = false;
  let inConcessiveClause = false;
  let postContrastMainClause = false;

  const tokenAnalyses: TokenAnalysis[] = [];
  const tokenPolarities: number[] = [];

  const lowerWords = cleanTokens.map(w => w.toLowerCase());
  const hasAlthough = lowerWords.some(w => w === 'although' || w === 'though' || w === 'despite');
  if (hasAlthough) {
    inConcessiveClause = true;
  }

  for (let i = 0; i < cleanTokens.length; i++) {
    const word = lowerWords[i];
    let tokenPolarity = 0;

    // Concessive clause exit (e.g. after comma or conjunction "and now")
    if (inConcessiveClause && (word === 'now' || word === 'replaced' || word === 'immediately' || word === 'however' || word === 'but')) {
      inConcessiveClause = false;
      postContrastMainClause = true;
    } else if (CONTRAST_WORDS.has(word)) {
      postContrastMainClause = true;
      inConcessiveClause = false;
      negationActive = false;
    } else if (NEGATION_WORDS.has(word)) {
      negationActive = true;
    } else {
      const isPos = POSITIVE_WORDS.has(word);
      const isNeg = NEGATIVE_WORDS.has(word);

      if (isPos) {
        tokenPolarity = negationActive ? -1.0 : 1.2;
        negationActive = false;
      } else if (isNeg) {
        tokenPolarity = negationActive ? 0.9 : -1.2;
        negationActive = false;
      }
    }

    // Weighting: if in concessive clause ("although..."), its rhetorical weight is reduced
    // if in post-contrast main clause ("...and now I adore it"), its weight is amplified
    if (inConcessiveClause) {
      tokenPolarity *= 0.45;
    } else if (postContrastMainClause) {
      tokenPolarity *= 1.85;
    }

    tokenPolarities.push(tokenPolarity);
  }

  // Attention weight simulation for Transformer (Multi-head self-attention)
  // Attends strongly to emotional words, contrast markers, and sentence culmination
  const attentionRaw: number[] = cleanTokens.map((w, idx) => {
    const lower = w.toLowerCase();
    const polarityMag = Math.abs(tokenPolarities[idx]);
    let salience = 0.2;

    if (polarityMag > 0) salience += 2.0 * polarityMag;
    if (CONTRAST_WORDS.has(lower)) salience += 1.4;
    if (NEGATION_WORDS.has(lower)) salience += 1.1;
    if (lower === 'adore' || lower === 'amazing' || lower === 'breathtaking' || lower === 'disaster') salience += 1.8;
    // recency anchor
    if (idx >= cleanTokens.length - 3) salience += 0.5;

    return Math.max(0.1, salience);
  });

  // Softmax normalization of attention weights
  const expAttention = attentionRaw.map(v => Math.exp(v));
  const sumExp = expAttention.reduce((a, b) => a + b, 0) || 1;
  const normalizedAttention = expAttention.map(v => Number((v / sumExp).toFixed(4)));

  // LSTM sequential recurrence simulation
  // Cell state C_t and hidden state h_t with forget gate f_t
  let lstmHidden = 0;
  let lstmCell = 0;
  const lstmDecayFactor = 0.86;

  for (let i = 0; i < cleanTokens.length; i++) {
    const polarity = tokenPolarities[i];
    const isContrast = CONTRAST_WORDS.has(cleanTokens[i].toLowerCase());

    // Forget gate: if a contrast word occurs, forget gate drops to flush old state
    const forgetGate = isContrast ? 0.35 : lstmDecayFactor;
    lstmCell = lstmCell * forgetGate + polarity * 1.3;
    lstmHidden = Math.tanh(lstmCell);

    tokenAnalyses.push({
      token: rawWords[i] || cleanTokens[i],
      attentionWeight: normalizedAttention[i],
      lstmForgetGate: Number(forgetGate.toFixed(2)),
      lstmHiddenNorm: Number(Math.abs(lstmHidden).toFixed(2)),
      sentimentPolarity: Number(polarity.toFixed(2)),
    });
  }

  // Transformer prediction computation: weighted sum over all token representations
  let transformerScore = 0;
  for (let i = 0; i < cleanTokens.length; i++) {
    transformerScore += tokenPolarities[i] * (normalizedAttention[i] * 4.0);
  }

  // LSTM prediction computation: final hidden state representation
  const lstmScore = lstmHidden * 1.9;

  // Derive classification probabilities & labels
  const transformerResult = computeModelOutput(transformerScore, cleanTokens.length, 'transformer');
  const lstmResult = computeModelOutput(lstmScore, cleanTokens.length, 'lstm');

  return {
    text,
    dataset,
    isDemoBenchmark: true,
    tokens: tokenAnalyses,
    lstm: lstmResult,
    transformer: transformerResult,
    metrics: getBenchmarkMetrics(dataset),
  };
}

function computeModelOutput(
  score: number,
  tokenCount: number,
  modelType: 'lstm' | 'transformer'
) {
  // Sigmoid / Softmax calibration
  // Transformer gets higher confidence on nuanced text due to direct attention routing
  const multiplier = modelType === 'transformer' ? 1.4 : 1.15;
  const calibrated = score * multiplier;
  const probPositive = 1 / (1 + Math.exp(-calibrated));
  const probNegative = 1 - probPositive;

  let label: ClassificationLabel = 'Neutral';
  let confidence = 0.5;

  if (Math.abs(score) < 0.25) {
    label = 'Neutral';
    confidence = Number((0.52 + Math.random() * 0.08).toFixed(3));
  } else if (score > 0) {
    label = 'Positive';
    confidence = Number(Math.min(0.99, Math.max(0.62, probPositive)).toFixed(3));
  } else {
    label = 'Negative';
    confidence = Number(Math.min(0.99, Math.max(0.62, probNegative)).toFixed(3));
  }

  // Inference latency simulation based on sequence length & model characteristics
  // LSTM has $O(N)$ sequential Python/C++ loop overhead; Transformer parallelizes matrix ops
  let inferenceMs = 0;
  if (modelType === 'lstm') {
    inferenceMs = Math.round(18 + tokenCount * 1.8 + Math.random() * 4);
  } else {
    // Transformer baseline overhead is slightly higher for tiny inputs, but scales well until huge context
    inferenceMs = Math.round(14 + Math.pow(tokenCount / 20, 1.3) + Math.random() * 3);
  }

  // Probabilities breakdown
  const posProb = label === 'Positive' ? confidence : Number(((1 - confidence) * 0.75).toFixed(3));
  const negProb = label === 'Negative' ? confidence : Number(((1 - confidence) * 0.75).toFixed(3));
  const neutralProb = Number(Math.max(0.01, 1 - (posProb + negProb)).toFixed(3));

  const features = [
    {
      name: 'Architecture Core',
      value: modelType === 'transformer' ? 'Multi-Head Self-Attention' : 'Bidirectional LSTM Cells',
    },
    {
      name: 'Receptive Field',
      value: modelType === 'transformer' ? 'Full All-to-All Pairwise (O(1) path)' : 'Sequential Recurrence (O(N) path)',
    },
    {
      name: 'Attention Entropy',
      value: modelType === 'transformer' ? 'Focused Context Heads' : 'Hidden-State Bottleneck',
    },
  ];

  return {
    label,
    confidence,
    inferenceMs,
    probabilities: {
      positive: Number(posProb.toFixed(3)),
      negative: Number(negProb.toFixed(3)),
      neutral: neutralProb,
    },
    features,
  };
}

/**
 * Pre-computed benchmark metrics on standard datasets (IMDB, SST-2, AG News, LongDoc)
 */
export function getBenchmarkMetrics(datasetKey = 'IMDB Sentiment'): BenchmarkMetricsData {
  const datasets: Record<string, BenchmarkMetricsData> = {
    'IMDB Sentiment': {
      datasetName: 'IMDB Movie Reviews (50k balanced)',
      sampleCount: 50000,
      sequenceAvgLength: 234,
      lstm: {
        accuracy: 89.4,
        precision: 88.7,
        recall: 87.9,
        f1: 88.3,
        trainingTimeSec: 142,
        inferenceTimeMs: 44,
        memoryUsageMb: 620,
        parametersMillion: 3.4,
      },
      transformer: {
        accuracy: 94.8,
        precision: 94.2,
        recall: 94.0,
        f1: 94.1,
        trainingTimeSec: 88,
        inferenceTimeMs: 26,
        memoryUsageMb: 890,
        parametersMillion: 66.4,
      },
      winner: {
        accuracy: 'Transformer',
        precision: 'Transformer',
        recall: 'Transformer',
        f1: 'Transformer',
        trainingTimeSec: 'Transformer', // faster parallel training on GPU
        inferenceTimeMs: 'Transformer',
        memoryUsageMb: 'LSTM', // LSTM wins on memory footprint
        parametersMillion: 'LSTM', // LSTM wins on parameter compactness
      },
    },
    'SST-2 (Short Sentences)': {
      datasetName: 'Stanford Sentiment Treebank (SST-2)',
      sampleCount: 67349,
      sequenceAvgLength: 21,
      lstm: {
        accuracy: 87.8,
        precision: 87.1,
        recall: 86.9,
        f1: 87.0,
        trainingTimeSec: 64,
        inferenceTimeMs: 14,
        memoryUsageMb: 310,
        parametersMillion: 2.1,
      },
      transformer: {
        accuracy: 92.6,
        precision: 92.1,
        recall: 91.8,
        f1: 91.9,
        trainingTimeSec: 52,
        inferenceTimeMs: 16,
        memoryUsageMb: 740,
        parametersMillion: 66.4,
      },
      winner: {
        accuracy: 'Transformer',
        precision: 'Transformer',
        recall: 'Transformer',
        f1: 'Transformer',
        trainingTimeSec: 'Transformer',
        inferenceTimeMs: 'LSTM', // for very short sequences, LSTM latency is slightly lower
        memoryUsageMb: 'LSTM',
        parametersMillion: 'LSTM',
      },
    },
    'AG News (Topic Classification)': {
      datasetName: 'AG News (4 Classes Topic Corpus)',
      sampleCount: 120000,
      sequenceAvgLength: 45,
      lstm: {
        accuracy: 91.2,
        precision: 90.8,
        recall: 90.5,
        f1: 90.6,
        trainingTimeSec: 210,
        inferenceTimeMs: 22,
        memoryUsageMb: 480,
        parametersMillion: 4.2,
      },
      transformer: {
        accuracy: 94.9,
        precision: 94.6,
        recall: 94.3,
        f1: 94.4,
        trainingTimeSec: 135,
        inferenceTimeMs: 21,
        memoryUsageMb: 860,
        parametersMillion: 66.4,
      },
      winner: {
        accuracy: 'Transformer',
        precision: 'Transformer',
        recall: 'Transformer',
        f1: 'Transformer',
        trainingTimeSec: 'Transformer',
        inferenceTimeMs: 'Transformer',
        memoryUsageMb: 'LSTM',
        parametersMillion: 'LSTM',
      },
    },
    'Long-Doc Context Stress Test': {
      datasetName: 'Long Document Classifier (800+ tokens)',
      sampleCount: 15000,
      sequenceAvgLength: 840,
      lstm: {
        accuracy: 78.6, // Vanishing gradients / catastrophic forgetting over long text
        precision: 77.9,
        recall: 76.5,
        f1: 77.2,
        trainingTimeSec: 480, // Sequential step-by-step unrolling is slow
        inferenceTimeMs: 148,
        memoryUsageMb: 920,
        parametersMillion: 5.1,
      },
      transformer: {
        accuracy: 93.1, // Full pairwise attention across 800 tokens
        precision: 92.8,
        recall: 92.4,
        f1: 92.6,
        trainingTimeSec: 360,
        inferenceTimeMs: 112,
        memoryUsageMb: 2450, // O(N^2) memory footprint explodes
        parametersMillion: 66.4,
      },
      winner: {
        accuracy: 'Transformer',
        precision: 'Transformer',
        recall: 'Transformer',
        f1: 'Transformer',
        trainingTimeSec: 'Transformer',
        inferenceTimeMs: 'Transformer',
        memoryUsageMb: 'LSTM', // LSTM is vastly more memory-efficient at long context
        parametersMillion: 'LSTM',
      },
    },
  };

  return datasets[datasetKey] || datasets['IMDB Sentiment'];
}

/**
 * Scaling curve data for visual charts
 */
export const SCALING_CURVES = {
  sequenceLength: [
    { length: 32, lstmTrainTime: 18, transformerTrainTime: 22, lstmMemoryMb: 210, transformerMemoryMb: 420 },
    { length: 64, lstmTrainTime: 34, transformerTrainTime: 32, lstmMemoryMb: 260, transformerMemoryMb: 520 },
    { length: 128, lstmTrainTime: 68, transformerTrainTime: 49, lstmMemoryMb: 350, transformerMemoryMb: 680 },
    { length: 256, lstmTrainTime: 138, transformerTrainTime: 82, lstmMemoryMb: 510, transformerMemoryMb: 990 },
    { length: 512, lstmTrainTime: 285, transformerTrainTime: 165, lstmMemoryMb: 780, transformerMemoryMb: 1680 },
    { length: 1024, lstmTrainTime: 610, transformerTrainTime: 390, lstmMemoryMb: 1120, transformerMemoryMb: 3450 },
  ],
  batchSizeInference: [
    { batch: 1, lstmMsPerBatch: 12, transformerMsPerBatch: 15, lstmThroughput: 83, transformerThroughput: 66 },
    { batch: 8, lstmMsPerBatch: 38, transformerMsPerBatch: 22, lstmThroughput: 210, transformerThroughput: 363 },
    { batch: 16, lstmMsPerBatch: 68, transformerMsPerBatch: 30, lstmThroughput: 235, transformerThroughput: 533 },
    { batch: 32, lstmMsPerBatch: 130, transformerMsPerBatch: 42, lstmThroughput: 246, transformerThroughput: 761 },
    { batch: 64, lstmMsPerBatch: 255, transformerMsPerBatch: 68, lstmThroughput: 250, transformerThroughput: 941 },
    { batch: 128, lstmMsPerBatch: 510, transformerMsPerBatch: 115, lstmThroughput: 251, transformerThroughput: 1113 },
  ],
};

/**
 * "Which Model Should I Choose?" Decision Recommender Engine
 */
export function calculateRecommendation(input: RecommenderInput): RecommendationResult {
  let lstmScore = 50;
  let transformerScore = 50;
  const reasons: string[] = [];
  const caveats: string[] = [];

  // 1. Dataset size impact
  if (input.datasetSize === 'tiny') {
    lstmScore += 30;
    transformerScore -= 20;
    reasons.push('With <5,000 samples, Transformers are prone to severe overfitting unless heavily regularized or using frozen pre-trained checkpoints.');
    caveats.push('LSTM will converge faster with limited training data without requiring massive pre-training.');
  } else if (input.datasetSize === 'small') {
    lstmScore += 15;
    transformerScore += 10;
    reasons.push('Small datasets (~10k-30k) are competitive: LSTMs train stably with few parameters, while compact Transformers (DistilBERT/MiniLM) begin pulling ahead.');
  } else if (input.datasetSize === 'medium') {
    transformerScore += 25;
    lstmScore -= 5;
    reasons.push('Medium datasets (50k-200k) allow self-attention heads to learn rich multi-hop representations, usually beating LSTMs by 3-6% F1 score.');
  } else {
    transformerScore += 40;
    lstmScore -= 25;
    reasons.push('Large datasets (>500k) overwhelmingly favor Transformers due to high model capacity and effortless GPU parallelization.');
  }

  // 2. Hardware / Compute
  if (input.hardware === 'cpu-edge') {
    lstmScore += 35;
    transformerScore -= 30;
    reasons.push('On CPU / Edge microcontrollers, LSTM requires orders of magnitude less RAM (~15MB vs ~300MB+ for BERT/Transformer) and fewer FLOPs.');
    caveats.push('Quantized Transformers (e.g., ONNX int8) can run on edge devices, but require extra engineering overhead.');
  } else if (input.hardware === 'single-gpu') {
    transformerScore += 15;
    lstmScore += 5;
    reasons.push('A modern consumer/workstation GPU (RTX 3060/4090 or T4/A10G) provides full tensor-core acceleration for Transformer matrix multiplications.');
  } else {
    transformerScore += 35;
    lstmScore -= 10;
    reasons.push('Multi-GPU / cluster environments scale efficiently with Transformers via tensor and data parallelism; LSTMs suffer from sequential inter-step synchronization.');
  }

  // 3. Sequence Length
  if (input.sequenceLength === 'long') {
    transformerScore += 25;
    lstmScore -= 25;
    reasons.push('Long context (>512 tokens) causes LSTMs to suffer from vanishing gradients and sequential memory bottleneck, losing earlier clause information.');
    caveats.push('Full self-attention scales quadratically O(N²) with sequence length; consider FlashAttention or Longformer for documents over 2,048 tokens.');
  } else if (input.sequenceLength === 'short') {
    lstmScore += 15;
    reasons.push('For short sequences (<50 words like tweets, titles, SMS), recurrence horizon is negligible and LSTM latency is very competitive.');
  }

  // 4. Latency budget
  if (input.latencyBudget === 'ultra-low') {
    lstmScore += 20;
    reasons.push('Ultra-low latency (<10ms single-sample) on standard CPU infrastructure favors compact recurrent models with minimal weight loads.');
  } else if (input.latencyBudget === 'relaxed') {
    transformerScore += 15;
    reasons.push('Batch inference throughput on GPU is 3x to 5x higher on Transformers due to matrix parallelization.');
  }

  // 5. Accuracy Priority
  if (input.accuracyPriority === 'maximum') {
    transformerScore += 30;
    lstmScore -= 15;
    reasons.push('When state-of-the-art accuracy and nuanced comprehension (double negatives, subtle sarcasm, distant references) are required, Transformers dominate benchmarks.');
  }

  // Determine winner
  const diff = transformerScore - lstmScore;
  let winner: 'LSTM' | 'Transformer' | 'Hybrid' = 'Transformer';
  let headline = '';
  let summary = '';
  let confidenceScore = 85;

  if (Math.abs(diff) <= 12) {
    winner = 'Hybrid';
    headline = 'Close Contention: Consider a Hybrid or BiLSTM + Attention';
    confidenceScore = 72;
    summary = 'Your requirements balance resource constraints and performance. A BiLSTM with an additive attention pooling layer or a lightweight DistilBERT model will give the best trade-off.';
  } else if (diff > 12) {
    winner = 'Transformer';
    confidenceScore = Math.min(98, Math.round(65 + diff * 0.4));
    headline = 'Transformer is the clear optimal choice';
    summary = 'Self-attention parallelization, higher representational capacity, and superior contextual modeling make Transformer the superior architecture for your workload.';
  } else {
    winner = 'LSTM';
    confidenceScore = Math.min(98, Math.round(65 + Math.abs(diff) * 0.4));
    headline = 'LSTM / Bi-LSTM is the recommended architecture';
    summary = 'Given your hardware or latency constraints and dataset scale, an LSTM offers substantially lower compute overhead, minimal memory footprint, and swift training without overfitting.';
  }

  return {
    winner,
    confidenceScore,
    headline,
    summary,
    keyReasons: reasons.slice(0, 4),
    caveats: caveats.length ? caveats : ['Always validate on a validation split representative of production traffic.'],
    lstmScore,
    transformerScore,
  };
}
