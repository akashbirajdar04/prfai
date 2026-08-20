import * as React from "react";
import { cn } from "../../lib/utils";

const TabsContext = React.createContext({
    value: "",
    onValueChange: () => { },
});

const Tabs = ({ value: selectedValue, defaultValue, onValueChange, children, className }) => {
    const [currentValue, setCurrentValue] = React.useState(selectedValue || defaultValue || "");

    React.useEffect(() => {
        if (selectedValue !== undefined) {
            setCurrentValue(selectedValue);
        }
    }, [selectedValue]);

    const handleValueChange = (val) => {
        setCurrentValue(val);
        if (onValueChange) onValueChange(val);
    };

    return (
        <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
            <div className={cn("space-y-4", className)}>{children}</div>
        </TabsContext.Provider>
    );
};

const TabsList = ({ className, children }) => {
    return (
        <div className={cn("inline-flex h-10 items-center justify-center rounded-lg bg-muted/60 p-1 text-muted-foreground border border-border/40", className)}>
            {children}
        </div>
    );
};

const TabsTrigger = ({ value, className, children }) => {
    const context = React.useContext(TabsContext);
    const isSelected = context.value === value;

    return (
        <button
            type="button"
            onClick={() => context.onValueChange(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3.5 py-1.5 text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
                isSelected
                    ? "bg-card text-foreground shadow-xs border border-border/50 font-semibold"
                    : "hover:text-foreground hover:bg-background/30",
                className
            )}
        >
            {children}
        </button>
    );
};

const TabsContent = ({ value, className, children }) => {
    const context = React.useContext(TabsContext);
    if (context.value !== value) return null;

    return (
        <div className={cn("ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring animate-in fade-in-50 duration-200", className)}>
            {children}
        </div>
    );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
