import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, X, Sparkle, Globe, GithubLogo, ArrowSquareOut } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeader } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
import { services, technologies, industries, process, principles, engagementModels } from "@/lib/content";
import { listCaseStudies } from "@/lib/public.functions";
import caseFintech from "@/assets/case-fintech.jpg";
import caseLogistics from "@/assets/case-logistics.jpg";
import caseHealth from "@/assets/case-health.jpg";

export function ServicesGrid({ limit }: { limit?: number }) {
  const list = limit ? services.slice(0, limit) : services;
  return (
    <div className="grid border-l border-t border-border/50 sm:grid-cols-2 lg:grid-cols-4">
      {list.map((s, i) => (
        <Reveal key={s.slug} delay={(i % 4) * 60} className="border-b border-r border-border/50">
          <Link
            to="/services"
            hash={s.slug}
            className="group card-interactive flex h-full flex-col border-0 p-7 hover:z-10"
          >
            <div className="flex items-center gap-3 md:block">
              <s.icon size={28} weight="light" className="icon-nudge text-primary shrink-0" />
              <h3 className="text-lg font-bold leading-snug md:mt-8">{s.title}</h3>
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              Learn more <ArrowRight className="arrow-nudge" />
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

export function ServicesSection() {
  return (
    <section className="py-8 md:py-12">
      <div className="container-site flex flex-col gap-6">
        <div className="border border-border/60 bg-surface/90 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-sm">
          <SectionHeader
            eyebrow="What we do"
            title="Services built around real delivery, not buzzwords."
            intro="From the first architecture decision to production operations, our teams cover the full lifecycle of a digital product."
          />
        </div>
        <div className="pt-2">
          <ServicesGrid />
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section className="border-y border-border bg-surface py-12 md:py-16">
      <div className="container-site grid gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-6">
          <p className="eyebrow">The company</p>
          <p className="mt-6 text-3xl font-bold leading-[1.2] md:text-[2.4rem]">
            We believe good software is engineered, not assembled — and that world-class work can be built
            from Kathmandu.
          </p>
        </Reveal>
        <Reveal delay={120} className="md:col-span-5 md:col-start-8">
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              QUMI Technologies is a Nepal-based IT company. We work with organisations that need software
              they can depend on: systems that scale, stay secure and remain maintainable long after launch.
            </p>
            <p>
              Our engineers combine modern technology stacks with disciplined practice — code review, automated
              testing, documentation — so the products we build can grow with the businesses that use them.
            </p>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-sm font-medium">
            {["Engineering-driven development", "Scalable architecture", "Long-term partnerships", "Modern technology stack"].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 bg-primary" /> {t}
              </li>
            ))}
          </ul>
          <Button asChild variant="link" className="mt-8">
            <Link to="/about">
              More about QUMI <ArrowRight className="arrow-nudge" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

export function TechnologySection() {
  return (
    <section className="py-8 md:py-12">
      <div className="container-site border border-border bg-surface/90 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-sm">
        <SectionHeader
          eyebrow="Technology"
          title="A focused, proven stack."
          intro="We choose mature tools with strong ecosystems, and we choose them per project — not by habit."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {technologies.map((g, i) => (
            <Reveal key={g.group} delay={i * 60} className="border border-border/60 bg-background/60 p-6 rounded-xl shadow-sm transition-all hover:bg-background">
              <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">{g.group}</h3>
              <ul className="mt-5 space-y-3">
                {g.items.map((t) => (
                  <li key={t} className="flex items-center justify-between border-b border-border/50 pb-3 text-[0.95rem] font-semibold last:border-0">
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function IndustriesList({ full = false }: { full?: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      {industries.map((ind, i) => (
        <Reveal key={ind.name} delay={(i % 4) * 40}>
          <div className="group grid gap-4 border border-border bg-surface/80 backdrop-blur-md p-5 md:p-6 rounded-lg shadow-sm transition-all hover:bg-surface hover:shadow-md md:grid-cols-12 md:gap-6">
            <span className="font-mono text-xs text-muted-foreground md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="text-xl font-bold transition-colors group-hover:text-primary md:col-span-3">{ind.name}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground md:col-span-4">
              <span className="font-semibold text-foreground">Challenge. </span>
              {ind.problem}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground md:col-span-4">
              <span className="font-semibold text-foreground">{full ? "Our approach. " : "Approach. "}</span>
              {ind.approach}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function IndustriesSection() {
  return (
    <section className="border-t border-border bg-surface py-12 md:py-16">
      <div className="container-site">
        <SectionHeader
          eyebrow="Industries"
          title="Solving specific problems in specific sectors."
          intro="Every industry has its own constraints — regulation, scale, connectivity, legacy systems. We design for them."
        />
        <div className="mt-14">
          <IndustriesList />
        </div>
      </div>
    </section>
  );
}

const cases = [
  { name: "Digital lending platform", industry: "FinTech", img: caseFintech, problem: "Manual loan processing across branches.", solution: "Web platform with automated credit workflow.", tech: "React, Node.js, PostgreSQL", result: "Reduced loan approval cycle from 5 days to 2 hours with 100% audit compliance." },
  { name: "Fleet & delivery tracking", industry: "Logistics", img: caseLogistics, problem: "No real-time view of deliveries.", solution: "Dispatch dashboard and driver mobile app.", tech: "React Native, Go, AWS", result: "Optimized dispatch routes for over 500 commercial vehicles daily with 99.4% on-time rate." },
  { name: "Patient records app", industry: "Healthcare", img: caseHealth, problem: "Paper records and long queues.", solution: "Secure records and appointment booking.", tech: "Next.js, Python, Azure", result: "Processed over 14,000 monthly bookings, cutting clinic waiting times by 65%." },
];

export function CaseStudiesSection() {
  const [items, setItems] = useState<any[]>(cases);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);

  useEffect(() => {
    listCaseStudies().then((data) => {
      if (data && data.length > 0) {
        setItems(data);
      }
    }).catch(() => {});
  }, []);

  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className="container-site">
        <SectionHeader
          eyebrow="Selected work"
          title="Project Case Studies"
          intro="Demonstrated technical delivery and architectural outcomes engineered across high-scale industries."
        />
        <div className="mt-8 sm:mt-10 md:mt-14 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c, i) => {
            const title = c.title || c.name;
            const tech = c.technology || c.tech;
            const image = c.image_url || c.img || caseFintech;
            return (
              <Reveal key={c.id || title} delay={i * 80}>
                <article
                  onClick={() => setSelectedCase(c)}
                  className="group card-interactive flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div>
                    {/* Image Banner */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                      <img
                        src={image}
                        alt={`${title} preview`}
                        width={1280}
                        height={720}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-ink/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      
                      {/* Top left badge */}
                      <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
                        <span className="rounded-md bg-surface/90 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary backdrop-blur-sm shadow-xs">
                          {c.industry}
                        </span>
                      </div>

                      {/* Top right quick links */}
                      <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5">
                        {c.live_url && (
                          <a
                            href={c.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-7 w-7 items-center justify-center rounded-md bg-black/60 text-white backdrop-blur-sm transition hover:bg-primary"
                            title="Open live project"
                          >
                            <Globe size={14} />
                          </a>
                        )}
                        {c.github_url && (
                          <a
                            href={c.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-7 w-7 items-center justify-center rounded-md bg-black/60 text-white backdrop-blur-sm transition hover:bg-primary"
                            title="View GitHub repository"
                          >
                            <GithubLogo size={14} />
                          </a>
                        )}
                      </div>

                      {c.client && (
                        <span className="absolute bottom-2.5 left-2.5 rounded-md bg-background/80 px-2 py-0.5 text-[10px] font-medium text-foreground backdrop-blur-sm">
                          {c.client}
                        </span>
                      )}
                    </div>

                    {/* Compact Card Content */}
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base sm:text-lg font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {title}
                        </h3>
                        <ArrowUpRight size={18} className="arrow-nudge shrink-0 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>

                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {c.solution || c.problem}
                      </p>

                      {c.result && (
                        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-primary font-medium">
                          <Sparkle size={13} weight="fill" className="shrink-0 text-primary" />
                          <span className="truncate">{c.result}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Compact Card Footer */}
                  <div className="border-t border-border/60 bg-surface-alt/40 px-4 sm:px-5 py-2.5">
                    <div className="flex flex-wrap items-center gap-1 font-mono text-[10px] text-muted-foreground">
                      {tech?.split(',').slice(0, 3).map((t: string) => (
                        <span key={t} className="rounded bg-background/80 px-1.5 py-0.5 border border-border/50">
                          {t.trim()}
                        </span>
                      ))}
                      {tech?.split(',').length > 3 && (
                        <span className="text-[10px]">+{tech.split(',').length - 3}</span>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Case Study Detail Modal */}
      {selectedCase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm animate-fade-in-up"
          onClick={() => setSelectedCase(null)}
        >
          <div
            className="flex max-h-[92vh] sm:max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-surface shadow-2xl animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-muted">
              <img
                src={selectedCase.image_url || selectedCase.img || caseFintech}
                alt={selectedCase.title || selectedCase.name}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => setSelectedCase(null)}
                className="absolute right-3 top-3 sm:right-4 sm:top-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/90 transition backdrop-blur-sm"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
              <div className="absolute left-3 bottom-3 sm:left-6 sm:bottom-4 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="rounded-md bg-surface/90 px-2.5 sm:px-3 py-1 font-mono text-[11px] sm:text-xs font-semibold text-primary backdrop-blur-sm">
                  {selectedCase.industry}
                </span>
                {selectedCase.client && (
                  <span className="rounded-md bg-black/60 px-2.5 sm:px-3 py-1 font-mono text-[11px] sm:text-xs text-white backdrop-blur-sm">
                    {selectedCase.client}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-7 space-y-4 sm:space-y-5">
              <div>
                <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
                  {selectedCase.title || selectedCase.name}
                </h2>
                {selectedCase.client && (
                  <p className="mt-0.5 text-xs text-muted-foreground">Engineered for {selectedCase.client}</p>
                )}
              </div>

              {/* Action Links (GitHub & Live Link) */}
              {(selectedCase.live_url || selectedCase.github_url) && (
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
                  {selectedCase.live_url && (
                    <a
                      href={selectedCase.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition flex-1 sm:flex-initial"
                    >
                      <Globe size={15} />
                      <span>Visit Live Project</span>
                      <ArrowSquareOut size={13} />
                    </a>
                  )}
                  {selectedCase.github_url && (
                    <a
                      href={selectedCase.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition flex-1 sm:flex-initial"
                    >
                      <GithubLogo size={15} />
                      <span>GitHub Repository</span>
                    </a>
                  )}
                </div>
              )}

              <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                <div className="rounded-xl border border-border/80 bg-background/60 p-3.5 sm:p-4">
                  <h4 className="font-bold text-foreground text-xs sm:text-sm flex items-center gap-2 mb-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary" /> The Problem & Challenge
                  </h4>
                  <p>{selectedCase.problem}</p>
                </div>

                <div className="rounded-xl border border-border/80 bg-background/60 p-3.5 sm:p-4">
                  <h4 className="font-bold text-foreground text-xs sm:text-sm flex items-center gap-2 mb-1.5">
                    <span className="h-2 w-2 rounded-full bg-highlight" /> The Architectural Solution
                  </h4>
                  <p>{selectedCase.solution}</p>
                </div>

                {selectedCase.result && (
                  <div className="rounded-xl border border-primary/30 bg-primary/10 p-3.5 sm:p-4 text-primary">
                    <h4 className="font-bold text-xs sm:text-sm flex items-center gap-2 mb-1.5">
                      <Sparkle size={15} weight="fill" /> Key Results & Measurable Impact
                    </h4>
                    <p className="font-medium text-foreground">{selectedCase.result}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Technologies Used</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedCase.technology || selectedCase.tech)?.split(',').map((t: string) => (
                    <span key={t} className="rounded-md border border-border/80 bg-background px-2.5 py-0.5 text-xs font-mono font-medium">
                      {t.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground text-center sm:text-left">Looking for similar technical architecture?</p>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition w-full sm:w-auto"
                  onClick={() => setSelectedCase(null)}
                >
                  Discuss Your Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function ProcessSection() {
  const ref = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh * 0.75 - r.top) / r.height;
      setProgress(Math.max(0, Math.min(1, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="bg-ink py-8 text-ink-foreground md:py-12">
      <div className="container-site grid gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <p className="eyebrow">How we deliver</p>
          <h2 className="mt-4 text-3xl font-bold leading-[1.12] md:text-[2.6rem]">A process designed for predictability.</h2>
          <p className="mt-5 leading-relaxed opacity-70">
            Seven stages, each with a clear output — so you always know what is happening and what comes next.
          </p>
        </Reveal>
        <ol ref={ref} className="relative md:col-span-7 md:col-start-6">
          <span className="absolute left-[7px] top-2 bottom-2 w-px bg-ink-foreground/15" aria-hidden="true" />
          <span
            className="absolute left-[7px] top-2 w-px origin-top bg-highlight transition-[height] duration-150"
            style={{ height: `calc((100% - 1rem) * ${progress})` }}
            aria-hidden="true"
          />
          {process.map((s, i) => {
            const active = progress >= i / (process.length - 1) - 0.02;
            return (
              <li key={s.n} className="relative grid grid-cols-[32px_1fr] gap-4 pb-9 last:pb-0">
                <span
                  className={`mt-1.5 h-[15px] w-[15px] border-2 transition-colors duration-300 ${active ? "border-highlight bg-highlight" : "border-ink-foreground/30 bg-ink"}`}
                />
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs opacity-60">{s.n}</span>
                    <h3 className="text-xl font-bold">{s.title}</h3>
                  </div>
                  <p className="mt-2 max-w-md text-sm leading-relaxed opacity-70">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export function PrinciplesSection() {
  return (
    <section className="py-8 md:py-12">
      <div className="container-site border border-border bg-surface/90 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-sm">
        <SectionHeader eyebrow="Why QUMI" title="The principles we work by." />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 60} className="border border-border/60 bg-background/60 p-6 md:p-8 rounded-xl shadow-sm transition-all hover:bg-background">
              <h3 className="text-xl font-bold">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function EngagementSection() {
  return (
    <section className="border-t border-border bg-surface py-8 sm:py-10 md:py-14">
      <div className="container-site">
        <SectionHeader
          eyebrow="How we work with teams"
          title="Three ways to engage."
          intro="Choose the model that fits your organisation. Many clients start with one and move to another as needs evolve."
        />
        <div className="mt-8 sm:mt-10 md:mt-12 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {engagementModels.map((m, i) => (
            <Reveal
              key={m.title}
              delay={i * 70}
              className={cn(
                "card-interactive rounded-xl p-5 sm:p-6 md:p-7 flex flex-col justify-between",
                i === 2 && "sm:col-span-2 lg:col-span-1"
              )}
            >
              <div>
                <span className="font-mono text-xs font-semibold text-primary">0{i + 1}</span>
                <h3 className="mt-4 sm:mt-6 text-lg sm:text-xl font-bold">{m.title}</h3>
              </div>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">{m.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="py-8 sm:py-10 md:py-14">
      <div className="container-site">
        <Reveal className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-primary px-5 py-8 sm:px-10 sm:py-12 md:px-16 md:py-16 text-primary-foreground">
          <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "linear-gradient(var(--color-primary-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary-foreground) 1px, transparent 1px)", backgroundSize: "56px 56px" }} aria-hidden="true" />
          <div className="relative grid items-center gap-6 sm:gap-8 md:grid-cols-12">
            <div className="md:col-span-8">
              <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.14em] opacity-80">Have a product or technology challenge?</p>
              <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-bold leading-[1.15] md:text-[2.6rem]">Let's build the right solution.</h2>
            </div>
            <div className="md:col-span-4 md:text-right">
              <Button asChild size="lg" variant="inverse" className="w-full sm:w-auto justify-center">
                <Link to="/contact">
                  Talk to Our Team <ArrowRight weight="bold" className="arrow-nudge" />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
