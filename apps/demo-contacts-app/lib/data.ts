export type ContactStatus = "active" | "new" | "priority" | "dormant";
export type ContactTag = "investor" | "board" | "warm" | "follow-up" | "intro";

export interface Contact {
  id: number;
  name: string;
  company: string;
  position: string;
  city: string;
  status: ContactStatus;
  tags: ContactTag[];
}

export const CONTACTS: Contact[] = [
  { id: 1,  name: "Adeline Fournier",   company: "Northwind Paper",    position: "Head of Brand",       city: "Portland",       status: "active",   tags: ["investor"] },
  { id: 2,  name: "Beatrice Holloway",  company: "Meridian Audio",     position: "Product Designer",    city: "Rochester",      status: "new",      tags: ["warm"] },
  { id: 3,  name: "Caleb Whitmore",     company: "Field & Loom",       position: "Operations Lead",     city: "Asheville",      status: "active",   tags: [] },
  { id: 4,  name: "Delphine Okoro",     company: "Lumen Bicycles",     position: "Creative Director",   city: "Brooklyn",       status: "priority", tags: ["follow-up"] },
  { id: 5,  name: "Emiliano Vargas",    company: "Kettle & Kiln",      position: "Founder",             city: "Oakland",        status: "active",   tags: [] },
  { id: 6,  name: "Farrah Nakamura",    company: "Coastline Works",    position: "Engineering Manager", city: "San Diego",      status: "dormant",  tags: [] },
  { id: 7,  name: "Gideon Larsen",      company: "Halcyon Studio",     position: "Strategy Partner",    city: "Minneapolis",    status: "new",      tags: ["intro"] },
  { id: 8,  name: "Harriet Boone",      company: "Parallel Goods",     position: "Head of Supply",      city: "Austin",         status: "active",   tags: [] },
  { id: 9,  name: "Idris Chaudhary",    company: "Kindred Motors",     position: "CFO",                 city: "Detroit",        status: "priority", tags: ["board"] },
  { id: 10, name: "Juno Velásquez",     company: "Paper Lantern",      position: "Editor in Chief",     city: "Santa Fe",       status: "active",   tags: [] },
  { id: 11, name: "Kasimir Petrov",     company: "Driftwood Co.",      position: "VP Marketing",        city: "Boulder",        status: "new",      tags: [] },
  { id: 12, name: "Linnea Forsberg",    company: "Orchard & Oak",      position: "Head of People",      city: "Portland, ME",   status: "dormant",  tags: [] },
  { id: 13, name: "Mehdi Rashidi",      company: "Signal Gardens",     position: "Research Lead",       city: "Providence",     status: "active",   tags: [] },
  { id: 14, name: "Niamh O\u2019Reilly", company: "Tidewater Press",   position: "Publishing Director", city: "Portsmouth",     status: "active",   tags: [] },
  { id: 15, name: "Osian Pritchard",    company: "Overland Collect.",  position: "GM, Retail",          city: "Madison",        status: "new",      tags: [] },
  { id: 16, name: "Petra Sandoval",     company: "Threadcount",        position: "Sourcing Manager",    city: "Cleveland",      status: "priority", tags: ["board"] },
  { id: 17, name: "Quinlan Ashworth",   company: "Wayfare Labs",       position: "Principal Engineer",  city: "Brooklyn",       status: "active",   tags: [] },
  { id: 18, name: "Remy Takahashi",     company: "Ember & Flint",      position: "Studio Lead",         city: "Seattle",        status: "dormant",  tags: [] },
  { id: 19, name: "Soraya Bellamy",     company: "Northbound Brew",    position: "Head of Wholesale",   city: "Burlington",     status: "active",   tags: [] },
  { id: 20, name: "Tobias Wren",        company: "Harbor Analytics",   position: "Data Science Lead",   city: "Somerville",     status: "new",      tags: [] },
  { id: 21, name: "Una Castellanos",    company: "Folio & Type",       position: "Design Systems",      city: "Pittsburgh",     status: "active",   tags: [] },
  { id: 22, name: "Viggo Lindqvist",    company: "Pale Horse",         position: "Head of Content",     city: "Portland",       status: "priority", tags: ["follow-up"] },
  { id: 23, name: "Winona Ashby",       company: "Riverine Goods",     position: "Brand Partner",       city: "Hudson",         status: "dormant",  tags: [] },
  { id: 24, name: "Xiomara Delgado",    company: "Crosscut Media",     position: "Executive Producer",  city: "Los Angeles",    status: "active",   tags: [] },
  { id: 25, name: "Yannick Proulx",     company: "Slate & Sable",      position: "Director of Ops",     city: "Montréal",       status: "new",      tags: [] },
  { id: 26, name: "Zahra Esmaili",      company: "Low Tide Records",   position: "A&R",                 city: "Nashville",      status: "active",   tags: [] },
  { id: 27, name: "Arlo Stenberg",      company: "Cairn & Co.",        position: "Portfolio Partner",   city: "Chicago",        status: "priority", tags: ["investor"] },
  { id: 28, name: "Brynn McAllister",   company: "Understory",         position: "Growth Lead",         city: "Durham",         status: "active",   tags: [] },
  { id: 29, name: "Cillian Faulkner",   company: "Gable Systems",      position: "CTO",                 city: "Boston",         status: "dormant",  tags: [] },
  { id: 30, name: "Dagny Ström",        company: "Atlas & Fen",        position: "COO",                 city: "Salt Lake City", status: "active",   tags: [] },
];

export interface StatusMeta {
  label: string;
  dot: string;
  bg: string;
  fg: string;
}

export const STATUS_META: Record<ContactStatus, StatusMeta> = {
  active:   { label: "Active",   dot: "var(--ok)",    bg: "oklch(0.95 0.03 150)",  fg: "oklch(0.36 0.08 150)" },
  new:      { label: "New",      dot: "var(--ink-2)", bg: "oklch(0.955 0.004 80)", fg: "oklch(0.38 0.01 80)"  },
  priority: { label: "Priority", dot: "var(--warn)",  bg: "oklch(0.95 0.04 60)",   fg: "oklch(0.40 0.10 55)"  },
  dormant:  { label: "Dormant",  dot: "var(--muted)", bg: "oklch(0.96 0.005 80)",  fg: "oklch(0.52 0.01 80)"  },
};

export const TAG_OPTIONS: ContactTag[] = ["investor", "board", "warm", "follow-up", "intro"];
