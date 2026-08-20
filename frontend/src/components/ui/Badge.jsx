import * as React from "react";
import { cn } from "../../lib/utils";

const badgeVariants = {
    default: "border-transparent bg-primary/15 text-primary border border-primary/20",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive/15 text-rose-400 border border-destructive/30",
    outline: "text-foreground border border-border/80",
    success: "border-transparent bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    warning: "border-transparent bg-amber-500/10 text-amber-400 border border-amber-500/20",
    danger: "border-transparent bg-rose-500/10 text-rose-400 border border-rose-500/20",
    info: "border-transparent bg-sky-500/10 text-sky-400 border border-sky-500/20",
};

function Badge({ className, variant = "default", ...props }) {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                badgeVariants[variant] || badgeVariants.default,
                className
            )}
            {...props}
        />
    );
}

export { Badge };
export default Badge;
