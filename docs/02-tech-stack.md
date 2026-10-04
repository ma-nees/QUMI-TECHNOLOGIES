# 02 — Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | TanStack Start v1 (React 19, Vite 7) | SSR + server functions in one codebase, edge-deployable |
| Routing | TanStack Router (file-based) | Type-safe routes, loaders, head() metadata |
| Styling | Tailwind CSS v4 (tokens in `src/styles.css`) | Design tokens, no runtime CSS |
| UI primitives | shadcn/ui (Radix) | Accessible primitives, restyled |
| Icons | Phosphor Icons (only icon set) | Consistent stroke, no Lucide per brief |
| 3D | three.js (vanilla, lazy-loaded) | Small surface, no extra React renderer |
| Data | TanStack Query | Loader prefetch + suspense reads |
| Validation | zod | Shared client/server schemas |
| Backend | Lovable Cloud (Postgres, Auth, Storage) | Managed DB, auth and file storage |
| Runtime | Cloudflare Workers (workerd) | Edge SSR |
| Fonts | Manrope (headings/body), JetBrains Mono (labels) | Professional, non-default |

Animation: CSS transitions + IntersectionObserver. No GSAP/Framer to keep JS small.
