export type AvatarData = { bg: string; initial: string };

export type Freelancer = {
  id: string;
  name: string;
  role: string;
  level: string;
  rate: number;
  rating: number;
  reviews: number;
  location: string;
  years: string;
  availability: string;
  remote: boolean;
  deals: number;
  paid: number;
  avatar: AvatarData;
  bio: string;
  experience: { title: string; company: string; years: string; tag?: string }[];
  skills: string[];
};

export type Job = {
  id: string;
  title: string;
  budget: number;
  tags: string[];
  posterRating: number;
  posterAvatar: AvatarData;
  description: string;
  category: string;
  posted: string;
  proposals: number;
  gallery: number;
};

export type Conversation = {
  id: string;
  name: string;
  avatar: AvatarData;
  preview: string;
  time: string;
  unread: number;
  online: boolean;
};

export type ChatMessage = {
  from: "me" | "them";
  text: string;
  time: string;
};

export const FREELANCERS: Freelancer[] = [
  {
    id: "chelsea",
    name: "Chelsea Knight",
    role: "Hardware Engineer",
    level: "Senior",
    rate: 2400,
    rating: 4.8,
    reviews: 142,
    location: "New York",
    years: "3+ year",
    availability: "Full-time",
    remote: true,
    deals: 12,
    paid: 120,
    avatar: { bg: "#f0c987", initial: "C" },
    bio: "Building embedded systems and developer tools for robotics teams. I care about making hardware feel as approachable as a good piece of software.",
    experience: [
      { title: "Staff Hardware Engineer", company: "Atlas Robotics", years: "2022 — 2025", tag: "Latest" },
      { title: "Firmware Lead", company: "Plume IoT", years: "2020 — 2022" },
      { title: "Embedded Engineer", company: "Northwind Labs", years: "2018 — 2020" },
    ],
    skills: ["Embedded C", "PCB design", "KiCad", "RTOS", "Signal integrity", "Python", "Soldering"],
  },
  {
    id: "jasmin",
    name: "Jasmin Lowery",
    role: "Product Designer",
    level: "Middle",
    rate: 2200,
    rating: 4.9,
    reviews: 87,
    location: "Austin",
    years: "5+ year",
    availability: "Part-time",
    remote: true,
    deals: 34,
    paid: 248,
    avatar: { bg: "#c8b6ff", initial: "J" },
    bio: "Designing tools people actually want to open on a Monday. Heavy on systems thinking, light on decoration.",
    experience: [
      { title: "Senior Product Designer", company: "Finch Finance", years: "2023 — Now", tag: "Latest" },
      { title: "Designer", company: "Thornbury Studio", years: "2021 — 2023" },
    ],
    skills: ["Design systems", "Figma", "Prototyping", "UX research", "Web", "iOS"],
  },
  {
    id: "mateo",
    name: "Mateo Aruna",
    role: "DevOps Engineer",
    level: "Senior",
    rate: 2800,
    rating: 4.7,
    reviews: 203,
    location: "Berlin",
    years: "6+ year",
    availability: "Full-time",
    remote: true,
    deals: 56,
    paid: 412,
    avatar: { bg: "#a7e8bd", initial: "M" },
    bio: "Kubernetes wrangler and reliability nerd. I keep your infra boring in the best way.",
    experience: [
      { title: "Platform Lead", company: "Heron Cloud", years: "2022 — Now", tag: "Latest" },
    ],
    skills: ["Kubernetes", "Terraform", "AWS", "GCP", "Observability", "Go"],
  },
  {
    id: "priya",
    name: "Priya Devan",
    role: "Data Analyst",
    level: "Middle",
    rate: 1800,
    rating: 4.9,
    reviews: 64,
    location: "Remote",
    years: "4+ year",
    availability: "Part-time",
    remote: true,
    deals: 22,
    paid: 96,
    avatar: { bg: "#ffb3ba", initial: "P" },
    bio: "Turning 12-tab spreadsheets into one clear answer. SQL, dashboards, and the occasional strong opinion.",
    experience: [
      { title: "Analytics Consultant", company: "Independent", years: "2023 — Now", tag: "Latest" },
    ],
    skills: ["SQL", "dbt", "Looker", "Python", "Experimentation"],
  },
  {
    id: "owen",
    name: "Owen Frey",
    role: "Frontend Developer",
    level: "Senior",
    rate: 2600,
    rating: 4.8,
    reviews: 118,
    location: "London",
    years: "7+ year",
    availability: "Full-time",
    remote: false,
    deals: 41,
    paid: 304,
    avatar: { bg: "#9bd0f5", initial: "O" },
    bio: "Typescript and motion nerd. Ex–agency, now shipping product teams' most interesting UI.",
    experience: [
      { title: "Frontend Eng", company: "Harbor", years: "2021 — Now", tag: "Latest" },
    ],
    skills: ["React", "TypeScript", "WebGL", "Motion", "CSS"],
  },
];

