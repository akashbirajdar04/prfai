import { Card, CardContent } from '../ui/Card';
import { Lightbulb, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { Badge } from '../ui/Badge';

const severityIcons = {
    low: <CheckCircle2 className="w-5 h-5 text-blue-400" />,
    medium: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    high: <AlertOctagon className="w-5 h-5 text-red-400" />,
    critical: <AlertOctagon className="w-5 h-5 text-red-500" />,
};

const severityColors = {
    low: 'bg-blue-900/20 border-blue-900/40',
    medium: 'bg-amber-900/20 border-amber-900/40',
    high: 'bg-red-900/20 border-red-900/40',
    critical: 'bg-red-950/40 border-red-900/60'
};

const RecommendationCard = ({
    title,
    description,
    severity = 'medium',
    category = 'General',
    suggestedFix
}) => {
    return (
        <div className={`rounded-xl border p-5 ${severityColors[severity]} transition-all`}>
            <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0">
                    {severityIcons[severity]}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider opacity-70">
                            {category}
                        </Badge>
                        <h4 className="font-semibold text-slate-200">{title}</h4>
                    </div>
                    <p className="text-slate-400 text-sm mb-3 leading-relaxed whitespace-pre-line">
                        {description}
                    </p>
                    {suggestedFix && (
                        <div className="mt-3 bg-black/20 rounded-lg p-3 text-sm text-slate-300 border border-white/5">
                            <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-indigo-400 uppercase">
                                <Lightbulb className="w-3 h-3" />
                                AI Suggested Fix
                            </div>
                            {suggestedFix}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecommendationCard;
