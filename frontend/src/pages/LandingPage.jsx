import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { ArrowRight, Zap, Globe, Server, Cpu, Activity, ShieldCheck, Gauge, Layers } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/25">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                            <Activity className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            PerafAI
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/login">
                            <Button variant="ghost" size="sm">
                                Log in
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button size="sm" className="rounded-full shadow-sm">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-primary/15 rounded-full blur-[140px] -z-10 animate-pulse-glow" />

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        AI-Powered Full-Stack Performance Analysis
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent max-w-4xl mx-auto leading-tight">
                        Analyze Web Performance <br />
                        <span className="text-primary">Beyond the Surface</span>
                    </h1>

                    <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                        Stop guessing why your site is slow. Get end-to-end insights combining Lighthouse metrics, backend API telemetry, and AI-driven code optimizations.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register">
                            <Button size="lg" className="rounded-full text-sm shadow-lg shadow-primary/20 gap-2">
                                Start Free Analysis <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="outline" size="lg" className="rounded-full text-sm">
                                View Live Dashboard
                            </Button>
                        </Link>
                    </div>

                    {/* Hero Preview Card */}
                    <div className="mt-16 relative mx-auto max-w-5xl">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-2xl blur-lg opacity-40"></div>
                        <Card className="relative rounded-2xl overflow-hidden border border-border/80 shadow-2xl bg-card/80 backdrop-blur-xl">
                            <div className="p-4 border-b border-border/40 bg-muted/30 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                                </div>
                                <div className="mx-auto text-xs text-muted-foreground font-mono bg-background/60 px-4 py-1 rounded-md border border-border/30">
                                    https://perafai-analyzer.app/dashboard
                                </div>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                                <div className="p-4 rounded-xl bg-background/40 border border-border/40">
                                    <div className="text-xs text-muted-foreground mb-1 font-medium">Core Web Vitals</div>
                                    <div className="text-2xl font-bold text-emerald-400">98 / 100</div>
                                    <p className="text-[11px] text-muted-foreground mt-1">LCP: 1.2s • CLS: 0.01</p>
                                </div>
                                <div className="p-4 rounded-xl bg-background/40 border border-border/40">
                                    <div className="text-xs text-muted-foreground mb-1 font-medium">Backend Latency</div>
                                    <div className="text-2xl font-bold text-primary">42ms</div>
                                    <p className="text-[11px] text-muted-foreground mt-1">P95: 85ms • 100% Success</p>
                                </div>
                                <div className="p-4 rounded-xl bg-background/40 border border-border/40">
                                    <div className="text-xs text-muted-foreground mb-1 font-medium">AI Recommendations</div>
                                    <div className="text-2xl font-bold text-amber-400">3 Insights</div>
                                    <p className="text-[11px] text-muted-foreground mt-1">1 High • 2 Medium fix</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-20 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">Complete Visibility Across Your Stack</h2>
                        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
                            Frontend lighthouse auditing paired with real backend API latency tracing.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<Globe className="w-5 h-5 text-cyan-400" />}
                            title="Lighthouse Audits"
                            description="Automated Google Lighthouse runs measuring Core Web Vitals, performance bottlenecks, and SEO issues."
                        />
                        <FeatureCard
                            icon={<Server className="w-5 h-5 text-indigo-400" />}
                            title="Backend Telemetry"
                            description="Identify slow database queries, microservice latency, and endpoint bottlenecks affecting TTFB."
                        />
                        <FeatureCard
                            icon={<Cpu className="w-5 h-5 text-purple-400" />}
                            title="AI Optimization Engine"
                            description="Get contextual code refactoring suggestions and server configuration fixes generated instantly."
                        />
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section id="how-it-works" className="py-20 border-t border-border/40 bg-muted/20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Optimization in 3 Simple Steps</h2>
                            <div className="space-y-6">
                                <Step
                                    number="01"
                                    title="Connect Your Target URL"
                                    description="Enter any website or API URL. Optionally add backend telemetry headers for deep tracing."
                                />
                                <Step
                                    number="02"
                                    title="Run Automated Diagnostic"
                                    description="Our engine analyzes client-side metrics, audits API response times, and compiles structured telemetry."
                                />
                                <Step
                                    number="03"
                                    title="Apply AI Fixes"
                                    description="Review prioritized recommendations with code snippets and verify improvements in real time."
                                />
                            </div>
                        </div>
                        <div>
                            <Card className="p-6 space-y-4 bg-card/80 border-border/60 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm">Sample AI Suggestion</h4>
                                        <p className="text-xs text-muted-foreground">Detected on /api/analytics endpoint</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg bg-background/80 border border-border/50 font-mono text-xs text-muted-foreground space-y-2">
                                    <div className="text-emerald-400">// Recommended Indexing strategy</div>
                                    <div>CREATE INDEX idx_user_sessions ON sessions(user_id, created_at);</div>
                                    <div className="text-xs text-muted-foreground/70 pt-1">// Reduces DB lookup from 420ms to 12ms</div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 relative overflow-hidden text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-4">Ready to accelerate your site?</h2>
                    <p className="text-muted-foreground text-sm mb-8">
                        Join developers who rely on PerafAI to diagnose web latency and ship faster experiences.
                    </p>
                    <Link to="/register">
                        <Button size="lg" className="rounded-full shadow-lg shadow-primary/25 px-8">
                            Get Started for Free
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/40 py-10 text-muted-foreground text-xs">
                <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-foreground">PerafAI</span>
                        <span>&copy; 2026 PerafAI Inc. All rights reserved.</span>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                        <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                        <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <Card hoverEffect={true} className="p-6">
        <div className="mb-4 inline-flex p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            {icon}
        </div>
        <h3 className="text-base font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </Card>
);

const Step = ({ number, title, description }) => (
    <div className="flex gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary">
            {number}
        </div>
        <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">{title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
    </div>
);

export default LandingPage;
