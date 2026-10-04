# 05 — Backend Architecture
- Server logic in `createServerFn` (no edge functions).
- Visitor submissions: server fn validates with zod, inserts with publishable client under insert-only anon policy.
- CV upload: browser uploads to private `resumes` bucket under a random path (anon insert-only policy), then application row stores the path.
- Admin: browser Supabase client with user session; RLS enforces admin role.
