import { Link } from "@tanstack/react-router";
import { ArrowRight } from "@phosphor-icons/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CursorDrivenParticleTypography } from "@/components/ui/cursor-driven-particle-typography";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/70 pt-14 pb-20 md:pt-20 md:pb-28 lg:pt-24 lg:pb-32 text-center">
      {/* Contrast Safeguard Layer: Soft radial vignette ensuring 100% typography contrast against 3D background */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_35%,_var(--color-background)_0%,_transparent_100%)] opacity-95"
        aria-hidden="true"
      />
      {/* Subtle Atmospheric Accent Glow behind center */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[700px] rounded-full bg-primary/10 blur-[150px]"
        aria-hidden="true"
      />

      <div className="container-site relative z-10 flex flex-col items-center">
        <div className="flex max-w-4xl flex-col items-center text-center w-full">
          {/* Live Telemetry & Origin Badge */}
          {/* <div className="animate-rise inline-flex items-center gap-2 rounded-full border border-primary/25 bg-surface/80 px-4 py-1.5 text-xs font-mono font-medium text-foreground backdrop-blur-md shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-primary font-semibold">KATHMANDU, NEPAL</span>
            <span className="text-muted-foreground/60">•</span>
            <span className="text-muted-foreground">SILICON-VALLEY RIGOR</span>
          </div> */}

          {/* Dominant Master Headline with Interactive Cursor-Driven Particle Typography */}
          <h1
            className="animate-rise mt-6 w-full max-w-4xl relative select-none flex flex-col items-center justify-center"
            style={{ animationDelay: "80ms" }}
          >
            {/* Screen-reader and SEO accessible semantic headline */}
            <span className="sr-only">
              Engineering digital products built to last.
            </span>

            <CursorDrivenParticleTypography
              lines={[
                { text: "Engineering digital products" },
                { text: "built to last.", isAccent: true },
              ]}
              className="h-[155px] sm:h-[165px] md:h-[195px] lg:h-[220px]"
              fontSize={66}
              particleDensity={2.5}
              particleSize={1.8}
              dispersionStrength={14}
              returnSpeed={0.08}
            />
          </h1>

          {/* Articulate Purpose Statement */}
          <p
            className="animate-rise mt-6 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-muted-foreground text-balance"
            style={{ animationDelay: "160ms" }}
          >
            QUMI Technologies designs and deploys mission-critical custom software, high-throughput cloud infrastructure, and intelligent data systems for organizations that cannot afford fragile code.
          </p>

          {/* Clear Call to Action Hierarchy */}
          <div
            className="animate-rise mt-8 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              to="/contact"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 w-full sm:w-auto px-8 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all text-center justify-center"
              )}
            >
              Initiate an Engagement <ArrowRight weight="bold" className="ml-2 arrow-nudge" />
            </Link>
            <Link
              to="/services"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-12 w-full sm:w-auto px-7 border-border/80 bg-surface/60 backdrop-blur-md hover:bg-surface hover:-translate-y-0.5 transition-all text-center justify-center"
              )}
            >
              Explore Capabilities
            </Link>
          </div>

          {/* Engineering Credibility Strip */}
          <div
            className="animate-rise mt-10 sm:mt-12 grid w-full max-w-2xl grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 border-t border-border/70 pt-6 sm:pt-8"
            style={{ animationDelay: "320ms" }}
          >
            <div className="flex flex-col items-center">
              <span className="font-display text-3xl font-black text-foreground">99.9%</span>
              <span className="mt-1 text-xs text-muted-foreground leading-snug">Production Uptime & Reliability</span>
            </div>
            <div className="flex flex-col items-center sm:border-l sm:border-border/60 sm:pl-4">
              <span className="font-display text-3xl font-black text-foreground">100%</span>
              <span className="mt-1 text-xs text-muted-foreground leading-snug">Senior-Led Guild Delivery</span>
            </div>
            <div className="flex flex-col items-center sm:border-l sm:border-border/60 sm:pl-4">
              <span className="font-display text-3xl font-black text-foreground">Global</span>
              <span className="mt-1 text-xs text-muted-foreground leading-snug">Multi-Region Architectures</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
