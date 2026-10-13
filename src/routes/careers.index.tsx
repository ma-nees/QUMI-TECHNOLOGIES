import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Briefcase,
  MapPin,
  Clock,
  MagnifyingGlass,
  Laptop,
  GraduationCap,
  Lightning,
  CurrencyDollar,
  Code,
  Coffee,
  CheckCircle,
  PaperPlaneTilt,
  Sparkle,
  Compass,
  Users,
} from "@phosphor-icons/react";
import { Reveal } from "@/components/site/primitives";
import { buttonVariants } from "@/components/ui/button";
import { listJobs } from "@/lib/public.functions";
import { principles } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

const jobsQuery = queryOptions({ queryKey: ["jobs"], queryFn: () => listJobs() });

export const Route = createFileRoute("/careers/")({
  head: () => pageMeta("Careers", "Join QUMI Technologies in Kathmandu. Open roles in engineering, design and data."),
  loader: ({ context }) => context.queryClient.ensureQueryData(jobsQuery),
  component: CareersPage,
  errorComponent: () => <p className="container-site py-24">Couldn't load open roles. Please refresh.</p>,
});

const perks = [
  {
    icon: Laptop,
    title: "Top-Tier Workstations & Tooling",
    description: "High-spec Apple Silicon MacBooks or Linux workstations, dual 4K monitors, and top software subscriptions (Copilot, Figma, JetBrains).",
  },
  {
    icon: GraduationCap,
    title: "Continuous Learning & Stipend",
    description: "Annual learning budget for books, international certifications, online courses, and regular engineering guild workshops.",
  },
  {
    icon: Lightning,
    title: "High Autonomy & Zero Bureaucracy",
    description: "We value shipped code, elegant architecture, and customer impact over endless meetings. You own what you build.",
  },
  {
    icon: CurrencyDollar,
    title: "Competitive Market-Leading Pay",
    description: "Transparent salary tiers pegged to top market benchmarks, biannual performance reviews, and merit-driven bonuses.",
  },
  {
    icon: Code,
    title: "Silicon-Valley Engineering Rigor",
    description: "Build robust distributed systems, modern cloud infrastructure, and practical AI applications using clean, modern tech stacks.",
  },
  {
    icon: Coffee,
    title: "Culture, Flexibility & Wellbeing",
    description: "Flexible hybrid work, artisan coffee & healthy snacks, game nights, wellness coverage, and quarterly team retreats.",
  },
];

const hiringSteps = [
  {
    step: "01",
    title: "Application Review",
    time: "3-5 business days",
    description: "We review your CV, GitHub, or portfolio to understand your craft and previous projects. No automated filters.",
  },
  {
    step: "02",
    title: "Technical Conversation",
    time: "45-60 mins",
    description: "A collaborative conversation with a lead engineer discussing system architecture, problem solving, and real-world trade-offs.",
  },
  {
    step: "03",
    title: "Culture & Team Fit",
    time: "30-45 mins",
    description: "Meet your future peers to talk about teamwork, growth expectations, and everyday collaboration style.",
  },
  {
    step: "04",
    title: "Transparent Offer",
    time: "Within 48 hours",
    description: "A clear, competitive offer with transparent benefits and a structured first-month onboarding plan.",
  },
];

