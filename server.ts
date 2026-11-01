import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { scoreText, getBenchmarkMetrics, SCALING_CURVES } from './src/utils/benchmark.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware
app.use(express.json());

// Enable CORS for API routes if needed
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    server: 'Attention vs Recurrence Research API',
    mode: 'Demo Benchmark',
  });
});

// Benchmark classification inference endpoint
app.post('/api/classify', (req, res) => {
  const text = String(req.body?.text || '').trim();
  const dataset = String(req.body?.dataset || 'IMDB Sentiment').trim();

  if (!text) {
    return res.status(400).json({
      error: 'Please enter text to classify with both models.',
    });
  }

  const result = scoreText(text, dataset);

  res.json({
    ...result,
    timestamp: new Date().toISOString(),
  });
});

// Metrics and dataset benchmark endpoint
app.get('/api/metrics', (req, res) => {
  const dataset = String(req.query.dataset || 'IMDB Sentiment');
  const metrics = getBenchmarkMetrics(dataset);

  res.json({
    dataset,
    currentBenchmark: metrics,
    availableDatasets: [
      'IMDB Sentiment',
      'SST-2 (Short Sentences)',
      'AG News (Topic Classification)',
      'Long-Doc Context Stress Test',
    ],
    scalingCurves: SCALING_CURVES,
    isDemoBenchmark: true,
  });
});

// Mounting Vite in development or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Attention vs Recurrence] Server running at http://0.0.0.0:${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
