export type EventColor =
  | "olive"
  | "orange"
  | "pink"
  | "cream"
  | "rust"
  | "taupe"
  | "sage";

export interface CalEvent {
  id: string;
  /** 0 = Monday, 4 = Friday in the visible 5-day window */
  day: number;
  /** minutes from 00:00 */
  start: number;
  end: number;
  title: string;
  sub: string;
  color: EventColor;
  /** Displayed minutes (oversized numeric inside the card) */
  num: number;
}

export const EVENTS: CalEvent[] = [
  // Monday (22)
  { id: "m1", day: 0, start: 8 * 60, end: 9 * 60, title: "Emma", sub: "Yoga · Morning Flow", color: "olive", num: 60 },
  { id: "m2", day: 0, start: 10 * 60, end: 10 * 60 + 30, title: "Savannah", sub: "Personal Training", color: "sage", num: 30 },
  { id: "m3", day: 0, start: 13 * 60, end: 14 * 60, title: "Walk-in", sub: "Yoga · Slow", color: "pink", num: 60 },
  { id: "m4", day: 0, start: 15 * 60, end: 17 * 60, title: "Zara", sub: "Personal Training", color: "olive", num: 120 },

  // Tuesday (23) — today
  { id: "t1", day: 1, start: 9 * 60, end: 9 * 60 + 45, title: "Jasper", sub: "Yoga · Flow 75", color: "pink", num: 45 },
  { id: "t2", day: 1, start: 10 * 60, end: 10 * 60 + 45, title: "Watson", sub: "Yoga · Vinyasa", color: "cream", num: 45 },
  { id: "t3", day: 1, start: 10 * 60 + 45, end: 12 * 60, title: "John", sub: "Zumba · Cardio", color: "orange", num: 75 },
  { id: "t4", day: 1, start: 12 * 60, end: 13 * 60, title: "Lilia", sub: "Zumba", color: "cream", num: 60 },
  { id: "t5", day: 1, start: 12 * 60 + 30, end: 13 * 60 + 30, title: "Mia", sub: "Yoga", color: "pink", num: 60 },
  { id: "t6", day: 1, start: 14 * 60, end: 15 * 60 + 15, title: "Omar", sub: "Zumba", color: "cream", num: 75 },

  // Wednesday (24)
  { id: "w1", day: 2, start: 9 * 60 + 30, end: 10 * 60 + 30, title: "Ethan", sub: "Yoga · Restore", color: "pink", num: 60 },
  { id: "w2", day: 2, start: 12 * 60, end: 13 * 60 + 30, title: "Sophie", sub: "Yoga Package · 3-part", color: "pink", num: 90 },
  { id: "w3", day: 2, start: 13 * 60 + 30, end: 14 * 60 + 45, title: "Clara", sub: "Personal Training", color: "rust", num: 75 },
  { id: "w4", day: 2, start: 14 * 60 + 45, end: 15 * 60 + 45, title: "Liam", sub: "Yoga · Slow", color: "cream", num: 60 },

  // Thursday (25)
  { id: "th1", day: 3, start: 9 * 60, end: 9 * 60 + 45, title: "Emma", sub: "Yoga", color: "pink", num: 45 },
  { id: "th2", day: 3, start: 9 * 60 + 45, end: 11 * 60, title: "Liam", sub: "Yoga · Vinyasa", color: "pink", num: 75 },
  { id: "th3", day: 3, start: 11 * 60, end: 12 * 60 + 30, title: "Zara", sub: "Personal Training", color: "pink", num: 90 },

  // Friday (26)
  { id: "f1", day: 4, start: 17 * 60, end: 18 * 60, title: "Walk-in", sub: "Personal Training", color: "taupe", num: 60 },
];

export interface StatCard {
  label: string;
  sub: string;
  value: string;
  unit?: string;
  deltaDir: "up" | "down";
  delta: string;
  compare: string;
}

export const STATS: StatCard[] = [
  { label: "Total Appointment", sub: "Last 7 days", value: "140", deltaDir: "up", delta: "+12%", compare: "vs last week" },
  { label: "Compl. Appointment", sub: "Last 7 days", value: "85", unit: "%", deltaDir: "up", delta: "+12%", compare: "vs last week" },
  { label: "No Show Appointment", sub: "Last 7 days", value: "7", unit: "%", deltaDir: "down", delta: "+12%", compare: "vs last week" },
];

export interface DayHeader {
  n: number;
  name: string;
  count: number;
  today: boolean;
}

export const DAYS: DayHeader[] = [
  { n: 22, name: "MON", count: 4, today: false },
  { n: 23, name: "TUE", count: 6, today: true },
  { n: 24, name: "WED", count: 5, today: false },
  { n: 25, name: "THU", count: 3, today: false },
  { n: 26, name: "FRI", count: 1, today: false },
];

/** 1 hour = 64px */
export const HOUR_PX = 64;
export const START_HOUR = 5;
export const END_HOUR = 20;

export type NavId =
  | "home"
  | "appointment"
  | "sales"
  | "customers"
  | "report"
  | "services"
  | "products"
  | "packages"
  | "staff"
  | "marketing"
  | "website"
  | "integration";

export type IconName =
  | "search"
  | "home"
  | "calendar"
  | "cart"
  | "users"
  | "chart"
  | "package"
  | "box"
  | "user"
  | "megaphone"
  | "globe"
  | "link"
  | "send"
  | "book"
  | "chevronDown"
  | "chevronLeft"
  | "chevronRight"
  | "plus"
  | "close"
  | "pencil"
  | "clock"
  | "sun"
  | "moon"
  | "sparkles"
  | "filter"
  | "yoga"
  | "sidebar"
  | "arrowRight";

export interface NavItemSpec {
  id: NavId;
  icon: IconName;
  label: string;
}

export const NAV_MAIN: NavItemSpec[] = [{ id: "home", icon: "home", label: "Home" }];
export const WORKSPACE: NavItemSpec[] = [
  { id: "appointment", icon: "calendar", label: "Appointment" },
  { id: "sales", icon: "cart", label: "Sales" },
  { id: "customers", icon: "users", label: "Customers" },
  { id: "report", icon: "chart", label: "Report" },
];
export const CATALOG: NavItemSpec[] = [
  { id: "services", icon: "package", label: "Services" },
  { id: "products", icon: "box", label: "Products" },
  { id: "packages", icon: "book", label: "Packages" },
];
export const COMPANY: NavItemSpec[] = [
  { id: "staff", icon: "user", label: "Staff" },
  { id: "marketing", icon: "megaphone", label: "Marketing" },
  { id: "website", icon: "globe", label: "Website" },
  { id: "integration", icon: "link", label: "Integration" },
];
