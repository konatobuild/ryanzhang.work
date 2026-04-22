# ryanzhang.work — demo roadmap

Human-readable kanban for the 9-demo portfolio series. The machine-readable
source of truth is [`apps/portfolio/lib/cases.ts`](./apps/portfolio/lib/cases.ts);
this file adds *where each demo is in the pipeline* without reading code.

| # | Slug | Brand | Category | Stage | Branch | Live URL |
|---|---|---|---|---|---|---|
| 1 | `saas-landing`         | LATTICE           | landing | wip     | `demo/saas-landing`   | — |
| 2 | `legal-landing`        | Meridian & Cole   | landing | wip     | `demo/legal-landing`  | — |
| 3 | `d2c-landing`          | —                 | landing | idea    | —                     | — |
| 4 | `professional-landing` | —                 | landing | idea    | —                     | — |
| 5 | `legal-intake`         | —                 | web-app | idea    | —                     | — |
| 6 | `logistics-dashboard`  | —                 | web-app | idea    | —                     | — |
| 7 | `analytics-tool`       | —                 | web-app | idea    | —                     | — |
| 8 | `consumer-app`         | Pulse Fitness     | mobile  | wip     | `demo/consumer-app`   | — |
| 9 | `mobile-web`           | Fresh             | mobile  | wip     | `demo/mobile-web`     | — |
| 10 | `saas-dashboard`      | Pilotdesk         | web-app | wip     | `demo/saas-dashboard` | — |

## Stages

- **idea** — slot exists in `cases.ts` as `placeholder`; no scoped code work yet.
- **wip** — `apps/demo-<slug>/` exists; prototype in progress; not deployed;
  `cases.ts` still `placeholder`.
- **shipped** — deployed to `<slug>.ryanzhang.work`; `cases.ts` `status = "live"`;
  `apps/portfolio/app/work/<slug>/page.tsx` case study exists.
- **retired** — removed from Featured Work but kept in history.

## When to move a demo along

`idea → wip`: first commit that creates `apps/demo-<slug>/`.
`wip → shipped`: the ship commit (per `README.md` §"Commit discipline" →
"Ship commit" exception) — same commit flips `cases.ts` status, adds the case
study page, and lands any final polish.
`shipped → retired`: deletion commit that removes the app and its case-study
route; entry stays in `cases.ts` only if retained for historical display.

Each move is reflected by updating this table *in the same commit* as the
code change that moves the stage. The table is the human record; `cases.ts`
drives the rendered grid.
