import { Link } from "@tanstack/react-router";
import { ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-[30vh] items-center justify-center overflow-hidden border-b border-border text-center">
      {/* Radial gradient behind text to ensure legibility while keeping the scene 100% visible at the edges */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-background)_0%,_transparent_65%)] opacity-90" aria-hidden="true" />
      
      <div className="container-site relative z-10 flex max-w-5xl flex-col items-center py-6">
        <p className="eyebrow animate-rise">Nepal-based technology partner</p>
        <h1
          className="animate-rise mt-3 text-[2.5rem] font-extrabold leading-[1.05] md:text-[3.5rem]"
          style={{ animationDelay: "90ms" }}
        >
          Engineering digital products that move businesses forward.
        </h1>
        <p
          className="animate-rise mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground"
          style={{ animationDelay: "180ms" }}
        >
          QUME Technologies designs and builds custom software, modernises operations on the cloud,
          and puts data and AI to practical use — for enterprises, startups and public institutions.
        </p>
        <div className="animate-rise mt-6 flex flex-wrap justify-center gap-3" style={{ animationDelay: "270ms" }}>
          <Button asChild size="lg" className="h-12 px-6 shadow-lg shadow-primary/25">
            <Link to="/contact">
              Start a Project <ArrowRight weight="bold" className="arrow-nudge ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-6 bg-surface/50 backdrop-blur-md">
            <Link to="/services">Explore Services</Link>
          </Button>
        </div>
        <dl
          className="animate-rise mt-8 grid w-full max-w-3xl grid-cols-1 gap-6 border-t border-border pt-6 text-sm md:grid-cols-3"
          style={{ animationDelay: "360ms" }}
        >
          {[
            ["Software", "Web, mobile, enterprise"],
            ["Cloud", "AWS, Azure, DevOps"],
            ["Data & AI", "Analytics, automation"],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col items-center">
              <dt className="text-lg font-bold text-foreground">{k}</dt>
              <dd className="mt-2 text-muted-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
