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
        width={800}
        height={268}
        className={cn(
          "w-auto max-h-full object-contain transition-all duration-200",
          className
        )}
        fetchPriority="high"
        decoding="async"
      />
    </span>
  );
}
