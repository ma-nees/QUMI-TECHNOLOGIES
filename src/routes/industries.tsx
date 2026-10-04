import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/primitives";
import { CtaSection, IndustriesList } from "@/components/home/Sections";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/industries")({
  head: () => pageMeta("Industries", "Software for FinTech, healthcare, education, retail, logistics, manufacturing, government and hospitality."),
  component: () => (
    <>
      <PageHero
        eyebrow="Industries"
        title="Sector knowledge built into the software."
        intro="Each industry brings different rules, users and risks. We design with those constraints from the start."
      />
      <section className="container-site py-16 md:py-24">
        <IndustriesList full />
      </section>
      <CtaSection />
    </>
  ),
});
