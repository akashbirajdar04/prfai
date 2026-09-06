import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Play, Globe, Server, Brain, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import analysisService from '../services/analysisService';

const steps = [
    { id: 1, name: 'Lighthouse Audit', icon: Globe, description: 'Analyzing FCP, LCP, CLS & Core Web Vitals...' },
    { id: 2, name: 'Backend Telemetry', icon: Server, description: 'Measuring API latency & HTTP TTFB...' },
    { id: 3, name: 'AI Optimization', icon: Brain, description: 'Generating actionable optimization code snippets...' },
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
        try {
            const response = await analysisService.startAnalysis(url);
            navigate(`/analysis/${response.data.sessionId}`);
        } catch (error) {
            console.error("Analysis failed", error);
            setAnalyzing(false);
            const serverMsg = error.response?.data?.message;
            alert(serverMsg ? `Failed to start analysis: ${serverMsg}` : "Failed to start analysis. Please check the URL and try again.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8 space-y-8 animate-in fade-in-50 duration-300">
            <div className="text-center space-y-2">
                <Badge variant="default" className="gap-1.5 py-1 px-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    Deep Stack Diagnostics
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Start New Performance Analysis
                </h1>
                <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                    Enter any public website URL to test Core Web Vitals, API response latency, and AI code recommendations.
                </p>
            </div>

            <Card className="shadow-lg border-border/80">
                <CardContent className="p-6">
                    <form onSubmit={handleStartAnalysis} className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="text"
                                required
                                placeholder="https://example.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                disabled={analyzing}
                                className="pl-10 h-11"
                            />
                        </div>
                        <Button type="submit" disabled={analyzing || !url} loading={analyzing} size="lg" className="h-11 px-6 gap-2">
                            {analyzing ? 'Analyzing...' : (
                                <>
                                    Run Audit <Play className="w-4 h-4 fill-current" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {analyzing && (
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Diagnostic Sequence</h3>
                    {steps.map((step) => {
                        const Icon = step.icon;
                        const isCompleted = completedSteps.includes(step.id);
                        const isCurrent = currentStep === step.id || (!isCompleted && step.id === 1);

                        return (
                            <Card
                                key={step.id}
                                className={`transition-all duration-300 ${isCurrent
                                    ? 'border-primary/40 bg-primary/5 shadow-sm'
                                    : 'border-border/40 opacity-60'
                                    }`}
                            >
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className={`p-2.5 rounded-lg ${isCompleted || isCurrent ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                                        }`}>
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                        ) : (
                                            <Icon className={`w-5 h-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-foreground">
                                            {step.name}
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                                    </div>
                                    {isCurrent && (
                                        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default NewAnalysis;
