import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { createAvatar } from "@bible-strong/avatar-react";
import "@bible-strong/avatar-react/styles.css";
import definition from "@/assets/strobi.avatar.json";
import {
  X,
  Sparkle,
  ArrowRight,
  PaperPlaneRight,
  ArrowsCounterClockwise,
  CheckCircle,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchCompanySettings } from "@/lib/public.functions";
import { company } from "@/lib/content";
import { supabase } from "@/integrations/supabase/client";

const StrobiAvatar = createAvatar(definition);

export type AnimationName = keyof typeof definition.animations;

export interface StructuredTopic {
  title: string;
  badge: string;
  summary: string;
  points: string[];
  actionLabel: string;
  actionLink: string;
  animation?: AnimationName;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text?: string;
  topic?: StructuredTopic;
  timestamp: string;
}

const INBUILT_TOPICS: Record<string, StructuredTopic> = {
  welcome: {
    title: "Hello, I'm Strobi",
    badge: "QUMI AI Assistant",
    summary:
      "I'm QUMI's intelligent companion. Select a topic below or type any question to explore our software, cloud, and engineering services!",
    points: [
      "Custom Software, Cloud Architecture & AI Systems.",
      "Senior Guild Delivery with 99.9% uptime track record.",
      "Headquartered in Kathmandu, Nepal serving global scale.",
    ],
    actionLabel: "Initiate an Engagement",
    actionLink: "/contact",
    animation: "happy",
  },
  services: {
    title: "Engineering Services",
    badge: "8 Core Domains",
    summary:
      "Purpose-built systems designed for resilience, throughput, and zero fragile code:",
    points: [
      "Custom Software: Scalable back-office systems & internal tools.",
      "Cloud & DevOps: AWS/Azure architecture & automated CI/CD.",
      "Data & AI: Practical intelligence grounded in operational data.",
    ],
    actionLabel: "Explore All Services",
    actionLink: "/services",
    animation: "proud",
  },
  about: {
    title: "About QUMI Technologies",
    badge: "Kathmandu, Nepal",
    summary:
      "Silicon Valley engineering standards combined with premier technical talent in Kathmandu:",
    points: [
      "Senior Guild: Direct collaboration with seasoned engineers.",
      "High Reliability: 99.9% uptime across production platforms.",
      "Global Scale: Multi-region deployments built to international standards.",
    ],
    actionLabel: "Read Our Story",
    actionLink: "/about",
    animation: "celebrate",
  },
  tech: {
    title: "Technology Stack",
    badge: "Production-Grade",
    summary:
      "Resilient, modern technologies selected for scale and maintainability:",
    points: [
      "Frontend: React, Next.js, React Native, TypeScript.",
      "Backend: Node.js, Python, Go, Java distributed services.",
      "Cloud & Data: AWS, Azure, Docker, Kubernetes, PostgreSQL.",
    ],
    actionLabel: "View Case Studies",
    actionLink: "/solutions",
    animation: "thinking",
  },
  industries: {
    title: "Industries We Serve",
    badge: "Specialized Domains",
    summary:
      "Deep technical expertise solving domain-specific data and infrastructure challenges:",
    points: [
      "FinTech: Ledger-safe architectures & real-time transaction tracking.",
      "Healthcare: Secure clinical records & HIPAA compliant workflows.",
      "Logistics & Retail: Fleet dispatch routing & omnichannel commerce.",
    ],
    actionLabel: "Explore Solutions",
    actionLink: "/industries",
    animation: "working",
  },
  start: {
    title: "Kickoff an Initiative",
    badge: "Fast-Track",
    summary:
      "Ready to build or scale your system? Our senior guild engages with speed:",
    points: [
      "Discovery & Architecture: 1-week rapid feasibility sprint.",
      "Dedicated Pod: Hand-picked engineers aligned to your timezone.",
      "Weekly Sprints: Live demoable deliverables and transparent telemetry.",
    ],
    actionLabel: "Schedule Architecture Call",
    actionLink: "/contact",
    animation: "excited",
  },
  careers: {
    title: "Careers & Culture",
    badge: "We're Hiring!",
    summary:
      "Passionate about hard engineering problems and distributed systems? Join our guild:",
    points: [
      "Autonomous, engineering-first culture with continuous growth.",
      "Work with global clients on mission-critical architectures.",
      "Based in Kathmandu, Nepal with flexible hybrid/remote options.",
    ],
    actionLabel: "Browse Open Positions",
    actionLink: "/careers",
    animation: "playful",
  },
};

