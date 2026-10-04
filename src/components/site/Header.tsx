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
        "sticky top-0 z-50 border-b bg-surface transition-[box-shadow,border-color] duration-300",
        scrolled ? "border-transparent shadow-header" : "border-border",
      )}
    >
      <div
        className={cn(
          "container-site flex items-center justify-between transition-[height] duration-300",
          scrolled ? "h-16" : "h-20",
        )}
      >
        <Link to="/" aria-label="QUME Technologies home" onClick={() => setOpen(false)}>
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
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden animate-in fade-in" onClick={() => setOpen(false)} />
          
          {/* Floating Menu Card */}
          <div 
            className="fixed left-4 right-4 z-50 rounded-[1.25rem] border border-border bg-card p-5 shadow-2xl lg:hidden animate-in zoom-in-95 fade-in duration-200" 
            style={{ top: scrolled ? 72 : 92 }}
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {navItems.map((n, i) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-b border-border/60 py-4 text-[0.95rem] font-medium text-foreground hover:text-primary data-[status=active]:text-primary"
                >
                  {n.label}
                </Link>
              ))}
              <div className="mt-6 flex flex-col gap-3">
                <Button asChild size="lg" className="w-full rounded-xl bg-primary hover:bg-primary-hover shadow-none">
                  <Link to="/contact" onClick={() => setOpen(false)}>
                    Start a Project
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full rounded-xl border-border bg-transparent shadow-none hover:bg-surface">
                  <Link to="/services" onClick={() => setOpen(false)}>
                    Explore Services
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
