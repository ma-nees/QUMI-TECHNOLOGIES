import { cn } from "@/lib/utils";

export function Logo({
  inverse = false,
  className,
}: {
  inverse?: boolean;
  className?: string;
}) {
  return (
    <span className="inline-flex items-center">
      <img
        src="/logo.png"
        alt="QUMI Technologies"
        width={950}
        height={694}
        className={cn(
          "w-auto max-h-full object-contain transition-all duration-200",
          inverse ? "" : "invert dark:invert-0",
          className
        )}
        fetchPriority="high"
        decoding="async"
      />
    </span>
  );
}
