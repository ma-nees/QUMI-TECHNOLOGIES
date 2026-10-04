# 07 — API Architecture
Server functions (`src/lib/public.functions.ts`): `listPosts`, `getPost`, `listJobs`, `getJob`, `submitContact`, `submitApplication`. All inputs zod-validated; errors return generic messages, details logged server-side. No public `/api` routes at launch.
