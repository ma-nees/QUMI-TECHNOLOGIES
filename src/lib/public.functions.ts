import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { applicationSchema, contactSchema } from "./schemas";

function publicClient() {
  const key = (process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"])!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export type PostSummary = { id: string; slug: string; title: string; excerpt: string; category: string; published_at: string | null };
export type Post = PostSummary & { body: string };
export type JobSummary = { id: string; title: string; department: string; location: string; employment_type: string; summary: string };
export type Job = JobSummary & { description: string };

export const listPosts = createServerFn({ method: "GET" }).handler(async (): Promise<PostSummary[]> => {
  const { data, error } = await publicClient()
    .from("posts")
    .select("id, slug, title, excerpt, category, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) {
    console.error("listPosts", error.message);
    return [];
  }
  return data ?? [];
});

export const getPost = createServerFn({ method: "GET" })
  .validator((d: { slug: string }) => z.object({ slug: z.string().max(200) }).parse(d))
  .handler(async ({ data }): Promise<Post | null> => {
    const { data: row, error } = await publicClient()
      .from("posts")
      .select("id, slug, title, excerpt, category, published_at, body")
      .eq("published", true)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) console.error("getPost", error.message);
    return row ?? null;
  });

export const listJobs = createServerFn({ method: "GET" }).handler(async (): Promise<JobSummary[]> => {
  const { data, error } = await publicClient()
    .from("jobs")
    .select("id, title, department, location, employment_type, summary")
    .eq("is_open", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("listJobs", error.message);
    return [];
  }
  return data ?? [];
});

export const getJob = createServerFn({ method: "GET" })
  .validator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }): Promise<Job | null> => {
    const { data: row, error } = await publicClient()
      .from("jobs")
      .select("id, title, department, location, employment_type, summary, description")
      .eq("is_open", true)
      .eq("id", data.id)
      .maybeSingle();
    if (error) console.error("getJob", error.message);
    return row ?? null;
  });

export const submitContact = createServerFn({ method: "POST" })
  .validator((d: unknown) => contactSchema.parse(d))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true };
    const { error } = await publicClient().from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      company: data.company || null,
      topic: data.topic || null,
      message: data.message,
    });
    if (error) {
      console.error("submitContact", error.message);
      return { ok: false, error: "We couldn't send your message. Please try again." };
    }
    return { ok: true };
  });

export const submitApplication = createServerFn({ method: "POST" })
  .validator((d: unknown) => applicationSchema.parse(d))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true };
    const { error } = await publicClient().from("job_applications").insert({
      job_id: data.job_id,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      portfolio_url: data.portfolio_url || null,
      cover_letter: data.cover_letter || null,
      resume_path: data.resume_path,
    });
    if (error) {
      console.error("submitApplication", error.message);
      return { ok: false, error: "We couldn't submit your application. Please try again." };
    }
    return { ok: true };
  });
