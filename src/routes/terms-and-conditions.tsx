import { useEffect, useState, useMemo, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/primitives";
import { pageMeta } from "@/lib/seo";
import { useCompanySettings } from "@/hooks/useCompanySettings";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => pageMeta("Terms & Conditions", "Terms governing the use of the QUMI Technologies website."),
  component: TermsAndConditions,
});

// Update this whenever the terms text changes.
const LAST_UPDATED = "15 October 2026";

type Section = { id: string; title: string; body: ReactNode };

function getSections(email: string, companyName: string): Section[] {
  return [
    {
      id: "use",
      title: "Use of this website",
      body: (
        <p>
          This website provides information about {companyName}. By using it, you agree to these terms. If you do
          not agree, please stop using the site.
        </p>
      ),
    },
    {
      id: "ip",
      title: "Intellectual property",
      body: (
        <p>
          The content, design and branding on this site belong to {companyName} unless stated otherwise. Please ask
          us before copying or reusing them.
        </p>
      ),
    },
    {
      id: "warranty",
      title: "No warranty",
      body: (
        <p>
          We provide information in good faith, but we do not guarantee that it is complete or accurate. Check
          important details with us directly before relying on them.
        </p>
      ),
    },
    {
      id: "law",
      title: "Governing law",
      body: <p>These terms are governed by the laws of Nepal.</p>,
    },
    {
      id: "contact",
      title: "Contact",
      body: (
        <p>
          Send questions about these terms to <a href={`mailto:${email}`}>{email}</a>.
        </p>
      ),
    },
  ];
}

const highlights = [
  { title: "Information only", text: "This site shares information about our company." },
  { title: "Our content is ours", text: "Ask before reusing our content or branding." },
  { title: "Nepal law applies", text: "These terms follow the laws of Nepal." },
];

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

function TermsAndConditions() {
  const { email, companyName } = useCompanySettings();
  const sections = useMemo(() => getSections(email, companyName), [email, companyName]);
  const active = useActiveSection(sections.map((s) => s.id));

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        intro="The rules and standards that apply when you visit our website."
      />

      <div className="container-site pb-20 pt-8 sm:pt-12">
        <div className="grid gap-12 lg:grid-cols-[260px_1fr] lg:gap-16">
          {/* Desktop Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">On this page</p>
                <nav aria-label="Table of contents" className="mt-3">
                  <TocLinks sections={sections} active={active} />
                </nav>
              </div>

              <div className="rounded-lg border bg-card p-4 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">Last updated</p>
                <p className="mt-1">{LAST_UPDATED}</p>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <article className="min-w-0 max-w-3xl">
            {/* Quick highlights */}
            <div className="mb-12 grid gap-4 rounded-xl border bg-muted/30 p-5 sm:grid-cols-3 sm:p-6">
              {highlights.map((h) => (
                <div key={h.title} className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">{h.title}</p>
                  <p className="text-xs text-muted-foreground">{h.text}</p>
                </div>
              ))}
            </div>

            {/* Mobile jump-to menu */}
            <div className="mb-10 rounded-lg border bg-card p-4 lg:hidden">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Jump to section</p>
              <nav aria-label="Table of contents mobile" className="mt-3">
                <TocLinks sections={sections} active={active} />
              </nav>
            </div>

            <div className="space-y-12 text-base leading-relaxed text-muted-foreground">
              {sections.map((s) => (
                <section key={s.id} id={s.id} className="group scroll-mt-24">
                  <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground md:text-2xl">
                    {s.title}
                    <a
                      href={`#${s.id}`}
                      aria-label={`Link to ${s.title}`}
                      className="rounded px-1 text-muted-foreground opacity-0 transition-opacity focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary group-hover:opacity-100"
                    >
                      #
                    </a>
                  </h2>
                  <div className="mt-3 space-y-3 [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4">
                    {s.body}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-14 flex flex-col gap-4 rounded-xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Questions about these terms?</h2>
                <p className="mt-1 text-sm text-muted-foreground">Write to us and we will get back to you.</p>
              </div>
              <a
                href={`mailto:${email}?subject=Question%20about%20terms`}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Email us
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-sm text-muted-foreground">
              <p>These terms are a template and must be reviewed by legal counsel before publication.</p>
              <a href="#top" className="font-medium text-foreground underline underline-offset-4">
                Back to top
              </a>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}

function TocLinks({ sections, active, className = "" }: { sections: Section[]; active: string; className?: string }) {
  return (
    <ul className={`space-y-1 ${className}`}>
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={isActive ? "location" : undefined}
              className={`block border-l-2 py-1.5 pl-3 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                isActive
                  ? "border-primary font-semibold text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
}