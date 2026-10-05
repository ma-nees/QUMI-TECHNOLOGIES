import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { List, X, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export const navItems = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/solutions", label: "Solutions" },
  { to: "/industries", label: "Industries" },
  { to: "/about", label: "About" },
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
          scrolled ? "h-14" : "h-16",
        )}
      >
        <Link to="/" aria-label="QUMI Technologies home" onClick={() => setOpen(false)}>
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
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border lg:hidden transition-all duration-150 ease-out active:scale-75"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} className="animate-in spin-in-90 duration-150" /> : <List size={20} className="animate-in spin-in-90 duration-150" />}
        </button>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full z-40 border-b border-t border-slate-200 bg-[#F4F8FC] pb-8 shadow-2xl lg:hidden animate-in slide-in-from-top-2 zoom-in-95 fade-in duration-150 ease-out origin-top">
          <nav aria-label="Mobile" className="container-site flex flex-col pt-2">
            {navItems.map((n, i) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="animate-rise flex items-center justify-between border-b border-slate-200/60 py-4 text-lg font-semibold text-slate-800 data-[status=active]:text-primary"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {n.label}
                <ArrowRight className="text-slate-400" />
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
