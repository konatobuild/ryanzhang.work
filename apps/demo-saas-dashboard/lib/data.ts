import {
  IcoBookings,
  IcoBriefcase,
  IcoCheck,
  IcoDashboard,
  IcoFile,
  IcoFlash,
  IcoForm,
  IcoGrid,
  IcoHash,
  IcoJoin,
  IcoLocation,
  IcoMail,
  IcoMarketing,
  IcoPackage,
  IcoParagraph,
  IcoPayouts,
  IcoPhone,
  IcoStuff,
  IcoText,
  IcoUser,
  IcoUsers,
  type IconCmp,
} from "../components/icons";

export type NavId =
  | "dashboard"
  | "bookings"
  | "instructors"
  | "students"
  | "stuff"
  | "payouts"
  | "forms"
  | "marketing"
  | "locations"
  | "packages"
  | "joins";

export const NAV_ITEMS: { id: NavId; label: string; icon: IconCmp }[] = [
  { id: "dashboard", label: "Dashboard", icon: IcoDashboard },
  { id: "bookings", label: "Bookings", icon: IcoBookings },
  { id: "instructors", label: "Instructors", icon: IcoUser },
  { id: "students", label: "Students", icon: IcoUsers },
  { id: "stuff", label: "Stuff", icon: IcoStuff },
  { id: "payouts", label: "Payouts", icon: IcoPayouts },
  { id: "forms", label: "Booking Forms", icon: IcoForm },
  { id: "marketing", label: "Marketing", icon: IcoMarketing },
  { id: "locations", label: "Location Groups", icon: IcoLocation },
  { id: "packages", label: "Lesson Packages", icon: IcoPackage },
  { id: "joins", label: "Join Requests", icon: IcoJoin },
];

export type TemplateId = "blank" | "quick" | "standard" | "corporate";

export type Template = {
  id: TemplateId;
  icon: IconCmp;
  title: string;
  sub: string;
  fields: number;
};

export const TEMPLATES: Template[] = [
  {
    id: "blank",
    icon: IcoFile,
    title: "Blank Form",
    sub: "Start from scratch",
    fields: 0,
  },
  {
    id: "quick",
    icon: IcoFlash,
    title: "Quick Booking",
    sub: "4 Essential fields",
    fields: 4,
  },
  {
    id: "standard",
    icon: IcoGrid,
    title: "Standard Form",
    sub: "8 Common fields",
    fields: 8,
  },
  {
    id: "corporate",
    icon: IcoBriefcase,
    title: "Corporate",
    sub: "Business bookings",
    fields: 12,
  },
];

export type FieldTypeId =
  | "short"
  | "long"
  | "email"
  | "phone"
  | "number"
  | "checkbox";

export type FieldType = { id: FieldTypeId; icon: IconCmp; label: string };

export const FIELDS: FieldType[] = [
  { id: "short", icon: IcoText, label: "Short Text" },
  { id: "long", icon: IcoParagraph, label: "Long Text" },
  { id: "email", icon: IcoMail, label: "Email" },
  { id: "phone", icon: IcoPhone, label: "Phone" },
  { id: "number", icon: IcoHash, label: "Number" },
  { id: "checkbox", icon: IcoCheck, label: "Checkbox" },
];
