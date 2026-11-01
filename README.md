# Attention vs Recurrence: LSTM vs Transformer for Text Classification

An interactive machine learning research and comparative benchmark web platform designed to analyze:

> **“Design, train and compare an LSTM and a Transformer classifier on the same text dataset, and determine which gives better accuracy, training speed, resource usage, and under what conditions.”**

This platform focuses exclusively on **LSTM vs Transformer text-classification comparison** with real-time inference, token-level attention & forget-gate visualization, comprehensive benchmark metrics, scaling curves, and decision guidance.

---

## Core User Flow
1. **Enter text** (or select preset stress tests such as nuanced negation or long-range sarcasm).
2. **Run both models** simultaneously via `POST /api/classify`.
3. **Get predictions** (side-by-side classification label, confidence %, latency in ms).
4. **Compare confidence & activations** (Transformer multi-head self-attention heatmap vs LSTM sequential forget gates).
5. **Compare performance** on empirical benchmarks (Accuracy, Precision, Recall, F1, Training time, Inference latency, RAM/VRAM footprint).
6. **Understand which model is better** through the decision matrix and final engineering verdict.

---

## Architectural Comparison Summary

| Metric / Dimension | LSTM (Bidirectional) | Transformer (Self-Attention) | Architectural Advantage |
| :--- | :--- | :--- | :--- |
| **Max Path Length** | $O(N)$ sequential steps | $O(1)$ direct pairwise attention | Transformer preserves distant cues |
| **Training Parallelism**| Sequential $h_{t-1} \to h_t$ | Fully parallel tensor ops | Transformer trains 1.8x - 2.4x faster on GPU |
| **Memory Complexity** | Linear $O(N)$ | Quadratic $O(N^2)$ attention matrix | LSTM is vastly lighter on memory |
| **Parameter Scale** | ~3.4M weights (compact) | ~66.4M weights (DistilBERT/MiniLM)| LSTM is 19x smaller |
| **Accuracy on Long Docs**| 78.6% (suffers catastrophic forgetting) | 93.1% (unbroken receptive field) | Transformer leads by +14.5% |
| **Edge & Low-RAM Fit** | **Outstanding** (&lt;20MB RAM, CPU) | Demanding (needs GPU or quantization) | LSTM is optimal for constrained devices |

---

## Key Takeaway
> **“There is no universal winner. Model selection depends on dataset size, accuracy, latency and available computational resources.”**

- **Choose LSTM** when: deploying on microcontrollers/edge CPU, RAM is strictly limited (&lt;50MB), labeled data is tiny (&lt;5,000 samples), or processing streaming inputs.
- **Choose Transformer** when: state-of-the-art accuracy is paramount, documents exceed 100 tokens, large corpora are available (&gt;50k samples), and GPU batch throughput is required.

---

## Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend**: Node.js + Express 4 running with Vite middleware
- **APIs**:
  - `POST /api/classify` - Evaluates input text through both architectures
  - `GET /api/metrics` - Retrieves standardized benchmarks (IMDB, SST-2, AG News, LongDoc)
  - `GET /api/health` - Server health status

---

## Local Setup & Development

```bash
# 1. Install dependencies
npm install

# 2. Run the full-stack dev server
npm run dev
```

Open your browser to:
```
http://localhost:3000
```

### Running Unit Tests
```bash
npx --yes tsx --test src/utils/benchmark.test.ts
```

### Building for Production
```bash
npm run build
npm start
```
