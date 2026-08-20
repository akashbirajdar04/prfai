import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/dashboard/MetricCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Activity, Globe, Database, Search, ArrowRight, Zap, Sparkles, Clock } from 'lucide-react';
import analysisService from '../services/analysisService';
import useAuth from '../hooks/useAuth';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentSessions, setRecentSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, historyRes] = await Promise.all([
                    analysisService.getDashboardStats().catch(err => {
                        console.warn("Stats API unavailable, using default metrics", err);
                        return { data: { totalAnalyses: 0, avgPerformance: 0, avgSeo: 0, avgLatency: '0ms' } };
                    }),
                    analysisService.getRecentSessions().catch(err => {
                        console.warn("History API unavailable, using empty history", err);
                        return { data: [] };
                    })
                ]);

                setStats(statsRes?.data || {
                    totalAnalyses: 0,
                    avgPerformance: 0,
                    avgSeo: 0,
                    avgLatency: '0ms'
                });

                const rawList = Array.isArray(historyRes?.data) ? historyRes.data : (Array.isArray(historyRes?.data?.data) ? historyRes.data.data : []);
                const formattedSessions = rawList.map(s => ({
                    id: s._id || s.id,
                    url: s.targetUrl || s.url || 'Unknown Target',
                    date: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Recent',
                    status: s.status || 'completed',
                    score: s.metrics?.performance?.score || 0
                }));

                setRecentSessions(formattedSessions);

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
                setStats({
                    totalAnalyses: 0,
                    avgPerformance: 0,
                    avgSeo: 0,
                    avgLatency: '0ms'
                });
                setRecentSessions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
                    <p className="text-sm text-muted-foreground">Loading performance overview...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in-50 duration-300">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-border/40">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        Welcome back, <span className="text-primary font-bold">{user?.name || 'Developer'}</span>
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Overview of your web performance metrics and AI teardowns.
                    </p>
                </div>
                <Button onClick={() => navigate('/analysis/new')} className="gap-2 shadow-sm">
                    <Zap className="w-4 h-4" />
                    New Analysis
                </Button>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <MetricCard
                    title="Total Analyses"
                    value={stats?.totalAnalyses || 0}
                    change="+2 this week"
                    trend="up"
                    icon={Search}
                    description="100% completion rate across runs"
                />
                <MetricCard
                    title="Avg Performance"
                    value={stats?.avgPerformance || 0}
                    change="+5%"
                    trend="up"
                    icon={Activity}
                    description="Median Core Web Vitals score"
                />
                <MetricCard
                    title="Avg SEO Score"
                    value={stats?.avgSeo || 0}
                    change="-2%"
                    trend="down"
                    icon={Globe}
                    description="Sub-optimal metadata detected"
                />
                <MetricCard
                    title="Avg API Latency"
                    value={stats?.avgLatency || '0ms'}
                    icon={Database}
                    description="Global TTFB backend latency"
                />
            </div>

            {/* Activity and Quick Tips */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Recent Activity Teardown */}
                <Card className="lg:col-span-2 flex flex-col overflow-hidden" hoverEffect={false}>
                    <CardHeader className="flex flex-row items-center justify-between py-4 px-6">
                        <div>
                            <CardTitle className="text-base font-semibold">Recent Audits</CardTitle>
                            <CardDescription className="text-xs">Latest performance test teardowns</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/history')} className="text-primary text-xs gap-1.5">
                            System History <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/40">
                            {recentSessions.map((session) => (
                                <div key={session.id} className="px-6 py-4 flex items-center justify-between hover:bg-accent/40 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2.5 h-2.5 rounded-full ${session.status === 'completed' ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : 'bg-rose-500 shadow-xs shadow-rose-500/50'}`}></div>
                                        <div>
                                            <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{session.url}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                <Clock className="w-3 h-3 text-muted-foreground/70" />
                                                {session.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <span className="text-[11px] text-muted-foreground font-medium block">Perf Index</span>
                                            <span className={`text-lg font-bold tabular-nums ${session.score >= 90 ? 'text-emerald-400' : session.score >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                                                {session.score}
                                            </span>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={() => navigate(`/analysis/${session.id}`)}>
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {recentSessions.length === 0 && (
                                <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                                    <Activity className="w-8 h-8 mb-3 opacity-20" />
                                    <p className="text-sm font-medium">No recent analyses found.</p>
                                    <p className="text-xs text-muted-foreground/70 mt-1">Run a new analysis to populate metrics.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick AI Tips */}
                <Card className="bg-gradient-to-br from-indigo-950/30 via-card/70 to-card/90 border-primary/20">
                    <CardHeader className="py-4 px-6">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <CardTitle className="text-base font-semibold">AI Insights</CardTitle>
                        </div>
                        <CardDescription className="text-xs">Quick performance optimizations</CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 space-y-3">
                        <div className="bg-background/40 p-3.5 rounded-lg border border-border/50 space-y-1">
                            <div className="flex items-center justify-between">
                                <h5 className="font-medium text-foreground text-xs">Optimize Image Assets</h5>
                                <Badge variant="info" className="text-[10px]">LCP</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">Use WebP/AVIF formats to reduce image bytes by up to 35%.</p>
                        </div>
                        <div className="bg-background/40 p-3.5 rounded-lg border border-border/50 space-y-1">
                            <div className="flex items-center justify-between">
                                <h5 className="font-medium text-foreground text-xs">Enable API Response Caching</h5>
                                <Badge variant="warning" className="text-[10px]">TTFB</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">Add Redis or HTTP Cache-Control headers on static endpoints.</p>
                        </div>
                        <Button className="w-full mt-2 text-xs" variant="outline" size="sm" onClick={() => navigate('/analysis/new')}>
                            Run Full Diagnostics
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
