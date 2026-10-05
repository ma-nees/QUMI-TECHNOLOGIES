export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className="inline-flex items-center">
      <img src="/logo-full.png" alt="QUMI Technologies" width={800} height={268} className="h-8 w-auto object-contain" fetchPriority="high" decoding="async" />
    </span>
  );
}
