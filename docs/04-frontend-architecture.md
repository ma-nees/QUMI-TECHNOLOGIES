# 04 — Frontend Architecture
- `src/routes/` file routes; `__root.tsx` owns html shell, fonts, header/footer, Toaster.
- `src/components/site/` layout pieces (Header, Footer, Section, Reveal).
- `src/components/home/` homepage sections.
- `src/components/three/` 3D hero, imported with `React.lazy` inside a client-only gate.
- `src/lib/content.ts` static marketing content (services, industries, tech, process).
- `src/lib/*.functions.ts` server functions; `src/lib/schemas.ts` zod schemas.
- Data reads: loader `ensureQueryData` + `useSuspenseQuery`.
- No colour utilities in components; tokens only.
