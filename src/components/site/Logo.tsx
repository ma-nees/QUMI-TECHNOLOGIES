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
        src="/logo.jpeg"
        alt="QUMI Technologies"
        width={800}
        height={268}
        className={cn(
          "h-11 sm:h-12 md:h-14 w-auto max-h-14 object-contain transition-all duration-200",
          className
        )}
        fetchPriority="high"
        decoding="async"
      />
    </span>
  );
}
