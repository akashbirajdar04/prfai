# PerafAI ⚡ (AI-Powered Performance Intelligence)

**PerafAI** is a state-of-the-art "Closed-Loop" web performance analysis system. Unlike traditional tools that only look at frontend vitals, PerafAI correlates real-world backend telemetry with synthetic Lighthouse audits using a **Retrieval-Augmented Generation (RAG)** pipeline to provide grounded, actionable engineering recommendations.

![PerafAI Logo](https://prfeai-backend.onrender.com/logo.png)

## 🏗️ Core Architecture

PerafAI operates on a unique three-phase analysis cycle:

1.  **Synthetic Audit**: Triggered via an asynchronous Lighthouse job to capture LCP, CLS, INP, and SEO metrics.
2.  **Real-World Calibration**: Real-time backend tracing via the custom **`ai-perf-sdk`** which uses Node.js monkey-patching to intercept HTTP traffic without configuration changes.
3.  **AI Reasoning (RAG)**: Performance data is embedded (Hugging Face `all-mpnet-base-v2`) and indexed in **Pinecone**. **Groq (Llama 3.3 70B)** then synthesizes this context to generate structured "Problem → Solution" insights.

## 🚀 Key Features

-   **Zero-Config Telemetry**: SDK uses low-level HTTP wrapping for seamless instrumentation.
-   **Intelligent RAG Pipeline**: Maps UI performance spikes (Core Web Vitals) to specific backend API latency bottlenecks.
-   **Micro-Batching Strategy**: Optimized network overhead for telemetry traces with asynchronous flushing.
-   **Cloud-Native Storage**: Automated report archival using **Cloudinary** and **MongoDB Atlas**.

## 🛠️ Technology Stack

-   **Frontend**: React, Vite, Tailwind CSS, Framer Motion
-   **Backend**: Node.js, Express, MongoDB Atlas
-   **AI/RAG**: Pinecone (Vector DB), Groq (Llama 3.3 70B), Hugging Face (Embeddings)
-   **Observability**: OpenTelemetry, Lighthouse, Custom SDK
-   **Cloud**: Cloudinary, Render

## 📦 Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. SDK Integration
Integrate the telemetry SDK into your target application to enable deep backend insights:

```bash
npm install ai-perf-sdk
```

```javascript
const { initPerformanceSDK } = require('ai-perf-sdk');

initPerformanceSDK({
  serviceName: 'prod-api-service',
  endpoint: 'https://prfeai-backend.onrender.com/api/telemetry',
  headers: {
    'x-session-id': 'YOUR_SESSION_ID'
  }
});
```

---

## 📈 Roadmap & Features
- [x] RAG-based performance reasoning
- [x] Zero-config Node.js instrumentation
- [x] Dashboard visualization for P95 latency
- [ ] Automated code suggestion via PR comments
- [ ] Support for mobile-specific Lighthouse audits
