# AI-Driven Web Performance Analyzer (MVP) - Project Report

## 1. Project Overview
The AI-Driven Web Performance Analyzer is a sophisticated full-stack platform designed to automate the process of performance debugging. It provides a unique "closed-loop" system that combines frontend synthetic audits (Lighthouse) with real-world backend telemetry (custom SDK) to generate grounded, AI-powered engineering insights.

## 2. Technical Stack

### **Frontend**
- **Library**: React.js
- **Styling**: TailwindCSS & Glassmorphism Design
- **Icons**: Lucide-React
- **State Management**: React Hooks (useState/useEffect)

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Session & User persistence)
- **File Storage**: Cloudinary (Storing detailed metrics & raw reports)

### **AI & RAG Pipeline**
- **Vector Database**: Pinecone (768-dimension storage)
- **Embeddings**: Hugging Face (`sentence-transformers/all-mpnet-base-v2`)
- **LLM Reasoning**: Groq (`llama-3.3-70b-versatile`)
- **Integration Strategy**: Retrieval-Augmented Generation (RAG) for data-grounded insights.

### **Telemetry SDK**
- **Logic**: Custom Node.js client (`ai-perf-sdk`)
- **Features**: Automatic interception of HTTP requests/responses, batching, and flush logic.

## 3. Core Architecture
The system follows a modern micro-service-like orchestration:
1.  **SDK Integration**: Developers integrate the SDK into their backend to capture live API latency and success rates.
2.  **Synthetic Audit**: The platform triggers a Lighthouse run to capture Core Web Vitals (LCP, CLS, TTFB, etc.).
3.  **Data Ingestion**: All metrics are stored in MongoDB and indexed into Pinecone via an embedding service.
4.  **RAG Analysis**: When requested, the Groq-powered LLM retrieves relevant context from Pinecone and generates a "Problem → Solution" report.

## 4. Key Features Implemented
- **One-Line Analysis**: Strict engineering-focused reports using arrow notation.
- **Hybrid AI Stack**: Optimized for speed and cost by splitting Embedding and Reasoning tasks.
- **Real-Time Telemetry**: Immediate capturing of backend events for precise session analysis.
- **Automated Root-Cause Analysis**: High-quality mapping of frontend vitals back to backend latency spikes.

## 5. Senior Performance Engineer Persona
The system is configured with a strict "Senior Software Performance Engineer" persona, ensuring:
- Conciseness (one-liners).
- High precision (identifying exact bottlenecks).
- Practical solutions (no generic fluff).

## 6. Project Status: MVP Complete
The application is currently a **fully functional Minimum Viable Product**. It successfully bridges the gap between raw data collection and actionable engineering advice.

---
*Report Generated on Jan 24, 2026*
