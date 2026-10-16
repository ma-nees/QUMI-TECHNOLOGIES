// Organization Structure & Journey Map Data Configuration
// Configurable data model for an engineering-driven IT services company
// SVG canvas coordinate space: 980 x 440  (use viewBox="0 0 980 440")

export type OrgNodeType = 'leadership' | 'management' | 'team';
export type ConnectorType = 'reporting' | 'collaboration';

export interface OrgNodeData {
  id: string;
  title: string;
  shortTitle: string;
  initials: string;
  roleType: OrgNodeType;
  level: 1 | 2 | 3;
  illustrativeCount?: number;
  countLabel?: string;
  reportsTo?: string[];
  oversees?: string[];
  coordinatesWith?: string[];
  collaboratesWith?: string[];
  coordinates: { x: number; y: number }; // SVG coordinate space (980 x 440)
  color: string;
  accentBg: string;
  gradient: [string, string]; // [from, to] for node fill / header
  glow: string; // rgba glow / drop-shadow color
  icon: string; // lucide-react icon name
  tagline: string; // short punchy line shown on hover / cards
  tools?: string[]; // tech / tools the team lives in
  summary: string;
  responsibilities: string[];
  exampleRoles?: string[];
  departmentOverview: string;
}

export interface OrgConnectorData {
  id: string;
  from: string;
  to: string;
  type: ConnectorType;
  path: string; // SVG path d in 980x440 coordinate space
  label: string;
}

// ─────────────────────────────────────────────────────────────
// Visual theme config
// ─────────────────────────────────────────────────────────────
export const CANVAS = { width: 980, height: 340 } as const;

export const LEVEL_STYLES = {
  1: { width: 130, height: 38, radius: 12, fontSize: 11, glowBlur: 14 },
  2: { width: 120, height: 38, radius: 10, fontSize: 10, glowBlur: 10 },
  3: { width: 72, height: 44, radius: 10, fontSize: 8.5, glowBlur: 8 },
} as const;

export const CONNECTOR_STYLES: Record<
  ConnectorType,
  { stroke: string; width: number; dash?: string; animated?: boolean; opacity: number }
> = {
  reporting: { stroke: "#94A3B8", width: 1.6, opacity: 0.85 },
  collaboration: {
    stroke: "#F28C28",
    width: 1.3,
    dash: "4 4",
    animated: true, // animate stroke-dashoffset for a flowing effect
    opacity: 0.8,
  },
};

export const CANVAS_THEME = {
  background: "radial-gradient(ellipse at top, #0B1B3A 0%, #060D1F 70%)",
  gridDot: "rgba(255,255,255,0.05)",
  titleGradient: ["#0047AB", "#F28C28"] as [string, string],
};

