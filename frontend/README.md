# PerafAI Frontend ⚡ (Intelligence Dashboard)

The visual interface for the **PerafAI** performance system. This dashboard allows users to trigger audits, visualize Core Web Vitals, and interact with AI-generated performance insights.

## 🎨 Design & UI
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS & Vanilla CSS (Custom Design System)
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Icons**: Lucide React

## ✨ Key Features
- **Real-time Performance Visuals**: Dynamic charts and scorecards for LCP, CLS, INP, and TTFB.
- **AI Insight Explorer**: Interactive interface to view RAG-generated recommendations for Backend, Frontend, and Infrastructure.
- **SDK Integration Guide**: Dynamic code snippet generator to help users integrate telemetry into their own apps.
- **History & Trends**: Side-by-side comparison of different performance runs.

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file:
```env
VITE_API_URL=https://prfeai-backend.onrender.com/api
```

### 3. Development
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

## 🌐 Deployment
Optimized for deployment on **Render**, **Vercel**, or **Netlify**. Ensure `VITE_API_URL` is set in your build environment.

---
Part of the [PerafAI Ecosystem](https://prfeai-backend.onrender.com).
