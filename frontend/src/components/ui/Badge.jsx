import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const variants = {
    default: 'bg-slate-800 text-slate-300',
    success: 'bg-green-900/30 text-green-400 border border-green-900/50',
    warning: 'bg-amber-900/30 text-amber-400 border border-amber-900/50',
    danger: 'bg-red-900/30 text-red-400 border border-red-900/50',
    info: 'bg-blue-900/30 text-blue-400 border border-blue-900/50',
};

export function Badge({ variant = 'default', className, children, ...props }) {
    return (
        <span
            className={twMerge(
                clsx(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors',
                    variants[variant],
                    className
                )
            )}
            {...props}
        >
            {children}
        </span>
    );
}
