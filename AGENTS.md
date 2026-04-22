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

- **Demo work** → **worktree** at `.claude/worktrees/<slug>/` on branch `demo/<slug>` → push → `gh pr create` → squash-merge → delete branch + remove worktree. See "Worktree workflow" below.
- **Infra** ≤3 files, no code → OK to commit directly to `main` (no worktree)
- **Infra** otherwise → `infra/<theme>` branch → PR
- **Portfolio** small → direct to `main`; large → `portfolio/<theme>` branch → PR
- **Always squash-merge** (not merge-commit, not rebase-merge). Delete branch after merge.

When in doubt, use the branch + PR path — it's reversible.

## Worktree workflow (demos only)

Parallel demo work runs in isolated git worktrees so each demo keeps its
own working directory, `.next/` cache, dev-server port, and Vercel CLI
state. This replaces the old "checkout + stash" pattern that caused
demos to mix (saas-dashboard accidentally committed on demo/consumer-app).

### Routing: when the user says "modify <slug> demo"

1. **Check** `.claude/worktrees/<slug>/` — does it exist?
   - Exists → `cd` in; `git pull --rebase origin main` to sync against latest `main`.
   - Missing → `git worktree add -b demo/<slug> .claude/worktrees/<slug> main`.
     `.worktreeinclude` auto-copies `.env.local` / `.vercel/` into the new worktree.
     Run `pnpm install` (fast — seconds — because `enableGlobalVirtualStore` shares the content store).
2. **All subsequent edits, reads, and shell commands happen under the worktree path**, never in the main repo. Use absolute paths so the persisted Bash cwd stays correct.
3. **Green gate**: `pnpm --filter demo-<slug> build && lint` before any commit.
4. **Commit** with `[<slug>] Title` prefix. Multi-commit on the branch is fine (will squash).
5. **Push** `demo/<slug>`, then `gh pr create` with a test plan.
6. **Stop — do not auto-merge**. Report the PR URL and wait for explicit user approval.

### Merge + teardown (only when user says "merge it" or approves inline)

7. `gh pr merge <PR#> --squash --delete-branch` (squash-merge, delete remote branch).
8. Return to main repo: `cd /Users/reyn/ryanzhang.work`, `git pull --rebase origin main`.
9. Remove the worktree: `git worktree remove .claude/worktrees/<slug>` (use `--force` only if there are uncommitted throwaway files the user confirmed discarding).

### Auto-merge opt-in (per-prompt)

If the user explicitly says "绿灯就 auto-merge" / "auto-merge when green" / equivalent, skip step 6 — after the PR is created and CI (if any) passes, run steps 7–9 without pausing. Otherwise default to step-6 stop.

### Don't

- Work on a demo from the main repo directory — always route through the worktree.
- Copy `.env` files manually — `.worktreeinclude` handles it.
- Leave stale worktrees after merge — always run step 9.
- Use `git worktree remove --force` without user confirmation if uncommitted changes exist.
- Run `pnpm install` at the main repo to satisfy a demo's deps — install inside the worktree.

### First-time setup on a fresh clone

Run `pnpm install` once at the root after cloning. This establishes the global virtual store. Subsequent worktree creations get their node_modules symlinked from it in seconds.

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
