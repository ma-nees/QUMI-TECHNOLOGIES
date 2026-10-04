import type { Icon } from "@phosphor-icons/react";
import {
  Code,
  DeviceMobile,
  PenNib,
  CloudArrowUp,
  ChartLineUp,
  Brain,
  ShieldCheck,
  Compass,
} from "@phosphor-icons/react/dist/ssr";

export const company = {
  name: "QUME Technologies",
  short: "QUME",
  // Placeholder contact details — replace with real ones.
  email: "hello@qume.tech",
  phone: "+977 1-0000000",
  address: "Kathmandu, Nepal",
};

export type Service = { slug: string; title: string; summary: string; detail: string[]; icon: Icon };

export const services: Service[] = [
  {
    slug: "custom-software",
    title: "Custom Software Development",
    summary: "Purpose-built systems that fit how your organisation actually operates.",
    detail: ["Domain modelling and system design", "Internal tools and back-office platforms", "Integrations with existing systems"],
    icon: Code,
  },
  {
    slug: "web-mobile",
    title: "Web & Mobile Development",
    summary: "Fast, accessible web applications and native-quality mobile apps.",
    detail: ["React and Next.js web apps", "React Native mobile apps", "Progressive web apps"],
    icon: DeviceMobile,
  },
  {
    slug: "ui-ux",
    title: "UI/UX Design",
    summary: "Research-led interface design that keeps complex workflows simple.",
    detail: ["User research and journey mapping", "Design systems", "Prototyping and usability testing"],
    icon: PenNib,
  },
  {
    slug: "cloud-devops",
    title: "Cloud & DevOps",
    summary: "Reliable infrastructure, automated delivery and observable systems.",
    detail: ["AWS and Azure architecture", "CI/CD pipelines", "Containerisation with Docker"],
    icon: CloudArrowUp,
  },
  {
    slug: "data-analytics",
    title: "Data & Analytics",
    summary: "Turning operational data into reporting teams can act on.",
    detail: ["Data pipelines and warehousing", "Dashboards in Power BI", "Data quality and governance"],
    icon: ChartLineUp,
  },
  {
    slug: "ai",
    title: "Artificial Intelligence",
    summary: "Practical AI features grounded in your data and business rules.",
    detail: ["Document and workflow automation", "Search and assistants over internal knowledge", "Model evaluation and guardrails"],
    icon: Brain,
  },
  {
    slug: "cybersecurity",
    title: "Cybersecurity",
    summary: "Security built into architecture, code and operations from day one.",
    detail: ["Secure architecture reviews", "Access control and data protection", "Application security testing"],
    icon: ShieldCheck,
  },
  {
    slug: "consulting",
    title: "IT Consulting",
    summary: "Independent guidance on technology strategy, vendors and roadmaps.",
    detail: ["Technology assessments", "Modernisation roadmaps", "Build-versus-buy decisions"],
    icon: Compass,
  },
];

export const technologies = [
  { group: "Frontend", items: ["React", "Next.js", "React Native", "TypeScript"] },
  { group: "Backend", items: ["Node.js", "Java", "Python", "Go"] },
  { group: "Cloud", items: ["AWS", "Azure", "Docker", "Kubernetes"] },
  { group: "Data", items: ["PostgreSQL", "MongoDB", "Python", "Power BI"] },
];

export const industries = [
  { name: "FinTech", problem: "Regulated workflows, real-time transactions and audit trails.", approach: "Ledger-safe architectures, strong access control and clear reporting." },
  { name: "Healthcare", problem: "Fragmented patient records and paper-based processes.", approach: "Secure record systems and scheduling built around clinical staff." },
  { name: "Education", problem: "Disconnected tools for learning, admissions and administration.", approach: "Unified portals for students, teachers and administrators." },
  { name: "Retail & E-commerce", problem: "Inventory, orders and customers spread across channels.", approach: "Commerce platforms with integrated stock, payments and analytics." },
  { name: "Logistics", problem: "Limited visibility over fleets, routes and deliveries.", approach: "Tracking, dispatch and route tools that work in the field." },
  { name: "Manufacturing", problem: "Production data locked in spreadsheets and legacy systems.", approach: "Operational dashboards and integrations with plant systems." },
  { name: "Government", problem: "Citizen services that depend on in-person visits.", approach: "Accessible digital services with secure identity and records." },
  { name: "Hospitality", problem: "Manual bookings and inconsistent guest experience.", approach: "Booking, property management and guest communication tools." },
];

export const process = [
  { n: "01", title: "Discover", text: "Understand the business, users, constraints and what success looks like." },
  { n: "02", title: "Define", text: "Agree scope, architecture and a delivery plan with clear milestones." },
  { n: "03", title: "Design", text: "Shape flows and interfaces, validated with real users early." },
  { n: "04", title: "Build", text: "Ship in short iterations with code review and continuous integration." },
  { n: "05", title: "Test", text: "Automated and manual testing across function, security and performance." },
  { n: "06", title: "Launch", text: "Controlled releases, monitoring and a documented handover." },
  { n: "07", title: "Improve", text: "Measure, learn and evolve the product alongside your team." },
];

export const principles = [
  { title: "Engineering first", text: "We build systems with maintainability and scalability in mind, not just the next demo." },
  { title: "Transparent collaboration", text: "Clear communication, shared boards and visible progress throughout development." },
  { title: "Business-focused technology", text: "Every technology decision should solve an actual business problem." },
  { title: "Long-term thinking", text: "We build products that can evolve with your organisation for years." },
];

export const engagementModels = [
  { title: "Project delivery", text: "A defined scope delivered end-to-end by a dedicated QUME team." },
  { title: "Dedicated team", text: "Engineers and designers who work as an extension of your team." },
  { title: "Advisory", text: "Architecture reviews, audits and technical due diligence." },
];
