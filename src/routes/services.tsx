import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "@phosphor-icons/react";
import { PageHero, Reveal } from "@/components/site/primitives";
import { CtaSection } from "@/components/home/Sections";
import { services } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/services")({
  head: () => pageMeta("Services", "Custom software, web & mobile, UI/UX, cloud & DevOps, data, AI, cybersecurity and IT consulting."),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="End-to-end engineering for digital products."
        intro="Eight disciplines, one accountable team. Engage us for a single capability or the full product lifecycle."
      />
      <section className="container-site py-16 md:py-24">
        <div className="border-t border-border">
          {services.map((s, i) => (
            <Reveal key={s.slug}>
              <div id={s.slug} className="grid scroll-mt-28 gap-6 border-b border-border py-10 md:grid-cols-12">
                <div className="flex items-start gap-5 md:col-span-5">
                  <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <s.icon size={28} weight="light" className="text-primary" />
                    <h2 className="mt-4 text-2xl font-bold">{s.title}</h2>
                  </div>
                </div>
                <p className="leading-relaxed text-muted-foreground md:col-span-4">{s.summary}</p>
                <ul className="space-y-2 text-sm md:col-span-3">
                  {s.detail.map((d) => (
                    <li key={d} className="flex gap-2.5">
                      <span className="mt-2 h-1 w-1 shrink-0 bg-primary" /> {d}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <Link to="/contact" className="group mt-10 inline-flex items-center gap-2 font-semibold text-primary">
          Discuss your requirements <ArrowRight className="arrow-nudge" />
        </Link>
      </section>
      <CtaSection />
    </>
  );
}
