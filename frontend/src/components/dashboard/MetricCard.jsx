import { Card, CardContent } from '../ui/Card';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

const MetricCard = ({ title, value, change, trend = 'neutral', icon: Icon = Activity, description }) => {
    const isPositive = trend === 'up';
    const isNegative = trend === 'down';

    return (
        <Card className="h-full flex flex-col justify-between" hoverEffect={true}>
            <CardContent className="flex flex-col h-full space-y-4">
                <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-inner">
                        <Icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    {change && (
                        <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${isPositive
                                ? 'text-green-400 bg-green-500/10 border border-green-500/20'
                                : isNegative
                                    ? 'text-red-400 bg-red-500/10 border border-red-500/20'
                                    : 'text-slate-400 bg-slate-800'
                            }`}>
                            {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                            {change}
                        </div>
                    )}
                </div>

                <div className="space-y-1 flex-grow">
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</h3>
                    <div className="text-3xl font-black text-slate-100 tabular-nums tracking-tight">
                        {value}
                    </div>
                </div>

                {description && (
                    <div className="pt-3 border-t border-slate-800/40">
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider leading-tight">
                            {description}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default MetricCard;
