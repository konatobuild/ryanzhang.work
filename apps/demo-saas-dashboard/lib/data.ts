export type Role =
  | "Editor"
  | "Contributor"
  | "Author"
  | "Administrator"
  | "Subscriber";
export type Status = "Active" | "Idle" | "Pending";

export interface User {
  id: string;
  name: string;
  handle: string;
  email: string;
  role: Role;
  status: Status;
  posts: number;
  joined: string;
  hue: number;
  initials: string;
}

const FIRST = [
  "Mira",
  "Theo",
  "Anya",
  "Kai",
  "Lena",
  "Ezra",
  "Iris",
  "Noor",
  "Rune",
  "Saoirse",
  "Cyrus",
  "Alma",
  "Jude",
  "Nia",
  "Rhea",
  "Otis",
  "Wren",
  "Beck",
  "Lior",
  "Sana",
  "Pax",
  "Zara",
  "Idris",
  "Hana",
  "Sage",
  "Roan",
  "Vela",
  "Cleo",
  "Felix",
  "Maren",
];

const LAST = [
  "Okafor",
  "Vesely",
  "Marchetti",
  "Ahn",
  "Bjornson",
  "Halvorsen",
  "Mensah",
  "Kovac",
  "Salinas",
  "Patel",
  "Akagi",
  "Rourke",
  "Castell",
  "Eberhardt",
  "Doroshenko",
  "Ferreira",
  "Singh",
  "Yamamoto",
  "Costa",
  "Renz",
  "Calder",
  "Petrov",
  "Aoki",
  "Bauer",
  "Greco",
  "Holm",
  "Ibarra",
  "Jovanovic",
  "Khan",
  "Loomis",
];

export const ROLES: Role[] = [
  "Editor",
  "Contributor",
  "Author",
  "Administrator",
  "Subscriber",
];

const STATUSES: Status[] = [
  "Active",
  "Active",
  "Active",
  "Active",
  "Idle",
  "Active",
  "Active",
  "Pending",
  "Active",
  "Active",
];

function makeUser(i: number): User {
  const first = FIRST[i % FIRST.length];
  const last = LAST[(i * 7) % LAST.length];
  const role = ROLES[(i * 3) % ROLES.length];
  const status = STATUSES[i % STATUSES.length];
  const handle = `${first}.${last}`.toLowerCase();
  const hue = (i * 47) % 360;
  return {
    id: `u_${i}`,
    name: `${first} ${last}`,
    handle,
    email: `${handle}@foliage.studio`,
    role,
    status,
    posts: ((i * 13) % 47) + 2,
    joined: `2025-${String(((i * 5) % 12) + 1).padStart(2, "0")}-${String(((i * 11) % 27) + 1).padStart(2, "0")}`,
    hue,
    initials: (first[0] + last[0]).toUpperCase(),
  };
}

export const ALL_USERS: User[] = Array.from({ length: 24 }, (_, i) =>
  makeUser(i),
);

export type IconName =
  | "grid"
  | "users"
  | "file"
  | "image"
  | "edit"
  | "tag"
  | "folder"
  | "chat"
  | "gear"
  | "globe"
  | "moon"
  | "book"
  | "help"
  | "life"
  | "search"
  | "bell"
  | "settings-2"
  | "sparkle"
  | "pencil"
  | "trash"
  | "eye"
  | "plus"
  | "check"
  | "chevron-down"
  | "chevron-up"
  | "chevron-left"
  | "chevron-right"
  | "mail"
  | "badge"
  | "message"
  | "list"
  | "cards"
  | "filter"
  | "docs"
  | "print"
  | "sidebar"
  | "bolt"
  | "arrow-right"
  | "arrow-left"
  | "arrow-up"
  | "dots"
  | "leaf";

export interface NavItem {
  id: string;
  label: string;
  count?: number;
  icon: IconName;
}

export const NAV_PRIMARY: NavItem[] = [
  { id: "dashboard", label: "Dashboard", count: 6, icon: "grid" },
  { id: "users", label: "Members", count: 248, icon: "users" },
  { id: "pages", label: "Pages", count: 597, icon: "file" },
  { id: "media", label: "Media library", count: 331, icon: "image" },
  { id: "posts", label: "Posts", count: 84, icon: "edit" },
  { id: "tags", label: "Tags", count: 32, icon: "tag" },
  { id: "categories", label: "Categories", count: 12, icon: "folder" },
  { id: "comments", label: "Comments", count: 1204, icon: "chat" },
];

export const NAV_LINKS: { id: string; label: string }[] = [
  { id: "about", label: "About the studio" },
  { id: "guidelines", label: "Editorial guidelines" },
  { id: "contact", label: "Contact us" },
  { id: "authors", label: "Author handbook" },
  { id: "rules", label: "Community rules" },
  { id: "whats-new", label: "What\u2019s new" },
];

export const NAV_FOOTER: NavItem[] = [
  { id: "settings", label: "Settings", icon: "gear" },
  { id: "language", label: "Language", icon: "globe" },
  { id: "theme", label: "Appearance", icon: "moon" },
  { id: "learn", label: "Learn", icon: "book" },
  { id: "help", label: "Help center", icon: "help" },
  { id: "support", label: "Contact support", icon: "life" },
];