function CareersPage() {
  const { data: rawJobs } = useSuspenseQuery(jobsQuery);
  const jobs = rawJobs || [];

  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  // Extract unique departments
  const departments = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.department) set.add(j.department.trim());
    });
    return ["All", ...Array.from(set)];
  }, [jobs]);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const matchesDept = selectedDept === "All" || j.department?.toLowerCase() === selectedDept.toLowerCase();
      const query = search.toLowerCase().trim();
      const matchesSearch =
        !query ||
        j.title?.toLowerCase().includes(query) ||
        j.department?.toLowerCase().includes(query) ||
        j.location?.toLowerCase().includes(query) ||
        j.summary?.toLowerCase().includes(query);
      return matchesDept && matchesSearch;
    });
  }, [jobs, selectedDept, search]);

  return (
    <div className="relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]" aria-hidden="true" />
      <div className="pointer-events-none absolute top-[800px] right-0 -z-10 h-[400px] w-[500px] rounded-full bg-highlight/10 blur-[120px]" aria-hidden="true" />

      {/* Hero Section */}
      <section className="relative border-b border-border/80 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="container-site">
          <Reveal className="max-w-4xl">
            {/* Live Hiring Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              <span>We're hiring talented builders in Kathmandu</span>
            </div>

            <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
              Do the best work of your career.{" "}
              <span className="bg-gradient-to-r from-primary via-[#60a5fa] to-primary bg-clip-text text-transparent">
                Right here from Nepal.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              We combine Silicon-Valley engineering standards with top technical talent. 
              Join a team building reliable, high-stakes software, modern cloud platforms, and practical AI systems.
            </p>

            {/* Quick Metrics & Highlights */}
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs md:text-sm font-medium">
              <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-surface/60 px-3.5 py-2 backdrop-blur-md">
                <MapPin className="text-primary" weight="bold" size={16} />
                <span>Kathmandu (Hybrid & Flexible)</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-surface/60 px-3.5 py-2 backdrop-blur-md">
                <Code className="text-primary" weight="bold" size={16} />
                <span>Modern Tech: React, Go, Cloud, AI</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-surface/60 px-3.5 py-2 backdrop-blur-md">
                <Sparkle className="text-primary" weight="bold" size={16} />
                <span>{jobs.length} Open {jobs.length === 1 ? "Role" : "Roles"}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#open-roles"
                className={cn(buttonVariants({ size: "lg" }), "h-12 px-7 font-medium shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5")}
              >
                Browse Open Positions <ArrowRight weight="bold" className="arrow-nudge ml-2" />
              </a>
              <Link
                to="/careers/$id"
                params={{ id: "general" }}
                className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-12 px-6 border-border/80 bg-surface/70 backdrop-blur-md hover:bg-surface")}
              >
                Send General Application
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Perks & Culture Section */}
      <section className="container-site py-16 md:py-24">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="eyebrow">Life at QUMI</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Built for engineers who care about craft.
              </h2>
            </div>
            <p className="max-w-md text-sm md:text-base text-muted-foreground">
              We foster an environment where smart, curious people have the resources, autonomy, and support to build their best work.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <Reveal key={perk.title} delay={Math.min(i * 35, 180)}>
                <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-border/70 bg-surface/80 p-7 backdrop-blur-md transition-[transform,border-color,background-color,box-shadow] duration-200 ease-out will-change-transform hover:-translate-y-1 hover:border-primary/50 hover:bg-surface hover:shadow-xl hover:shadow-primary/5">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon size={24} weight="bold" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold tracking-tight">{perk.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                      {perk.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="open-roles" className="border-t border-border/80 bg-surface/40 py-16 md:py-24">
        <div className="container-site">
          <Reveal>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">Opportunities</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                  Open Positions
                </h2>
              </div>
              <span className="font-mono text-sm text-muted-foreground">
                Showing {filteredJobs.length} of {jobs.length} roles
              </span>
            </div>
          </Reveal>

          {/* Interactive Search & Filter Bar */}
          <Reveal delay={100} className="mt-8">
            <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-surface/90 p-4 shadow-sm backdrop-blur-md md:flex-row md:items-center md:justify-between">
              {/* Search input */}
              <div className="relative flex-1">
                <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by role title, department, or keywords..."
                  className="w-full rounded-xl border border-border/60 bg-background/70 py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Department Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {departments.map((dept) => {
                  const isActive = selectedDept.toLowerCase() === dept.toLowerCase();
                  return (
                    <button
                      key={dept}
                      onClick={() => setSelectedDept(dept)}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "border border-border/60 bg-background/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      )}
                    >
                      {dept}
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Job Listings Grid */}
          <div className="mt-8 space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/80 bg-surface/60 p-12 text-center backdrop-blur-md">
                <Briefcase size={36} className="mx-auto text-muted-foreground/60" />
                <h3 className="mt-4 text-lg font-bold">No positions found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {search || selectedDept !== "All"
                    ? "Try adjusting your search terms or filter to view more roles."
                    : "There are currently no active job openings listed."}
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  {(search || selectedDept !== "All") && (
                    <button
                      onClick={() => {
                        setSearch("");
                        setSelectedDept("All");
                      }}
                      className="rounded-lg border border-border px-4 py-2 text-xs font-semibold hover:bg-surface"
                    >
                      Reset filters
                    </button>
                  )}
                  <Link
                    to="/careers/$id"
                    params={{ id: "general" }}
                    className={cn(buttonVariants({ size: "sm" }), "text-xs")}
                  >
                    Send general application
                  </Link>
                </div>
              </div>
            ) : (
              filteredJobs.map((j, idx) => (
                <Reveal key={j.id} delay={search || selectedDept !== "All" ? 0 : Math.min(idx * 30, 150)}>
                  <Link
                    to="/careers/$id"
                    params={{ id: j.id }}
                    className="group relative flex flex-col justify-between gap-5 rounded-2xl border border-border/70 bg-surface/85 p-6 backdrop-blur-md transition-[transform,border-color,background-color,box-shadow] duration-200 ease-out will-change-transform hover:-translate-y-1 hover:border-primary/50 hover:bg-surface hover:shadow-xl hover:shadow-primary/5 md:flex-row md:items-center md:p-7"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md border border-primary/20 bg-primary/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-primary">
                          {j.department || "Engineering"}
                        </span>
                        {j.employment_type && (
                          <span className="rounded-md border border-border/60 bg-muted/40 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                            {j.employment_type}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2.5 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {j.title}
                      </h3>

                      {j.summary && (
                        <p className="mt-1.5 line-clamp-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                          {j.summary}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-primary" />
                          {j.location || "Kathmandu, Nepal (Hybrid)"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-primary" />
                          {j.employment_type || "Full-time"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center md:self-center">
                      <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/50 px-4 py-2.5 text-xs font-semibold text-foreground transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                        <span>View Role</span>
                        <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" size={14} weight="bold" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))
            )}
          </div>

          {/* Spontaneous Application Banner */}
          <Reveal className="mt-10">
            <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-surface/80 to-primary/5 p-8 md:p-10 backdrop-blur-xl">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-1.5 rounded-md bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    <PaperPlaneTilt size={14} weight="bold" />
                    <span>Always Scouting Talent</span>
                  </div>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight">
                    Don't see your specific role listed?
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    We value raw intellect, architectural taste, and proactive problem solvers over rigid job titles. 
                    If you are passionate about building dependable software that lasts, we want to hear from you.
                  </p>
                </div>
                <Link
                  to="/careers/$id"
                  params={{ id: "general" }}
                  className={cn(buttonVariants({ size: "lg" }), "h-11 shrink-0 px-6 font-semibold shadow-md shadow-primary/20")}
                >
                  Send a General Application <ArrowRight weight="bold" className="arrow-nudge ml-2" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Transparent Hiring Process */}
      <section className="container-site py-16 md:py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow mx-auto justify-center">The Journey</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Transparent & respectful hiring.
            </h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground">
              We know interviewing can be stressful. We promise prompt feedback, zero trick puzzles, and complete clarity at every step.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {hiringSteps.map((s, idx) => (
            <Reveal key={s.step} delay={Math.min(idx * 40, 160)}>
              <div className="relative flex h-full flex-col justify-between rounded-2xl border border-border/70 bg-surface/80 p-6 backdrop-blur-md">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-primary">
                      {s.step}
                    </span>
                    <span className="rounded-full bg-muted/60 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {s.time}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Engineering Principles */}
      <section className="border-t border-border/80 bg-surface/50 py-16 md:py-24">
        <div className="container-site">
          <Reveal>
            <p className="eyebrow">Our Philosophy</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              How we build software together.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={Math.min(i * 35, 140)}>
                <div className="h-full rounded-2xl border border-border/70 bg-surface/90 p-6 backdrop-blur-md">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">
                    0{i + 1}
                  </div>
                  <h3 className="mt-4 font-bold tracking-tight text-foreground">{p.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
