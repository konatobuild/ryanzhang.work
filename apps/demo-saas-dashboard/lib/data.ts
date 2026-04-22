export type AccountItem = {
  id: string;
  name: string;
  meta: string;
  sub: string;
  kind: "account" | "doc";
};

export type AccountRow = {
  id: string;
  name: string;
  kind: "account" | "doc" | "link";
  owners: string[] | null;
  extra?: number;
  count: string;
  modified: string;
};

export type ActivityItem = {
  when: string;
  avatar: string;
  text: string;
  link?: string;
  tag?: string;
  extra?: string;
  sub?: string;
};

export type NavItem = {
  id: "all" | "recent" | "watchlist" | "shared" | "segments";
  label: string;
  caret?: boolean;
  active?: boolean;
};

/* Quick Access — the four accounts/playbooks your team pinned. */
export const ACCOUNTS: AccountItem[] = [
  {
    id: "a1",
    name: "Acme Corp",
    meta: "$480K ARR",
    sub: "3 champions",
    kind: "account",
  },
  {
    id: "a2",
    name: "Northwind Systems",
    meta: "$220K ARR",
    sub: "Renews in 47 days",
    kind: "account",
  },
  {
    id: "a3",
    name: "Linea Co",
    meta: "$96K ARR",
    sub: "Pilot — week 2",
    kind: "account",
  },
  {
    id: "a4",
    name: "Q2 Renewal Playbook",
    meta: "Playbook",
    sub: "Updated today",
    kind: "doc",
  },
];

/* Main table — accounts in the currently selected segment. */
export const ACCOUNT_ROWS: AccountRow[] = [
  {
    id: "r1",
    name: "Acme Corp",
    kind: "account",
    owners: ["AS", "MR"],
    extra: 4,
    count: "$480K ARR",
    modified: "Yesterday",
  },
  {
    id: "r2",
    name: "Northwind Systems",
    kind: "account",
    owners: ["MR"],
    count: "$220K ARR",
    modified: "Apr 10, 2026",
  },
  {
    id: "r3",
    name: "Linea Co",
    kind: "account",
    owners: ["MR", "AV"],
    count: "$96K ARR",
    modified: "Apr 02, 2026",
  },
  {
    id: "r4",
    name: "Stripe Relay",
    kind: "account",
    owners: ["MR", "AV"],
    extra: 0,
    count: "$64K ARR",
    modified: "Yesterday",
  },
  {
    id: "r5",
    name: "Q2 Renewal Playbook",
    kind: "doc",
    owners: null,
    count: "Doc",
    modified: "Oct 12, 2025",
  },
  {
    id: "r6",
    name: "Churn-save script",
    kind: "doc",
    owners: null,
    count: "Doc",
    modified: "Oct 12, 2025",
  },
  {
    id: "r7",
    name: "Gainsight sync",
    kind: "link",
    owners: null,
    count: "Link",
    modified: "Oct 12, 2025",
  },
];

/* Right rail activity — context for the selected account (Acme Corp). */
export const ACTIVITY: ActivityItem[] = [
  {
    when: "Yesterday",
    avatar: "MK",
    text: "You shared account access with",
    link: "Miko",
  },
  {
    when: "Yesterday",
    avatar: "AS",
    text: "You shared account access with",
    link: "Ashley",
  },
  {
    when: "Apr 1, 2026",
    avatar: "YO",
    text: "You updated",
    link: "Renewal terms",
    sub: "Renewal terms",
  },
  {
    when: "Feb 21, 2026",
    avatar: "MR",
    text: "You added tag",
    tag: "Enterprise",
    extra: "+2",
  },
  {
    when: "Feb 16, 2026",
    avatar: "NO",
    text: "You changed edit to view access for",
    link: "Nolan",
  },
  {
    when: "Feb 8, 2026",
    avatar: "MR",
    text: "You updated",
    link: "QBR deck",
  },
];

export const NAV: NavItem[] = [
  { id: "all", label: "All Accounts", caret: true, active: true },
  { id: "recent", label: "Recent" },
  { id: "watchlist", label: "Watchlist" },
  { id: "shared", label: "Shared" },
  { id: "segments", label: "Segments" },
];
