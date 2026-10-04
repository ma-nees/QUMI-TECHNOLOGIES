import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash, DownloadSimple, SignOut, PencilSimple, Plus } from "@phosphor-icons/react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Field, TextArea } from "@/components/site/Field";
import { Logo } from "@/components/site/Logo";
import { cn } from "@/lib/utils";

type Job = Database["public"]["Tables"]["jobs"]["Row"];
type Post = Database["public"]["Tables"]["posts"]["Row"];

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — QUMI Technologies" },
      { name: "description", content: "Manage enquiries, jobs, applications and insights." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const tabs = ["Enquiries", "Applications", "Jobs", "Insights"] as const;
const fmt = (d: string) => new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

function AdminPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Enquiries");
  const role = useQuery({
    queryKey: ["is-admin", user.id],
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      return !!data;
    },
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-surface">
        <div className="container-site flex h-16 items-center justify-between">
          <Link to="/"><Logo /></Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-muted-foreground sm:inline">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}><SignOut /> Sign out</Button>
          </div>
        </div>
      </header>
      <div className="container-site py-10">
        {role.isLoading ? (
          <p className="text-muted-foreground">Checking access…</p>
        ) : !role.data ? (
          <div className="max-w-lg rounded-md border border-border bg-surface p-8">
            <h1 className="text-xl font-bold">Access not granted</h1>
            <p className="mt-2 text-sm text-muted-foreground">Your account is signed in but does not have admin rights yet. Ask an existing administrator to grant access.</p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Admin</h1>
            <div role="tablist" className="mt-6 flex gap-6 border-b border-border">
              {tabs.map((t) => (
                <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cn("-mb-px border-b-2 pb-3 text-sm font-semibold transition-colors", tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
                  {t}
                </button>
              ))}
            </div>
            <div className="mt-8">
              {tab === "Enquiries" && <Enquiries />}
              {tab === "Applications" && <Applications />}
              {tab === "Jobs" && <Jobs />}
              {tab === "Insights" && <Insights />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-md border border-border bg-surface p-8 text-sm text-muted-foreground">{text}</p>;
}

function Enquiries() {
  const q = useQuery({
    queryKey: ["admin-enquiries"],
    queryFn: async () => (await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  async function del(id: string) {
    if (!confirm("Delete this enquiry?")) return;
    await supabase.from("contact_submissions").delete().eq("id", id);
    q.refetch();
  }
  if (!q.data?.length) return <Empty text={q.isLoading ? "Loading…" : "No enquiries yet."} />;
  return (
    <div className="space-y-4">
      {q.data.map((r) => (
        <article key={r.id} className="rounded-md border border-border bg-surface p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-bold">{r.name} {r.company && <span className="font-normal text-muted-foreground">· {r.company}</span>}</h3>
              <a href={`mailto:${r.email}`} className="text-sm text-primary">{r.email}</a>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {r.topic && <span className="rounded-sm border border-border px-2 py-0.5">{r.topic}</span>}
              {fmt(r.created_at)}
              <button aria-label="Delete" onClick={() => del(r.id)} className="hover:text-destructive"><Trash size={16} /></button>
            </div>
          </div>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed">{r.message}</p>
        </article>
      ))}
    </div>
  );
}

function Applications() {
  const q = useQuery({
    queryKey: ["admin-apps"],
    queryFn: async () => (await supabase.from("job_applications").select("*, jobs(title)").order("created_at", { ascending: false })).data ?? [],
  });
  async function download(path: string) {
    const { data, error } = await supabase.storage.from("resumes").createSignedUrl(path, 60);
    if (error || !data) { toast.error("Couldn't open the file"); return; }
    window.open(data.signedUrl, "_blank", "noopener");
  }
  async function del(id: string, path: string | null) {
    if (!confirm("Delete this application and its CV?")) return;
    if (path) await supabase.storage.from("resumes").remove([path]);
    await supabase.from("job_applications").delete().eq("id", id);
    q.refetch();
  }
  if (!q.data?.length) return <Empty text={q.isLoading ? "Loading…" : "No applications yet."} />;
  return (
    <div className="space-y-4">
      {q.data.map((a) => (
        <article key={a.id} className="rounded-md border border-border bg-surface p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-bold">{a.name}</h3>
              <p className="text-sm text-muted-foreground">{(a.jobs as { title: string } | null)?.title ?? "General application"} · {fmt(a.created_at)}</p>
              <p className="mt-1 text-sm"><a className="text-primary" href={`mailto:${a.email}`}>{a.email}</a>{a.phone && ` · ${a.phone}`}</p>
              {a.portfolio_url && <a href={a.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">{a.portfolio_url}</a>}
            </div>
            <div className="flex gap-2">
              {a.resume_path && <Button size="sm" variant="outline" onClick={() => download(a.resume_path!)}><DownloadSimple /> CV</Button>}
              <Button size="sm" variant="ghost" aria-label="Delete" onClick={() => del(a.id, a.resume_path)}><Trash /></Button>
            </div>
          </div>
          {a.cover_letter && <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{a.cover_letter}</p>}
        </article>
      ))}
    </div>
  );
}

function Jobs() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Job> | null>(null);
  const q = useQuery({ queryKey: ["admin-jobs"], queryFn: async () => (await supabase.from("jobs").select("*").order("created_at", { ascending: false })).data ?? [] });

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const row = {
      title: String(fd.get("title")).trim(),
      department: String(fd.get("department")).trim() || "Engineering",
      location: String(fd.get("location")).trim() || "Kathmandu, Nepal",
      employment_type: String(fd.get("employment_type")).trim() || "Full-time",
      summary: String(fd.get("summary")).trim(),
      description: String(fd.get("description")).trim(),
      is_open: fd.get("is_open") === "on",
    };
    if (!row.title) { toast.error("Title is required"); return; }
    const res = editing?.id ? await supabase.from("jobs").update(row).eq("id", editing.id) : await supabase.from("jobs").insert(row);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Saved");
    setEditing(null);
    q.refetch();
    qc.invalidateQueries({ queryKey: ["jobs"] });
  }
  async function del(id: string) {
    if (!confirm("Delete this job?")) return;
    await supabase.from("jobs").delete().eq("id", id);
    q.refetch();
  }

  if (editing)
    return (
      <form onSubmit={save} className="grid max-w-2xl gap-4 rounded-md border border-border bg-surface p-6">
        <Field label="Title" name="title" defaultValue={editing.title} required />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Department" name="department" defaultValue={editing.department ?? "Engineering"} />
          <Field label="Location" name="location" defaultValue={editing.location ?? "Kathmandu, Nepal"} />
          <Field label="Type" name="employment_type" defaultValue={editing.employment_type ?? "Full-time"} />
        </div>
        <Field label="Summary" name="summary" defaultValue={editing.summary} />
        <TextArea label="Description" name="description" rows={10} defaultValue={editing.description} />
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="is_open" defaultChecked={editing.is_open ?? true} /> Open for applications</label>
        <div className="flex gap-3"><Button type="submit">Save</Button><Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div>
      </form>
    );

  return (
    <div>
      <Button onClick={() => setEditing({})}><Plus /> New job</Button>
      <div className="mt-6 divide-y divide-border rounded-md border border-border bg-surface">
        {!q.data?.length && <p className="p-6 text-sm text-muted-foreground">No jobs yet.</p>}
        {q.data?.map((j) => (
          <div key={j.id} className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="font-semibold">{j.title}</p>
              <p className="text-sm text-muted-foreground">{j.department} · {j.location} · {j.is_open ? "Open" : "Closed"}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditing(j)}><PencilSimple /> Edit</Button>
              <Button size="sm" variant="ghost" aria-label="Delete" onClick={() => del(j.id)}><Trash /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);

function Insights() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Post> | null>(null);
  const q = useQuery({ queryKey: ["admin-posts"], queryFn: async () => (await supabase.from("posts").select("*").order("created_at", { ascending: false })).data ?? [] });

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title")).trim();
    const published = fd.get("published") === "on";
    const row = {
      title,
      slug: slugify(String(fd.get("slug")).trim() || title),
      category: String(fd.get("category")).trim() || "Engineering",
      excerpt: String(fd.get("excerpt")).trim(),
      body: String(fd.get("body")).trim(),
      published,
      published_at: published ? editing?.published_at ?? new Date().toISOString() : null,
    };
    if (!title || !row.slug) { toast.error("Title is required"); return; }
    const res = editing?.id ? await supabase.from("posts").update(row).eq("id", editing.id) : await supabase.from("posts").insert(row);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Saved");
    setEditing(null);
    q.refetch();
    qc.invalidateQueries({ queryKey: ["posts"] });
  }
  async function del(id: string) {
    if (!confirm("Delete this article?")) return;
    await supabase.from("posts").delete().eq("id", id);
    q.refetch();
  }

  if (editing)
    return (
      <form onSubmit={save} className="grid max-w-3xl gap-4 rounded-md border border-border bg-surface p-6">
        <Field label="Title" name="title" defaultValue={editing.title} required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="URL slug" name="slug" defaultValue={editing.slug} hint="Leave blank to generate from title" />
          <Field label="Category" name="category" defaultValue={editing.category ?? "Engineering"} />
        </div>
        <Field label="Excerpt" name="excerpt" defaultValue={editing.excerpt} />
        <TextArea label="Body" name="body" rows={16} defaultValue={editing.body} />
        <p className="-mt-2 text-xs text-muted-foreground">Separate paragraphs with a blank line. Start a line with "## " for a subheading.</p>
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="published" defaultChecked={editing.published ?? false} /> Published</label>
        <div className="flex gap-3"><Button type="submit">Save</Button><Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div>
      </form>
    );

  return (
    <div>
      <Button onClick={() => setEditing({})}><Plus /> New article</Button>
      <div className="mt-6 divide-y divide-border rounded-md border border-border bg-surface">
        {!q.data?.length && <p className="p-6 text-sm text-muted-foreground">No articles yet.</p>}
        {q.data?.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="font-semibold">{p.title}</p>
              <p className="text-sm text-muted-foreground">/{p.slug} · {p.published ? "Published" : "Draft"}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditing(p)}><PencilSimple /> Edit</Button>
              <Button size="sm" variant="ghost" aria-label="Delete" onClick={() => del(p.id)}><Trash /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