// ─────────────────────────────────────────────────────────────
// Nodes
// ─────────────────────────────────────────────────────────────
export const ORG_NODES: OrgNodeData[] = [
  // ───────── Level 1 — Senior Executive Leadership ─────────
  {
    id: "director",
    title: "Managing Director / CEO",
    shortTitle: "CEO / Managing Director",
    initials: "CEO",
    roleType: "leadership",
    level: 1,
    coordinates: { x: 490, y: 44 },
    color: "#0047AB",
    accentBg: "rgba(0, 71, 171, 0.08)",
    gradient: ["#0047AB", "#2563EB"],
    glow: "rgba(37, 99, 235, 0.55)",
    icon: "Crown",
    tagline: "Vision, strategy and trust.",
    summary:
      "Senior executive steering company vision, strategic partnerships, financial governance, and high-level client trust.",
    responsibilities: [
      "Company strategy, strategic market positioning, and long-term vision",
      "Business growth, key client relationships, and international enterprise partnerships",
      "Financial and operational performance oversight and capital allocation",
      "Major business decisions, risk governance, and regulatory compliance",
      "Overall organizational leadership, culture building, and executive alignment",
    ],
    oversees: ["cte", "secretary", "growth"],
    coordinatesWith: ["pm"],
    departmentOverview:
      "The executive office leads strategic direction, partner governance, and company-wide accountability.",
  },

  // ───────── Level 2 — Technical, Operational & Growth Leadership ─────────
  {
    id: "cte",
    title: "Chief Technology Officer (CTO)",
    shortTitle: "Chief Technology",
    initials: "CTO",
    roleType: "leadership",
    level: 2,
    coordinates: { x: 250, y: 142 },
    color: "#0284C7",
    accentBg: "rgba(2, 132, 199, 0.08)",
    gradient: ["#0284C7", "#38BDF8"],
    glow: "rgba(56, 189, 248, 0.5)",
    icon: "Cpu",
    tagline: "Engineering excellence at scale.",
    tools: ["Architecture", "Cloud", "Security", "R&D"],
    reportsTo: ["director"],
    oversees: ["projects", "design", "engineering", "quality", "infrastructure", "data"],
    coordinatesWith: ["pm"],
    summary:
      "Technical leader responsible for architectural strategy, software engineering standards, technology stack choices, and engineering excellence.",
    responsibilities: [
      "Technical strategy, enterprise architectural standards, and technology roadmap",
      "Software engineering standards, peer code review policies, and security baselines",
      "Technology selection, framework adoption, and technical debt governance",
      "Engineering quality, high-availability architecture, and cybersecurity resilience",
      "Technical team leadership, engineering mentorship, and R&D exploration",
    ],
    departmentOverview:
      "The CTO oversees product analysis, design, software engineering, QA validation, DevOps infrastructure, and data & AI teams.",
  },

  {
    id: "pm",
    title: "Project Manager",
    shortTitle: "Project Delivery",
    initials: "PM",
    roleType: "management",
    level: 2,
    illustrativeCount: 3,
    countLabel: "3 Illustrative Positions",
    coordinates: { x: 490, y: 142 },
    color: "#F28C28",
    accentBg: "rgba(242, 140, 40, 0.10)",
    gradient: ["#F28C28", "#FBBF24"],
    glow: "rgba(251, 191, 36, 0.55)",
    icon: "Workflow",
    tagline: "The heartbeat of delivery.",
    tools: ["Jira", "Linear", "Notion", "Slack"],
    coordinatesWith: ["director", "cte", "secretary", "growth"],
    collaboratesWith: ["projects", "design", "engineering", "quality", "infrastructure", "data"],
    exampleRoles: ["Senior Project Manager", "Project Manager", "Scrum Master"],
    summary:
      "Delivery orchestrators responsible for sprint planning, cross-functional collaboration, milestone tracking, and stakeholder communication.",
    responsibilities: [
      "Project planning, scope refinement, milestone mapping, and agile sprint delivery",
      "Task allocation, team velocity tracking, and cross-discipline dependency management",
      "Client status reporting, transparent sprint demos, and scope alignment",
      "Risk mitigation, blocker resolution, and delivery bottleneck identification",
      "Active coordination across leadership and all technical & product teams",
    ],
    departmentOverview:
      "Project Managers sit at the collaborative heart of the company, orchestrating smooth collaboration across all disciplines.",
  },

  {
    id: "secretary",
    title: "Chief Operating Officer (COO)",
    shortTitle: "Chief Operating",
    initials: "COO",
    roleType: "leadership",
    level: 2,
    coordinates: { x: 670, y: 142 },
    color: "#475569",
    accentBg: "rgba(71, 85, 105, 0.08)",
    gradient: ["#475569", "#94A3B8"],
    glow: "rgba(148, 163, 184, 0.45)",
    icon: "Settings2",
    tagline: "Making the machine run smoothly.",
    tools: ["ERP", "HRIS", "Compliance"],
    reportsTo: ["director"],
    oversees: ["admin", "hr", "finance", "support"],
    coordinatesWith: ["pm"],
    summary:
      "Operations leader steering day-to-day organizational execution, administrative workflow, people operations, finance, and customer support.",
    responsibilities: [
      "Day-to-day business operations and cross-functional workflow efficiency",
      "Resource allocation, talent capacity planning, and operational coordination",
      "Administrative processes, vendor contracts, facilities, and statutory compliance",
      "Business delivery support and client operational onboarding coordination",
      "Harmonious coordination between technical delivery teams and corporate administration",
    ],
    departmentOverview:
      "The COO directs administration, human resources, finance, and customer support functions.",
  },

  {
    id: "growth",
    title: "Chief Growth Officer (CGO)",
    shortTitle: "Chief Growth",
    initials: "CGO",
    roleType: "leadership",
    level: 2,
    coordinates: { x: 890, y: 142 },
    color: "#DB2777",
    accentBg: "rgba(219, 39, 119, 0.08)",
    gradient: ["#DB2777", "#F472B6"],
    glow: "rgba(244, 114, 182, 0.5)",
    icon: "TrendingUp",
    tagline: "Turning great engineering into great business.",
    tools: ["CRM", "Analytics", "Market Research"],
    reportsTo: ["director"],
    oversees: ["sales", "marketing"],
    coordinatesWith: ["pm"],
    summary:
      "Commercial leader driving revenue growth, brand presence, client acquisition, and long-term market expansion.",
    responsibilities: [
      "Go-to-market strategy, pricing models, and new market entry",
      "Revenue targets, pipeline health, and key account growth",
      "Brand positioning, thought leadership, and partner ecosystem development",
      "Client acquisition and retention strategy alongside delivery leadership",
      "Market intelligence, competitor tracking, and proposal quality",
    ],
    departmentOverview:
      "The growth office brings in the right clients, tells the company's story, and keeps the pipeline healthy.",
  },

  // ───────── Level 3 — CTO Teams ─────────
  {
    id: "projects",
    title: "Product & Business Analysis Team",
    shortTitle: "Product & BA",
    initials: "BA",
    roleType: "team",
    level: 3,
    illustrativeCount: 5,
    countLabel: "5 Illustrative Positions",
    coordinates: { x: 50, y: 275 },
    color: "#0D9488",
    accentBg: "rgba(13, 148, 136, 0.08)",
    gradient: ["#0D9488", "#2DD4BF"],
    glow: "rgba(45, 212, 191, 0.45)",
    icon: "ClipboardList",
    tagline: "Right problem first, then right solution.",
    tools: ["Figma", "Confluence", "Miro", "Jira"],
    reportsTo: ["cte"],
    collaboratesWith: ["pm"],
    summary:
      "Translates business goals into actionable system specifications, user journeys, workflows, and detailed product backlogs.",
    responsibilities: [
      "Stakeholder requirements elicitation, domain modeling, and process analysis",
      "Authoring user stories, acceptance criteria, and technical system specifications",
      "Translating complex business needs into clear, actionable development requirements",
      "Conducting workflow mapping, gap analysis, and user journey optimization",
      "Collaborating closely with Project Managers and Software Engineers during sprint grooming",
    ],
    exampleRoles: [
      "Senior Business Analyst",
      "Business Analyst",
      "Product Analyst",
      "Product Owner",
      "Requirements Analyst",
    ],
    departmentOverview:
      "Ensures every line of code built corresponds directly to verified customer problems and measurable business value.",
  },

  {
    id: "design",
    title: "UI/UX Design Team",
    shortTitle: "UI/UX Design",
    initials: "UX",
    roleType: "team",
    level: 3,
    illustrativeCount: 4,
    countLabel: "4 Illustrative Positions",
    coordinates: { x: 130, y: 275 },
    color: "#C026D3",
    accentBg: "rgba(192, 38, 211, 0.08)",
    gradient: ["#C026D3", "#E879F9"],
    glow: "rgba(232, 121, 249, 0.5)",
    icon: "Palette",
    tagline: "Interfaces people actually enjoy.",
    tools: ["Figma", "FigJam", "Framer", "Storybook"],
    reportsTo: ["cte"],
    collaboratesWith: ["pm"],
    summary:
      "Crafts intuitive, accessible, and visually striking interfaces backed by user research and a consistent design system.",
    responsibilities: [
      "User research, personas, journey mapping, and usability testing",
      "Wireframes, high-fidelity prototypes, and interaction design",
      "Design system ownership: tokens, components, and accessibility (WCAG) standards",
      "Design handoff and close collaboration with frontend engineers",
    ],
    exampleRoles: [
      "UI/UX Design Lead",
      "Product Designer",
      "UX Researcher",
      "Visual / Brand Designer",
    ],
    departmentOverview:
      "Design turns requirements into experiences that are clear, fast, and memorable.",
  },

  {
    id: "engineering",
    title: "Software Engineering Team",
    shortTitle: "Software Eng",
    initials: "SE",
    roleType: "team",
    level: 3,
    illustrativeCount: 22,
    countLabel: "22 Illustrative Positions",
    coordinates: { x: 210, y: 275 },
    color: "#0047AB",
    accentBg: "rgba(0, 71, 171, 0.08)",
    gradient: ["#0047AB", "#3B82F6"],
    glow: "rgba(59, 130, 246, 0.5)",
    icon: "Code2",
    tagline: "Clean code. Dependable products.",
    tools: ["React", "Next.js", "React Native", "Node", "Go", "PostgreSQL"],
    reportsTo: ["cte"],
    collaboratesWith: ["pm"],
    summary:
      "The technical powerhouse delivering full-stack web applications, native mobile apps, robust APIs, and scalable distributed systems.",
    responsibilities: [
      "System design, clean architecture patterns, and domain-driven design",
      "Modern web and native mobile application engineering (React, Next.js, React Native, Node, Go)",
      "Strict peer code reviews, continuous integration, and automated unit/integration testing",
      "Robust RESTful and GraphQL API implementation with secure relational databases (PostgreSQL)",
      "Performance profiling, code maintainability, and decade-long software evolvability",
    ],
    exampleRoles: [
      "Software Engineering Lead",
      "Senior Software Engineer",
      "Full-Stack Developer",
      "Frontend Developer",
      "Backend Developer",
      "Mobile Application Developer",
    ],
    departmentOverview:
      "Engineers apply silicon-valley discipline and clean architecture principles to create dependable digital products.",
  },

  {
    id: "quality",
    title: "Quality Assurance & Security Team",
    shortTitle: "QA & Security",
    initials: "QA",
    roleType: "team",
    level: 3,
    illustrativeCount: 7,
    countLabel: "7 Illustrative Positions",
    coordinates: { x: 290, y: 275 },
    color: "#059669",
    accentBg: "rgba(5, 150, 105, 0.08)",
    gradient: ["#059669", "#34D399"],
    glow: "rgba(52, 211, 153, 0.45)",
    icon: "ShieldCheck",
    tagline: "If it ships, it's been tested.",
    tools: ["Playwright", "Cypress", "Jest", "k6", "OWASP ZAP"],
    reportsTo: ["cte"],
    collaboratesWith: ["pm"],
    summary:
      "Ensures flawless functionality, resilient performance, regression prevention, and strict application vulnerability hardening.",
    responsibilities: [
      "Formulating comprehensive test plans, manual test suites, and regression matrices",
      "Automated test pipeline engineering (Playwright, Cypress, Jest, k6)",
      "Defect lifecycle tracking, edge-case validation, and release readiness sign-offs",
      "High-scale performance, concurrency, and stress test validation",
      "Application security audits, OWASP top 10 verification, and access vulnerability testing",
    ],
    exampleRoles: [
      "QA Lead",
      "QA Engineer",
      "Software Test Engineer",
      "Automation Test Engineer",
      "Performance Test Engineer",
      "Application Security Engineer",
    ],
    departmentOverview:
      "Protects reliability and user confidence through thorough automated test suites and disciplined release verification.",
  },

  {
    id: "infrastructure",
    title: "DevOps & Infrastructure Team",
    shortTitle: "DevOps & Cloud",
    initials: "DO",
    roleType: "team",
    level: 3,
    illustrativeCount: 5,
    countLabel: "5 Illustrative Positions",
    coordinates: { x: 370, y: 275 },
    color: "#6366F1",
    accentBg: "rgba(99, 102, 241, 0.08)",
    gradient: ["#6366F1", "#A5B4FC"],
    glow: "rgba(129, 140, 248, 0.5)",
    icon: "Cloud",
    tagline: "Ship fast. Stay up. Sleep well.",
    tools: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform"],
    reportsTo: ["cte"],
    collaboratesWith: ["pm"],
    summary:
      "Builds automated CI/CD pipelines, containerized environments, cloud infrastructure, and 24/7 observability frameworks.",
    responsibilities: [
      "Designing automated CI/CD build, test, and zero-downtime deployment pipelines",
      "Cloud architecture and Infrastructure as Code (AWS, Azure, Docker, Kubernetes, Terraform)",
      "System monitoring, distributed logging, telemetry, and automated incident alerting",
      "High-availability clustering, automated data backups, and disaster recovery validation",
      "Security compliance, network isolation, secrets management, and cloud cost governance",
    ],
    exampleRoles: [
      "DevOps Engineer",
      "Cloud Engineer",
      "Infrastructure Engineer",
      "Site Reliability Engineer (SRE)",
      "Systems Administrator",
    ],
    departmentOverview:
      "Powers production reliability, automated delivery speeds, and resilient multi-region cloud operations.",
  },

  {
    id: "data",
    title: "Data & AI Team",
    shortTitle: "Data & AI",
    initials: "AI",
    roleType: "team",
    level: 3,
    illustrativeCount: 6,
    countLabel: "6 Illustrative Positions",
    coordinates: { x: 450, y: 275 },
    color: "#7C3AED",
    accentBg: "rgba(124, 58, 237, 0.08)",
    gradient: ["#7C3AED", "#A78BFA"],
    glow: "rgba(167, 139, 250, 0.5)",
    icon: "BrainCircuit",
    tagline: "Data turned into decisions.",
    tools: ["Python", "SQL", "dbt", "PyTorch", "LLM APIs"],
    reportsTo: ["cte"],
    collaboratesWith: ["pm"],
    summary:
      "Builds data pipelines, analytics dashboards, machine learning models, and AI-powered product features.",
    responsibilities: [
      "Data pipeline engineering, warehousing, and data quality governance",
      "Analytics dashboards and reporting for clients and leadership",
      "Machine learning model development, evaluation, and deployment",
      "LLM-powered features: retrieval, agents, and prompt engineering",
      "Responsible AI practices, privacy, and model monitoring",
    ],
    exampleRoles: [
      "Data Engineer",
      "Data Analyst",
      "Machine Learning Engineer",
      "AI Engineer",
      "BI Developer",
      "Data Scientist",
    ],
    departmentOverview:
      "Gives products and clients an intelligent edge through reliable data and applied AI.",
  },

  // ───────── Level 3 — COO Teams ─────────
  {
    id: "admin",
    title: "Administration & Operations",
    shortTitle: "Admin & Ops",
    initials: "AO",
    roleType: "team",
    level: 3,
    illustrativeCount: 4,
    countLabel: "4 Illustrative Positions",
    coordinates: { x: 530, y: 275 },
    color: "#D97706",
    accentBg: "rgba(217, 119, 6, 0.08)",
    gradient: ["#D97706", "#FBBF24"],
    glow: "rgba(251, 191, 36, 0.45)",
    icon: "Building2",
    tagline: "The backbone of a smooth workday.",
    reportsTo: ["secretary"],
    summary:
      "Manages workplace infrastructure, IT equipment provisioning, vendor coordination, and daily administrative operations.",
    responsibilities: [
      "Workplace management, facilities upkeep, and legal statutory compliance",
      "Internal workstation provisioning, network security, and hardware support",
      "Vendor management, procurement, and contract tracking",
      "Organizational culture initiatives, team wellbeing events, and administrative coordination",
    ],
    exampleRoles: [
      "Office Administrator",
      "Operations Coordinator",
      "IT Support Engineer",
      "Procurement Executive",
    ],
    departmentOverview:
      "Enables all teams to do their best work with seamless administrative and workplace support.",
  },

  {
    id: "hr",
    title: "HR & Talent Team",
    shortTitle: "HR & Talent",
    initials: "HR",
    roleType: "team",
    level: 3,
    illustrativeCount: 3,
    countLabel: "3 Illustrative Positions",
    coordinates: { x: 610, y: 275 },
    color: "#EA580C",
    accentBg: "rgba(234, 88, 12, 0.08)",
    gradient: ["#EA580C", "#FB923C"],
    glow: "rgba(251, 146, 60, 0.5)",
    icon: "Users",
    tagline: "Great people, great culture.",
    tools: ["ATS", "HRIS", "LMS"],
    reportsTo: ["secretary"],
    summary:
      "Attracts, onboards, develops, and retains the talent that powers every team in the company.",
    responsibilities: [
      "Talent acquisition, candidate interview coordination, and smooth employee onboarding",
      "Performance review cycles, career ladders, and learning programs",
      "Employee engagement, wellbeing, and culture initiatives",
      "HR policy, labor compliance, and employee relations",
    ],
    exampleRoles: [
      "HR Manager",
      "Technical Recruiter",
      "HR & Recruitment Executive",
      "Learning & Development Coordinator",
    ],
    departmentOverview:
      "Builds the team behind the products, and the culture that keeps them together.",
  },

  {
    id: "finance",
    title: "Finance & Accounts Team",
    shortTitle: "Finance",
    initials: "FA",
    roleType: "team",
    level: 3,
    illustrativeCount: 3,
    countLabel: "3 Illustrative Positions",
    coordinates: { x: 690, y: 275 },
    color: "#16A34A",
    accentBg: "rgba(22, 163, 74, 0.08)",
    gradient: ["#16A34A", "#4ADE80"],
    glow: "rgba(74, 222, 128, 0.45)",
    icon: "Landmark",
    tagline: "Every number accounted for.",
    tools: ["Accounting Suite", "Payroll", "Excel"],
    reportsTo: ["secretary"],
    summary:
      "Keeps the company financially healthy through accounting, payroll, budgeting, invoicing, and tax compliance.",
    responsibilities: [
      "Financial accounting, bookkeeping, and month-end close",
      "Payroll processing, tax filing, and statutory compliance",
      "Client invoicing, collections, and cash-flow forecasting",
      "Budgeting, expense control, and financial reporting for leadership",
    ],
    exampleRoles: [
      "Finance Manager",
      "Accountant",
      "Finance & Accounts Officer",
      "Payroll Executive",
    ],
    departmentOverview:
      "Provides the financial clarity leadership needs to invest and grow with confidence.",
  },

  {
    id: "support",
    title: "Customer Success & Support Team",
    shortTitle: "Support",
    initials: "CS",
    roleType: "team",
    level: 3,
    illustrativeCount: 5,
    countLabel: "5 Illustrative Positions",
    coordinates: { x: 770, y: 275 },
    color: "#0891B2",
    accentBg: "rgba(8, 145, 178, 0.08)",
    gradient: ["#0891B2", "#22D3EE"],
    glow: "rgba(34, 211, 238, 0.5)",
    icon: "Headset",
    tagline: "Clients stay when they feel looked after.",
    tools: ["Helpdesk", "Status Page", "Intercom"],
    reportsTo: ["secretary"],
    summary:
      "Onboards clients, resolves post-launch issues, and ensures long-term satisfaction and product adoption.",
    responsibilities: [
      "Client onboarding, training, and product adoption",
      "Ticket triage, SLA tracking, and escalation management",
      "Maintenance and support plans after go-live",
      "Feedback loops to product, design, and engineering teams",
    ],
    exampleRoles: [
      "Customer Success Manager",
      "Support Engineer",
      "Technical Support Specialist",
      "Client Onboarding Specialist",
    ],
    departmentOverview:
      "The voice of the client inside the company and the face of the company to the client.",
  },

  // ───────── Level 3 — CGO Teams ─────────
  {
    id: "sales",
    title: "Sales & Business Development Team",
    shortTitle: "Sales & BD",
    initials: "BD",
    roleType: "team",
    level: 3,
    illustrativeCount: 4,
    countLabel: "4 Illustrative Positions",
    coordinates: { x: 850, y: 275 },
    color: "#E11D48",
    accentBg: "rgba(225, 29, 72, 0.08)",
    gradient: ["#E11D48", "#FB7185"],
    glow: "rgba(251, 113, 133, 0.5)",
    icon: "Handshake",
    tagline: "Relationships that turn into partnerships.",
    tools: ["CRM", "LinkedIn Sales Nav", "Proposal Tools"],
    reportsTo: ["growth"],
    summary:
      "Finds, qualifies, and wins new clients while growing relationships with existing accounts.",
    responsibilities: [
      "Lead generation, outreach, and pipeline qualification",
      "Proposals, estimates, and contract negotiation with delivery leadership",
      "Key account management and upsell opportunities",
      "Partnership development with agencies, resellers, and technology vendors",
    ],
    exampleRoles: [
      "Business Development Manager",
      "Sales Executive",
      "Account Manager",
      "Pre-Sales Consultant",
    ],
    departmentOverview:
      "Turns market opportunity into signed projects and long-term client relationships.",
  },

  {
    id: "marketing",
    title: "Marketing & Brand Team",
    shortTitle: "Marketing",
    initials: "MK",
    roleType: "team",
    level: 3,
    illustrativeCount: 4,
    countLabel: "4 Illustrative Positions",
    coordinates: { x: 930, y: 275 },
    color: "#F59E0B",
    accentBg: "rgba(245, 158, 11, 0.08)",
    gradient: ["#F59E0B", "#FCD34D"],
    glow: "rgba(252, 211, 77, 0.5)",
    icon: "Megaphone",
    tagline: "Telling the story worth telling.",
    tools: ["SEO", "Analytics", "Social", "Webflow"],
    reportsTo: ["growth"],
    summary:
      "Builds brand awareness and demand through content, digital campaigns, SEO, events, and case studies.",
    responsibilities: [
      "Brand identity, messaging, and website content",
      "SEO, content marketing, and social media presence",
      "Case studies, whitepapers, and thought-leadership publishing",
      "Campaign analytics and lead-quality reporting with Sales",
    ],
    exampleRoles: [
      "Marketing Manager",
      "Content Strategist",
      "Digital Marketing Executive",
      "Graphic / Social Media Designer",
    ],
    departmentOverview:
      "Makes sure the right people know who the company is and why it's worth trusting.",
  },
];

