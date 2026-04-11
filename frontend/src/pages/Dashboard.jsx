import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/dashboard/MetricCard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Activity, Globe, Database, Search, ArrowRight, Zap } from 'lucide-react';
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
                    analysisService.getDashboardStats(),
                    analysisService.getRecentSessions()
                ]);

                setStats(statsRes.data);

                // Format recent sessions for the activity feed
                const formattedSessions = historyRes.data.map(s => ({
                    id: s._id,
                    url: s.targetUrl,
                    date: new Date(s.createdAt).toLocaleDateString(),
                    status: s.status,
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
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 mb-1">Welcome back, {user?.name || 'Developer'}</h1>
                    <p className="text-slate-400">Here's what's happening with your projects.</p>
                </div>
                <Button onClick={() => navigate('/analysis/new')} className="gap-2">
                    <Zap className="w-4 h-4" />
                    New Analysis
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
                <MetricCard
                    title="Total Analyses"
                    value={stats?.totalAnalyses || 0}
                    change="+2 this week"
                    trend="up"
                    icon={Search}
                    description="Success Rate: 100%"
                />
                <MetricCard
                    title="Avg Performance"
                    value={stats?.avgPerformance || 0}
                    change="+5%"
                    trend="up"
                    icon={Activity}
                    description="P95 LCP: 2.1s"
                />
                <MetricCard
                    title="Avg SEO Score"
                    value={stats?.avgSeo || 0}
                    change="-2%"
                    trend="down"
                    icon={Globe}
                    description="8 Critical Issues Found"
                />
                <MetricCard
                    title="Avg API Latency"
                    value={stats?.avgLatency || '0ms'}
                    description="Global median across all endpoints"
                    icon={Database}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                <Card className="lg:col-span-2 flex flex-col" hoverEffect={false}>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Activity Teardown</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/history')} className="text-indigo-400 hover:bg-indigo-500/10">
                            System History <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0 flex-grow">
                        <div className="divide-y divide-slate-800/60">
                            {recentSessions.map((session) => (
                                <div key={session.id} className="px-8 py-5 flex items-center justify-between hover:bg-white/5 transition-all duration-300 group">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-3 h-3 rounded-full shadow-lg ${session.status === 'completed' ? 'bg-green-500 shadow-green-500/20' : 'bg-red-500 shadow-red-500/20'}`}></div>
                                        <div>
                                            <p className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors uppercase text-xs tracking-widest">{session.url}</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{session.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black block mb-1">Index</span>
                                            <span className={`text-xl font-black tabular-nums ${session.score >= 90 ? 'text-green-400' : session.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                                                {session.score}
                                            </span>
                                        </div>
                                        <Button variant="ghost" className="rounded-full w-10 h-10 p-0 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all" onClick={() => navigate(`/analysis/${session.id}`)}>
                                            <ArrowRight className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {recentSessions.length === 0 && (
                                <div className="p-16 text-center text-slate-500 italic flex flex-col items-center">
                                    <Activity className="w-12 h-12 mb-4 opacity-10" />
                                    No recent analyses found.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/20">
                    <CardHeader>
                        <CardTitle>Quick Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                                <h4 className="font-medium text-indigo-300 text-sm mb-1">Optimize Images</h4>
                                <p className="text-xs text-slate-400">Use WebP format to reduce load times by up to 30%.</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                                <h4 className="font-medium text-indigo-300 text-sm mb-1">Cache API Responses</h4>
                                <p className="text-xs text-slate-400">Implement Redis caching for static endpoints.</p>
                            </div>
                            <Button className="w-full mt-2" variant="outline">
                                Read Docs
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
