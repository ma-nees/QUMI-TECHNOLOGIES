"use client";

import * as React from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface EyeTrackingProps {
  /** Additional CSS classes */
  className?: string;
  /** Size of each eye in pixels */
  eyeSize?: number;
  /** Gap between eyes in pixels */
  gap?: number;
  /** Color of the iris */
  irisColor?: string;
  /** Secondary iris color for gradient */
  irisColorSecondary?: string;
  /** Pupil color */
  pupilColor?: string;
  /** Sclera (white) color */
  scleraColor?: string;
  /** How far the pupil can travel (0-1) */
  pupilRange?: number;
  /** Enable the reflection/glint effect */
  showReflection?: boolean;
  /** Enable iris detail pattern */
  showIrisDetail?: boolean;
  /** Enable subtle idle animation when cursor is away */
  idleAnimation?: boolean;
  /** Blink interval in milliseconds (0 to disable) */
  blinkInterval?: number;
  /** Number of eyes */
  eyeCount?: number;
  /** Variant style */
  variant?: "realistic" | "cartoon" | "minimal" | "cyber";
  /** Enable reactive pupil dilation */
  reactivePupil?: boolean;
  /** Eyelid visibility */
  showEyelids?: boolean;
}

interface EyeProps {
  eyeSize: number;
  irisColor: string;
  irisColorSecondary: string;
  pupilColor: string;
  scleraColor: string;
  pupilRange: number;
  showReflection: boolean;
  showIrisDetail: boolean;
  blinkInterval: number;
  variant: "realistic" | "cartoon" | "minimal" | "cyber";
  reactivePupil: boolean;
  showEyelids: boolean;
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
  index: number;
}

