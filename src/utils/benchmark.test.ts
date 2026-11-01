import test from 'node:test';
import assert from 'node:assert/strict';
import {
  tokenize,
  scoreText,
  getBenchmarkMetrics,
  calculateRecommendation,
} from './benchmark.ts';

test('tokenize splits words and cleans punctuation', () => {
  const words = tokenize('Hello, world! This is LSTM vs Transformer.');
  assert.deepEqual(words, ['Hello', 'world', 'This', 'is', 'LSTM', 'vs', 'Transformer']);
});

test('scoreText handles empty string gracefully', () => {
  const res = scoreText('');
  assert.equal(res.tokens.length, 0);
  assert.equal(res.lstm.label, 'Neutral');
  assert.equal(res.transformer.label, 'Neutral');
});

test('scoreText correctly classifies positive sentence', () => {
  const res = scoreText('The movie was absolutely amazing, wonderful, and brilliant!');
  assert.equal(res.transformer.label, 'Positive');
  assert.ok(res.transformer.confidence > 0.7);
  assert.equal(res.lstm.label, 'Positive');
  assert.ok(res.lstm.confidence > 0.6);
  assert.ok(res.tokens.length > 5);
});

test('scoreText handles negation and contrast appropriately', () => {
  const res = scoreText('The setup was terrible and slow, but the customer service was sensational!');
  // With the strong contrast "but", the final verdict should be positive
  assert.equal(res.transformer.label, 'Positive');
  assert.equal(res.isDemoBenchmark, true);
  // Verify tokens have attention weights summing near 1
  const sumAttention = res.tokens.reduce((acc, t) => acc + t.attentionWeight, 0);
  assert.ok(Math.abs(sumAttention - 1.0) < 0.05);
});

test('getBenchmarkMetrics returns dataset metrics and valid winners', () => {
  const metrics = getBenchmarkMetrics('IMDB Sentiment');
  assert.equal(metrics.sampleCount, 50000);
  assert.equal(metrics.winner.accuracy, 'Transformer');
  assert.equal(metrics.winner.memoryUsageMb, 'LSTM');
});

test('calculateRecommendation recommends LSTM for edge / tiny dataset', () => {
  const rec = calculateRecommendation({
    datasetSize: 'tiny',
    hardware: 'cpu-edge',
    sequenceLength: 'short',
    latencyBudget: 'ultra-low',
    accuracyPriority: 'moderate',
  });
  assert.equal(rec.winner, 'LSTM');
  assert.ok(rec.lstmScore > rec.transformerScore);
});

test('calculateRecommendation recommends Transformer for large dataset with cluster', () => {
  const rec = calculateRecommendation({
    datasetSize: 'large',
    hardware: 'cluster',
    sequenceLength: 'long',
    latencyBudget: 'relaxed',
    accuracyPriority: 'maximum',
  });
  assert.equal(rec.winner, 'Transformer');
  assert.ok(rec.transformerScore > rec.lstmScore);
});
