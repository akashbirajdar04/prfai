import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowRight, Zap, Globe, Server, CheckCircle2, BarChart3, Shield, Cpu } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            PerafAI
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <a href="#features" className="hover:text-slate-100 transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-slate-100 transition-colors">How it works</a>
                        <a href="#pricing" className="hover:text-slate-100 transition-colors">Pricing</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            Log in
                        </Link>
                        <Link to="/register">
                            <Button variant="primary" size="sm" className="rounded-full">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-cyan-600/10 rounded-full blur-[100px] -z-10" />

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-8 animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        Now with AI-powered Backend Analysis
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent max-w-4xl mx-auto leading-tight">
                        Analyze Web Performance <br />
                        <span className="text-indigo-400">Beyond the Surface</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Stop guessing why your site is slow. Get full-stack performance insights combining Lighthouse metrics, backend telemetry, and AI-driven optimization suggestions.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register">
                            <Button size="lg" className="h-14 px-8 rounded-full text-base shadow-indigo-500/25 shadow-xl">
                                Start Free Analysis <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Button variant="secondary" size="lg" className="h-14 px-8 rounded-full text-base border-slate-700 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800">
                            View Live Demo
                        </Button>
                    </div>

                    {/* Hero Image / Dashboard Preview */}
                    <div className="mt-20 relative mx-auto max-w-5xl">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-20"></div>
                        <div className="relative rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl shadow-2xl overflow-hidden aspect-[16/9]">
                            <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                                <p className="text-slate-500 text-sm">Dashboard Preview Image Placeholder</p>
                            </div>
                            {/* 
                  You would typically use an img tag here:
                  <img src="/dashboard-preview.png" alt="Dashboard" className="w-full h-full object-cover" />
                */}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-slate-950 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Visibility</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Most tools only look at the frontend. We trace the request all the way to your database.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Globe className="w-6 h-6 text-cyan-400" />}
                            title="Lighthouse Audits"
                            description="Automated runs of Google Lighthouse to track Core Web Vitals, SEO, and Accessibility scores over time."
                        />
                        <FeatureCard
                            icon={<Server className="w-6 h-6 text-purple-400" />}
                            title="Backend Telemetry"
                            description="Identify slow API endpoints, database bottlenecks, and unoptimized queries affecting TTFB."
                        />
                        <FeatureCard
                            icon={<Cpu className="w-6 h-6 text-indigo-400" />}
                            title="AI Recommendations"
                            description="Get actionable code snippets and config changes generated by AI to fix identified issues instantly."
                        />
                    </div>
                </div>
            </section>

            {/* Social Proof / Trust */}
            <section className="py-20 border-y border-white/5 bg-slate-900/20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">Trusted by developers at</p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholders for logos */}
                        <span className="text-xl font-bold text-slate-300">ACME Corp</span>
                        <span className="text-xl font-bold text-slate-300">GlobalTech</span>
                        <span className="text-xl font-bold text-slate-300">Nebula</span>
                        <span className="text-xl font-bold text-slate-300">Vertex</span>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section id="how-it-works" className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Optimization in 3 Simple Steps</h2>
                            <div className="space-y-8">
                                <Step
                                    number="01"
                                    title="Connect your URL"
                                    description="Simply paste your website URL. Optionally install our tiny SDK for deeper backend insights."
                                />
                                <Step
                                    number="02"
                                    title="Run Analysis"
                                    description="Our engine gathers performance metrics, SEO data, and traces request latency across your stack."
                                />
                                <Step
                                    number="03"
                                    title="Implement Fixes"
                                    description="Review AI-generated suggestions and apply fixes. Verify improvements with a re-run."
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-2xl opacity-20"></div>
                            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                                <div className="space-y-4">
                                    <div className="h-8 w-3/4 bg-slate-800 rounded animate-pulse"></div>
                                    <div className="h-4 w-full bg-slate-800 rounded animate-pulse opacity-60"></div>
                                    <div className="h-4 w-5/6 bg-slate-800 rounded animate-pulse opacity-60"></div>

                                    <div className="mt-8 p-4 bg-black/30 rounded-lg border border-indigo-500/30">
                                        <div className="flex items-center gap-2 text-indigo-400 text-sm font-mono mb-2">
                                            <Zap className="w-4 h-4" /> AI Suggestion
                                        </div>
                                        <div className="h-2 w-full bg-slate-700 rounded mb-2"></div>
                                        <div className="h-2 w-2/3 bg-slate-700 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-900/20"></div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl font-bold mb-6">Ready to speed up your website?</h2>
                    <p className="text-xl text-slate-400 mb-10">
                        Join thousands of developers using PerafAI to build faster, efficient, and user-friendly web experiences.
                    </p>
                    <Link to="/register">
                        <Button size="lg" className="h-16 px-10 rounded-full text-lg shadow-2xl shadow-indigo-500/30">
                            Get Started for Free
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 border-t border-white/5 py-12 text-slate-400 text-sm">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-slate-200">
                            <span className="font-bold text-lg">PerafAI</span>
                        </div>
                        <p>Making the web faster, one site at a time.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-200 mb-4">Product</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-indigo-400">Features</a></li>
                            <li><a href="#" className="hover:text-indigo-400">Pricing</a></li>
                            <li><a href="#" className="hover:text-indigo-400">API</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-200 mb-4">Resources</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-indigo-400">Documentation</a></li>
                            <li><a href="#" className="hover:text-indigo-400">Blog</a></li>
                            <li><a href="#" className="hover:text-indigo-400">Community</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-200 mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-indigo-400">Privacy</a></li>
                            <li><a href="#" className="hover:text-indigo-400">Terms</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center">
                    &copy; 2026 PerafAI Inc. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-colors group">
        <div className="mb-4 inline-flex p-3 rounded-xl bg-slate-800 group-hover:bg-indigo-500/10 group-hover:scale-110 transition-all duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-slate-200">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
);

const Step = ({ number, title, description }) => (
    <div className="flex gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400 border border-slate-700">
            {number}
        </div>
        <div>
            <h4 className="text-lg font-bold text-slate-200 mb-1">{title}</h4>
            <p className="text-slate-400">{description}</p>
        </div>
    </div>
);

export default LandingPage;
