import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "@phosphor-icons/react";
import { PageHero, Reveal } from "@/components/site/primitives";
import { listPosts } from "@/lib/public.functions";
import { pageMeta } from "@/lib/seo";

const postsQuery = queryOptions({ queryKey: ["posts"], queryFn: () => listPosts() });

export const Route = createFileRoute("/insights/")({
  head: () => pageMeta("Insights", "Articles on software engineering, cloud, data and technology strategy from the QUME Technologies team."),
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  component: InsightsPage,
  errorComponent: () => <p className="container-site py-24">Couldn't load articles. Please refresh.</p>,
});

const fmtDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

function InsightsPage() {
  const { data: posts } = useSuspenseQuery(postsQuery);
  return (
    <>
      <PageHero eyebrow="Insights" title="Notes on engineering and technology." intro="Practical writing from our team on building, running and improving software systems." />
      <section className="container-site py-16 md:py-24">
        {posts.length === 0 ? (
          <div className="rounded-md border border-border bg-surface p-10">
            <p className="font-semibold">Our first articles are on the way.</p>
            <p className="mt-2 text-muted-foreground">Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 60}>
                <Link to="/insights/$slug" params={{ slug: p.slug }} className="group card-interactive flex h-full flex-col rounded-md p-7">
                  <div className="flex justify-between font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">
                    <span className="text-primary">{p.category}</span>
                    <span>{fmtDate(p.published_at)}</span>
                  </div>
                  <h2 className="mt-6 text-xl font-bold leading-snug transition-colors group-hover:text-primary">{p.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">Read article <ArrowRight className="arrow-nudge" /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
