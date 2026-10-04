import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/primitives";
import { company } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => pageMeta("Terms & Conditions", "Terms governing the use of the QUMI Technologies website."),
  component: () => (
    <>
      <PageHero eyebrow="Legal" title="Terms & Conditions" intro="This template must be reviewed by legal counsel before publication." />
      <article className="container-site max-w-3xl space-y-8 py-8 md:py-12 leading-relaxed text-muted-foreground [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground">
        <section><h2>Use of this website</h2><p className="mt-3">This website provides information about {company.name}. By using it you agree to these terms.</p></section>
        <section><h2>Intellectual property</h2><p className="mt-3">Content, design and branding on this site belong to {company.name} unless stated otherwise.</p></section>
        <section><h2>No warranty</h2><p className="mt-3">Information is provided in good faith but without warranty of completeness or accuracy.</p></section>
        <section><h2>Governing law</h2><p className="mt-3">These terms are governed by the laws of Nepal.</p></section>
        <section><h2>Contact</h2><p className="mt-3">Questions about these terms can be sent to {company.email}.</p></section>
      </article>
    </>
  ),
});
