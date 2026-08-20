import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Calendar, Globe, ArrowRight, Search, Activity, Clock } from 'lucide-react';
import analysisService from '../services/analysisService';

const History = () => {
    const [sessions, setSessions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
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
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const filteredSessions = sessions.filter(session =>
        session.url.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2 border-b border-border/40">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Analysis History
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        View results and historical telemetry from previous performance audits.
                    </p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by URL..."
                        className="pl-9 h-9 text-xs"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card hoverEffect={false} className="overflow-hidden border-border/70 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-foreground border-collapse">
                        <thead className="bg-muted/40 text-muted-foreground font-semibold text-xs border-b border-border/40">
                            <tr>
                                <th className="px-6 py-3.5">Target Endpoint</th>
                                <th className="px-6 py-3.5">Date Analyzed</th>
                                <th className="px-6 py-3.5">Status</th>
                                <th className="px-6 py-3.5 text-center">Perf Index</th>
                                <th className="px-6 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {filteredSessions.map((session) => (
                                <tr key={session.id} className="hover:bg-accent/40 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                                        <div className="flex items-center gap-2.5">
                                            <Globe className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                                            <span className="truncate max-w-xs">{session.url}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                                            {session.date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={session.status === 'completed' ? 'success' : 'danger'}>
                                            {session.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {session.score > 0 ? (
                                            <span className={`text-base font-bold tabular-nums ${session.score >= 90 ? 'text-emerald-400' :
                                                session.score >= 50 ? 'text-amber-400' : 'text-rose-400'
                                                }`}>
                                                {session.score}
                                            </span>
                                        ) : <span className="text-muted-foreground text-xs">N/A</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button size="sm" variant="ghost" className="text-xs text-primary gap-1 font-medium" onClick={() => navigate(`/analysis/${session.id}`)}>
                                            Explore <ArrowRight className="w-3.5 h-3.5" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredSessions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center text-muted-foreground text-xs italic">
                                        {loading ? "Loading history..." : "No analysis metrics found matching your query."}
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
