import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, LogOut, Cpu, Activity } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'New Analysis', path: '/analysis/new', icon: PlusCircle },
        { name: 'History', path: '/history', icon: History },
    ];

    return (
        <div className="h-screen w-64 bg-card/60 backdrop-blur-xl border-r border-border/60 flex flex-col fixed left-0 top-0 z-40">
            <div className="p-6 flex items-center gap-3 border-b border-border/30">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                    <Activity className="w-5 h-5" />
                </div>
                <div>
                    <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                        PerafAI
                    </span>
                    <span className="block text-[10px] text-muted-foreground font-medium tracking-wide">Performance AI</span>
                </div>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1.5">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-150 font-medium",
                                active
                                    ? "bg-primary/10 text-primary border border-primary/20 shadow-xs"
                                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("w-4 h-4 transition-colors", active ? "text-primary" : "text-muted-foreground")} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border/40">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-3.5 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer font-medium"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