function Eye({
  eyeSize,
  irisColor,
  irisColorSecondary,
  pupilColor,
  scleraColor,
  pupilRange,
  showReflection,
  showIrisDetail,
  blinkInterval,
  variant,
  reactivePupil,
  showEyelids,
  mouseX,
  mouseY,
}: EyeProps) {
  const eyeRef = React.useRef<HTMLDivElement>(null);
  const [isBlinking, setIsBlinking] = React.useState(false);
  const [pupilScale, setPupilScale] = React.useState(1);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 25, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 25, mass: 0.5 });

  const irisSize = eyeSize * 0.45;
  const pupilSize = irisSize * 0.5;
  const maxOffset = (eyeSize / 2 - irisSize / 2) * pupilRange;

  // Blink animation
  React.useEffect(() => {
    if (blinkInterval <= 0) return;

    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    };

    const randomOffset = Math.random() * 200;
    const timeout = setTimeout(() => {
      blink();
      const interval = setInterval(blink, blinkInterval + Math.random() * 1000);
      return () => clearInterval(interval);
    }, randomOffset);

    const interval = setInterval(blink, blinkInterval + Math.random() * 1000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [blinkInterval]);

  // Track mouse position and update pupil
  React.useEffect(() => {
    let animFrame: number;

    const update = () => {
      if (!eyeRef.current) {
        animFrame = requestAnimationFrame(update);
        return;
      }

      const rect = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const dx = mouseX.current - eyeCenterX;
      const dy = mouseY.current - eyeCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      const clampedDistance = Math.min(distance, maxOffset * 3);
      const normalizedDistance = clampedDistance / (maxOffset * 3);
      const offset = normalizedDistance * maxOffset;

      x.set(Math.cos(angle) * offset);
      y.set(Math.sin(angle) * offset);

      // Reactive pupil dilation based on distance
      if (reactivePupil) {
        const proximityScale = distance < 200 ? 1.3 - (distance / 200) * 0.3 : 0.85 + (Math.min(distance, 800) / 800) * 0.15;
        setPupilScale(proximityScale);
      }

      animFrame = requestAnimationFrame(update);
    };

    animFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animFrame);
  }, [x, y, maxOffset, reactivePupil, mouseX, mouseY]);

  // Rotation transform for iris detail
  const irisRotation = useTransform(springX, [-maxOffset, maxOffset], [-15, 15]);

  const eyeAspect = variant === "cartoon" ? 1 : 0.85;
  const borderRadius = "50%";

  const scleraGradient =
    variant === "realistic"
      ? `radial-gradient(circle at 35% 35%, ${scleraColor} 0%, ${scleraColor}ee 60%, ${scleraColor}cc 100%)`
      : variant === "cyber"
        ? `radial-gradient(circle at 50% 50%, #0a0a1a 0%, #111128 100%)`
        : scleraColor;

  const eyeWidth = eyeSize;
  const eyeHeight = eyeSize * eyeAspect;

  return (
    <motion.div
      ref={eyeRef}
      className={cn(
        "relative overflow-hidden",
        variant === "cyber" && "border border-cyan-500/30"
      )}
      style={{
        width: eyeWidth,
        height: eyeHeight,
        borderRadius,
        background: scleraGradient,
        boxShadow:
          variant === "realistic"
            ? "inset 0 2px 8px rgba(0,0,0,0.15), inset 0 -1px 4px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.1)"
            : variant === "cyber"
              ? "inset 0 0 30px rgba(0,200,255,0.1), 0 0 20px rgba(0,200,255,0.15)"
              : variant === "cartoon"
                ? "inset 0 4px 12px rgba(0,0,0,0.1), 0 6px 24px rgba(0,0,0,0.15)"
                : "0 2px 10px rgba(0,0,0,0.1)",
      }}
      animate={{
        scaleY: isBlinking ? 0.05 : 1,
      }}
      transition={{
        scaleY: { duration: 0.1, ease: "easeInOut" },
      }}
    >
      {/* Blood vessel details for realistic variant */}
      {variant === "realistic" && (
        <div className="absolute inset-0 overflow-hidden rounded-full opacity-[0.07]">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-red-500"
              style={{
                width: "1px",
                height: eyeSize * 0.4,
                left: `${20 + i * 12}%`,
                top: `${10 + (i % 3) * 15}%`,
                transform: `rotate(${-30 + i * 20}deg)`,
                opacity: 0.3 + Math.random() * 0.4,
              }}
            />
          ))}
        </div>
      )}

      {/* Iris */}
      <motion.div
        className="absolute"
        style={{
          width: irisSize,
          height: irisSize,
          borderRadius: "50%",
          left: eyeWidth / 2 - irisSize / 2,
          top: eyeHeight / 2 - irisSize / 2,
          x: springX,
          y: springY,
          background:
            variant === "cyber"
              ? `conic-gradient(from 0deg, ${irisColor}, ${irisColorSecondary}, ${irisColor})`
              : `radial-gradient(circle at 40% 40%, ${irisColorSecondary}, ${irisColor} 60%, ${irisColor}dd 100%)`,
          boxShadow:
            variant === "realistic"
              ? `inset 0 2px 6px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1)`
              : variant === "cyber"
                ? `0 0 15px ${irisColor}66, inset 0 0 10px ${irisColor}33`
                : `inset 0 1px 4px rgba(0,0,0,0.2)`,
        }}
      >
        {/* Iris detail pattern */}
        {showIrisDetail && (
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{ rotate: irisRotation }}
          >
            {variant === "cyber" ? (
              // Cyber circuit pattern
              <>
                <div
                  className="absolute inset-[15%] rounded-full border border-dashed opacity-40"
                  style={{ borderColor: irisColor }}
                />
                <div
                  className="absolute inset-[30%] rounded-full border opacity-30"
                  style={{ borderColor: irisColorSecondary }}
                />
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-1/2 top-1/2 origin-left opacity-25"
                    style={{
                      width: irisSize * 0.45,
                      height: "1px",
                      background: irisColor,
                      transform: `rotate(${i * 45}deg)`,
                    }}
                  />
                ))}
              </>
            ) : (
              // Realistic iris fibers
              <>
                {[...Array(24)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-1/2 top-1/2 origin-left"
                    style={{
                      width: irisSize * 0.45,
                      height: "1px",
                      background: `linear-gradient(to right, transparent 20%, ${irisColor}44 50%, transparent 80%)`,
                      transform: `rotate(${i * 15}deg)`,
                      opacity: 0.3 + (i % 3) * 0.15,
                    }}
                  />
                ))}
                <div
                  className="absolute inset-[20%] rounded-full"
                  style={{
                    border: `1px solid ${irisColor}33`,
                  }}
                />
              </>
            )}
          </motion.div>
        )}

        {/* Pupil */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: pupilSize,
            height: pupilSize,
            left: irisSize / 2 - pupilSize / 2,
            top: irisSize / 2 - pupilSize / 2,
            background:
              variant === "cyber"
                ? `radial-gradient(circle, ${pupilColor} 40%, transparent 100%)`
                : pupilColor,
            boxShadow:
              variant === "cyber"
                ? `0 0 10px ${irisColor}88`
                : undefined,
          }}
          animate={{
            scale: reactivePupil ? pupilScale : 1,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />

        {/* Primary light reflection */}
        {showReflection && (
          <>
            <div
              className="absolute rounded-full"
              style={{
                width: pupilSize * 0.35,
                height: pupilSize * 0.35,
                left: irisSize * 0.3,
                top: irisSize * 0.25,
                background:
                  variant === "cyber"
                    ? `radial-gradient(circle, rgba(0,255,255,0.9), transparent)`
                    : "radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0.6))",
                filter: "blur(0.5px)",
              }}
            />
            {/* Secondary smaller reflection */}
            <div
              className="absolute rounded-full"
              style={{
                width: pupilSize * 0.15,
                height: pupilSize * 0.15,
                left: irisSize * 0.58,
                top: irisSize * 0.6,
                background:
                  variant === "cyber"
                    ? "rgba(0,255,255,0.5)"
                    : "rgba(255,255,255,0.7)",
              }}
            />
          </>
        )}
      </motion.div>

      {/* Top eyelid shadow */}
      {showEyelids && variant !== "minimal" && (
        <>
          <div
            className="pointer-events-none absolute inset-x-0 top-0"
            style={{
              height: eyeHeight * 0.35,
              background:
                variant === "cyber"
                  ? "linear-gradient(to bottom, rgba(0,10,30,0.6) 0%, transparent 100%)"
                  : "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 100%)",
              borderRadius: "50% 50% 0 0",
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0"
            style={{
              height: eyeHeight * 0.2,
              background:
                variant === "cyber"
                  ? "linear-gradient(to top, rgba(0,10,30,0.4) 0%, transparent 100%)"
                  : "linear-gradient(to top, rgba(0,0,0,0.04) 0%, transparent 100%)",
              borderRadius: "0 0 50% 50%",
            }}
          />
        </>
      )}

      {/* Cyber scan line */}
      {variant === "cyber" && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 h-[2px]"
          style={{
            background: `linear-gradient(to right, transparent, ${irisColor}44, transparent)`,
          }}
          animate={{
            top: [0, eyeHeight, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}
    </motion.div>
  );
}

export function EyeTracking({
  className,
  eyeSize = 120,
  gap = 40,
  irisColor = "#4A6741",
  irisColorSecondary = "#6B8F62",
  pupilColor = "#0a0a0a",
  scleraColor = "#F5F0EB",
  pupilRange = 0.7,
  showReflection = true,
  showIrisDetail = true,
  idleAnimation = true,
  blinkInterval = 4000,
  eyeCount = 2,
  variant = "cyber",
  reactivePupil = true,
  showEyelids = true,
}: EyeTrackingProps) {
  const mouseX = React.useRef(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = React.useRef(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
  const [isMounted, setIsMounted] = React.useState(false);

  // Default colors per variant
  const resolvedIrisColor =
    variant === "cyber" ? (irisColor === "#4A6741" ? "#00e5ff" : irisColor) : irisColor;
  const resolvedIrisSecondary =
    variant === "cyber"
      ? irisColorSecondary === "#6B8F62"
        ? "#0066ff"
        : irisColorSecondary
      : irisColorSecondary;
  const resolvedPupilColor =
    variant === "cyber" ? (pupilColor === "#0a0a0a" ? "#000814" : pupilColor) : pupilColor;
  const resolvedScleraColor =
    variant === "cyber" ? (scleraColor === "#F5F0EB" ? "#060913" : scleraColor) : scleraColor;

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Global mouse tracker
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseX.current = e.touches[0].clientX;
        mouseY.current = e.touches[0].clientY;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // Idle animation - subtle random eye movement when no cursor activity
  React.useEffect(() => {
    if (!idleAnimation) return;

    let idleInterval: ReturnType<typeof setInterval>;
    let lastX = mouseX.current;
    let lastY = mouseY.current;

    const checkIdle = () => {
      if (mouseX.current === lastX && mouseY.current === lastY) {
        // Start idle micro-movements
        idleInterval = setInterval(() => {
          const currentX = mouseX.current;
          const currentY = mouseY.current;
          mouseX.current = currentX + (Math.random() - 0.5) * 30;
          mouseY.current = currentY + (Math.random() - 0.5) * 30;
          setTimeout(() => {
            mouseX.current = currentX;
            mouseY.current = currentY;
          }, 500);
        }, 2000);
      }
      lastX = mouseX.current;
      lastY = mouseY.current;
    };

    const idleTimeout = setInterval(checkIdle, 3000);

    return () => {
      clearInterval(idleTimeout);
      clearInterval(idleInterval);
    };
  }, [idleAnimation]);

  if (!isMounted) {
    return (
      <div
        className={cn("flex items-center justify-center", className)}
        style={{ gap }}
      >
        {[...Array(eyeCount)].map((_, i) => (
          <div
            key={i}
            className="rounded-full bg-neutral-200 dark:bg-neutral-800"
            style={{ width: eyeSize, height: eyeSize * 0.85 }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-center justify-center", className)}
      style={{ gap }}
    >
      {[...Array(eyeCount)].map((_, i) => (
        <Eye
          key={i}
          index={i}
          eyeSize={eyeSize}
          irisColor={resolvedIrisColor}
          irisColorSecondary={resolvedIrisSecondary}
          pupilColor={resolvedPupilColor}
          scleraColor={resolvedScleraColor}
          pupilRange={pupilRange}
          showReflection={showReflection}
          showIrisDetail={showIrisDetail}
          blinkInterval={blinkInterval}
          variant={variant}
          reactivePupil={reactivePupil}
          showEyelids={showEyelids}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      ))}
    </div>
  );
}

interface EyePreloaderProps {
  /** Minimum duration to show loader in milliseconds. Defaults to 5000 (5 seconds) */
  duration?: number;
  onComplete?: () => void;
}

export function EyePreloader({ duration = 5000, onComplete }: EyePreloaderProps) {
  const [mounted, setMounted] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    setMounted(true);
    // Only run on the very first page load in a user session
    const hasLoaded = sessionStorage.getItem("qumi_preloader_shown");
    if (hasLoaded) {
      setIsVisible(false);
      onComplete?.();
      return;
    }

    setIsVisible(true);
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(currentProgress);

      if (elapsed >= duration) {
        clearInterval(interval);
        sessionStorage.setItem("qumi_preloader_shown", "true");
        setTimeout(() => {
          setIsVisible(false);
          onComplete?.();
        }, 300);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  if (!mounted || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="eye-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col justify-between p-8 sm:p-14 bg-[#060B12] text-foreground select-none overflow-hidden"
        >
          {/* Subtle architectural grain & ambient light */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-sky-950/20 via-blue-900/10 to-transparent rounded-full blur-[160px]" />
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />
          </div>

          {/* Top telemetry bar */}
          <div className="relative z-10 flex items-center justify-between font-mono text-[11px] tracking-[0.2em] uppercase text-neutral-400">
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              <span className="font-semibold text-neutral-200">QUMI TECHNOLOGIES</span>
            </div>
            <div className="hidden sm:flex items-center gap-6 text-neutral-500">
              <span>SYSTEM RIGOR 2.0</span>
              <span>KATHMANDU / GLOBAL</span>
            </div>
          </div>

          {/* Centerpiece: Precision Engineered Optical Module */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center justify-center my-auto"
          >
            <div className="relative p-10 sm:p-14 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-2xl shadow-[0_24px_80px_-20px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)]">
              <EyeTracking
                eyeSize={125}
                gap={36}
                variant="minimal"
                irisColor="#2563EB"
                irisColorSecondary="#60A5FA"
                pupilColor="#050B14"
                scleraColor="#E5E9F0"
                reactivePupil={true}
                blinkInterval={3600}
                idleAnimation={true}
                pupilRange={0.65}
              />
            </div>
          </motion.div>

          {/* Bottom Precision Loading Bar */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-neutral-400">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <span className="tracking-[0.25em] uppercase text-neutral-300 font-medium">INITIALIZING ARCHITECTURE</span>
            </div>

            {/* Micro hairline progress gauge */}
            <div className="flex items-center gap-4 w-full sm:w-80">
              <div className="relative flex-1 h-[2px] bg-neutral-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-400 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="w-10 text-right tracking-widest text-neutral-200 font-medium">
                {String(progress).padStart(2, "0")}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
