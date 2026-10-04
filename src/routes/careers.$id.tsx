import { useState, type FormEvent } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, CheckCircle, FileArrowUp } from "@phosphor-icons/react";
import { Field, Honeypot, TextArea } from "@/components/site/Field";
import { Button } from "@/components/ui/button";
import { getJob, submitApplication } from "@/lib/public.functions";
import { applicationSchema } from "@/lib/schemas";
import { supabase } from "@/integrations/supabase/client";

const jobQuery = (id: string) =>
  queryOptions({
    queryKey: ["job", id],
    queryFn: () => (id === "general" ? Promise.resolve(null) : getJob({ data: { id } })),
  });

const isUuid = (s: string) => /^[0-9a-f-]{36}$/i.test(s);

export const Route = createFileRoute("/careers/$id")({
  loader: async ({ context, params }) => {
    if (params.id !== "general" && !isUuid(params.id)) throw notFound();
    const job = await context.queryClient.ensureQueryData(jobQuery(params.id));
    if (params.id !== "general" && !job) throw notFound();
    return { title: job?.title ?? "General application", summary: job?.summary ?? "" };
  },
  head: ({ loaderData }) => {
    const t = `${loaderData?.title ?? "Careers"} — Careers at QUME Technologies`;
    const d = loaderData?.summary || "Apply to join QUME Technologies in Kathmandu, Nepal.";
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: JobPage,
  notFoundComponent: () => (
    <div className="container-site py-12">
      <h1 className="text-2xl font-bold">This role is no longer open.</h1>
      <Link to="/careers" className="mt-4 inline-block font-semibold text-primary">View open roles</Link>
    </div>
  ),
  errorComponent: () => <p className="container-site py-12">Couldn't load this role. Please refresh.</p>,
});

const ALLOWED = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

function JobPage() {
  const { id } = Route.useParams();
  const { data: job } = useSuspenseQuery(jobQuery(id));
  const send = useServerFn(submitApplication);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [fileName, setFileName] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get("resume") as File | null;
    const errs: Record<string, string> = {};
    if (!file || file.size === 0) errs["resume"] = "Please attach your CV";
    else if (!ALLOWED.includes(file.type)) errs["resume"] = "Use PDF, DOC or DOCX";
    else if (file.size > 5 * 1024 * 1024) errs["resume"] = "Maximum size is 5 MB";

    const raw = {
      job_id: job?.id ?? null,
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      portfolio_url: String(fd.get("portfolio_url") ?? ""),
      cover_letter: String(fd.get("cover_letter") ?? ""),
      website: String(fd.get("website") ?? ""),
      resume_path: null as string | null,
    };
    const pre = applicationSchema.safeParse(raw);
    if (!pre.success) pre.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus("sending");
    const safe = file!.name.replace(/[^A-Za-z0-9._-]/g, "_").slice(-100);
    const path = `applications/${crypto.randomUUID()}/${safe}`;
    const up = await supabase.storage.from("resumes").upload(path, file!, { contentType: file!.type });
    if (up.error) {
      setStatus("error");
      return;
    }
    const res = await send({ data: { ...raw, resume_path: path } }).catch(() => ({ ok: false }));
    setStatus(res.ok ? "sent" : "error");
  }

  return (
    <section className="container-site grid gap-14 py-8 md:grid-cols-12 md:py-12">
      <div className="md:col-span-5">
        <Link to="/careers" className="group inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
          <ArrowLeft className="transition-transform group-hover:-translate-x-1" /> All roles
        </Link>
        <p className="eyebrow mt-10">{job ? job.department : "Careers"}</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight">{job?.title ?? "General application"}</h1>
        {job && (
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div><dt className="text-muted-foreground">Location</dt><dd className="font-semibold">{job.location}</dd></div>
            <div><dt className="text-muted-foreground">Type</dt><dd className="font-semibold">{job.employment_type}</dd></div>
          </dl>
        )}
        <div className="mt-8 space-y-4 leading-relaxed text-muted-foreground">
          {(job?.description || job?.summary || "Tell us about yourself and the kind of work you want to do. We review every application.")
            .split(/\n{2,}/)
            .map((p, i) => <p key={i} className="whitespace-pre-line">{p}</p>)}
        </div>
      </div>
      <div className="md:col-span-6 md:col-start-7">
        {status === "sent" ? (
          <div className="animate-rise rounded-md border border-border bg-surface p-10">
            <CheckCircle size={36} weight="light" className="text-primary" />
            <h2 className="mt-5 text-2xl font-bold">Application received.</h2>
            <p className="mt-3 text-muted-foreground">Thank you for applying. Our team will review it and contact you by email.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="grid gap-5 rounded-md border border-border bg-surface p-6 md:p-8">
            <h2 className="text-xl font-bold">Apply</h2>
            <Honeypot />
            <Field label="Full name" name="name" autoComplete="name" error={errors["name"]} />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Email" name="email" type="email" autoComplete="email" error={errors["email"]} />
              <Field label="Phone" name="phone" type="tel" autoComplete="tel" optional error={errors["phone"]} />
            </div>
            <Field label="Portfolio, GitHub or LinkedIn" name="portfolio_url" type="url" placeholder="https://" optional error={errors["portfolio_url"]} />
            <div>
              <span className="mb-1.5 block text-sm font-semibold">CV / Résumé</span>
              <label htmlFor="resume" className="group flex cursor-pointer items-center gap-4 rounded-md border border-dashed border-border-strong p-5 transition-colors hover:border-primary aria-[invalid=true]:border-destructive" aria-invalid={!!errors["resume"]}>
                <FileArrowUp size={26} weight="light" className="icon-nudge text-primary" />
                <span className="text-sm">
                  <span className="font-semibold">{fileName || "Choose a file"}</span>
                  <span className="block text-muted-foreground">PDF, DOC or DOCX, up to 5 MB</span>
                </span>
              </label>
              <input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} />
              {errors["resume"] && <p className="mt-1.5 text-xs text-destructive">{errors["resume"]}</p>}
            </div>
            <TextArea label="Cover letter" name="cover_letter" optional error={errors["cover_letter"]} />
            {status === "error" && <p role="alert" className="text-sm text-destructive">We couldn't submit your application. Please try again.</p>}
            <Button type="submit" size="lg" disabled={status === "sending"}>
              {status === "sending" ? "Submitting…" : "Submit application"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
