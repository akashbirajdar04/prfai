import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import MetricCard from '../components/dashboard/MetricCard';
import ApiTable from '../components/analysis/ApiTable';
import RecommendationCard from '../components/analysis/RecommendationCard';
import { Button } from '../components/ui/Button';
import { Zap, Globe, Database, Brain, Download, Share2, Activity, Server } from 'lucide-react';
import analysisService from '../services/analysisService';

const AnalysisResult = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('performance');
    const [data, setData] = useState(null);
    const [showDashboard, setShowDashboard] = useState(false);
    const [loadingStage, setLoadingStage] = useState(0); // 0: Start, 1: Lighthouse Done


    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await analysisService.getSessionDetails(id);

                // Always update data to show URL and basic info even if running
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
                    setLoadingStage(1); // Final AI Done
                } else if (currentData.status === 'waiting_for_telemetry') {
                    setLoadingStage(1); // Lighthouse Done, now waiting for data
                    // Keep polling to see incoming telemetry count
                    setTimeout(fetchData, 3000);
                } else if (currentData.status === 'failed') {
                    setError('Analysis failed.');
                } else {
                    // Still running initial LH, poll again
                    setTimeout(fetchData, 2000);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load analysis.');
            }
        };

        fetchData();
    }, [id]);

    const handleGenerateAI = async () => {
        try {
            await analysisService.generateAI(id);
            // Reload page or force refresh status
            window.location.reload();
        } catch (e) {
            alert("Failed to start AI generation");
        }
    };

    if (error) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Analysis Failed</h2>
            <p className="text-slate-400 max-w-md mb-6">{error}</p>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg text-left text-sm max-w-lg mb-8">
                <p className="text-slate-500 mb-2 font-mono">DEBUG INFO:</p>
                <p className="text-red-400 font-mono break-all">{data?.error?.message || 'Unknown error occurred during processing.'}</p>
            </div>
            <Button onClick={() => window.location.href = '/analysis/new'} variant="outline">
                Try Another URL
            </Button>
            <p className="mt-4 text-xs text-slate-500">
                Tip: Ensure the URL is accessible from the public internet and not a local development server like localhost.
            </p>
        </div>
    );

    // Loading / Summary View
    if (!showDashboard) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background Ambient */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] -z-10" />

                <div className="max-w-4xl w-full space-y-12">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            {loadingStage === 1 ? 'Lighthouse Audit Complete' : 'Analyzing Your Page'}
                        </h1>
                        <p className="text-slate-400 text-lg">
                            {data?.targetUrl || 'Submitting URL...'}
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                        {/* Circular Loader */}
                        <div className="relative">
                            <div className={`w-48 h-48 rounded-full border-4 flex items-center justify-center relative ${loadingStage === 1 ? 'border-green-500/20' : 'border-indigo-500/20'}`}>
                                {loadingStage === 0 && (
                                    <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent rounded-full animate-spin" />
                                )}
                                {loadingStage === 1 && (
                                    <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-ping opacity-20" />
                                )}

                                <div className="text-center">
                                    <h3 className={`text-4xl font-bold ${loadingStage === 1 ? 'text-green-400' : 'text-indigo-400'}`}>
                                        {loadingStage === 1 ? data?.performance?.score || 0 : '...'}
                                    </h3>
                                    <p className="text-xs uppercase tracking-wider text-slate-500 mt-1">
                                        Performance<br />Score
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                            {/* Core Web Vitals */}
                            <MetricPlaceholder label="LCP" value={data?.performance?.lcp} loading={loadingStage === 0} delay={0} />
                            <MetricPlaceholder label="CLS" value={data?.performance?.cls} loading={loadingStage === 0} delay={100} />
                            <MetricPlaceholder label="INP" value={data?.performance?.inp} loading={loadingStage === 0} delay={200} />
                            <MetricPlaceholder label="TTFB" value={data?.performance?.ttfb} loading={loadingStage === 0} delay={300} />

                            {/* Other Metrics */}
                            <MetricPlaceholder label="FCP" value={data?.performance?.fcp || '---'} loading={loadingStage === 0} delay={400} />
                            <MetricPlaceholder label="SI" value={data?.performance?.si || '---'} loading={loadingStage === 0} delay={500} />
                            <MetricPlaceholder label="TBT" value={data?.performance?.tbt || '---'} loading={loadingStage === 0} delay={600} />
                        </div>
                    </div>

                    {/* Action */}
                    <div className="flex justify-center h-16">
                        {loadingStage === 1 ? (
                            <Button
                                onClick={() => setShowDashboard(true)}
                                size="lg"
                                className="animate-fade-in-up px-12 h-14 text-lg rounded-full shadow-xl shadow-indigo-500/20 hover:scale-105 transition-transform"
                            >
                                View Full Report <Activity className="ml-2 w-5 h-5" />
                            </Button>
                        ) : (
                            <div className="flex items-center gap-3 text-slate-500 animate-pulse">
                                <Activity className="w-5 h-5 animate-bounce" />
                                <span>Gathering Telemetry...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const isWaitingForTelemetry = data?.status === 'waiting_for_telemetry';

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        Analysis Report
                    </h1>
                    <p className="text-slate-400 mt-1">
                        {data.targetUrl || data.url || 'No URL info'} • <span className="text-slate-500">{new Date(data.createdAt || Date.now()).toLocaleDateString()}</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2">
                        <Share2 className="w-4 h-4" /> Share
                    </Button>
                    <Button variant="primary" className="gap-2">
                        <Download className="w-4 h-4" /> Export PDF
                    </Button>
                </div>
            </div>

            {/* SDK Integration Guide - Only if waiting for telemetry */}
            {isWaitingForTelemetry && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-8 shadow-2xl shadow-indigo-500/5">
                    <div className="bg-indigo-600/10 px-6 py-4 flex items-center justify-between border-b border-slate-800">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-400" />
                            <h2 className="text-xl font-bold text-slate-100">Complete Calibration</h2>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                            WAITING FOR TELEMETRY
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Goal</h3>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    Capture real-world traffic data (latency, status codes, and errors) to generate deep AI recommendations for your backend services.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-indigo-400 font-bold text-sm">1</div>
                                    <div className="flex-1">
                                        <h4 className="text-slate-200 font-medium mb-1">Install the SDK</h4>
                                        <div className="bg-black/40 p-3 rounded-lg border border-slate-800 font-mono text-sm group flex justify-between items-center">
                                            <code className="text-indigo-300">npm install ai-perf-sdk@latest</code>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-indigo-400 font-bold text-sm">2</div>
                                    <div className="flex-1">
                                        <h4 className="text-slate-200 font-medium mb-1">Initialize at Entry Point</h4>
                                        <p className="text-slate-500 text-xs mb-3">Paste this at the VERY TOP of your `index.js` or `app.js` file before any other imports.</p>
                                        <div className="bg-black/40 p-4 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 relative group">
                                            <pre className="overflow-x-auto">
                                                {`import { startSDK, shutdownSDK } from 'ai-perf-sdk';

startSDK({
  serviceName: 'user-service',
  endpoint: 'https://prfeai-backend.onrender.com/api/telemetry',
  headers: {
    'x-session-id': '${id}'
  }
});

const shutdown = async () => {
    console.log("[SDK-INIT] Cleaning up...");
    await shutdownSDK();
    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-indigo-400 font-bold text-sm">3</div>
                                    <div className="flex-1">
                                        <h4 className="text-slate-200 font-medium mb-1">Verify Activity</h4>
                                        <p className="text-slate-500 text-xs">Refresh your website and navigate around. You should see "Captured APIs" increase below.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-6 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Live Status</h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${data?.metrics?.api?.length > 0 ? 'bg-green-500 animate-pulse outline outline-offset-2 outline-green-500/20' : 'bg-slate-700'}`}></span>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{data?.metrics?.api?.length > 0 ? 'Data Receiving' : 'No Data Yet'}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800/50 text-center">
                                        <div className="text-2xl font-bold text-slate-100">{data?.metrics?.api?.length || 0}</div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">Captured Routes</div>
                                    </div>
                                    <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800/50 text-center">
                                        <div className="text-2xl font-bold text-slate-100">{loadingStage === 1 ? '100%' : '0%'}</div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">LH Completion</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-8">
                                {data?.metrics?.api?.length > 0 ? (
                                    <Button
                                        onClick={handleGenerateAI}
                                        className="w-full bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-500/20 py-8 text-lg rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-all group"
                                    >
                                        <Brain className="w-6 h-6 animate-pulse group-hover:rotate-12 transition-transform" />
                                        Generate Final AI Insights
                                    </Button>
                                ) : (
                                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-center">
                                        <p className="text-xs text-slate-500 italic">Generate insights once telemetry data is captured.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Tabs */}
            <div className="flex border-b border-slate-800">
                {['performance', 'seo', 'backend', 'ai'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-medium text-sm transition-all relative ${activeTab === tab
                            ? 'text-indigo-400'
                            : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        <span className="capitalize">{tab === 'ai' ? 'AI Insights' : tab}</span>
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="animate-fade-in">
                {activeTab === 'performance' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 auto-rows-fr">
                            <MetricCard title="Performance Score" value={data.performance.score} trend="neutral" icon={Zap} description="Composite Weight" />
                            <MetricCard title="LCP" value={data.performance.lcp} trend={parseFloat(data.performance.lcp) > 2.5 ? 'down' : 'up'} icon={Activity} description="Paint Benchmark" />
                            <MetricCard title="CLS" value={data.performance.cls} trend={parseFloat(data.performance.cls) > 0.1 ? 'down' : 'up'} icon={Activity} description="Visual Stability" />
                            <MetricCard title="TTFB" value={data.performance.ttfb} description="Endpoint Response" icon={Server} />
                        </div>
                        <Card>
                            <CardHeader><CardTitle>Core Web Vitals</CardTitle></CardHeader>
                            <CardContent>
                                <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
                                    Chart Placeholder (Integrate Recharts/Chart.js here)
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'seo' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <MetricCard title="SEO Score" value={data.seo.score} icon={Globe} trend="up" />
                            <Card className="h-full">
                                <CardHeader><CardTitle>Issues Found</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {data.seo.issues.map((issue, idx) => (
                                        <RecommendationCard
                                            key={idx}
                                            title={issue.title}
                                            description={issue.description}
                                            severity={issue.severity}
                                            category="SEO"
                                        />
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'backend' && (
                    <div className="space-y-6">
                        <ApiTable data={data.api} />
                    </div>
                )}

                {activeTab === 'ai' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-full">
                            <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 p-6 rounded-xl border border-indigo-500/20">
                                <h3 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
                                    <Brain className="w-6 h-6 text-purple-400" />
                                    AI Executive Summary
                                </h3>
                                <p className="text-slate-300 leading-relaxed">
                                    {data.ai && data.ai.length > 0
                                        ? "Detailed AI breakdown of your system performance is available below. Focus on the High Severity findings for immediate impact."
                                        : "Automated analysis in progress. Once telemetry data is captured and Lighthouse audit completes, real insights will appear here."}
                                </p>
                            </div>
                        </div>
                        {data.ai && data.ai.length > 0 ? (
                            data.ai.map((insight, idx) => (
                                <RecommendationCard
                                    key={idx}
                                    {...insight}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-800 rounded-xl">
                                <Activity className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                <p className="text-slate-500">No deep AI insights found for this session yet.</p>
                                <Button
                                    onClick={handleGenerateAI}
                                    variant="outline"
                                    size="sm"
                                    className="mt-4"
                                >
                                    Force Regenerate
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const MetricPlaceholder = ({ label, value, loading, delay }) => (
    <div
        className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center min-w-[100px] transition-all duration-500"
        style={{ animationDelay: `${delay}ms` }}
    >
        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</span>
        {loading ? (
            <div className="h-6 w-16 bg-slate-800 rounded animate-pulse" />
        ) : (
            <span className="text-xl font-mono font-bold text-slate-200 animate-fade-in">{value || '--'}</span>
        )}
    </div>
);

export default AnalysisResult;