const QUICK_BUTTONS = [
  { key: "services", label: "Services" },
  { key: "about", label: "About" },
  { key: "contact", label: "Contact" },
  { key: "tech", label: "Tech Stack" },
  { key: "careers", label: "Careers" },
  { key: "start", label: "Kickoff" },
];

const STORAGE_KEY = "qumi_strobi_chat_history_v2";

const createWelcomeMessage = (): ChatMessage => ({
  id: "welcome-0",
  sender: "bot",
  topic: INBUILT_TOPICS.welcome,
  timestamp: "Just now",
});

export default function FloatingMascotInner() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [botAnimation, setBotAnimation] = useState<AnimationName | null>(null);

  // Live admin settings & jobs state
  const [settings, setSettings] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);

  // Persistent Chat History
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === "undefined") return [createWelcomeMessage()];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [createWelcomeMessage()];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const revertTimer = useRef<NodeJS.Timeout | null>(null);

  // Smoothly trigger a reaction animation, then gently revert to natural listening/idle
  const triggerAnimation = useCallback((anim: AnimationName) => {
    setBotAnimation(anim);
    if (revertTimer.current) clearTimeout(revertTimer.current);
    revertTimer.current = setTimeout(() => {
      setBotAnimation(null);
    }, 4500);
  }, []);

  // Compute the current active animation smoothly based on interaction state
  const currentAnimation: AnimationName =
    botAnimation ||
    (isOpen
      ? isTyping
        ? "thinking"
        : "listening"
      : isHovered
      ? "curious"
      : "idle");

  useEffect(() => {
    fetchCompanySettings().then(setSettings).catch(() => {});
    supabase
      .from("jobs")
      .select("id, title, department, employment_type")
      .eq("is_open", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setJobs(data);
      })
      .catch(() => {});

    return () => {
      if (revertTimer.current) clearTimeout(revertTimer.current);
    };
  }, []);

  // Save history on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Auto-scroll on new messages or typing
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  const getDynamicTopic = (key: string): StructuredTopic => {
    if (key === "contact") {
      return {
        title: "Contact & Headquarters",
        badge: "Direct Contact",
        summary: "Reach our leadership and engineering team directly:",
        points: [
          `Email: ${settings?.email || company.email}`,
          `Phone: ${settings?.mobile_number || company.phone}`,
          `Location: ${settings?.location || company.address}`,
        ],
        actionLabel: "Send an Enquiry",
        actionLink: "/contact",
        animation: "happy",
      };
    }
    if (key === "careers") {
      return {
        title: "Open Opportunities",
        badge:
          jobs.length > 0
            ? `${jobs.length} Open ${jobs.length === 1 ? "Role" : "Roles"}`
            : "We're Hiring!",
        summary:
          jobs.length > 0
            ? `We currently have ${jobs.length} active position${
                jobs.length === 1 ? "" : "s"
              } listed on our careers portal:`
            : "Passionate about hard engineering problems and distributed systems? Join our guild:",
        points:
          jobs.length > 0
            ? jobs
                .slice(0, 3)
                .map(
                  (j: any) =>
                    `${j.title} (${j.department || "Engineering"} • ${
                      j.employment_type || "Full-time"
                    })`
                )
            : [
                "Autonomous, engineering-first culture with continuous growth.",
                "Work with global clients on mission-critical architectures.",
                "Flexible hybrid work environment in Kathmandu, Nepal.",
              ],
        actionLabel: "View All Positions & Apply",
        actionLink: "/careers",
        animation: "playful",
      };
    }
    return INBUILT_TOPICS[key] || INBUILT_TOPICS.services;
  };

  const resolveTopicFromQuery = (rawQuery: string): StructuredTopic => {
    const query = rawQuery.toLowerCase().trim();

    // 1. Topic Keyword Matching
    if (
      query.includes("service") ||
      query.includes("offer") ||
      query.includes("build") ||
      query.includes("capability")
    ) {
      return getDynamicTopic("services");
    }
    if (
      query.includes("contact") ||
      query.includes("email") ||
      query.includes("phone") ||
      query.includes("call") ||
      query.includes("office") ||
      query.includes("address") ||
      query.includes("reach") ||
      query.includes("location")
    ) {
      return getDynamicTopic("contact");
    }
    if (
      query.includes("about") ||
      query.includes("who") ||
      query.includes("qumi") ||
      query.includes("nepal") ||
      query.includes("kathmandu") ||
      query.includes("team")
    ) {
      return getDynamicTopic("about");
    }
    if (
      query.includes("tech") ||
      query.includes("stack") ||
      query.includes("language") ||
      query.includes("framework") ||
      query.includes("react") ||
      query.includes("node") ||
      query.includes("python") ||
      query.includes("aws") ||
      query.includes("cloud") ||
      query.includes("architecture")
    ) {
      return getDynamicTopic("tech");
    }
    if (
      query.includes("industry") ||
      query.includes("fintech") ||
      query.includes("health") ||
      query.includes("logistic") ||
      query.includes("domain")
    ) {
      return getDynamicTopic("industries");
    }
    if (
      query.includes("start") ||
      query.includes("hire") ||
      query.includes("price") ||
      query.includes("quote")
    ) {
      return getDynamicTopic("start");
    }
    if (
      query.includes("job") ||
      query.includes("career") ||
      query.includes("apply") ||
      query.includes("hiring") ||
      query.includes("position") ||
      query.includes("role") ||
      query.includes("intern") ||
      query.includes("devops") ||
      query.includes("developer")
    ) {
      return getDynamicTopic("careers");
    }
    if (
      query.includes("case") ||
      query.includes("study") ||
      query.includes("project") ||
      query.includes("portfolio") ||
      query.includes("work")
    ) {
      return {
        title: "Project Case Studies",
        badge: "Proven Delivery",
        summary:
          "Explore our real-world software, data, and cloud architecture deployments:",
        points: [
          "FinTech: Digital lending & automated KYC underwriting engine.",
          "Logistics: Live GPS telemetry & automated fleet dispatch routing.",
          "Healthcare: HIPAA-compliant clinical records & patient portal.",
        ],
        actionLabel: "View All Project Case Studies",
        actionLink: "/solutions",
        animation: "celebrate",
      };
    }

    // 2. Emotional & Conversational Sentiment Matching
    if (
      query.includes("hello") ||
      query.includes("hi") ||
      query.includes("hey") ||
      query.includes("morning") ||
      query.includes("yo")
    ) {
      return {
        title: "Greetings! Welcome to QUMI",
        badge: "AI Companion",
        summary:
          "Hello! I'm Strobi, QUMI's interactive companion. How can I assist you with your software and cloud initiatives today?",
        points: [
          "Ask me about our software engineering services.",
          "Inquire about our team, technologies, or past projects.",
          "Directly connected to QUMI's services & engineering portal.",
        ],
        actionLabel: "Explore Services",
        actionLink: "/services",
        animation: "happy",
      };
    }

    if (
      query.includes("thank") ||
      query.includes("great") ||
      query.includes("awesome") ||
      query.includes("good") ||
      query.includes("cool") ||
      query.includes("nice") ||
      query.includes("love")
    ) {
      return {
        title: "Much Appreciated!",
        badge: "Gratitude",
        summary:
          "Thank you! Our engineering guild takes immense pride in delivering resilient, production-grade systems and top-quality experiences.",
        points: [
          "Built with high reliability and zero fragile code.",
          "Backed by senior guild delivery across global clients.",
        ],
        actionLabel: "Work With Us",
        actionLink: "/contact",
        animation: "laughing",
      };
    }

    if (
      query.includes("funny") ||
      query.includes("joke") ||
      query.includes("haha") ||
      query.includes("lol") ||
      query.includes("smile")
    ) {
      return {
        title: "Keep Coding, Keep Smiling!",
        badge: "Playful",
        summary:
          "Why do programmers prefer dark mode? Because light attracts bugs! 😄 Always happy to bring good energy to your development workflow.",
        points: [
          "Clean code, automated tests, zero late-night emergencies.",
          "High performance with maximum engineering satisfaction.",
        ],
        actionLabel: "Explore Solutions",
        actionLink: "/solutions",
        animation: "laughing",
      };
    }

    if (
      query.includes("sad") ||
      query.includes("bad") ||
      query.includes("bug") ||
      query.includes("error") ||
      query.includes("problem") ||
      query.includes("issue") ||
      query.includes("broken") ||
      query.includes("fail")
    ) {
      return {
        title: "Let's Solve It Together",
        badge: "Troubleshooting",
        summary:
          "Bugs happen, but resilient architecture eliminates fragile dependencies. Our engineers specialize in diagnosing performance bottlenecks.",
        points: [
          "Architecture audit and root-cause analysis.",
          "Automated test suites & resilient retry logic.",
          "Production observability with OpenTelemetry & Datadog.",
        ],
        actionLabel: "Request Architecture Audit",
        actionLink: "/contact",
        animation: "thinking",
      };
    }

    if (
      query.includes("smart") ||
      query.includes("ai") ||
      query.includes("intelligent") ||
      query.includes("model") ||
      query.includes("llm") ||
      query.includes("agent")
    ) {
      return {
        title: "Practical AI & Intelligence",
        badge: "AI Engineering",
        summary:
          "We build production-grade agentic systems, RAG pipelines, and automated intelligence directly embedded into your operational workflows.",
        points: [
          "Enterprise RAG with strict tenant data isolation.",
          "Vector embeddings & semantic search pipelines.",
          "Domain-specialized agents with determinism & reliability.",
        ],
        actionLabel: "Explore AI Capabilities",
        actionLink: "/services",
        animation: "celebrate",
      };
    }

    if (
      query.includes("who are you") ||
      query.includes("what are you") ||
      query.includes("bot") ||
      query.includes("mascot") ||
      query.includes("strobi")
    ) {
      return {
        title: "Meet Strobi · AI Companion",
        badge: "Interactive Mascot",
        summary:
          "I'm Strobi, QUMI's interactive companion powered by procedural vector animations, here to guide you through our engineering offerings, case studies, and career opportunities!",
        points: [
          "Interactive vector animation with life-like expressions and natural blinks.",
          "Ask about custom software, cloud architecture, data, and devops.",
          "Check open opportunities or initiate an engagement anytime.",
        ],
        actionLabel: "Learn About QUMI",
        actionLink: "/about",
        animation: "happy",
      };
    }

    // Default Fallback
    return {
      title: "QUMI Engineering Intelligence",
      badge: "Direct Assistance",
      summary: `Regarding "${rawQuery}": QUMI specializes in custom software architectures, cloud infrastructure, and AI engineering.`,
      points: [
        "Senior engineers lead every project from kickoff to deployment.",
        "Explore our 8 service domains or connect directly with our architects.",
        "Schedule a call to discuss your specific technical requirements.",
      ],
      actionLabel: "Connect with Engineering Team",
      actionLink: "/contact",
      animation: "happy",
    };
  };

  const sendQuery = (text: string, matchedTopic?: StructuredTopic) => {
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sender: "user",
      text,
      timestamp: now,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setBotAnimation("thinking");

    setTimeout(() => {
      const topic = matchedTopic || resolveTopicFromQuery(text);
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sender: "bot",
        topic,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      triggerAnimation(topic.animation || "happy");
    }, 450);
  };

  const handleCustomSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputValue.trim();
    if (!query) return;
    setInputValue("");
    sendQuery(query);
  };

  const selectInbuiltTopic = (key: string, queryLabel?: string) => {
    const topic = getDynamicTopic(key);
    sendQuery(queryLabel || topic.title, topic);
  };

  const handleClearHistory = () => {
    const fresh = [createWelcomeMessage()];
    setMessages(fresh);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    triggerAnimation("happy");
  };

  return (
    <motion.div
      id="floating-mascot-root"
      data-mascot-container="true"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end select-none"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-2 sm:mb-2.5 flex flex-col w-[calc(100vw-1.5rem)] max-w-[400px] sm:max-w-[440px] md:max-w-[460px] h-[520px] max-h-[82vh] rounded-2xl sm:rounded-3xl border border-border/80 bg-surface/95 shadow-2xl backdrop-blur-xl overflow-hidden"
          >
            {/* Chatbot Header */}
            <div className="flex items-center justify-between border-b border-border/70 px-3.5 py-2.5 sm:px-4.5 sm:py-3 bg-secondary/30 shrink-0">
              <div className="flex items-center gap-2.5">
                {/* Live Strobi Avatar inside Header */}
                <div className="relative h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center filter drop-shadow-xs shrink-0 transition-transform duration-200">
                  <StrobiAvatar
                    animation={currentAnimation}
                    size="100%"
                    ariaLabel="Strobi"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-foreground tracking-tight">
                      Strobi
                    </span>
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                  </div>
                  <p className="text-[10.5px] sm:text-[11px] text-muted-foreground font-medium leading-none mt-0.5">
                    QUMI AI Companion
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearHistory}
                  title="Clear conversation history"
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <ArrowsCounterClockwise size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close assistant"
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Scrollable Message History Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 [scrollbar-width:thin] text-foreground">
              {messages.map((msg) => (
                <div key={msg.id} className="w-full">
                  {msg.sender === "user" ? (
                    <div className="flex justify-end">
                      <div className="rounded-2xl rounded-tr-xs bg-primary px-3.5 py-2 text-xs sm:text-[13px] font-medium text-primary-foreground shadow-xs max-w-[85%] break-words">
                        {msg.text}
                      </div>
                    </div>
                  ) : msg.topic ? (
                    <div className="flex flex-col items-start gap-1 max-w-[96%]">
                      <div className="rounded-xl sm:rounded-2xl border border-border/70 bg-card/95 p-3.5 shadow-2xs space-y-2 text-foreground w-full">
                        {/* Title & Badge */}
                        <div className="flex items-center justify-between gap-1.5 border-b border-border/50 pb-1.5">
                          <span className="text-xs sm:text-[13.5px] font-bold text-foreground">
                            {msg.topic.title}
                          </span>
                          <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-primary">
                            {msg.topic.badge}
                          </span>
                        </div>

                        {/* Summary */}
                        <p className="text-[11.5px] sm:text-xs leading-relaxed text-foreground/90 font-medium">
                          {msg.topic.summary}
                        </p>

                        {/* Compact Points */}
                        <ul className="space-y-1.5 pt-0.5 text-[10.5px] sm:text-[11.5px] text-muted-foreground">
                          {msg.topic.points.map((pt, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-1.5 leading-snug"
                            >
                              <CheckCircle
                                size={13}
                                weight="fill"
                                className="text-primary shrink-0 mt-0.5"
                              />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Action Link */}
                        {msg.topic.actionLink && (
                          <div className="pt-1.5">
                            <Link
                              to={msg.topic.actionLink}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary-hover px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-primary-foreground shadow-2xs transition-colors"
                            >
                              <span>{msg.topic.actionLabel}</span>
                              <ArrowRight size={11} weight="bold" />
                            </Link>
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-muted-foreground/70 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  ) : null}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card p-3 text-xs text-muted-foreground w-fit">
                  <span className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.15s]" />
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.3s]" />
                  </span>
                  <span className="font-medium text-[11px]">Thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Topic Chips */}
            <div className="border-t border-border/50 bg-secondary/15 px-2.5 py-1.5 sm:px-3 sm:py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5">
                {QUICK_BUTTONS.map((btn) => (
                  <button
                    key={btn.key}
                    type="button"
                    onClick={() => selectInbuiltTopic(btn.key, btn.label)}
                    className="shrink-0 whitespace-nowrap rounded-full border border-border/70 bg-surface px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all cursor-pointer shadow-2xs"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleCustomSubmit}
              className="flex items-center gap-2 border-t border-border/70 p-2 sm:p-2.5 bg-surface shrink-0"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
                placeholder="Ask Strobi anything about QUMI..."
                className="flex-1 rounded-xl border border-border/80 bg-background/70 px-3 py-1.5 text-xs sm:text-[13px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary h-9 sm:h-9.5"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="flex h-9 w-9 sm:h-9.5 sm:w-9.5 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-primary-hover active:scale-95 shadow-xs shrink-0"
                title="Send inquiry"
              >
                <PaperPlaneRight size={14} weight="fill" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sleek Bot Trigger Icon with Living Idle/Listening Animation */}
      <motion.button
        type="button"
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
        whileHover={{ scale: 1.08, rotate: [-2, 3, -1, 0] }}
        whileTap={{ scale: 0.92 }}
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        onMouseEnter={() => {
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
        className={`group relative flex items-center justify-center bg-transparent border-0 p-0 outline-none focus:outline-none cursor-pointer filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.2)] hover:drop-shadow-[0_8px_20px_rgba(91,127,229,0.35)] transition-all duration-200 ${
          isOpen
            ? "h-13 w-13 sm:h-15 sm:w-15 md:h-16 md:w-16"
            : "h-16 w-16 sm:h-20 sm:w-20 md:h-[84px] md:w-[84px]"
        }`}
        aria-label="Chat with Strobi AI companion"
        aria-expanded={isOpen}
      >
        <div className="w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-300">
          <StrobiAvatar
            animation={currentAnimation}
            size="100%"
            ariaLabel="Strobi Avatar"
          />
        </div>

        {/* Tooltip on hover if not open */}
        {!isOpen && isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-full mr-3 whitespace-nowrap rounded-lg border border-border/80 bg-surface/95 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-md backdrop-blur-md pointer-events-none flex items-center gap-1.5"
          >
            <span>Ask Strobi</span>
            <Sparkle size={11} weight="fill" className="text-primary" />
          </motion.div>
        )}
      </motion.button>
    </motion.div>
  );
}
