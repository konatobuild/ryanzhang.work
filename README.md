# ryanzhang.work

Monorepo for **[ryanzhang.work](https://ryanzhang.work)** — Ryan Zhang's
portfolio main site plus incremental demo apps.

---

## 🚨 Adding a new demo — READ THIS FIRST

**Demos are added ONE AT A TIME, by hand, when Ryan is ready to work on them.**

**Do not** scaffold multiple demo apps in a single session. **Do not**
batch-create `apps/demo-*` directories. This rule exists because each demo
needs:

- A deliberate scenario brief (10–15 min human thinking per the portfolio
  architecture doc §0.5)
- Its own visual direction — the whole point is that the 9 demos look like
  different projects, not the same template re-skinned
- Its own vibe-coded prototype and live deploy
- Case-study copy reverse-engineered from the prototype

Scaffolding nine apps at once produces nine half-baked demos. Don't do it.

### Workflow to add one demo (do this each time)

1. **Update the case registry.** Edit [`apps/portfolio/lib/cases.ts`][cases]:
   flip the entry's `status` from `"placeholder"` to `"live"`; fill
   `summary`, `subdomain` (or `liveUrl`), `coverImage`, and optionally
   `accent` (that demo's own brand color).
2. **Scaffold the demo app.** `apps/demo-<slug>/` — framework chosen per
   demo. Typical: Next.js 16 + Tailwind v4 for anything with SEO; Vite +
   React for fast-iteration landings.
3. **Build the prototype.** Vibe-code the UI, mock the data. Deploy to
   Vercel. Configure the subdomain CNAME in Cloudflare.
4. **Reverse-engineer the case study.** Create
   `apps/portfolio/app/work/<slug>/page.tsx` using the template components
   in [`apps/portfolio/components/case-study/`][template]. Fill Hero,
   Context (150–200 words, specific), Approach (3–4 decisions), Showcase,
   BottomNav.
5. **Verify Featured Work.** The home page grid reflects the new `"live"`
   card automatically.
6. **Commit** using the gridex style — English, imperative, sentence-case,
   no conventional-commit prefix, no `Co-Authored-By` footer. Example:
   `Ship fleet operations dashboard demo and case study`.

[cases]: ./apps/portfolio/lib/cases.ts
[template]: ./apps/portfolio/components/case-study/

---

## Structure

```
ryanzhang.work/
├── apps/
│   └── portfolio/            # ryanzhang.work main site (Next.js 16 + TS + Tailwind v4)
│       ├── app/              # Routes (App Router)
│       ├── components/       # UI + case-study template
│       ├── lib/cases.ts      # Single source of truth for the Featured Work grid
│       └── public/awards/    # Red Dot, MUSE, NY, London logos
├── packages/                 # Empty — reserved for future shared code
├── pnpm-workspace.yaml
└── package.json              # Root workspace scripts
```

Each demo added later lives at `apps/demo-<slug>/` and deploys to its own
Vercel project on a subdomain (`<slug>.ryanzhang.work`).

---

## Tech

| Layer | Choice |
| --- | --- |
| Monorepo | pnpm workspaces (pnpm 9+) |
| Portfolio framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 via `@tailwindcss/postcss`, tokens in `@theme` |
| Fonts | `next/font/google` — Inter (display, tight tracking) + Geist Mono (meta) |
| Hosting | Vercel (portfolio → `ryanzhang.work`; demos → subdomains) |
| DNS | Cloudflare |

Demo tech stack is **decided per demo** — not locked at monorepo level.

---

## Design system

**Palette** — pure white (`#FFFFFF`) canvas, near-black (`#0A0A0A`) ink,
**Klein Blue `#002FA7`** as the signature accent.

**Klein Blue usage discipline** — the accent is a scarce resource:

- Primary CTA hover/focus states, link-underline hover, focus rings
- Active nav indicator, selected-state markers, hero accent word
- **Not** body text. **Not** card fills. **Not** large surfaces.
- Target: < 10% of any page's visual weight.

Default ink does the heavy lifting; Klein is the signature spike.

**Type** — Inter display with `-0.03em`/`-0.04em` tracking. Geist Mono at
10–12px, uppercase, `0.08em` tracking, for meta labels and numeric data.

**Cards** — 32px border radius, 1px hairline border
(`rgba(0,0,0,0.08)`), soft drop shadow. Pill buttons, `h-12` default.

Design tokens live in
[`apps/portfolio/app/globals.css`](./apps/portfolio/app/globals.css)
(`@theme` block).

---

## Local development

```bash
# From repo root
pnpm install
pnpm dev            # starts apps/portfolio on http://localhost:3000
pnpm build          # production build
pnpm lint           # lint the portfolio
```

---

## Conventions

- **Commits** — English, imperative, sentence-case, no conventional-commit
  prefix, no `Co-Authored-By` footer. (`Scaffold portfolio skeleton`, not
  `feat: scaffold portfolio skeleton`.)
- **Content markers** — `{/* TODO: Ryan */}` flags copy that Ryan will
  rewrite in his own voice.
- **Single-app context for agents** — when working on a demo, open an
  editor/agent session in `apps/demo-<slug>/` only. Do not give the agent
  simultaneous context over every app.

---

## License

All rights reserved. © Ryan Zhang.