// ─────────────────────────────────────────────────────────────
// Lookup helpers (declared before connectors, which depend on them)
// ─────────────────────────────────────────────────────────────
export function getOrgNodeById(id: string): OrgNodeData | undefined {
  return ORG_NODES.find((n) => n.id === id);
}

// ─────────────────────────────────────────────────────────────
// Connector path builders — paths are derived from node coordinates,
// so moving a node automatically re-routes its lines.
// ─────────────────────────────────────────────────────────────
const HALF_H = { 1: 19, 2: 19, 3: 22 } as const;
const HALF_W = { 1: 65, 2: 60, 3: 36 } as const;

function verticalCurve(a: OrgNodeData, b: OrgNodeData, bend: number): string {
  const sx = a.coordinates.x;
  const sy = a.coordinates.y + HALF_H[a.level];
  const tx = b.coordinates.x;
  const ty = b.coordinates.y - HALF_H[b.level];
  const my = sy + (ty - sy) * bend;
  return `M ${sx} ${sy} C ${sx} ${my}, ${tx} ${my}, ${tx} ${ty}`;
}

function horizontalLine(a: OrgNodeData, b: OrgNodeData): string {
  const dir = b.coordinates.x > a.coordinates.x ? 1 : -1;
  const sx = a.coordinates.x + dir * HALF_W[a.level];
  const tx = b.coordinates.x - dir * HALF_W[b.level];
  return `M ${sx} ${a.coordinates.y} L ${tx} ${b.coordinates.y}`;
}

