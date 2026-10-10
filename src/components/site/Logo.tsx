export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className="inline-flex items-center">
      <img src="/logo-full.webp" alt="QUMI Technologies" width={800} height={268} className="h-9 sm:h-10 w-auto object-contain" fetchPriority="high" decoding="async" />
    </span>
  );
}
