import { Link } from "@tanstack/react-router";
import { ArrowRight } from "@phosphor-icons/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const phrases = [
  "drive business growth.",
  "accelerate business growth.",
  "transform businesses.",
  "power business growth.",
  "create business impact.",
  "shape the future of business.",
  "help businesses evolve.",
  "turn ideas into impact.",
  "drive what's next."
];

function Typewriter() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(phrases[0]!);
  const [isDeleting, setIsDeleting] = useState(true);
  const [isPaused, setIsPaused] = useState(true);

  // Initial pause on mount
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (isPaused && text === phrases[0] && index === 0) {
      timeoutId = setTimeout(() => {
        setIsPaused(false);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const current = phrases[index]!;
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isDeleting) {
      timeoutId = setTimeout(() => {
        setText(current.substring(0, text.length - 1));
        if (text.length <= 1) {
          setIsDeleting(false);
          setIndex((i) => (i + 1) % phrases.length);
        }
      }, 40);
    } else {
      timeoutId = setTimeout(() => {
        setText(current.substring(0, text.length + 1));
        if (text.length === current.length) {
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
            setIsDeleting(true);
          }, 2500);
        }
      }, 60);
    }
    return () => clearTimeout(timeoutId);
  }, [text, isDeleting, index, isPaused]);

  return (
    <span className="inline font-display font-bold tracking-tight">
      <span className="bg-gradient-to-r from-primary via-[#60a5fa] to-primary bg-[length:200%_auto] animate-[gradient_4s_ease_infinite] bg-clip-text text-transparent drop-shadow-sm">{text}</span>
      <span className="animate-pulse border-r-[0.1em] border-primary/70 ml-1 inline h-[0.8em] align-middle" />
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-[30vh] items-center justify-center overflow-hidden border-b border-border text-center">
      {/* Radial gradient behind text to ensure legibility while keeping the scene 100% visible at the edges */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-background)_0%,_transparent_65%)] opacity-90" aria-hidden="true" />

      <div className="container-site relative z-10 flex max-w-5xl flex-col items-center py-6">
        <p className="eyebrow animate-rise">Nepal-based technology partner</p>
        <h1
          className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl min-h-[140px] sm:min-h-[120px] md:min-h-0 flex flex-col md:block items-center"
        >
          <span>Engineering digital products that </span>
          <Typewriter />
        </h1>
        <p
          className="animate-rise mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground"
          style={{ animationDelay: "180ms" }}
        >
          QUMI Technologies designs and builds custom software, modernises operations on the cloud,
          and puts data and AI to practical use — for enterprises, startups and public institutions.
        </p>
        <div className="animate-rise mt-6 flex flex-wrap justify-center gap-3" style={{ animationDelay: "270ms" }}>
          <Link to="/contact" className={cn(buttonVariants({ size: "lg" }), "h-12 px-6 shadow-lg shadow-primary/25")}>
            Start a Project <ArrowRight weight="bold" className="arrow-nudge ml-2" />
          </Link>
          <Link to="/services" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-12 px-6 bg-surface/50 backdrop-blur-md")}>
            Explore Services
          </Link>
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
