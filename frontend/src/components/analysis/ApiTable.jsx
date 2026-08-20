import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';

const ApiTable = ({ data = [] }) => {
    return (
        <Card className="overflow-hidden border-border/70 shadow-sm">
            <CardHeader className="py-4 px-6">
                <CardTitle className="text-base font-semibold">Backend API Telemetry</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-foreground">
                    <thead className="bg-muted/40 text-muted-foreground font-semibold text-xs border-b border-border/40">
                        <tr>
                            <th className="px-6 py-3.5 text-left">Endpoint</th>
                            <th className="px-6 py-3.5 text-center">Method</th>
                            <th className="px-6 py-3.5 text-center">Avg</th>
                            <th className="px-6 py-3.5 text-center">Best</th>
                            <th className="px-6 py-3.5 text-center">P95</th>
                            <th className="px-6 py-3.5 text-center">Hits</th>
                            <th className="px-6 py-3.5 text-center">Success Rate</th>
                            <th className="px-6 py-3.5 text-right">Health</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                        {data.map((row, index) => (
                            <tr key={index} className="hover:bg-accent/40 transition-colors">
                                <td className="px-6 py-3.5 font-mono text-xs font-medium text-foreground max-w-[220px] truncate" title={row.endpoint}>
                                    {row.endpoint}
                                </td>
                                <td className="px-6 py-3.5 text-center">
                                    <Badge variant="outline" className="text-[11px] font-mono font-medium">{row.method}</Badge>
                                </td>
                                <td className="px-6 py-3.5 text-center font-mono text-xs font-semibold">{row.avgLatency}ms</td>
                                <td className="px-6 py-3.5 text-center font-mono text-xs text-emerald-400">{row.bestLatency || row.avgLatency}ms</td>
                                <td className="px-6 py-3.5 text-center font-mono text-xs text-amber-400">{row.p95}ms</td>
                                <td className="px-6 py-3.5 text-center">
                                    <span className="text-muted-foreground text-xs">{row.hitCount || row.count || 1}</span>
                                </td>
                                <td className="px-6 py-3.5 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-16">
                                            <Progress
                                                value={row.successRate || 100}
                                                indicatorClassName={(row.successRate || 100) > 95 ? 'bg-emerald-500' : (row.successRate || 100) > 80 ? 'bg-amber-500' : 'bg-rose-500'}
                                            />
                                        </div>
                                        <span className="text-[10px] font-mono text-muted-foreground">{row.successRate || 100}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-3.5 text-right">
                                    <Badge variant={row.isSlow ? 'danger' : 'success'}>
                                        {row.isSlow ? 'Slow' : 'Optimal'}
                                    </Badge>
                                </td>
                            </tr>
                        ))}

                        {data.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground text-xs italic">
                                    No API telemetry data found for this session.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default ApiTable;
