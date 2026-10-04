import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Reveal, SectionHeader } from "@/components/site/primitives";
import { CaseStudiesSection, CtaSection, EngagementSection } from "@/components/home/Sections";
import { pageMeta } from "@/lib/seo";

const solutions = [
  { title: "Legacy modernisation", text: "Move ageing systems to maintainable architectures in stages, without stopping the business." },
  { title: "Digital customer channels", text: "Customer portals and mobile apps that replace counters, phone calls and paperwork." },
  { title: "Operations platforms", text: "Internal tools for approvals, inventory, scheduling and field work — built around your process." },
  { title: "Data foundations", text: "Reliable pipelines and reporting so decisions rest on one trusted version of the numbers." },
  { title: "Applied AI", text: "Document processing, search and assistants that work on your data, with human oversight." },
  { title: "Cloud migration", text: "Plan and execute moves to AWS or Azure with cost, security and resilience in view." },
];

export const Route = createFileRoute("/solutions")({
  head: () => pageMeta("Solutions", "How QUME Technologies solves business problems: modernisation, digital channels, operations platforms, data, AI and cloud."),
  component: SolutionsPage,
});

function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Technology applied to concrete business problems."
        intro="We start from the outcome you need, then choose the architecture and tools that get you there."
      />
      <section className="container-site py-16 md:py-24">
        <SectionHeader eyebrow="Common engagements" title="Where we help most." />
        <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
          {solutions.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 60} className="bg-surface p-8">
              <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="mt-6 text-xl font-bold">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <CaseStudiesSection />
      <EngagementSection />
      <CtaSection />
    </>
  );
}
