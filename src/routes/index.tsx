import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { ScrollBasedVelocity } from "@/components/ui/scroll-based-velocity";
import {
  AboutSection,
  CaseStudiesSection,
  CtaSection,
  EngagementSection,
  IndustriesSection,
  PrinciplesSection,
  ProcessSection,
  ServicesSection,
  TechnologySection,
} from "@/components/home/Sections";
import { Globe, Users, Code } from "@phosphor-icons/react";
import { Reveal, SectionHeader } from "@/components/site/primitives";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QUMI Technologies — Software, Cloud & Data Engineering from Nepal" },
      { name: "description", content: "Nepal-based technology partner engineering custom software, web and mobile apps, cloud, data and AI solutions." },
      { property: "og:title", content: "QUMI Technologies — Engineering digital products" },
      { property: "og:description", content: "Custom software, cloud, data and AI engineering from Kathmandu, Nepal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});





function ValuePropositionSection() {
  return (
    <section className="py-8 sm:py-12 md:py-20">
      <div className="container-site">
        <div className="border border-border/60 bg-surface/90 backdrop-blur-md p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl shadow-sm">
          <SectionHeader eyebrow="Why Qumi" title="Built for modern digital demands." intro="We combine silicon-valley engineering standards with the incredible technical talent pool in Kathmandu." />
          
          <div className="mt-8 sm:mt-10 md:mt-12 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Code,
                title: "Engineering Excellence",
                desc: "We don't outsource to junior teams. Every project is led by senior engineers who understand distributed systems, clean architecture, and scale."
              },
              {
                icon: Globe,
                title: "Global Perspective",
                desc: "We build for international compliance, multi-region deployments, and global audiences while operating from our HQ in Nepal."
              },
              {
                icon: Users,
                title: "True Partnership",
                desc: "We integrate directly with your teams. No black-box development. Total transparency in our sprints, codebases, and infrastructure."
              }
            ].map((v, i) => (
              <Reveal
                key={v.title}
                delay={i * 80}
                className={`rounded-xl bg-background/50 border border-border/50 p-5 sm:p-6 ${i === 2 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              >
                <div className="mb-3.5 sm:mb-4 inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <v.icon size={22} weight="duotone" className="sm:hidden" />
                  <v.icon size={24} weight="duotone" className="hidden sm:block" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold">{v.title}</h3>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <>
      <div className="border-b border-border/80 bg-surface/85 backdrop-blur-md py-1.5 overflow-hidden shadow-xs">
        <ScrollBasedVelocity
          text="QUMI TECHNOLOGIES"
          default_velocity={3}
          numRows={1}
          className="font-display text-xs sm:text-sm font-medium uppercase tracking-[0.28em] text-foreground"
        />
      </div>
      <Hero />
      <ValuePropositionSection />
      <ServicesSection />
      <CtaSection />
    </>
  );
}
