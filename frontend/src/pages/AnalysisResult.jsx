import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import MetricCard from '../components/dashboard/MetricCard';
import ApiTable from '../components/analysis/ApiTable';
import RecommendationCard from '../components/analysis/RecommendationCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Zap, Globe, Database, Brain, Download, Share2, Activity, Server, ArrowLeft, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import analysisService from '../services/analysisService';

const AnalysisResult = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('performance');
    const [data, setData] = useState(null);
    const [showDashboard, setShowDashboard] = useState(false);
    const [loadingStage, setLoadingStage] = useState(0);
    const [error, setError] = useState(null);
    const [sdkSyntax, setSdkSyntax] = useState('cjs');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let isMounted = true;
        let timerId = null;

        const fetchData = async () => {
            try {
                const response = await analysisService.getSessionDetails(id);
                if (!isMounted) return;

                const currentData = response.data;
                console.log(`[Frontend] Received session data:`, currentData);
                const backendMetrics = currentData.metrics || {};
                const mergedData = {
                    ...currentData,
                    ...currentData.artifacts,
                    performance: backendMetrics.performance || {},
                    seo: backendMetrics.seo || { score: 0, issues: [] },
                    ai: backendMetrics.ai || [],
                    api: backendMetrics.api || []
                };

                setData(mergedData);

                if (currentData.status === 'completed') {
                    setLoadingStage(1);
                } else if (currentData.status === 'failed') {
                    setError('Analysis failed.');
                } else {
                    setLoadingStage(1);
                    timerId = setTimeout(fetchData, 3000);
                }
            } catch (err) {
                if (!isMounted) return;
                console.error(err);
                setError('Failed to load analysis.');
            }
        };

        fetchData();

        return () => {
            isMounted = false;
            if (timerId) clearTimeout(timerId);
        };
    }, [id]);

    const handleGenerateAI = async () => {
        try {
            await analysisService.generateAI(id);
            window.location.reload();
        } catch (e) {
            alert("Failed to start AI generation");
        }
    };

    if (error) return (
        <div className="min-h-[65vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center text-rose-400 border border-destructive/20">
                <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Analysis Failed</h2>
            <p className="text-sm text-muted-foreground max-w-md">{error}</p>
            <div className="bg-card border border-border/70 p-4 rounded-xl text-left text-xs max-w-lg w-full font-mono text-muted-foreground">
                <p className="text-destructive font-sans font-medium mb-1">Details:</p>
                <p className="break-all">{data?.error?.message || 'Unknown error occurred during lighthouse execution.'}</p>
            </div>
            <Button onClick={() => navigate('/analysis/new')} variant="outline" size="sm">
                Try Another URL
            </Button>
        </div>
    );

    // Summary Loading State
    if (!showDashboard) {
        return (
            <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 relative overflow-hidden space-y-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] -z-10" />

                <div className="text-center space-y-2">
                    <Badge variant="default" className="gap-1 px-3 py-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        {loadingStage === 1 ? 'Lighthouse Audit Complete' : 'Executing Diagnostics'}
                    </Badge>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {loadingStage === 1 ? 'Audit Ready' : 'Analyzing Performance'}
                    </h1>
                    <p className="text-sm text-muted-foreground font-mono bg-muted/30 px-3 py-1 rounded-md inline-block border border-border/40">
                        {data?.targetUrl || 'Target site...'}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                    <div className="relative">
                        <div className={`w-40 h-40 rounded-full border-4 flex items-center justify-center relative ${loadingStage === 1 ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-primary/20 bg-primary/5'}`}>
                            {loadingStage === 0 && (
                                <div className="absolute inset-0 border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent rounded-full animate-spin" />
                            )}
                            <div className="text-center">
                                <h3 className={`text-3xl font-bold ${loadingStage === 1 ? 'text-emerald-400' : 'text-primary'}`}>
                                    {loadingStage === 1 ? data?.performance?.score || 0 : '...'}
                                </h3>
                                <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
                                    Performance Index
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <MetricPlaceholder label="LCP" value={data?.performance?.lcp} loading={loadingStage === 0} />
                        <MetricPlaceholder label="CLS" value={data?.performance?.cls} loading={loadingStage === 0} />
                        <MetricPlaceholder label="INP" value={data?.performance?.inp} loading={loadingStage === 0} />
                        <MetricPlaceholder label="TTFB" value={data?.performance?.ttfb} loading={loadingStage === 0} />
                    </div>
                </div>

                <div className="h-12 flex items-center justify-center">
                    {loadingStage === 1 ? (
                        <Button
                            onClick={() => setShowDashboard(true)}
                            size="lg"
                            className="rounded-full px-8 shadow-lg shadow-primary/25 gap-2"
                        >
                            View Comprehensive Report <ArrowLeft className="w-4 h-4 rotate-180" />
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
                            <Activity className="w-4 h-4 text-primary animate-bounce" />
                            <span>Tracing Web Vitals and API Telemetry...</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const isWaitingForTelemetry = data?.status === 'waiting_for_telemetry';

    return (
        <div className="space-y-6 pb-12 animate-in fade-in-50 duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-border/40">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Performance Audit Report
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                        <span>{data.targetUrl || data.url || 'Target Endpoint'}</span>
                        <span>•</span>
                        <span>{data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Today'}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <Share2 className="w-3.5 h-3.5" /> Share
                    </Button>
                    <Button size="sm" className="gap-1.5 text-xs shadow-xs">
                        <Download className="w-3.5 h-3.5" /> Export Report
                    </Button>
                </div>
            </div>

            {/* SDK Calibration box if waiting for telemetry */}
            {isWaitingForTelemetry && (
                <Card className="border-primary/30 bg-primary/5 overflow-hidden">
                    <CardHeader className="py-4 px-6 bg-primary/10 border-b border-primary/20 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-primary" />
                            <CardTitle className="text-sm font-semibold">Backend SDK Telemetry Setup</CardTitle>
                        </div>
                        <Badge variant="warning" className="text-[11px] gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                            Waiting for Telemetry
                        </Badge>
                    </CardHeader>

                    <CardContent className="p-6 space-y-4 text-xs">
                        <p className="text-muted-foreground leading-relaxed">
                            To generate deep AI query diagnostics, link your Express/Node.js backend using the micro-SDK:
                        </p>
                        
                        <div className="flex items-center justify-between p-3 bg-background/80 rounded-lg border border-border/50 font-mono text-muted-foreground">
                            <code>npm install ai-perf-sdk@latest</code>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 px-2 text-[11px]"
                                onClick={() => navigator.clipboard.writeText('npm install ai-perf-sdk@latest')}
                            >
                                Copy Install
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground font-medium text-[11px]">SDK Import Instructions:</span>
                                <div className="flex bg-muted/50 p-0.5 rounded border border-border/40 text-[11px]">
                                    <button 
                                        type="button"
                                        onClick={() => setSdkSyntax('cjs')} 
                                        className={`px-2.5 py-0.5 rounded font-mono transition-colors ${sdkSyntax === 'cjs' ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        CommonJS (require)
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setSdkSyntax('esm')} 
                                        className={`px-2.5 py-0.5 rounded font-mono transition-colors ${sdkSyntax === 'esm' ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        ES Modules (import)
                                    </button>
                                </div>
                            </div>

                            <div className="relative p-4 bg-background/90 rounded-lg border border-border/60 font-mono text-foreground overflow-x-auto">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute top-2 right-2 h-7 px-2 text-[11px] bg-muted/40 hover:bg-muted"
                                    onClick={() => {
                                        const code = sdkSyntax === 'cjs' 
                                            ? `const { startSDK } = require('ai-perf-sdk');\n\nstartSDK({\n  serviceName: 'backend-api',\n  endpoint: 'https://prfeai-backend.onrender.com/api/telemetry',\n  headers: { 'x-session-id': '${id}' }\n});`
                                            : `import { startSDK } from 'ai-perf-sdk';\n\nstartSDK({\n  serviceName: 'backend-api',\n  endpoint: 'https://prfeai-backend.onrender.com/api/telemetry',\n  headers: { 'x-session-id': '${id}' }\n});`;
                                        navigator.clipboard.writeText(code);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                >
                                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1" /> : null}
                                    {copied ? 'Copied!' : 'Copy Code'}
                                </Button>
                                <pre className="text-[11px] leading-relaxed text-muted-foreground pt-4">
                                    {sdkSyntax === 'cjs' ? (
                                        `const { startSDK } = require('ai-perf-sdk');

startSDK({
  serviceName: 'backend-api',
  endpoint: 'https://prfeai-backend.onrender.com/api/telemetry',
  headers: { 'x-session-id': '${id}' }
});`
                                    ) : (
                                        `import { startSDK } from 'ai-perf-sdk';

startSDK({
  serviceName: 'backend-api',
  endpoint: 'https://prfeai-backend.onrender.com/api/telemetry',
  headers: { 'x-session-id': '${id}' }
});`
                                    )}
                                </pre>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-xs text-muted-foreground">Captured API Routes: <strong className="text-foreground">{data?.metrics?.api?.length || 0}</strong></span>
                            {data?.metrics?.api?.length > 0 && (
                                <Button size="sm" onClick={handleGenerateAI} className="gap-2">
                                    <Brain className="w-4 h-4" /> Generate Final AI Insights
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Tabbed view */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="seo">SEO Audit</TabsTrigger>
                    <TabsTrigger value="backend">API Telemetry</TabsTrigger>
                    <TabsTrigger value="ai">AI Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="performance" className="space-y-6 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <MetricCard title="Performance Score" value={data.performance.score || 0} trend="neutral" icon={Zap} description="Weighted aggregate" />
                        <MetricCard title="LCP (Largest Contentful)" value={data.performance.lcp || '0s'} trend={parseFloat(data.performance.lcp) > 2.5 ? 'down' : 'up'} icon={Activity} description="Main element load" />
                        <MetricCard title="CLS (Layout Shift)" value={data.performance.cls || 0} trend={parseFloat(data.performance.cls) > 0.1 ? 'down' : 'up'} icon={Activity} description="Visual stability" />
                        <MetricCard title="TTFB (Time to First Byte)" value={data.performance.ttfb || '0ms'} description="Server response time" icon={Server} />
                    </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-6 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <MetricCard title="SEO Score" value={data.seo.score || 0} icon={Globe} trend="up" description="Search engine optimization index" />
                        <Card className="md:col-span-2">
                            <CardHeader className="py-4 px-6">
                                <CardTitle className="text-base font-semibold">SEO Recommendations & Checks</CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 pb-6 space-y-3">
                                {data.seo.issues && data.seo.issues.length > 0 ? (
                                    data.seo.issues.map((issue, idx) => (
                                        <RecommendationCard
                                            key={idx}
                                            title={typeof issue === 'string' ? issue : issue.title}
                                            description={typeof issue === 'string' ? 'Failing SEO check detected during audit.' : (issue.description || issue.displayValue || '')}
                                            severity={typeof issue === 'string' ? 'medium' : (issue.severity || 'medium')}
                                            category="SEO"
                                        />
                                    ))
                                ) : (
                                    <p className="text-xs text-muted-foreground py-6 text-center italic">No SEO issues detected. Page meets key search optimization standards!</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="backend" className="pt-2">
                    <ApiTable data={data.api} sessionId={id} />
                </TabsContent>

                <TabsContent value="ai" className="space-y-6 pt-2">
                    <Card className="bg-gradient-to-r from-primary/10 via-card to-card border-primary/20">
                        <CardContent className="p-6 space-y-2">
                            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                                <Brain className="w-5 h-5" />
                                AI Executive Diagnostics
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {data.ai && data.ai.length > 0
                                    ? "Prioritized AI optimizations targeting slow database queries, render blocking resources, and unminified bundles."
                                    : "Telemetry data captured. Run AI generation to get code-level suggestions."}
                            </p>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 gap-4">
                        {data.ai && data.ai.length > 0 ? (
                            data.ai.map((insight, idx) => (
                                <RecommendationCard key={idx} {...insight} />
                            ))
                        ) : (
                            <div className="py-12 text-center border border-dashed border-border/70 rounded-xl space-y-3">
                                <Activity className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                                <p className="text-xs text-muted-foreground">No AI recommendations generated yet.</p>
                                <Button onClick={handleGenerateAI} variant="outline" size="sm" className="gap-1.5 text-xs">
                                    <RefreshCw className="w-3.5 h-3.5" /> Trigger AI Diagnostic
                                </Button>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

const MetricPlaceholder = ({ label, value, loading }) => (
    <Card className="p-3 text-center min-w-[100px] border-border/60">
        <span className="text-[11px] font-medium text-muted-foreground block mb-1">{label}</span>
        {loading ? (
            <div className="h-5 w-14 bg-muted rounded animate-pulse mx-auto" />
        ) : (
            <span className="text-base font-bold text-foreground font-mono">{value || '--'}</span>
        )}
    </Card>
);

export default AnalysisResult;
