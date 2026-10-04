export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className="inline-flex items-center">
      <img src="/logo-full.png" alt="QUMI Technologies" className="h-8 w-auto object-contain" />
    </span>
  );
}
