import React, { useState } from 'react';
import { X, Copy, Check, Code2, Server, Database, ArrowRight, Layers } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const samplePythonCode = `# python_inference_service.py (FastAPI or PyTorch Flask wrapper)
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# 1. Load trained Transformer (e.g. DistilBERT fine-tuned on IMDB)
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")
transformer_model = AutoModelForSequenceClassification.from_pretrained("./saved_models/transformer")

# 2. Load trained PyTorch LSTM model
from models.bilstm import BiLSTMClassifier
lstm_model = BiLSTMClassifier(vocab_size=30000, embed_dim=128, hidden_dim=256)
lstm_model.load_state_dict(torch.load("./saved_models/bilstm.pt"))

class ClassifyRequest(BaseModel):
    text: str

@app.post("/api/classify")
def classify(req: ClassifyRequest):
    # Transformer forward pass
    inputs = tokenizer(req.text, return_tensors="pt")
    with torch.no_grad():
        trans_out = torch.softmax(transformer_model(**inputs).logits, dim=-1)
    
    # LSTM forward pass
    with torch.no_grad():
        lstm_out = torch.softmax(lstm_model(req.text), dim=-1)
        
    return {
        "text": req.text,
        "transformer": {"confidence": float(trans_out.max()), "label": "Positive"},
        "lstm": {"confidence": float(lstm_out.max()), "label": "Positive"}
    }
`;

  const copyScript = () => {
    navigator.clipboard.writeText(samplePythonCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-200 rounded-2xl p-6 sm:p-8 bg-white text-slate-800 relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 cursor-pointer transition-colors"
          aria-label="Close specification modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 border border-blue-200">
            <Server className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-slate-900">
              Full-Stack Architecture & Model Integration Spec
            </h3>
            <p className="text-xs text-slate-500">
              How this benchmark platform connects frontend UI, Express REST API, and trained PyTorch models
            </p>
          </div>
        </div>

        {/* Pipeline Architecture Diagram */}
        <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-mono uppercase text-blue-700 block mb-3 font-semibold">
            End-to-End System Flow:
          </span>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-center">
            <div className="p-3 rounded-lg bg-white border border-blue-300 w-full sm:w-auto shadow-xs">
              <span className="text-slate-900 font-bold block">React Frontend</span>
              <span className="text-slate-500 text-[10px]">Dual Model UI</span>
            </div>

            <ArrowRight className="h-4 w-4 text-slate-400 shrink-0 hidden sm:block" />

            <div className="p-3 rounded-lg bg-white border border-indigo-300 w-full sm:w-auto shadow-xs">
              <span className="text-slate-900 font-bold block">Express.js API</span>
              <span className="text-slate-500 text-[10px]">/api/classify & metrics</span>
            </div>

            <ArrowRight className="h-4 w-4 text-slate-400 shrink-0 hidden sm:block" />

            <div className="p-3 rounded-lg bg-white border border-purple-300 w-full sm:w-auto shadow-xs">
              <span className="text-slate-900 font-bold block">Inference Engine</span>
              <span className="text-slate-500 text-[10px]">PyTorch / Demo Scorer</span>
            </div>
          </div>
        </div>

        {/* REST API Endpoints Table */}
        <div className="my-6 space-y-2">
          <h4 className="font-display font-semibold text-sm text-slate-900 flex items-center gap-2">
            <Code2 className="h-4 w-4 text-blue-600" />
            Backend REST API Specification:
          </h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100 p-2.5 font-mono text-slate-600 border-b border-slate-200 grid grid-cols-12 gap-2 font-semibold">
              <span className="col-span-3">Method & Path</span>
              <span className="col-span-4">Request Body / Query</span>
              <span className="col-span-5">Response</span>
            </div>
            <div className="p-2.5 font-mono bg-white border-b border-slate-100 grid grid-cols-12 gap-2 text-slate-700">
              <span className="col-span-3 text-emerald-700 font-bold">POST /api/classify</span>
              <span className="col-span-4 text-slate-500">{`{ text: "...", dataset?: "..." }`}</span>
              <span className="col-span-5 text-purple-700">Both model labels, confidences, tokens & times</span>
            </div>
            <div className="p-2.5 font-mono bg-slate-50/70 border-b border-slate-100 grid grid-cols-12 gap-2 text-slate-700">
              <span className="col-span-3 text-blue-700 font-bold">GET /api/metrics</span>
              <span className="col-span-4 text-slate-500">?dataset=IMDB</span>
              <span className="col-span-5 text-slate-600">Accuracy, F1, latency, VRAM, scaling curves</span>
            </div>
            <div className="p-2.5 font-mono bg-white grid grid-cols-12 gap-2 text-slate-700">
              <span className="col-span-3 text-cyan-700 font-bold">GET /api/health</span>
              <span className="col-span-4 text-slate-500">None</span>
              <span className="col-span-5 text-slate-600">{`{ status: "ok", mode: "Demo Benchmark" }`}</span>
            </div>
          </div>
        </div>

        {/* Connecting Real Models Snippet */}
        <div className="my-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-800">
              Drop-In PyTorch Service Adapter (`server.ts` or Python proxy):
            </span>
            <button
              onClick={copyScript}
              className="flex items-center gap-1 text-[11px] font-mono text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-3.5 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-200 overflow-x-auto border border-slate-800 leading-relaxed max-h-56">
            {samplePythonCode}
          </pre>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer shadow-xs transition-colors"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
