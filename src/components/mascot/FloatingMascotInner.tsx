import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { createAvatar } from "@bible-strong/avatar-react";
import "@bible-strong/avatar-react/styles.css";
import definition from "@/assets/strobi.avatar.json";
import { X, Sparkle, ArrowRight } from "@phosphor-icons/react";
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
  | "confused";

const MESSAGES: Record<string, string> = {
  idle: "Hi there! I'm Strobi, QUMI's AI companion. How can we help you build today?",
  happy: "Glad you stopped by! We build high-throughput, mission-critical systems.",
  excited: "Ready to launch something groundbreaking? Let's engineer it!",
  celebrate: "Woohoo! Ship fast, scale gracefully, and build to last!",
  thinking: "Architecting zero-downtime distributed systems... fascinating problem!",
  playful: "Code doesn't have to be boring when it's built with high precision.",
  proud: "Senior engineering talent from Kathmandu serving global enterprises.",
  curious: "Have an ambitious software or AI challenge? We'd love to hear it.",
};

const REACTIONS: { key: AnimationName; label: string; icon: string }[] = [
  { key: "celebrate", label: "Celebrate", icon: "🎉" },
  { key: "thinking", label: "Think", icon: "🤔" },
  { key: "excited", label: "Excited", icon: "⚡" },
  { key: "playful", label: "Play", icon: "🎈" },
  { key: "proud", label: "Proud", icon: "✨" },
];

export default function FloatingMascotInner() {
  const [isOpen, setIsOpen] = useState(false);
  const [animation, setAnimation] = useState<AnimationName>("idle");
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Return to idle after a reaction animation finishes
  useEffect(() => {
    if (animation !== "idle") {
      const timer = setTimeout(() => {
        setAnimation("idle");
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [animation]);

  const handleReactionClick = (key: AnimationName) => {
    setAnimation(key);
    setHasInteracted(true);
  };

  const currentMessage = MESSAGES[animation] || MESSAGES.idle;

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 flex flex-col items-end select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92 }}
            transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
            className="mb-3 w-[calc(100vw-2.5rem)] max-w-sm rounded-2xl border border-border/80 bg-surface/95 p-4 shadow-2xl backdrop-blur-xl sm:w-88"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-bold tracking-tight text-foreground">
                  Strobi <span className="text-[10px] font-medium text-muted-foreground">· QUMI Companion</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                aria-label="Close assistant"
              >
                <X size={15} />
              </button>
            </div>

            {/* Avatar Stage */}
            <div className="relative my-3 flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-primary/5 via-secondary/30 to-background/40 py-3 border border-border/40">
              <div className="relative h-24 w-24 drop-shadow-md">
                <StrobiAvatar
                  animation={animation}
                  size="100%"
                  ariaLabel="Strobi 3D Avatar"
                />
              </div>

              {/* Dynamic Speech Balloon */}
              <div className="mt-2 text-center px-3">
                <p className="text-xs font-medium leading-relaxed text-foreground transition-all duration-200">
                  {currentMessage}
                </p>
              </div>
            </div>

            {/* Interactive Reactions */}
            <div className="mt-2">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Tap to React
                </span>
                <span className="text-[10px] text-primary font-medium flex items-center gap-1">
                  <Sparkle size={10} weight="fill" /> Interactive
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {REACTIONS.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => handleReactionClick(r.key)}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all duration-150 cursor-pointer ${
                      animation === r.key
                        ? "bg-primary text-primary-foreground shadow-xs scale-105"
                        : "bg-secondary/70 text-foreground hover:bg-secondary hover:scale-102"
                    }`}
                  >
                    <span>{r.icon}</span>
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Navigation CTAs */}
            <div className="mt-3.5 border-t border-border/60 pt-3 flex flex-col gap-1.5">
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover transition-colors shadow-xs"
              >
                <span>Initiate an Engagement</span>
                <ArrowRight size={13} weight="bold" />
              </Link>
              <div className="grid grid-cols-2 gap-1.5 text-center">
                <Link
                  to="/services"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-border/70 bg-surface px-2 py-1.5 text-[11px] font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  Services
                </Link>
                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-border/70 bg-surface px-2 py-1.5 text-[11px] font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  About QUMI
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) {
            setAnimation("happy");
          }
        }}
        onMouseEnter={() => {
          setIsHovered(true);
          if (!isOpen && animation === "idle") {
            setAnimation("curious");
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          if (!isOpen && animation === "curious") {
            setAnimation("idle");
          }
        }}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-border/90 bg-surface/90 shadow-xl backdrop-blur-md transition-all duration-200 hover:border-primary/50 hover:shadow-primary/20 cursor-pointer"
        aria-label="Toggle Strobi interactive companion"
        aria-expanded={isOpen}
      >
        {/* Subtle Brand Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 via-transparent to-highlight/20 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Live Strobi Head preview inside trigger */}
        <div className="relative h-11 w-11 flex items-center justify-center pointer-events-none">
          <StrobiAvatar
            animation={isOpen ? "excited" : animation}
            size="100%"
            ariaLabel="Strobi Avatar"
          />
        </div>

        {/* Status Dot */}
        <span className="absolute bottom-0.5 right-0.5 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-surface bg-emerald-500" />
        </span>

        {/* Tooltip on hover if not open */}
        {!isOpen && !hasInteracted && isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-16 whitespace-nowrap rounded-lg border border-border/80 bg-surface/95 px-2.5 py-1 text-xs font-semibold text-foreground shadow-md backdrop-blur-md pointer-events-none"
          >
            Hi! I'm Strobi 👋
          </motion.div>
        )}
      </motion.button>
    </div>
  );
}