function archOver(a: OrgNodeData, b: OrgNodeData, lift: number): string {
  const sx = a.coordinates.x + HALF_W[a.level] - 14;
  const sy = a.coordinates.y - HALF_H[a.level];
  const tx = b.coordinates.x;
  const ty = b.coordinates.y - HALF_H[b.level];
  const top = Math.min(sy, ty) - lift;
  return `M ${sx} ${sy} C ${sx + 60} ${top}, ${tx - 60} ${top}, ${tx} ${ty}`;
}

function buildConnectors(): OrgConnectorData[] {
  const list: OrgConnectorData[] = [];

  // Formal reporting lines (solid) — generated from each node's `reportsTo`
  ORG_NODES.forEach((node) => {
    node.reportsTo?.forEach((parentId) => {
      const parent = getOrgNodeById(parentId);
      if (!parent) return;
      list.push({
        id: `route-${parentId}-${node.id}`,
        from: parentId,
        to: node.id,
        type: "reporting",
        path: verticalCurve(parent, node, 0.45),
        label: `${node.title} reports to ${parent.title}`,
      });
    });
  });

  // Project collaboration lines (dashed) — all originate from the PM node
  const pm = getOrgNodeById("pm")!;

  // Straight link up to the CEO
  const ceo = getOrgNodeById("director")!;
  list.push({
    id: "route-pm-director",
    from: "pm",
    to: "director",
    type: "collaboration",
    path: `M ${pm.coordinates.x} ${pm.coordinates.y - HALF_H[2]} L ${ceo.coordinates.x} ${ceo.coordinates.y + HALF_H[1]
      }`,
    label: "PM coordinates strategic milestones with CEO",
  });

  // Side-by-side leadership links
  const cto = getOrgNodeById("cte")!;
  const coo = getOrgNodeById("secretary")!;
  const cgo = getOrgNodeById("growth")!;
  list.push(
    {
      id: "route-pm-cte",
      from: "pm",
      to: "cte",
      type: "collaboration",
      path: horizontalLine(pm, cto),
      label: "PM aligns technical delivery with CTO",
    },
    {
      id: "route-pm-secretary",
      from: "pm",
      to: "secretary",
      type: "collaboration",
      path: horizontalLine(pm, coo),
      label: "PM coordinates capacity with COO",
    },
    {
      id: "route-pm-growth",
      from: "pm",
      to: "growth",
      type: "collaboration",
      path: archOver(pm, cgo, 26),
      label: "PM aligns delivery commitments with CGO",
    }
  );

  // PM ↔ delivery teams
  (pm.collaboratesWith ?? []).forEach((teamId) => {
    const team = getOrgNodeById(teamId);
    if (!team) return;
    list.push({
      id: `route-pm-${teamId}`,
      from: "pm",
      to: teamId,
      type: "collaboration",
      path: verticalCurve(pm, team, 0.45),
      label: `PM collaborates with ${team.title}`,
    });
  });

  return list;
}

export const ORG_CONNECTORS: OrgConnectorData[] = buildConnectors();

// ─────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────
export function getRelatedConnectors(nodeId: string): OrgConnectorData[] {
  return ORG_CONNECTORS.filter((c) => c.from === nodeId || c.to === nodeId);
}

export function getRelatedNodeIds(nodeId: string): string[] {
  const set = new Set<string>();
  ORG_CONNECTORS.forEach((c) => {
    if (c.from === nodeId) set.add(c.to);
    if (c.to === nodeId) set.add(c.from);
  });
  return Array.from(set);
}

// Headline numbers for a stats strip above the chart
export function getOrgStats() {
  const teams = ORG_NODES.filter((n) => n.roleType === "team");
  const positions = ORG_NODES.reduce((sum, n) => sum + (n.illustrativeCount ?? 0), 0);
  return {
    leadershipRoles: ORG_NODES.filter((n) => n.roleType === "leadership").length,
    teams: teams.length,
    illustrativePositions: positions,
  };
}