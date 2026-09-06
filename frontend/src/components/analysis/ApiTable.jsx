import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Button } from '../ui/Button';
import { Code, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

const ApiTable = ({ data = [], sessionId = '' }) => {
    const [showGuide, setShowGuide] = useState(false);
    const [syntax, setSyntax] = useState('cjs');
    const [copied, setCopied] = useState(false);

    const cjsCode = `const { startSDK } = require('ai-perf-sdk');

startSDK({
  serviceName: 'backend-api',
  endpoint: 'https://prfeai-backend.onrender.com/api/telemetry'${sessionId ? `,\n  headers: { 'x-session-id': '${sessionId}' }` : ''}
});`;

    const esmCode = `import { startSDK } from 'ai-perf-sdk';

startSDK({
  serviceName: 'backend-api',
  endpoint: 'https://prfeai-backend.onrender.com/api/telemetry'${sessionId ? `,\n  headers: { 'x-session-id': '${sessionId}' }` : ''}
});`;

    const activeCode = syntax === 'cjs' ? cjsCode : esmCode;

    return (
        <div className="space-y-4">
            <Card className="overflow-hidden border-border/70 shadow-sm">
                <CardHeader className="py-4 px-6 flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-semibold">Backend API Telemetry</CardTitle>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs gap-1.5"
                        onClick={() => setShowGuide(!showGuide)}
                    >
                        <Code className="w-3.5 h-3.5 text-primary" />
                        {showGuide ? 'Hide SDK Setup' : 'SDK Import Instructions'}
                        {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </Button>
                </CardHeader>

                {showGuide && (
                    <div className="bg-muted/20 border-y border-border/40 p-4 space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground">How to Import & Initialize `ai-perf-sdk`:</span>
                            <div className="flex bg-muted/60 p-0.5 rounded border border-border/40 font-mono text-[11px]">
                                <button 
                                    type="button"
                                    onClick={() => setSyntax('cjs')}
                                    className={`px-2 py-0.5 rounded transition-colors ${syntax === 'cjs' ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    CommonJS (require)
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setSyntax('esm')}
                                    className={`px-2 py-0.5 rounded transition-colors ${syntax === 'esm' ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    ES Modules (import)
                                </button>
                            </div>
                        </div>

                        <div className="p-3 bg-background/90 rounded-lg border border-border/60 font-mono text-muted-foreground flex justify-between items-center text-[11px]">
                            <code>npm install ai-perf-sdk@latest</code>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2 text-[10px]"
                                onClick={() => navigator.clipboard.writeText('npm install ai-perf-sdk@latest')}
                            >
                                Copy Install
                            </Button>
                        </div>

                        <div className="relative p-3 bg-background/90 rounded-lg border border-border/60 font-mono overflow-x-auto text-[11px]">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2 h-6 px-2 text-[10px] bg-muted/40 hover:bg-muted"
                                onClick={() => {
                                    navigator.clipboard.writeText(activeCode);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                            >
                                {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-400 mr-1" /> : null}
                                {copied ? 'Copied!' : 'Copy Code'}
                            </Button>
                            <pre className="text-muted-foreground pt-3">{activeCode}</pre>
                        </div>
                    </div>
                )}

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
        </div>
    );
};

export default ApiTable;
