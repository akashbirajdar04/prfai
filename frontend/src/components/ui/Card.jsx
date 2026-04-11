import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function Card({ className, children, hoverEffect = true, ...props }) {
    return (
        <div
            className={twMerge(
                clsx(
                    "bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl transition-all duration-300",
                    hoverEffect && "hover:border-indigo-500/40 hover:shadow-indigo-500/5",
                    className
                )
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }) {
    return (
        <div className={twMerge(clsx("px-8 py-5 border-b border-slate-800/60 bg-white/5", className))} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children, ...props }) {
    return (
        <h3 className={twMerge(clsx("text-lg font-bold text-slate-100 tracking-tight", className))} {...props}>
            {children}
        </h3>
    );
}

export function CardContent({ className, children, ...props }) {
    return (
        <div className={twMerge(clsx("p-8", className))} {...props}>
            {children}
        </div>
    );
}
