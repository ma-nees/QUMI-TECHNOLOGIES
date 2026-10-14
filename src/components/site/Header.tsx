import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { List, X, ArrowRight } from "@phosphor-icons/react";
import { Button, buttonVariants } from "@/components/ui/button";
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
        "sticky top-0 z-50 border-b bg-surface/95 backdrop-blur-md transition-[box-shadow,border-color,background-color] duration-300",
        scrolled ? "border-transparent shadow-header" : "border-border/80",
      )}
    >
      <div
        className={cn(
          "container-site flex items-center justify-between transition-[height] duration-300",
          scrolled ? "h-12 md:h-13.5" : "h-13.5 md:h-15.5",
        )}
      >
        <Link to="/" aria-label="QUMI Technologies home" onClick={() => setOpen(false)} className="flex items-center h-full">
          <Logo className={cn(
            "transition-all duration-300",
            scrolled ? "h-7 sm:h-7.5 md:h-8" : "h-8 sm:h-8.5 md:h-9.5"
          )} />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {navItems.map((n) => (
            <Link key={n.to} to={n.to} preload="intent" className="nav-link text-[0.86rem] font-medium text-foreground/85 hover:text-foreground">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link to="/contact" className={cn(buttonVariants({ size: "sm" }), "h-8.5 px-4 text-xs font-semibold shadow-xs")}>
            Start a Project <ArrowRight weight="bold" className="arrow-nudge ml-1.5" />
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-border/80 bg-surface/50 text-foreground transition-all duration-150 ease-out active:scale-75 shadow-xs"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} className="animate-in spin-in-90 duration-150" /> : <List size={18} className="animate-in spin-in-90 duration-150" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full z-40 border-b border-t border-border bg-background pb-8 shadow-2xl lg:hidden animate-in slide-in-from-top-2 zoom-in-95 fade-in duration-150 ease-out origin-top">
          <nav aria-label="Mobile" className="container-site flex flex-col pt-2">
            {navItems.map((n, i) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="animate-rise flex items-center justify-between border-b border-border py-4 text-lg font-semibold text-foreground hover:text-primary data-[status=active]:text-primary"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {n.label}
                <ArrowRight className="opacity-50" />
              </Link>
            ))}
            <div className="mt-8 flex flex-col gap-4">
              <Link to="/contact" onClick={() => setOpen(false)} className={buttonVariants({ size: "lg" })}>
                Start a Project
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
