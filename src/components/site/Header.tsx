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
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <List size={20} />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-[inherit] z-40 border-t border-border bg-surface lg:hidden" style={{ top: scrolled ? 64 : 80 }}>
          <nav aria-label="Mobile" className="container-site flex flex-col py-6">
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
