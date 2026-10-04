export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="1" y="1" width="30" height="30" rx="4" className="fill-primary" />
        <circle cx="15" cy="15" r="7" fill="none" strokeWidth="3" className="stroke-primary-foreground" />
        <path d="M18.5 18.5 L24 24" strokeWidth="3" strokeLinecap="square" className="stroke-highlight" />
      </svg>
      <span className={inverse ? "text-ink-foreground" : "text-foreground"}>
        <span className="text-[1.05rem] font-extrabold tracking-tight">QUME</span>
        <span className="ml-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] opacity-70">
          Technologies
        </span>
      </span>
    </span>
  );
}
