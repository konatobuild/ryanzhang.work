# ryanzhang.work — agent operating notes

Next.js 16 pnpm monorepo: a portfolio site at `apps/portfolio/` plus up
to 9 demos at `apps/demo-<slug>/`, each deploying to its own Vercel
project at `<slug>.ryanzhang.work`. Single git repo, single `main`
branch, **multiple demos in flight at any time** — never assume serial
progress.

## Commit rules (enforce without being asked)

Before any commit, verify all four:

1. **Workstream boundary** — the diff touches exactly one of:
   - `apps/portfolio/**` (portfolio)
   - `apps/demo-<slug>/**` (a single demo)
   - infra: root config, `pnpm-lock.yaml`, `.claude/launch.json`,
     `.gitignore`, `ROADMAP.md`, `packages/**`

   If two workstreams → split with `git add -p`.

2. **Title prefix**:
   - Portfolio → **no prefix** (imperative sentence-case)
   - Demo → `[<slug>] Title` where `<slug>` matches `cases.ts`
   - Infra → `[infra] Title`
   - Ship commit (flips `cases.ts` status) → `Ship <slug> demo and case study`

3. **Green gate** — `pnpm --filter <workstream> build && lint` pass.

4. **Never** — Conventional-Commits prefixes (`feat:` / `chore:` / `fix:`),
   `Co-Authored-By` footer, mixing workstreams.

## Branch + PR workflow

- **Demo work** → branch `demo/<slug>` → push → `gh pr create` → squash-merge → delete branch
- **Infra** ≤3 files, no code → OK to commit directly to `main`
- **Infra** otherwise → `infra/<theme>` branch → PR
- **Portfolio** small → direct to `main`; large → `portfolio/<theme>` branch → PR
- **Always squash-merge** (not merge-commit, not rebase-merge). Delete branch after merge.

When in doubt, use the branch + PR path — it's reversible.

## Example titles

```
Drop in the real hero portrait at full quality                       # portfolio
[legal-landing] Scaffold Meridian & Cole from Claude Design handoff  # demo
[legal-landing] Pass copy through industry-reality check             # demo
[saas-landing] Tune LATTICE hero rhythm across breakpoints           # demo
[infra] Bump Next.js to 16.3.0                                       # infra
Ship logistics-dashboard demo and case study                         # ship
```

## Canonical docs

- [README.md §"Commit discipline"](./README.md#-commit-discipline) — full rules; re-read if this file seems outdated
- [README.md §"Adding a new demo"](./README.md#-adding-a-new-demo--read-this-first) — 6-step scaffolding workflow. **One demo at a time, never batch.**
- [ROADMAP.md](./ROADMAP.md) — demo stages (idea / wip / shipped / retired); update in the same commit that moves a demo between stages
- [apps/portfolio/lib/cases.ts](./apps/portfolio/lib/cases.ts) — machine-readable source of truth for Featured Work

## Next.js 16 — not the one you were trained on

This repo is on Next.js 16 with breaking changes from 15. Before writing
Next.js code, read the relevant guide in `node_modules/next/dist/docs/`
(from whichever workspace you're editing). Heed deprecation notices.
The portfolio app repeats this in `apps/portfolio/AGENTS.md`.
