import { useState, useEffect, useRef } from "react";
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

const StrobiAvatar = createAvatar(definition);

type AnimationName =
  | "idle"
  | "happy"
  | "excited"
  | "celebrate"
  | "thinking"
  | "playful"
  | "proud"
  | "curious"
  | "waking"
  | "listening"
  | "searching";

interface StructuredTopic {
  title: string;
  badge: string;
  summary: string;
  points: string[];
  actionLabel: string;
  actionLink: string;
  animation: AnimationName;
}

// In-built structured company topics designed to fit without any scrolling
const INBUILT_TOPICS: Record<string, StructuredTopic> = {
  welcome: {
    title: "Hello, I'm Strobi",
    badge: "QUMI AI Assistant",
    summary:
      "I'm QUMI's intelligent companion. Select a topic below or type any question to explore our capabilities.",
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
    actionLabel: "View Industry Solutions",
    actionLink: "/industries",
    animation: "curious",
  },
  start: {
    title: "Initiate an Engagement",
    badge: "Quick Kickoff",
    summary:
      "Every project begins with a structured architectural discovery sprint:",
    points: [
      "Phase 1: Architecture & Technical Scope Definition.",
      "Phase 2: Transparent Bi-weekly Agile Sprint Iterations.",
      "Flexible Model: Dedicated senior team extension or fixed delivery.",
    ],
    actionLabel: "Start a Project Now",
    actionLink: "/contact",
    animation: "excited",
  },
  careers: {
    title: "QUMI Engineering Guild",
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

// In-built quick inquiry buttons (cleanly horizontal, zero scrollbar)
const QUICK_BUTTONS = [
  { key: "services", label: "Services" },
  { key: "about", label: "About" },
  { key: "tech", label: "Tech Stack" },
  { key: "industries", label: "Industries" },
  { key: "start", label: "Kickoff" },
  { key: "careers", label: "Careers" },
];

// Automatic expression rotation sequence when floating idle
const AUTOMATIC_EXPRESSIONS: AnimationName[] = [
  "idle",
  "curious",
  "thinking",
  "happy",
  "playful",
  "proud",
  "excited",
  "celebrate",
  "waking",
];

export default function FloatingMascotInner() {
  const [isOpen, setIsOpen] = useState(false);
  const [animation, setAnimation] = useState<AnimationName>("idle");
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Active in-built topic card (fits perfectly without requiring scrolling)
  const [activeTopic, setActiveTopic] = useState<StructuredTopic>(
    INBUILT_TOPICS.welcome
  );
  const [userQuery, setUserQuery] = useState<string | null>(null);

  const autoExpressionIndex = useRef(0);

  // 1. AUTOMATIC EXPRESSION ROTATION (cycles expressions automatically every 4.5s)
  useEffect(() => {
    if (isOpen || isHovered) return;

    const interval = setInterval(() => {
      autoExpressionIndex.current =
        (autoExpressionIndex.current + 1) % AUTOMATIC_EXPRESSIONS.length;
      const nextAnimation = AUTOMATIC_EXPRESSIONS[autoExpressionIndex.current];
      if (nextAnimation) {
        setAnimation(nextAnimation);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isOpen, isHovered]);

  const selectInbuiltTopic = (key: string, queryLabel?: string) => {
    const topic = INBUILT_TOPICS[key] || INBUILT_TOPICS.services;
    setUserQuery(queryLabel || topic.title);
    setIsTyping(true);
    setAnimation("thinking");

    setTimeout(() => {
      setActiveTopic(topic);
      setAnimation(topic.animation);
      setIsTyping(false);
    }, 380);
  };

  const handleCustomSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputValue.trim().toLowerCase();
    if (!query) return;

    setUserQuery(inputValue.trim());
    setInputValue("");
    setIsTyping(true);
    setAnimation("thinking");

    setTimeout(() => {
      // Smart intent matching to in-built structured message types
      if (
        query.includes("service") ||
        query.includes("offer") ||
        query.includes("build") ||
        query.includes("capability")
      ) {
        setActiveTopic(INBUILT_TOPICS.services);
        setAnimation(INBUILT_TOPICS.services.animation);
      } else if (
        query.includes("about") ||
        query.includes("who") ||
        query.includes("qumi") ||
        query.includes("nepal") ||
        query.includes("kathmandu")
      ) {
        setActiveTopic(INBUILT_TOPICS.about);
        setAnimation(INBUILT_TOPICS.about.animation);
      } else if (
        query.includes("tech") ||
        query.includes("stack") ||
        query.includes("react") ||
        query.includes("cloud") ||
        query.includes("aws") ||
        query.includes("python")
      ) {
        setActiveTopic(INBUILT_TOPICS.tech);
        setAnimation(INBUILT_TOPICS.tech.animation);
      } else if (
        query.includes("industry") ||
        query.includes("fintech") ||
        query.includes("health") ||
        query.includes("domain")
      ) {
        setActiveTopic(INBUILT_TOPICS.industries);
        setAnimation(INBUILT_TOPICS.industries.animation);
      } else if (
        query.includes("start") ||
        query.includes("hire") ||
        query.includes("contact") ||
        query.includes("price") ||
        query.includes("quote")
      ) {
        setActiveTopic(INBUILT_TOPICS.start);
        setAnimation(INBUILT_TOPICS.start.animation);
      } else if (
        query.includes("job") ||
        query.includes("career") ||
        query.includes("apply") ||
        query.includes("hiring")
      ) {
        setActiveTopic(INBUILT_TOPICS.careers);
        setAnimation(INBUILT_TOPICS.careers.animation);
      } else {
        // Fallback structured card
        setActiveTopic({
          title: "QUMI Engineering Intelligence",
          badge: "Direct Assistance",
          summary: `Regarding "${userQuery || query}": QUMI specializes in custom software architectures, cloud infrastructure, and AI engineering.`,
          points: [
            "Senior engineers lead every project from kickoff to deployment.",
            "Explore our 8 service domains or connect directly with our architects.",
            "Schedule a call to discuss your specific technical requirements.",
          ],
          actionLabel: "Connect with Engineering Team",
          actionLink: "/contact",
          animation: "happy",
        });
        setAnimation("happy");
      }
      setIsTyping(false);
    }, 420);
  };

  const handleReset = () => {
    setUserQuery(null);
    setActiveTopic(INBUILT_TOPICS.welcome);
    setAnimation("happy");
  };

  return (
    <motion.div
      id="floating-mascot-root"
      data-mascot-container="true"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-2.5 right-2.5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end select-none"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.94 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="mb-1.5 sm:mb-2 flex flex-col w-[calc(100vw-2rem)] max-w-[305px] sm:max-w-[370px] rounded-xl sm:rounded-2xl border border-border/80 bg-surface/95 shadow-xl backdrop-blur-xl overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* Chatbot Header - Spacious & balanced */}
            <div className="flex items-center justify-between border-b border-border/70 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-secondary/30">
              <div className="flex items-center gap-2">
                {/* Live Strobi Avatar inside Header */}
                <div className="relative h-8 w-8 sm:h-8.5 sm:w-8.5 flex items-center justify-center filter drop-shadow-xs">
                  <StrobiAvatar
                    animation={animation}
                    size="100%"
                    ariaLabel="Strobi"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-foreground tracking-tight">
                      Strobi
                    </span>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                  </div>
                  <p className="text-[9.5px] sm:text-[10.5px] text-muted-foreground font-medium capitalize leading-none">
                    QUMI AI · {animation}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={handleReset}
                  title="Reset conversation"
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <ArrowsCounterClockwise size={13} className="sm:hidden" />
                  <ArrowsCounterClockwise size={15} className="hidden sm:block" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close assistant"
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <X size={14} className="sm:hidden" />
                  <X size={16} className="hidden sm:block" />
                </button>
              </div>
            </div>

            {/* In-Built Message Card Display - Generous height & breathable */}
            <div className="p-2.5 sm:p-3 flex flex-col justify-center min-h-[180px] sm:min-h-[195px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {/* Optional user prompt badge if asked a custom question */}
              {userQuery && (
                <div className="mb-1.5 self-end rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-medium text-primary max-w-[90%] truncate">
                  {userQuery}
                </div>
              )}

              {/* Bot Response Box */}
              <AnimatePresence mode="wait">
                {isTyping ? (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 rounded-lg border border-border/60 bg-card p-3 text-[11px] text-muted-foreground"
                  >
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.15s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.3s]" />
                    </span>
                    <span className="font-medium text-[10.5px]">Thinking...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeTopic.title}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="rounded-lg sm:rounded-xl border border-border/70 bg-card/95 p-2.5 sm:p-3 shadow-2xs space-y-1.5 text-foreground"
                  >
                    {/* Title & Badge */}
                    <div className="flex items-center justify-between gap-1 border-b border-border/50 pb-1">
                      <span className="text-[11.5px] sm:text-xs font-bold text-foreground">
                        {activeTopic.title}
                      </span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[8.5px] sm:text-[9.5px] font-semibold text-primary">
                        {activeTopic.badge}
                      </span>
                    </div>

                    {/* Summary */}
                    <p className="text-[10.5px] sm:text-[11.5px] leading-relaxed text-foreground/90 font-medium">
                      {activeTopic.summary}
                    </p>

                    {/* Compact Points - clean and readable */}
                    <ul className="space-y-1 pt-0.5 text-[9.5px] sm:text-[10.5px] text-muted-foreground">
                      {activeTopic.points.map((pt, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-1.5 leading-snug"
                        >
                          <CheckCircle
                            size={11.5}
                            weight="fill"
                            className="text-primary shrink-0 mt-0.5"
                          />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Action Button */}
                    <div className="pt-1">
                      <Link
                        to={activeTopic.actionLink}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 rounded-md bg-primary hover:bg-primary-hover px-3 py-1 text-[9.5px] sm:text-[11px] font-semibold text-primary-foreground shadow-2xs transition-colors"
                      >
                        <span>{activeTopic.actionLabel}</span>
                        <ArrowRight size={10} weight="bold" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* In-Built Quick Topic Chips - Single horizontal scroll row (zero scrollbars) */}
            <div className="border-t border-border/50 bg-secondary/15 px-2.5 py-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5">
                {QUICK_BUTTONS.map((btn) => (
                  <button
                    key={btn.key}
                    type="button"
                    onClick={() => selectInbuiltTopic(btn.key, btn.label)}
                    className="shrink-0 whitespace-nowrap rounded-full border border-border/70 bg-surface px-2.5 py-1 text-[9px] sm:text-[10px] font-semibold text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all cursor-pointer shadow-2xs"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Field - Comfortable & breathable */}
            <form
              onSubmit={handleCustomSubmit}
              className="flex items-center gap-1.5 border-t border-border/70 p-1.5 sm:p-2 bg-surface"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Strobi..."
                className="flex-1 rounded-md sm:rounded-lg border border-border/80 bg-background/60 px-2.5 py-1 text-[10.5px] sm:text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary h-8 sm:h-8.5"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-md sm:rounded-lg bg-primary text-primary-foreground transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-primary-hover active:scale-95 shadow-xs shrink-0"
                title="Send inquiry"
              >
                <PaperPlaneRight size={12} weight="fill" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pure Floating Avatar Trigger */}
      <motion.button
        type="button"
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3.4, ease: "easeInOut" }}
        whileHover={{ scale: 1.1, rotate: [-2, 3, -1, 0] }}
        whileTap={{ scale: 0.92 }}
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) {
            setAnimation("happy");
          }
        }}
        onMouseEnter={() => {
          setIsHovered(true);
          if (!isOpen) {
            setAnimation("curious");
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          if (!isOpen) {
            setAnimation("idle");
          }
        }}
        className={`group relative flex items-center justify-center bg-transparent border-0 p-0 outline-none focus:outline-none cursor-pointer filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.2)] hover:drop-shadow-[0_12px_22px_rgba(91,127,229,0.38)] transition-all duration-200 ${
          isOpen ? "h-12 w-12 sm:h-14 sm:w-14" : "h-15 w-15 sm:h-18 sm:w-18"
        }`}
        aria-label="Chat with Strobi AI companion"
        aria-expanded={isOpen}
      >
        {/* Pure Strobi 3D Avatar */}
        <div className="w-full h-full flex items-center justify-center pointer-events-none">
          <StrobiAvatar
            animation={isOpen ? "listening" : animation}
            size="100%"
            ariaLabel="Strobi Avatar"
          />
        </div>

        {/* Tooltip on hover if not open */}
        {!isOpen && isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-full mr-2 whitespace-nowrap rounded-lg border border-border/80 bg-surface/95 px-2 py-0.5 text-[10px] font-semibold text-foreground shadow-md backdrop-blur-md pointer-events-none flex items-center gap-1"
          >
            <span>Ask Strobi</span>
            <Sparkle size={10} weight="fill" className="text-primary" />
          </motion.div>
        )}
      </motion.button>
    </motion.div>
  );
}
