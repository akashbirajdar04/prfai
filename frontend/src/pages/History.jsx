import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Calendar, Globe, ArrowRight, Search } from 'lucide-react';
import analysisService from '../services/analysisService';

const History = () => {
    const [sessions, setSessions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await analysisService.getAllSessions();
                const formatted = response.data.map(s => ({
                    id: s._id,
                    url: s.targetUrl,
                    date: new Date(s.createdAt).toLocaleDateString(),
                    status: s.status,
                    score: s.metrics?.performance?.score || 0
                }));
                setSessions(formatted);
            } catch (error) {
                console.error("Failed to fetch history", error);
            }
        };
        fetchHistory();
    }, []);

    const filteredSessions = sessions.filter(session =>
        session.url.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        Analysis History
                    </h1>
                    <p className="text-slate-400 mt-1">
                        View details from your past performance audits.
                    </p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search URL..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card hoverEffect={false}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400 border-collapse">
                        <thead className="bg-white/5 text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] border-b border-slate-800/60">
                            <tr>
                                <th className="px-8 py-5">Target Endpoint</th>
                                <th className="px-8 py-5">Date Analyzed</th>
                                <th className="px-8 py-5">System Status</th>
                                <th className="px-8 py-5 text-center">Perf Index</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {filteredSessions.map((session) => (
                                <tr key={session.id} className="hover:bg-white/5 transition-all duration-300 group">
                                    <td className="px-8 py-5 font-black text-slate-100 uppercase text-xs tracking-widest group-hover:text-indigo-400 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Globe className="w-4 h-4 text-slate-600 group-hover:text-indigo-500 transition-colors" />
                                            {session.url}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 font-bold text-[10px] uppercase text-slate-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {session.date}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex">
                                            <Badge variant={session.status === 'completed' ? 'success' : 'danger'} className="uppercase text-[10px] font-black tracking-widest px-3 py-1">
                                                {session.status}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        {session.score > 0 ? (
                                            <span className={`text-xl font-black tabular-nums ${session.score >= 90 ? 'text-green-400' :
                                                session.score >= 50 ? 'text-amber-400' : 'text-red-400'
                                                }`}>
                                                {session.score}
                                            </span>
                                        ) : <span className="text-slate-700 font-black">---</span>}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <Button size="sm" variant="ghost" className="rounded-full text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 font-bold uppercase text-[10px] tracking-widest py-2 px-4" onClick={() => navigate(`/analysis/${session.id}`)}>
                                            Explore <ArrowRight className="w-3.5 h-3.5 ml-2" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredSessions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-24 text-center text-slate-500 font-bold uppercase text-xs tracking-widest italic">
                                        No metrics found matching your query.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default History;
