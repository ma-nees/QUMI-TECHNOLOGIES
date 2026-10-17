import { Link } from "@tanstack/react-router";
import { ArrowRight } from "@phosphor-icons/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CursorDrivenParticleTypography } from "@/components/ui/cursor-driven-particle-typography";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/70 pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20 text-center">
      {/* Subtle Atmospheric Accent Glow behind center */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[350px] w-[500px] rounded-full bg-primary/5 blur-[120px]"
        aria-hidden="true"
      />

      <div className="container-site relative z-10 flex flex-col items-center">
        <div className="flex max-w-4xl flex-col items-center text-center w-full">
          {/* Dominant Master Headline with Interactive Cursor-Driven Particle Typography */}
          <h1
            className="animate-rise w-full max-w-4xl relative select-none flex flex-col items-center justify-center"
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
              className="h-[125px] sm:h-[135px] md:h-[155px] lg:h-[175px]"
              fontSize={66}
              particleDensity={2.5}
              particleSize={1.8}
              dispersionStrength={14}
              returnSpeed={0.08}
            />
          </h1>

          {/* Articulate Purpose Statement */}
          <p
            className="animate-rise mt-3 sm:mt-4 max-w-2xl text-xs sm:text-base md:text-lg leading-relaxed text-foreground/90 font-medium text-balance px-2 sm:px-0"
            style={{ animationDelay: "160ms" }}
          >
            QUMI Technologies designs and deploys mission-critical custom software, high-throughput cloud infrastructure, and intelligent data systems for organizations that cannot afford fragile code.
          </p>

          {/* Clear Call to Action Hierarchy */}
          <div
            className="animate-rise mt-5 sm:mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 w-full sm:w-auto px-4 sm:px-0 max-w-xs sm:max-w-none mx-auto"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              to="/contact"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 sm:h-12 w-full sm:w-auto px-6 sm:px-8 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all text-center justify-center text-sm sm:text-base"
              )}
            >
              Initiate an Engagement <ArrowRight weight="bold" className="ml-2 arrow-nudge" />
            </Link>
            <Link
              to="/services"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-11 sm:h-12 w-full sm:w-auto px-5 sm:px-7 border-border/80 bg-surface/60 backdrop-blur-md hover:bg-surface hover:-translate-y-0.5 transition-all text-center justify-center text-sm sm:text-base"
              )}
            >
              Explore Capabilities
            </Link>
          </div>

          {/* Engineering Credibility Strip */}
          <div
            className="animate-rise mt-6 sm:mt-9 grid w-full max-w-2xl grid-cols-3 gap-2 sm:gap-4 border-t border-border/70 pt-4 sm:pt-6"
            style={{ animationDelay: "320ms" }}
          >
            <div className="flex flex-col items-center text-center">
              <span className="font-display text-xl sm:text-3xl font-black text-foreground">99.9%</span>
              <span className="mt-0.5 text-[10px] sm:text-xs text-muted-foreground leading-tight text-center">Uptime & Reliability</span>
            </div>
            <div className="flex flex-col items-center text-center border-l border-border/60 pl-2 sm:pl-4">
              <span className="font-display text-xl sm:text-3xl font-black text-foreground">100%</span>
              <span className="mt-0.5 text-[10px] sm:text-xs text-muted-foreground leading-tight text-center">Senior Guild Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center border-l border-border/60 pl-2 sm:pl-4">
              <span className="font-display text-xl sm:text-3xl font-black text-foreground">Global</span>
              <span className="mt-0.5 text-[10px] sm:text-xs text-muted-foreground leading-tight text-center">Multi-Region Scale</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
