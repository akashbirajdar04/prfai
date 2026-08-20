import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

const MetricCard = ({ title, value, change, trend = 'neutral', icon: Icon = Activity, description }) => {
    const isPositive = trend === 'up';
    const isNegative = trend === 'down';

    return (
        <Card hoverEffect={true} className="h-full">
            <CardContent className="p-5 flex flex-col h-full justify-between space-y-4">
                <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-primary">
                        <Icon className="w-4 h-4" />
                    </div>
                    {change && (
                        <Badge
                            variant={isPositive ? 'success' : isNegative ? 'danger' : 'secondary'}
                            className="font-medium text-xs gap-1"
                        >
                            {isPositive ? (
                                <ArrowUpRight className="w-3 h-3" />
                            ) : isNegative ? (
                                <ArrowDownRight className="w-3 h-3" />
                            ) : null}
                            {change}
                        </Badge>
                    )}
                </div>

                <div className="space-y-1">
                    <h4 className="text-xs font-medium text-muted-foreground">{title}</h4>
                    <div className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                        {value}
                    </div>
                </div>

                {description && (
                    <div className="pt-2 border-t border-border/40">
                        <p className="text-xs text-muted-foreground/80 leading-relaxed font-normal">
                            {description}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default MetricCard;
