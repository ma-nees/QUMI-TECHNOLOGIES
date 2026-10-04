import { Link } from "@tanstack/react-router";
import { EnvelopeSimple, Phone, MapPin, LinkedinLogo, GithubLogo, XLogo } from "@phosphor-icons/react";
import { company } from "@/lib/content";
import { Logo } from "./Logo";

const cols = [
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/careers", label: "Careers" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Expertise",
    links: [
      { to: "/services", label: "Services" },
      { to: "/solutions", label: "Solutions" },
      { to: "/industries", label: "Industries" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="container-site grid gap-12 py-8 md:py-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo inverse />
          <p className="mt-5 max-w-sm text-sm leading-relaxed opacity-70">
            A Nepal-based technology partner engineering software, cloud and data systems for organisations
            in Nepal and abroad.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { Icon: LinkedinLogo, label: "LinkedIn" },
              { Icon: GithubLogo, label: "GitHub" },
              { Icon: XLogo, label: "X" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href={label === "LinkedIn" ? "https://linkedin.com/company/qume" : label === "GitHub" ? "https://github.com/qume" : "https://x.com/qume"}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-ink-foreground/20 transition-colors hover:border-highlight hover:text-highlight"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.title} className="md:col-span-2">
            <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.14em] opacity-60">{c.title}</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {c.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="opacity-85 transition-opacity hover:opacity-100 hover:text-highlight">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="md:col-span-3">
          <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.14em] opacity-60">Get in touch</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2.5">
              <EnvelopeSimple size={16} className="opacity-60" />
              <a href={`mailto:${company.email}`} className="hover:text-highlight">{company.email}</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="opacity-60" />
              <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hover:text-highlight">{company.phone}</a>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin size={16} className="opacity-60" />
              {company.address}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10">
        <div className="container-site flex flex-col gap-3 py-6 text-xs opacity-70 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:opacity-100">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:opacity-100">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
