import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Play, Globe, Server, Brain, CheckCircle2 } from 'lucide-react';
import analysisService from '../services/analysisService';

const steps = [
    { id: 1, name: 'Lighthouse Analysis', icon: Globe, description: 'Auditing performance & SEO...' },
    { id: 2, name: 'Backend Telemetry', icon: Server, description: 'Measuring API latency...' },
    { id: 3, name: 'AI Optimization', icon: Brain, description: 'Generating insights...' },
];

const NewAnalysis = () => {
    const [url, setUrl] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);
    const navigate = useNavigate();

    const handleStartAnalysis = async (e) => {
        e.preventDefault();
        if (!url) return;

        setAnalyzing(true);
        // Immediate navigation to analysis page where real progress happens
        try {
            // Actual API call
            const response = await analysisService.startAnalysis(url);

            // Navigate to results with real ID
            navigate(`/analysis/${response.data.sessionId}`);

        } catch (error) {
            console.error("Analysis failed", error);
            setAnalyzing(false);
            alert("Failed to start analysis. Please check the URL and try again.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                    Start New Analysis
                </h1>
                <p className="text-slate-400">
                    Enter the URL of the website you want to analyze. Our AI will audit performance, SEO, and backend latency.
                </p>
            </div>

            <Card className="mb-8">
                <CardContent>
                    <form onSubmit={handleStartAnalysis} className="flex gap-4">
                        <input
                            type="text"
                            required
                            placeholder="example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={analyzing}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                        />
                        <Button type="submit" disabled={analyzing || !url} size="lg" className="min-w-[140px]">
                            {analyzing ? 'Analyzing...' : (
                                <>
                                    Start <Play className="w-4 h-4 ml-2 fill-current" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {analyzing && (
                <div className="space-y-6">
                    {steps.map((step) => {
                        const Icon = step.icon;
                        const isCompleted = completedSteps.includes(step.id);
                        const isCurrent = currentStep === step.id;
                        const isPending = !isCompleted && !isCurrent;

                        return (
                            <div
                                key={step.id}
                                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${isCurrent
                                    ? 'bg-indigo-900/20 border-indigo-500/50 scale-105 shadow-lg shadow-indigo-500/10'
                                    : isCompleted
                                        ? 'bg-slate-900/50 border-slate-800 opacity-60'
                                        : 'bg-transparent border-transparent opacity-30'
                                    }`}
                            >
                                <div className={`p-3 rounded-full transition-colors ${isCompleted || isCurrent ? 'bg-indigo-500/20' : 'bg-slate-800'
                                    }`}>
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                                    ) : (
                                        <Icon className={`w-6 h-6 ${isCurrent ? 'text-indigo-400 animate-pulse' : 'text-slate-400'}`} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-semibold ${isCurrent ? 'text-indigo-300' : 'text-slate-300'}`}>
                                        {step.name}
                                    </h3>
                                    <p className="text-sm text-slate-500">{step.description}</p>
                                </div>
                                {isCurrent && (
                                    <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default NewAnalysis;
