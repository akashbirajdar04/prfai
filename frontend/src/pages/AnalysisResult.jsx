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

                if (currentData.status === 'completed' || currentData.status === 'waiting_for_telemetry') {
                    setLoadingStage(1);
                } else if (currentData.status === 'failed') {
                    setError(currentData.error?.message || 'Analysis failed.');
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

    const isRunning = !data || data?.status === 'running';
    const isWaitingForTelemetry = data?.status === 'waiting_for_telemetry';

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

    return (
        <div className="space-y-6 pb-12 animate-in fade-in-50 duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-border/40">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Performance & SEO Audit Report
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                        <span>{data?.targetUrl || data?.url || 'Target Endpoint'}</span>
                        <span>•</span>
                        <span>{data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Today'}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {isRunning && (
                        <Badge variant="warning" className="animate-pulse gap-1.5 py-1 px-3">
                            <Activity className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                            Lighthouse Audit Running in Background...
                        </Badge>
                    )}
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <Share2 className="w-3.5 h-3.5" /> Share
                    </Button>
                    <Button size="sm" className="gap-1.5 text-xs shadow-xs">
                        <Download className="w-3.5 h-3.5" /> Export Report
                    </Button>
                </div>
            </div>

            {/* SDK Setup Instructions - Rendered Immediately for the User */}
            <Card className="border-primary/30 bg-primary/5 overflow-hidden shadow-sm">
                <CardHeader className="py-4 px-6 bg-primary/10 border-b border-primary/20 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        <CardTitle className="text-sm font-semibold">Backend SDK Telemetry Setup Instructions</CardTitle>
                    </div>
                    <Badge variant={isWaitingForTelemetry ? "warning" : isRunning ? "outline" : "success"} className="text-[11px] gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-amber-400 animate-ping' : isWaitingForTelemetry ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                        {isRunning ? 'Auditing Background Metrics' : isWaitingForTelemetry ? 'Waiting for Telemetry' : 'SDK Connected'}
                    </Badge>
                </CardHeader>

                <CardContent className="p-6 space-y-4 text-xs">
                    <p className="text-muted-foreground leading-relaxed">
                        To capture deep backend API query latency and telemetry while the Lighthouse SEO audit finishes in the background, initialize the micro-SDK in your Node.js backend:
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
                            <span className="text-muted-foreground font-medium text-[11px]">SDK Import & Initialization Code:</span>
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
                        <MetricCard title="Performance Score" value={data?.performance?.score !== undefined ? data.performance.score : '...'} trend="neutral" icon={Zap} description="Weighted aggregate" />
                        <MetricCard title="LCP (Largest Contentful)" value={data?.performance?.lcp || '...'} trend={parseFloat(data?.performance?.lcp) > 2.5 ? 'down' : 'up'} icon={Activity} description="Main element load" />
                        <MetricCard title="CLS (Layout Shift)" value={data?.performance?.cls !== undefined ? data.performance.cls : '...'} trend={parseFloat(data?.performance?.cls) > 0.1 ? 'down' : 'up'} icon={Activity} description="Visual stability" />
                        <MetricCard title="TTFB (Time to First Byte)" value={data?.performance?.ttfb || '...'} description="Server response time" icon={Server} />
                    </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-6 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <MetricCard title="SEO Score" value={data?.seo?.score !== undefined ? data.seo.score : '...'} icon={Globe} trend="up" description="Search engine optimization index" />
                        <Card className="md:col-span-2">
                            <CardHeader className="py-4 px-6 flex flex-row items-center justify-between">
                                <CardTitle className="text-base font-semibold">SEO Recommendations & Checks</CardTitle>
                                {isRunning && (
                                    <Badge variant="outline" className="animate-pulse text-[11px] gap-1">
                                        <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                                        Auditing SEO...
                                    </Badge>
                                )}
                            </CardHeader>
                            <CardContent className="px-6 pb-6 space-y-3">
                                {isRunning && (!data?.seo?.issues || data.seo.issues.length === 0) ? (
                                    <div className="py-8 text-center space-y-3">
                                        <Activity className="w-6 h-6 text-primary animate-bounce mx-auto" />
                                        <p className="text-xs text-muted-foreground animate-pulse">Running PageSpeed & Lighthouse SEO checks in backend...</p>
                                        <p className="text-[11px] text-muted-foreground/70">Audit recommendations will appear automatically here once loaded.</p>
                                    </div>
                                ) : data?.seo?.issues && data.seo.issues.length > 0 ? (
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
