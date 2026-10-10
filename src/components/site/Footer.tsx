import { Link } from "@tanstack/react-router";
import { EnvelopeSimple, Phone, MapPin, LinkedinLogo, GithubLogo, XLogo, InstagramLogo, RedditLogo, FacebookLogo, LinkSimple } from "@phosphor-icons/react";
import { company } from "@/lib/content";
import { Logo } from "./Logo";
import { useEffect, useState } from "react";
import { fetchCompanySettings } from "@/lib/public.functions";

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
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchCompanySettings().then(setSettings);
  }, []);

  // Determine active socials based on settings
  const socials = [];
  if (settings?.linkedin_url) socials.push({ Icon: LinkedinLogo, label: "LinkedIn", url: settings.linkedin_url });
  if (settings?.twitter_url) socials.push({ Icon: XLogo, label: "X", url: settings.twitter_url });
  if (settings?.facebook_url) socials.push({ Icon: FacebookLogo, label: "Facebook", url: settings.facebook_url });
  if (settings?.instagram_url) socials.push({ Icon: InstagramLogo, label: "Instagram", url: settings.instagram_url });
  if (settings?.reddit_url) socials.push({ Icon: RedditLogo, label: "Reddit", url: settings.reddit_url });
  if (settings?.threads_url) socials.push({ Icon: LinkSimple, label: "Threads", url: settings.threads_url });

  // Add github as fallback if no settings yet just to not look empty during setup
  if (socials.length === 0) {
    socials.push({ Icon: GithubLogo, label: "GitHub", url: "https://github.com/qumi" });
  }

  return (
    <footer className="bg-ink text-ink-foreground dark:bg-[#010d17] dark:text-foreground dark:border-t dark:border-border">
      <div className="container-site grid gap-12 py-8 md:py-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo inverse />
          <p className="mt-5 max-w-sm text-sm leading-relaxed opacity-70">
            A Nepal-based technology partner engineering software, cloud and data systems for organisations
            in Nepal and abroad.
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map(({ Icon, label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-ink-foreground/20 dark:border-border dark:hover:border-highlight transition-colors hover:border-highlight hover:text-highlight"
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
              <a href={`mailto:${settings?.email || company.email}`} className="hover:text-highlight">{settings?.email || company.email}</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="opacity-60" />
              <a href={`tel:${(settings?.mobile_number || company.phone).replace(/\s/g, "")}`} className="hover:text-highlight">{settings?.mobile_number || company.phone}</a>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin size={16} className="opacity-60" />
              {settings?.location || company.address}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10 dark:border-border">
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
