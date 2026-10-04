import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "@phosphor-icons/react";
import { PageHero, Reveal } from "@/components/site/primitives";
import { listJobs } from "@/lib/public.functions";
import { principles } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

const jobsQuery = queryOptions({ queryKey: ["jobs"], queryFn: () => listJobs() });

export const Route = createFileRoute("/careers/")({
  head: () => pageMeta("Careers", "Join QUME Technologies in Kathmandu. Open roles in engineering, design and data."),
  loader: ({ context }) => context.queryClient.ensureQueryData(jobsQuery),
  component: CareersPage,
  errorComponent: () => <p className="container-site py-24">Couldn't load open roles. Please refresh.</p>,
});

function CareersPage() {
  const { data: jobs } = useSuspenseQuery(jobsQuery);
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Do the best work of your career, from Nepal."
        intro="We hire engineers, designers and analysts who care about craft and want to build software that lasts."
      />
      <section className="container-site py-16 md:py-24">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">Open positions</h2>
          <span className="font-mono text-xs text-muted-foreground">{jobs.length} open</span>
        </div>
        <div className="mt-8 border-t border-border">
          {jobs.length === 0 && (
            <div className="border-b border-border py-10">
              <p className="font-semibold">No open positions right now.</p>
              <p className="mt-2 text-muted-foreground">
                We still welcome strong candidates.{" "}
                <Link to="/careers/$id" params={{ id: "general" }} className="font-semibold text-primary hover:underline">
                  Send a general application
                </Link>
                .
              </p>
            </div>
          )}
          {jobs.map((j) => (
            <Reveal key={j.id}>
              <Link to="/careers/$id" params={{ id: j.id }} className="group grid gap-2 border-b border-border py-7 transition-colors hover:bg-surface md:grid-cols-12 md:items-center md:px-4">
                <h3 className="text-lg font-bold transition-colors group-hover:text-primary md:col-span-5">{j.title}</h3>
                <span className="text-sm text-muted-foreground md:col-span-2">{j.department}</span>
                <span className="text-sm text-muted-foreground md:col-span-2">{j.location}</span>
                <span className="text-sm text-muted-foreground md:col-span-2">{j.employment_type}</span>
                <ArrowRight className="arrow-nudge hidden text-primary md:col-span-1 md:block md:justify-self-end" />
              </Link>
            </Reveal>
          ))}
        </div>
        {jobs.length > 0 && (
          <p className="mt-6 text-sm text-muted-foreground">
            Don't see a fit?{" "}
            <Link to="/careers/$id" params={{ id: "general" }} className="font-semibold text-primary hover:underline">Send a general application</Link>.
          </p>
        )}
      </section>
      <section className="border-t border-border bg-surface py-16 md:py-24">
        <div className="container-site">
          <p className="eyebrow">Working at QUME</p>
          <div className="mt-10 grid gap-10 md:grid-cols-4">
            {principles.map((p) => (
              <div key={p.title} className="border-t-2 border-foreground pt-5">
                <h3 className="font-bold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
