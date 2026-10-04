import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

const HeroScene = lazy(() => import("@/components/three/HeroScene"));

function StaticVisual() {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <circle cx="200" cy="200" r="130" fill="none" className="stroke-primary" strokeOpacity="0.25" />
      <circle cx="200" cy="200" r="80" fill="none" className="stroke-primary" strokeOpacity="0.4" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <circle key={i} cx={200 + Math.cos(a) * 130} cy={200 + Math.sin(a) * 130} r="3.5" className={i === 3 ? "fill-highlight" : "fill-primary"} />;
      })}
    </svg>
  );
}

export function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="container-site grid items-center gap-12 py-16 md:py-24 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow animate-rise">Nepal-based technology partner</p>
          <h1
            className="animate-rise mt-6 text-[2.5rem] font-extrabold leading-[1.05] md:text-[3.6rem]"
            style={{ animationDelay: "90ms" }}
          >
            Engineering digital products that move businesses forward.
          </h1>
          <p
            className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            style={{ animationDelay: "180ms" }}
          >
            QUME Technologies designs and builds custom software, modernises operations on the cloud,
            and puts data and AI to practical use — for enterprises, startups and public institutions.
          </p>
          <div className="animate-rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: "270ms" }}>
            <Button asChild size="lg">
              <Link to="/contact">
                Start a Project <ArrowRight weight="bold" className="arrow-nudge" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/services">Explore Services</Link>
            </Button>
          </div>
          <dl
            className="animate-rise mt-12 grid max-w-lg grid-cols-3 border-t border-border pt-6 text-sm"
            style={{ animationDelay: "360ms" }}
          >
            {[
              ["Software", "Web, mobile, enterprise"],
              ["Cloud", "AWS, Azure, DevOps"],
              ["Data & AI", "Analytics, automation"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-semibold">{k}</dt>
                <dd className="mt-1 text-muted-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="animate-rise relative lg:col-span-6" style={{ animationDelay: "200ms" }}>
          <div className="relative aspect-square w-full overflow-hidden rounded-md border border-border bg-surface">
            <div className="grid-lines absolute inset-0 opacity-50" />
            {mounted ? (
              <Suspense fallback={<StaticVisual />}>
                <HeroScene />
              </Suspense>
            ) : (
              <StaticVisual />
            )}
            <div className="absolute left-4 top-4 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
              System architecture / live
            </div>
            <div className="absolute bottom-4 right-4 flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
              <span className="h-1.5 w-1.5 bg-highlight" /> Kathmandu, NP
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
