export type ProviderRole =
  | "Attending"
  | "Resident"
  | "Fellow"
  | "Nurse practitioner"
  | "Physician assistant";
export type Status = "On shift" | "On call" | "Off duty" | "On leave";

export interface Provider {
  id: string;
  name: string;
  /** 10-digit National Provider Identifier */
  npi: string;
  email: string;
  role: ProviderRole;
  specialty: string;
  /** e.g. "Cardiology · Tower 4" — shown under the title */
  unit: string;
  status: Status;
  /** Cases month-to-date */
  cases: number;
  joined: string;
  hue: number;
  initials: string;
  /** Days until any required credential lapses (license / board / DEA / vaccinations) */
  credentialDueDays: number;
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

export const PROVIDER_ROLES: ProviderRole[] = [
  "Attending",
  "Resident",
  "Fellow",
  "Nurse practitioner",
  "Physician assistant",
];

const SPECIALTIES = [
  "Cardiology",
  "Neurology",
  "Emergency medicine",
  "Internal medicine",
  "Anesthesiology",
  "Orthopedics",
  "Pediatrics",
  "Pulmonology",
  "Radiology",
  "General surgery",
  "Endocrinology",
  "Psychiatry",
];

const UNITS = [
  "Tower 4 · West",
  "Tower 2 · ICU",
  "Pavilion B · Wing 3",
  "Heart Center · L2",
  "Cardinal Building · L5",
  "ED · Trauma bay",
  "Outpatient · Suite 8",
  "Surgical pavilion · OR-7",
  "Annex · L1",
];

const STATUSES: Status[] = [
  "On shift",
  "On shift",
  "On shift",
  "On call",
  "On call",
  "On shift",
  "Off duty",
  "On shift",
  "On call",
  "On shift",
  "Off duty",
  "On leave",
];

function makeProvider(i: number): Provider {
  const first = FIRST[i % FIRST.length];
  const last = LAST[(i * 7) % LAST.length];
  const role = PROVIDER_ROLES[(i * 3) % PROVIDER_ROLES.length];
  const specialty = SPECIALTIES[(i * 5) % SPECIALTIES.length];
  const unit = UNITS[(i * 4) % UNITS.length];
  const status = STATUSES[i % STATUSES.length];
  // Deterministic NPI-like 10-digit number
  const npi = String(1_400_000_000 + ((i * 9_876_543) % 600_000_000)).slice(
    0,
    10,
  );
  // Distribute credential expirations: a few inside 30 days for the KPI
  const credentialDueDays =
    i % 7 === 0 ? (i % 4) * 6 + 4 : 60 + ((i * 13) % 240);
  return {
    id: `p_${i}`,
    name: `Dr. ${first} ${last}`,
    npi,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@atriahealth.org`,
    role,
    specialty,
    unit,
    status,
    cases: ((i * 17) % 84) + 12,
    joined: `2024-${String(((i * 5) % 12) + 1).padStart(2, "0")}-${String(((i * 11) % 27) + 1).padStart(2, "0")}`,
    hue: 90 + ((i * 13) % 40),
    initials: (first[0] + last[0]).toUpperCase(),
    credentialDueDays,
  };
}

export const ALL_PROVIDERS: Provider[] = Array.from({ length: 24 }, (_, i) =>
  makeProvider(i),
);

export type IconName =
  | "grid"
  | "users"
  | "stethoscope"
  | "calendar"
  | "shield"
  | "id-card"
  | "branch"
  | "scroll"
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
  | "leaf"
  | "atria"
  | "send"
  | "mic"
  | "expand";

export interface NavItem {
  id: string;
  label: string;
  count?: number;
  icon: IconName;
}

export const NAV_PRIMARY: NavItem[] = [
  { id: "dashboard", label: "Dashboard", count: 6, icon: "grid" },
  { id: "providers", label: "Providers", count: 312, icon: "stethoscope" },
  { id: "schedule", label: "Schedule", count: 47, icon: "calendar" },
  { id: "privileges", label: "Privileges", count: 184, icon: "shield" },
  { id: "credentials", label: "Credentials", count: 6, icon: "id-card" },
  { id: "departments", label: "Departments", count: 14, icon: "branch" },
  { id: "audit", label: "Audit log", count: 1024, icon: "scroll" },
];

export const NAV_LINKS: { id: string; label: string }[] = [
  { id: "compliance", label: "Compliance handbook" },
  { id: "guidelines", label: "Clinical guidelines" },
  { id: "incidents", label: "Incident reports" },
  { id: "byelaws", label: "Medical staff bylaws" },
  { id: "training", label: "Continuing education" },
  { id: "whats-new", label: "What\u2019s new" },
];

export const NAV_FOOTER: NavItem[] = [
  { id: "settings", label: "Settings", icon: "gear" },
  { id: "locations", label: "Locations", icon: "globe" },
  { id: "theme", label: "Appearance", icon: "moon" },
  { id: "learn", label: "Learn", icon: "book" },
  { id: "help", label: "Help center", icon: "help" },
  { id: "support", label: "Contact admin", icon: "life" },
];
