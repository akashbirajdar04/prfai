import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

const ApiTable = ({ data = [] }) => {
    return (
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle>Backend API Latency</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-900/50 text-slate-200 font-medium uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 text-left">Endpoint</th>
                            <th className="px-6 py-4 text-center">Method</th>
                            <th className="px-6 py-4 text-center">Avg</th>
                            <th className="px-6 py-4 text-center">Best</th>
                            <th className="px-6 py-4 text-center">P95</th>
                            <th className="px-6 py-4 text-center">Hits</th>
                            <th className="px-6 py-4 text-center">Success</th>
                            <th className="px-6 py-4 text-right">Health</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {data.map((row, index) => (
                            <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-200 max-w-[200px] truncate" title={row.endpoint}>
                                    {row.endpoint}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <Badge variant="outline" className="text-[10px] font-bold">{row.method}</Badge>
                                </td>
                                <td className="px-6 py-4 text-center font-mono">{row.avgLatency}ms</td>
                                <td className="px-6 py-4 text-center font-mono text-green-400/80">{row.bestLatency || row.avgLatency}ms</td>
                                <td className="px-6 py-4 text-center font-mono text-orange-400/80">{row.p95}ms</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="text-slate-500 text-xs">{row.hitCount || row.count || 1}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ${(row.successRate || 100) > 95 ? 'bg-green-500' :
                                                        (row.successRate || 100) > 80 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${row.successRate || 100}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-mono">{row.successRate || 100}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Badge variant={row.isSlow ? 'danger' : 'success'}>
                                        {row.isSlow ? 'Slow' : 'Optimal'}
                                    </Badge>
                                </td>
                            </tr>
                        ))}

                        {data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
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
