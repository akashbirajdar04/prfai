import { Card, CardContent } from '../ui/Card';
import { Sparkles, CheckCircle2, AlertTriangle, AlertOctagon, Code } from 'lucide-react';
import { Badge } from '../ui/Badge';

const severityIcons = {
    low: <CheckCircle2 className="w-4 h-4 text-sky-400" />,
    medium: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    high: <AlertOctagon className="w-4 h-4 text-rose-400" />,
    critical: <AlertOctagon className="w-4 h-4 text-rose-500" />,
};

const severityBadges = {
    low: 'info',
    medium: 'warning',
    high: 'danger',
    critical: 'danger'
};

const RecommendationCard = ({
    title,
    description,
    severity = 'medium',
    category = 'General',
    suggestedFix
}) => {
    return (
        <Card hoverEffect={true} className="p-5 border-border/70">
            <div className="flex items-start gap-4">
                <div className="mt-0.5 p-2 rounded-lg bg-background/80 border border-border/50 flex-shrink-0">
                    {severityIcons[severity]}
                </div>
                <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={severityBadges[severity]} className="capitalize text-[11px]">
                            {severity} priority
                        </Badge>
                        <Badge variant="outline" className="text-[11px]">
                            {category}
                        </Badge>
                        <h4 className="font-semibold text-sm text-foreground ml-1">{title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                        {description}
                    </p>
                    {suggestedFix && (
                        <div className="mt-3 bg-muted/40 rounded-lg p-3.5 text-xs text-foreground border border-border/60 font-mono space-y-1">
                            <div className="flex items-center gap-1.5 text-[11px] font-sans font-medium text-primary mb-1">
                                <Sparkles className="w-3.5 h-3.5" />
                                AI Suggested Code Fix
                            </div>
                            <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                {suggestedFix}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default RecommendationCard;