export const JOBS: Job[] = [
  {
    id: "landing",
    title: "Landing page design for candle studio",
    budget: 300,
    tags: ["Remote", "Part-time"],
    posterRating: 4.8,
    posterAvatar: { bg: "#f0c987", initial: "R" },
    description:
      "Hey! A creative landing page is needed. I'd love to showcase our candle collection, tell our story, and point visitors to the offline shop.",
    category: "Design",
    posted: "2h ago",
    proposals: 7,
    gallery: 4,
  },
  {
    id: "mobile",
    title: "Fintech mobile app — onboarding flow",
    budget: 1800,
    tags: ["Remote", "Full-time"],
    posterRating: 4.6,
    posterAvatar: { bg: "#c8b6ff", initial: "F" },
    description:
      "Redesigning our onboarding from scratch. Looking for a designer with fintech chops and opinions on KYC flows.",
    category: "Design",
    posted: "6h ago",
    proposals: 23,
    gallery: 3,
  },
  {
    id: "k8s",
    title: "Migrate production cluster to EKS",
    budget: 4200,
    tags: ["Remote", "Contract"],
    posterRating: 4.9,
    posterAvatar: { bg: "#a7e8bd", initial: "D" },
    description:
      "Moving off a self-hosted k8s setup. Need a DevOps specialist to plan + execute migration with zero downtime.",
    category: "Engineering",
    posted: "1d ago",
    proposals: 12,
    gallery: 0,
  },
];

export const CATEGORIES = [
  "Product Designer",
  "Business Analyst",
  "Database Analyst",
  "Data Analyst",
  "DevOps Engineer",
  "Hardware Engineer",
  "Frontend Developer",
  "Swift Developer",
  "Cloud Architect",
  "Mobile Designer",
  "Brand Designer",
  "Copywriter",
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: "krystal",
    name: "Krystal Young",
    avatar: { bg: "#ffb3ba", initial: "K" },
    preview: "That's great too, thanks!",
    time: "1h ago",
    unread: 1,
    online: true,
  },
  {
    id: "joshua",
    name: "Joshua Nickleson",
    avatar: { bg: "#c8b6ff", initial: "J" },
    preview: "Thank you for your reply!",
    time: "24.06.2024",
    unread: 0,
    online: false,
  },
  {
    id: "mateo",
    name: "Mateo Aruna",
    avatar: { bg: "#a7e8bd", initial: "M" },
    preview: "Here's the proposal for the EKS migration. LMK thoughts.",
    time: "Yesterday",
    unread: 2,
    online: true,
  },
  {
    id: "priya",
    name: "Priya Devan",
    avatar: { bg: "#9bd0f5", initial: "P" },
    preview: "Sent over the dashboard draft — easier to discuss on a call?",
    time: "Mon",
    unread: 0,
    online: false,
  },
];

export const CHAT_THREAD: ChatMessage[] = [
  { from: "them", text: "Hi! I saw your posting for the landing page project. Still looking?", time: "10:04" },
  { from: "me", text: "Yes — we are. Did you have a moment to review the brief?", time: "10:06" },
  {
    from: "them",
    text: "I did. Loved the direction. A few questions on the tone — are you leaning warm editorial or more minimal modern?",
    time: "10:08",
  },
  { from: "them", text: "I can put together two quick moodboards by Friday if helpful.", time: "10:08" },
  { from: "me", text: "That's great too, thanks!", time: "10:12" },
];
