import { useEffect, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/primitives";
import { company } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/privacy-policy")({
  head: () => pageMeta("Privacy Policy", "How QUMI Technologies collects, uses and protects personal information."),
  component: PrivacyPolicy,
});

// Update this whenever the policy text changes.
const LAST_UPDATED = "15 October 2026";

type Section = { id: string; title: string; body: ReactNode };

const sections: Section[] = [
  {
    id: "collect",
    title: "Information we collect",
    body: (
      <>
        <p>When you contact us or apply for a role, we collect the details you choose to give us:</p>
        <ul>
          <li>Name, email address and phone number</li>
          <li>Company and the message you send</li>
          <li>Any CV or portfolio you submit with an application</li>
        </ul>
      </>
    ),
  },
  {
    id: "use",
    title: "How we use it",
    body: (
      <>
        <p>We use your information only to:</p>
        <ul>
          <li>Respond to your enquiry</li>
          <li>Assess your job application</li>
          <li>Operate our services</li>
        </ul>
        <p>We do not sell personal data.</p>
      </>
    ),
  },
  {
    id: "security",
    title: "Storage and security",
    body: (
      <p>
        Access to your data is restricted to authorised staff. CVs are kept in private storage and are never
        publicly accessible.
      </p>
    ),
  },
  {
    id: "retention",
    title: "Retention",
    body: (
      <p>
        We keep enquiries and applications only as long as needed for the purpose they were submitted for, or as
        required by law.
      </p>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <p>
        You can ask us to access, correct or delete your data at any time. Email{" "}
        <a href={`mailto:${company.email}`}>{company.email}</a> and tell us what you need.
      </p>
    ),
  },
];

const highlights = [
  { title: "No data sales", text: "We never sell your personal information." },
  { title: "Private CV storage", text: "Applications are visible only to authorised staff." },
  { title: "You stay in control", text: "Ask to access, correct or delete your data." },
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

function PrivacyPolicy() {
  const active = useActiveSection(sections.map((s) => s.id));

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        intro="What we collect, why we collect it, and how you can control it."
      />

      <div className="container-site py-8 md:py-12">
        <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
          {/* Navigation: collapsible on mobile, sticky on desktop */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <details className="group rounded-lg border bg-card lg:hidden">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                On this page
                <span aria-hidden className="transition-transform group-open:rotate-180">▾</span>
              </summary>
              <TocLinks active={active} className="border-t px-4 py-3" />
            </details>

            <nav aria-label="On this page" className="hidden lg:block">
              <p className="mb-3 text-sm font-semibold text-foreground">On this page</p>
              <TocLinks active={active} />
              <p className="mt-6 text-sm text-muted-foreground">Last updated {LAST_UPDATED}</p>
            </nav>
          </aside>

          <article className="max-w-3xl">
            <p className="mb-8 text-sm text-muted-foreground lg:hidden">Last updated {LAST_UPDATED}</p>

            {/* Plain-language summary */}
            <div className="mb-12 grid gap-4 rounded-xl border bg-muted/40 p-5 sm:grid-cols-3 md:p-6">
              {highlights.map((h) => (
                <div key={h.title}>
                  <h2 className="text-base font-semibold text-foreground">{h.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{h.text}</p>
                </div>
              ))}
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
                  <div className="mt-3 space-y-3 [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:marker:text-primary">
                    {s.body}
                  </div>
                </section>
              ))}
            </div>

            {/* Contact card */}
            <div className="mt-14 flex flex-col gap-4 rounded-xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Questions about your data?</h2>
                <p className="mt-1 text-sm text-muted-foreground">Write to us and we will reply with what you need.</p>
              </div>
              <a
                href={`mailto:${company.email}?subject=Privacy%20request`}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Email us
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-sm text-muted-foreground">
              <p>This policy is a template and must be reviewed by legal counsel before publication.</p>
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

function TocLinks({ active, className = "" }: { active: string; className?: string }) {
  return (
    <ul className={`space-y-1 ${className}`}>
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={isActive ? "location" : undefined}
              className={`block border-l-2 py-1.5 pl-3 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${isActive
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