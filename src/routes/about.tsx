import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Reveal, SectionHeader } from "@/components/site/primitives";
import { CtaSection } from "@/components/home/Sections";
import { NepalKnowledgeMap } from "@/components/network/NepalKnowledgeMap";
import { principles, technologies } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import {
  Compass,
  Broadcast,
  ShieldCheck,
  Code,
  ArrowRight,
  Sparkle,
  CheckCircle,
  MapPin,
  Buildings,
} from "@phosphor-icons/react";

export const Route = createFileRoute("/about")({
  head: () =>
    pageMeta(
      "About",
      "QUMI Technologies is a Nepal-based IT company focused on engineering-driven software, cloud and data work."
    ),
  component: AboutPage,
});

type TabKey = "story" | "network" | "principles" | "tech";

interface TabItem {
  key: TabKey;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; weight?: string }>;
  badge?: string;
  isLive?: boolean;
}

const TABS: TabItem[] = [
  {
    key: "story",
    label: "Company Story",
    icon: Compass,
  },
  {
    key: "network",
    label: "Digital Network",
    icon: Broadcast,
    badge: "LIVE",
    isLive: true,
  },
  {
    key: "principles",
    label: "Core Principles",
    icon: ShieldCheck,
  },
  {
    key: "tech",
    label: "Tech Stack",
    icon: Code,
  },
];

function AboutPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("story");

  // Sync hash with active tab (e.g., #knowledge-network -> network)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes("network") || hash.includes("knowledge")) {
        setActiveTab("network");
      } else if (hash.includes("principle")) {
        setActiveTab("principles");
      } else if (hash.includes("tech")) {
        setActiveTab("tech");
      } else if (hash.includes("story") || hash.includes("about")) {
        setActiveTab("story");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    // Update hash without scrolling page
    const targetHash = key === "network" ? "#knowledge-network" : `#${key}`;
    if (window.history.pushState) {
      window.history.pushState(null, "", targetHash);
    } else {
      window.location.hash = targetHash;
    }
  };

  return (
    <>
      <PageHero
        eyebrow="About QUMI"
        title="A technology company from Nepal, built for the long term."
        intro="We exist to show that dependable, well-engineered software can be designed and built in Nepal — for clients here and around the world."
      />

      {/* Interactive Tabs Header & Navigation Bar */}
      <section className="container-site pt-2 pb-6 sm:pb-8">
        <div className="flex justify-center">
          <div
            role="tablist"
            aria-label="About QUMI sections"
            className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-md shadow-sm max-w-full overflow-x-auto no-scrollbar"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`tab-panel-${tab.key}`}
                  id={`tab-btn-${tab.key}`}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/70"
                  }`}
                >
                  <Icon size={18} weight={isActive ? "fill" : "regular"} className="shrink-0" />
                  <span>{tab.label}</span>
                  {tab.isLive && (
                    <span className="flex items-center gap-1.5 ml-0.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Panels */}
        <div className="mt-6 sm:mt-8">
          {/* 1. COMPANY STORY TAB */}
          {activeTab === "story" && (
            <div
              id="tab-panel-story"
              role="tabpanel"
              aria-labelledby="tab-btn-story"
              className="animate-fade-in"
            >
              <div className="border border-border bg-surface/90 backdrop-blur-md p-6 sm:p-8 md:p-12 rounded-2xl shadow-sm grid gap-8 md:grid-cols-12 md:gap-12">
                <div className="md:col-span-5 space-y-6">
                  <div>
                    <span className="eyebrow text-primary">Our Philosophy</span>
                    <h2 className="mt-2 text-2xl sm:text-3xl font-bold leading-tight">
                      What we stand for
                    </h2>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/50 p-3.5">
                      <MapPin size={20} className="text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-foreground">Kathmandu Headquarters</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Engineering products with Nepal's premier technical talent for domestic & global partners.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/50 p-3.5">
                      <ShieldCheck size={20} className="text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-foreground">Infrastructure Mindset</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Code designed for security, auditability, and decade-long resilience from day zero.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/50 p-3.5">
                      <Buildings size={20} className="text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-foreground">Long-Term Partnerships</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Continuous iteration, deep business alignment, and dedicated technical stewardship.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTabChange("network")}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary hover:underline group cursor-pointer pt-2"
                  >
                    <span>View our nationwide digital network map</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                <div className="space-y-5 text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground md:col-span-7 flex flex-col justify-center">
                  <p>
                    We treat software as infrastructure for the organisations that rely on it. That means thinking about
                    security, performance and maintainability from the first line of code — not after launch.
                  </p>
                  <p>
                    We prefer long partnerships over one-off projects. The best results come from understanding a business
                    deeply and improving its systems over time.
                  </p>
                  <p>
                    We are proud to be based in Kathmandu and to contribute to Nepal's growing technology community through
                    the people we hire, train and work alongside.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. DIGITAL NETWORK TAB */}
          {activeTab === "network" && (
            <div
              id="tab-panel-network"
              role="tabpanel"
              aria-labelledby="tab-btn-network"
              className="animate-fade-in"
            >
              <NepalKnowledgeMap embedded />
            </div>
          )}

          {/* 3. CORE PRINCIPLES TAB */}
          {activeTab === "principles" && (
            <div
              id="tab-panel-principles"
              role="tabpanel"
              aria-labelledby="tab-btn-principles"
              className="animate-fade-in"
            >
              <div className="border border-border bg-surface/90 backdrop-blur-md p-6 sm:p-8 md:p-12 rounded-2xl shadow-sm">
                <SectionHeader
                  eyebrow="Why QUMI"
                  title="The principles we work by."
                  intro="Clear engineering discipline, open collaboration, and business-focused decisions guide every deliverable."
                />
                <div className="mt-8 sm:mt-10 md:mt-12 grid gap-4 sm:gap-6 md:grid-cols-2">
                  {principles.map((p, i) => (
                    <div
                      key={p.title}
                      className="border border-border/70 bg-background/60 p-5 sm:p-6 md:p-8 rounded-xl shadow-xs transition-all hover:bg-background hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="font-mono text-xs font-bold text-primary">0{i + 1}</span>
                        <CheckCircle size={18} className="text-primary/70" weight="fill" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-foreground">{p.title}</h3>
                      <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {p.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. TECH STACK TAB */}
          {activeTab === "tech" && (
            <div
              id="tab-panel-tech"
              role="tabpanel"
              aria-labelledby="tab-btn-tech"
              className="animate-fade-in"
            >
              <div className="border border-border bg-surface/90 backdrop-blur-md p-6 sm:p-8 md:p-12 rounded-2xl shadow-sm">
                <SectionHeader
                  eyebrow="Technology"
                  title="A focused, proven stack."
                  intro="We choose mature tools with strong ecosystems, and we choose them per project — not by habit."
                />
                <div className="mt-8 sm:mt-10 md:mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
                  {technologies.map((g) => (
                    <div
                      key={g.group}
                      className="border border-border/70 bg-background/60 p-5 sm:p-6 rounded-xl shadow-xs transition-all hover:bg-background"
                    >
                      <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground font-semibold">
                        {g.group}
                      </h3>
                      <ul className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3">
                        {g.items.map((t) => (
                          <li
                            key={t}
                            className="flex items-center justify-between border-b border-border/50 pb-2.5 sm:pb-3 text-xs sm:text-[0.95rem] font-semibold last:border-0 text-foreground"
                          >
                            <span>{t}</span>
                            <Sparkle size={13} className="text-primary/50" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-border/60 text-center text-xs text-muted-foreground">
                  Need a custom or enterprise stack? We adapt to client clouds, legacy platforms, and specific compliance requirements.
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Unified CTA Section */}
      <CtaSection />
    </>
  );
}
