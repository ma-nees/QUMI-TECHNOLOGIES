import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "button" | "pill";
}

export function ThemeToggle({ className, variant = "button" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-border/60 bg-surface/50 opacity-0",
          className
        )}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={cn(
          "relative flex items-center justify-between gap-2 rounded-full border border-border/80 bg-surface/80 px-3 py-1.5 text-xs font-semibold text-foreground shadow-2xs backdrop-blur-md transition-all duration-200 hover:bg-surface hover:border-primary/50 cursor-pointer",
          className
        )}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      >
        <span className="flex items-center gap-1.5">
          {isDark ? (
            <Moon size={15} weight="fill" className="text-primary animate-in spin-in-180 duration-200" />
          ) : (
            <Sun size={15} weight="fill" className="text-highlight animate-in spin-in-180 duration-200" />
          )}
          <span>{isDark ? "Dark mode" : "Light mode"}</span>
        </span>
        <span className="h-2 w-2 rounded-full bg-primary" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "group relative inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-border/80 bg-surface/60 text-foreground shadow-2xs backdrop-blur-md transition-all duration-200 hover:border-primary/50 hover:bg-surface hover:text-primary active:scale-95 cursor-pointer",
        className
      )}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <Sun
          size={18}
          weight="fill"
          className="text-highlight transition-transform duration-200 group-hover:rotate-45"
        />
      ) : (
        <Moon
          size={18}
          weight="duotone"
          className="text-foreground transition-transform duration-200 group-hover:-rotate-12 group-hover:text-primary"
        />
      )}
    </button>
  );
}
