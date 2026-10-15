import { useEffect, useRef, type ReactNode, type ElementType } from "react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.02, rootMargin: "250px 0px 250px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={cn("reveal", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={cn("grid gap-4 sm:gap-6 md:grid-cols-12 md:items-end", className)}>
      <div className="md:col-span-7">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-bold leading-[1.15] md:text-[2.6rem]">{title}</h2>
      </div>
      {intro && <p className="text-sm sm:text-base leading-relaxed text-muted-foreground md:col-span-5">{intro}</p>}
    </Reveal>
  );
}

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: ReactNode; intro?: ReactNode }) {
  return (
    <section className="border-b border-border">
      <div className="container-site py-8 sm:py-10 md:py-14">
        <p className="eyebrow animate-rise">{eyebrow}</p>
        <h1
          className="animate-rise mt-4 sm:mt-5 max-w-3xl text-3xl sm:text-4xl font-bold leading-[1.12] sm:leading-[1.08] md:text-[3.25rem]"
          style={{ animationDelay: "80ms" }}
        >
          {title}
        </h1>
        {intro && (
          <p
            className="animate-rise mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground"
            style={{ animationDelay: "160ms" }}
          >
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
