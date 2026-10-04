import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { List, X, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export const navItems = [
  { to: "/services", label: "Services" },
  { to: "/solutions", label: "Solutions" },
  { to: "/industries", label: "Industries" },
  { to: "/about", label: "About" },
  { to: "/insights", label: "Insights" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={cn(
        "z-50 transition-[box-shadow,border-color,background-color] duration-300",
        // Desktop: sticky, full width, border bottom
        "lg:sticky lg:top-0 lg:border-b lg:bg-surface",
        scrolled ? "lg:border-transparent lg:shadow-header" : "lg:border-border",
        // Mobile: fixed, top floating, transparent container (click-through)
        "fixed top-4 left-0 right-0 flex justify-center pointer-events-none lg:pointer-events-auto lg:block lg:top-0 lg:left-auto lg:right-auto"
      )}
    >
      <div
        className={cn(
          "pointer-events-auto flex items-center transition-all duration-300",
          // Desktop inner container
          "lg:container-site lg:justify-between lg:w-full lg:max-w-[1240px] lg:rounded-none lg:border-0 lg:bg-transparent lg:px-8 lg:shadow-none",
          scrolled ? "lg:h-16" : "lg:h-20",
          // Mobile inner floating pill
          "h-14 gap-8 rounded-full border border-border bg-surface/90 px-6 shadow-lg backdrop-blur-md justify-between"
        )}
      >
        <Link to="/" aria-label="QUME Technologies home" onClick={() => setOpen(false)} className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {navItems.map((n) => (
            <Link key={n.to} to={n.to} className="nav-link text-[0.9rem] font-medium">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button asChild>
            <Link to="/contact">
              Start a Project <ArrowRight weight="bold" className="arrow-nudge" />
            </Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border lg:hidden transition-transform duration-200 active:scale-90"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <List size={20} />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 bg-background lg:hidden animate-in fade-in duration-200 pt-24 pb-8 overflow-y-auto">
          <nav aria-label="Mobile" className="container-site flex flex-col">
            {navItems.map((n, i) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="animate-rise flex items-center justify-between border-b border-border py-4 text-lg font-semibold data-[status=active]:text-primary"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {n.label}
                <ArrowRight className="text-muted-foreground" />
              </Link>
            ))}
            <Button asChild size="lg" className="mt-8">
              <Link to="/contact" onClick={() => setOpen(false)}>
                Start a Project
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
