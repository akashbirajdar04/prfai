import * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = {
    default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98]",
    destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-[0.98]",
    outline: "border border-border/80 bg-background/50 hover:bg-accent hover:text-accent-foreground shadow-xs",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-secondary/50",
    ghost: "hover:bg-accent/80 hover:text-accent-foreground text-muted-foreground",
    link: "text-primary underline-offset-4 hover:underline",
};

const buttonSizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-11 rounded-lg px-6 text-sm font-medium",
    icon: "h-9 w-9 p-0",
};

const Button = React.forwardRef(({
    className,
    variant = "default",
    size = "default",
    loading = false,
    disabled = false,
    children,
    type = "button",
    ...props
}, ref) => {
    // Mapping legacy 'primary' or 'danger' variant names if passed
    const resolvedVariant = variant === "primary" ? "default" : variant === "danger" ? "destructive" : variant;

    return (
        <button
            type={type}
            className={cn(
                "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
                buttonVariants[resolvedVariant] || buttonVariants.default,
                buttonSizes[size] || buttonSizes.default,
                className
            )}
            ref={ref}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
});

Button.displayName = "Button";

export { Button };
export default Button;
