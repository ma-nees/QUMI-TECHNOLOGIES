import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft } from "@phosphor-icons/react";
import { getPost } from "@/lib/public.functions";

const postQuery = (slug: string) => queryOptions({ queryKey: ["post", slug], queryFn: () => getPost({ data: { slug } }) });
const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "");

export const Route = createFileRoute("/insights/$slug")({
  loader: async ({ context, params }) => {
    const post = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!post) throw notFound();
    return { title: post.title, excerpt: post.excerpt };
  },
  head: ({ loaderData }) => {
    const t = `${loaderData?.title ?? "Insights"} — QUME Technologies`;
    const d = loaderData?.excerpt || "An article from the QUME Technologies team.";
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: PostPage,
  notFoundComponent: () => (
    <div className="container-site py-24">
      <h1 className="text-2xl font-bold">Article not found.</h1>
      <Link to="/insights" className="mt-4 inline-block font-semibold text-primary">All insights</Link>
    </div>
  ),
  errorComponent: () => <p className="container-site py-24">Couldn't load this article. Please refresh.</p>,
});

function PostPage() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(postQuery(slug));
  if (!post) return null;
  return (
    <article className="container-site max-w-3xl py-14 md:py-20">
      <Link to="/insights" className="group inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
        <ArrowLeft className="transition-transform group-hover:-translate-x-1" /> All insights
      </Link>
      <p className="eyebrow mt-10">{post.category}</p>
      <h1 className="mt-4 text-4xl font-bold leading-[1.1] md:text-5xl">{post.title}</h1>
      <p className="mt-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">{fmt(post.published_at)}</p>
      {post.excerpt && <p className="mt-8 text-xl leading-relaxed text-muted-foreground">{post.excerpt}</p>}
      <div className="mt-10 space-y-6 border-t border-border pt-10 text-[1.05rem] leading-[1.8]">
        {post.body.split(/\n{2,}/).map((para, i) =>
          para.startsWith("## ") ? (
            <h2 key={i} className="pt-4 text-2xl font-bold">{para.slice(3)}</h2>
          ) : (
            <p key={i} className="whitespace-pre-line">{para}</p>
          ),
        )}
      </div>
    </article>
  );
}
