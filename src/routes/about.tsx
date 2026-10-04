import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Reveal } from "@/components/site/primitives";
import { CtaSection, PrinciplesSection, ProcessSection, TechnologySection } from "@/components/home/Sections";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => pageMeta("About", "QUMI Technologies is a Nepal-based IT company focused on engineering-driven software, cloud and data work."),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About QUMI"
        title="A technology company from Nepal, built for the long term."
        intro="We exist to show that dependable, well-engineered software can be designed and built in Nepal — for clients here and around the world."
      />
      <section className="container-site py-8 md:py-12">
        <div className="border border-border bg-surface/80 backdrop-blur-md p-8 md:p-12 rounded-xl shadow-sm grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <h2 className="text-3xl font-bold leading-tight">What we stand for</h2>
          </Reveal>
          <Reveal delay={100} className="space-y-5 text-lg leading-relaxed text-muted-foreground md:col-span-7">
            <p>
              We treat software as infrastructure for the organisations that rely on it. That means thinking about
              security, performance and maintainability from the first line of code — not after launch.
            </p>
            <p>
              We prefer long partnerships over one-off projects. The best results come from understanding a business
              deeply and improving its systems over time.
            </p>
            <p>
              We are proud to be based in Kathmandu and to contribute to Nepal's growing technology community through
              the people we hire, train and work alongside.
            </p>
          </Reveal>
        </div>
      </section>
      <PrinciplesSection />
      <ProcessSection />
      <TechnologySection />
      <CtaSection />
    </>
  );
}
