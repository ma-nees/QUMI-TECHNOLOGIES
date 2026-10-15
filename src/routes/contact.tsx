import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { EnvelopeSimple, Phone, MapPin, CheckCircle, ArrowRight } from "@phosphor-icons/react";
import { PageHero } from "@/components/site/primitives";
import { Field, Honeypot, TextArea, fieldClass } from "@/components/site/Field";
import { Button } from "@/components/ui/button";
import { contactSchema } from "@/lib/schemas";
import { submitContact, fetchCompanySettings } from "@/lib/public.functions";
import { company } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  loader: async () => {
    const settings = await fetchCompanySettings();
    return { settings };
  },
  head: () => pageMeta("Contact", "Start a project or ask a question. Talk to the QUMI Technologies team in Kathmandu, Nepal."),
  component: ContactPage,
});

const topics = ["New project", "Existing system", "Consulting", "Partnership", "Other"];

function ContactPage() {
  const { settings } = Route.useLoaderData();
  const send = useServerFn(submitContact);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("sending");
    const res = await send({ data: parsed.data }).catch(() => ({ ok: false, error: "Network error. Please try again." }));
    if (res.ok) setStatus("sent");
    else {
      setServerError("error" in res && res.error ? res.error : "Something went wrong.");
      setStatus("error");
    }
  }

  const email = settings?.email || company.email;
  const phone = settings?.mobile_number || company.phone;
  const address = settings?.location || company.address;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what you're building."
        intro="Share a few details about your project or question. A member of our team will reply by email."
      />
      <section className="container-site grid gap-6 py-8 sm:gap-8 md:gap-14 md:grid-cols-12 md:py-12">
        <div className="md:col-span-7 border border-border bg-surface/90 backdrop-blur-md p-5 sm:p-7 md:p-10 rounded-xl sm:rounded-2xl shadow-sm">
          {status === "sent" ? (
            <div className="animate-rise">
              <CheckCircle size={36} weight="light" className="text-primary" />
              <h2 className="mt-5 text-2xl font-bold">Thank you — your message has been received.</h2>
              <p className="mt-3 text-muted-foreground">We'll get back to you at the email address you provided.</p>
              <Button variant="outline" className="mt-8" onClick={() => setStatus("idle")}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:gap-5 md:grid-cols-2">
              <Honeypot />
              <Field label="Full name" name="name" autoComplete="name" error={errors["name"]} />
              <Field label="Work email" name="email" type="email" autoComplete="email" error={errors["email"]} />
              <Field label="Company" name="company" autoComplete="organization" optional error={errors["company"]} />
              <div>
                <label htmlFor="topic" className="mb-1.5 block text-sm font-semibold">Topic</label>
                <select id="topic" name="topic" className={fieldClass} defaultValue={topics[0]}>
                  {topics.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <TextArea label="How can we help?" name="message" className="md:col-span-2" error={errors["message"]} rows={5} />
              {status === "error" && <p role="alert" className="text-sm text-destructive md:col-span-2">{serverError}</p>}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 md:col-span-2 pt-1 sm:pt-2">
                <p className="text-xs text-muted-foreground text-center sm:text-left">We use your details only to respond to this enquiry.</p>
                <Button type="submit" size="lg" disabled={status === "sending" || status === "sent"} className="w-full sm:w-auto justify-center">
                  {status === "sending" ? "Sending…" : "Send message"} <ArrowRight weight="bold" className="arrow-nudge" />
                </Button>
              </div>
            </form>
          )}
        </div>
        
        <aside className="md:col-span-5 h-fit border border-border bg-surface/90 backdrop-blur-md p-5 sm:p-7 md:p-10 rounded-xl sm:rounded-2xl shadow-sm">
          <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">Direct contact</h2>
          <ul className="mt-5 sm:mt-6 divide-y divide-border/50 border-y border-border/50">
            <li className="flex items-center gap-3.5 sm:gap-4 py-4 sm:py-5"><EnvelopeSimple size={22} weight="light" className="text-primary shrink-0" /><a href={`mailto:${email}`} className="font-semibold hover:text-primary break-all text-xs sm:text-sm">{email}</a></li>
            <li className="flex items-center gap-3.5 sm:gap-4 py-4 sm:py-5"><Phone size={22} weight="light" className="text-primary shrink-0" /><a href={`tel:${phone.replace(/\s/g, "")}`} className="font-semibold hover:text-primary text-xs sm:text-sm">{phone}</a></li>
            <li className="flex items-center gap-3.5 sm:gap-4 py-4 sm:py-5"><MapPin size={22} weight="light" className="text-primary shrink-0" /><span className="font-semibold text-xs sm:text-sm">{address}</span></li>
          </ul>
          <p className="mt-5 sm:mt-6 text-xs sm:text-sm leading-relaxed text-muted-foreground">Office hours: Sunday to Friday, Nepal Time (UTC+5:45).</p>
        </aside>
      </section>
    </>
  );
}
