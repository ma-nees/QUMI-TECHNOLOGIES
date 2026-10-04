import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QUME Technologies — Software, Cloud & Data Engineering from Nepal" },
      { name: "description", content: "Nepal-based technology partner engineering custom software, web and mobile apps, cloud, data and AI solutions." },
      { property: "og:title", content: "QUME Technologies — Engineering digital products" },
      { property: "og:description", content: "Custom software, cloud, data and AI engineering from Kathmandu, Nepal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <AboutSection />
      <TechnologySection />
      <IndustriesSection />
      <CaseStudiesSection />
      <ProcessSection />
      <PrinciplesSection />
      <EngagementSection />
      <CtaSection />
    </>
  );
}
