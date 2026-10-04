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
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-white shadow-sm lg:hidden transition-transform duration-200 active:scale-95 text-slate-700"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
        </button>
      </div>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden animate-in fade-in" onClick={() => setOpen(false)} />
          
          {/* Floating Menu Card */}
          <div 
            className="fixed left-4 right-4 z-50 rounded-2xl border border-border/40 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] lg:hidden animate-in zoom-in-95 fade-in duration-200" 
            style={{ top: scrolled ? 76 : 96 }}
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {navItems.map((n, i) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-b border-border/30 py-3.5 text-[0.95rem] font-medium text-slate-800 hover:text-primary data-[status=active]:text-primary"
                >
                  {n.label}
                </Link>
              ))}
              <div className="mt-5 flex flex-col gap-3">
                <Button asChild size="lg" className="w-full rounded-xl bg-[#e94e34] text-white hover:bg-[#d4432a] shadow-none h-12 text-[0.95rem] font-bold">
                  <Link to="/contact" onClick={() => setOpen(false)}>
                    Enquire Now
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full rounded-xl border-border/60 bg-white shadow-none hover:bg-slate-50 h-12 text-[0.95rem] font-bold text-slate-700">
                  <a href="tel:+919000000000" onClick={() => setOpen(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" className="mr-2 text-slate-500"><path fill="currentColor" d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.41-38.83-38.83l20.78-24.34a8.12,8.12,0,0,0,.56-.75,16,16,0,0,0,1.4-15.17l-.06-.13L97.54,33.63A16,16,0,0,0,82.49,23.85,61.72,61.72,0,0,0,41,27.35a56.36,56.36,0,0,0-32.55,38C3.33,87.35,16.22,126.31,52,162.08s74.73,48.67,96.72,43.51A56.36,56.36,0,0,0,186.73,173a61.72,61.72,0,0,0,3.5-21.49A16,16,0,0,0,222.37,158.46ZM184,157.94a40.42,40.42,0,0,1-23.41,23.41c-16.71,3.93-51.13-7-82.68-38.52S35.32,76.85,39.25,60.14A40.42,40.42,0,0,1,62.66,36.73a45.69,45.69,0,0,1,16.29-2.31l46.22,103.11-19,22.18a8,8,0,0,0-.81,9c9.35,18.42,27.81,36.88,46.23,46.23a8,8,0,0,0,9-.81l22.18-19L221.58,181A45.69,45.69,0,0,1,184,157.94Z"></path></svg>
                    +91 90000 00000
                  </a>
                </Button>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
