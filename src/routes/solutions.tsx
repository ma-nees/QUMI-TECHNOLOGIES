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
  head: () => pageMeta("Solutions", "How QUMI Technologies solves business problems: modernisation, digital channels, operations platforms, data, AI and cloud."),
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
      <section className="container-site py-8 sm:py-10 md:py-14">
        <SectionHeader eyebrow="Common engagements" title="Where we help most." />
        <Reveal className="mt-8 sm:mt-10 md:mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s, i) => (
            <div
              key={s.title}
              className="group bg-surface p-5 sm:p-6 md:p-8 flex flex-col justify-between transition-colors duration-200 hover:bg-surface-alt/70"
            >
              <div>
                <span className="font-mono text-xs font-semibold text-primary">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-4 sm:mt-6 text-lg sm:text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                  {s.title}
                </h2>
              </div>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </Reveal>
      </section>
      <CaseStudiesSection />
      <EngagementSection />
      <CtaSection />
    </>
  );
}
