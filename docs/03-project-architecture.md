# 03 — Project Architecture

```text
Browser ──SSR HTML──> TanStack Start (Worker)
   │                     ├─ route loaders → server functions (createServerFn)
   │                     └─ public reads via publishable key (RLS anon policies)
   └─ authenticated admin → server fns with bearer token (requireSupabaseAuth)
                               └─ Lovable Cloud: Postgres + Auth + Storage
```
- Public content (published posts, open jobs) is read through RLS `anon` SELECT policies.
- Writes from visitors (contact, applications) go through validated server functions.
- Admin writes use the signed-in user's session; RLS checks `has_role(auth.uid(),'admin')`.
