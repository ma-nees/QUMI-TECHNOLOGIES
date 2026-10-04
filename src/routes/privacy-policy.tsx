import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/primitives";
import { company } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/privacy-policy")({
  head: () => pageMeta("Privacy Policy", "How QUMI Technologies collects, uses and protects personal information."),
  component: () => (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" intro="This template must be reviewed by legal counsel before publication." />
      <article className="container-site max-w-3xl space-y-8 py-8 md:py-12 leading-relaxed text-muted-foreground [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground">
        <section><h2>Information we collect</h2><p className="mt-3">When you contact us or apply for a role, we collect the details you provide: name, email, phone, company, message, and any CV or portfolio you submit.</p></section>
        <section><h2>How we use it</h2><p className="mt-3">We use this information only to respond to enquiries, assess job applications and operate our services. We do not sell personal data.</p></section>
        <section><h2>Storage and security</h2><p className="mt-3">Data is stored with access restricted to authorised staff. CVs are kept in private storage.</p></section>
        <section><h2>Retention</h2><p className="mt-3">We keep enquiries and applications only as long as needed for the purpose they were submitted for, or as required by law.</p></section>
        <section><h2>Your rights</h2><p className="mt-3">You may ask us to access, correct or delete your data by writing to {company.email}.</p></section>
      </article>
    </>
  ),
});
