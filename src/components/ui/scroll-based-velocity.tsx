"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  wrap,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface ScrollBasedVelocityProps {
  text: string;
  default_velocity?: number;
  className?: string;
  numCopies?: number;
  numRows?: 1 | 2;
  containerRef?: React.RefObject<HTMLElement | null>;
}

interface ParallaxProps {
  children: string;
  baseVelocity: number;
  className?: string;
  numCopies?: number;
  containerRef?: React.RefObject<HTMLElement | null>;
}

function ParallaxText({
  children,
  baseVelocity = 100,
  className,
  numCopies = 10,
  containerRef,
}: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll(
    containerRef ? { container: containerRef } : undefined
  );
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const wrapRange = -(100 / numCopies);
  const x = useTransform(baseX, (v) => `${wrap(wrapRange, 0, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      className="overflow-hidden whitespace-nowrap flex flex-nowrap"
      style={{ width: "100%" }}
    >
      <motion.div
        className={cn("flex whitespace-nowrap will-change-transform", className)}
        style={{ x }}
      >
        {Array.from({ length: numCopies }).map((_, i) => (
          <span key={i} className="inline-flex items-center mr-8 sm:mr-12">
            <span className="text-foreground">{children}</span>
            <span className="ml-8 sm:ml-12 text-primary font-bold opacity-90 select-none">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function ScrollBasedVelocity({
  text,
  default_velocity = 5,
  className,
  numCopies = 10,
  numRows = 1,
  containerRef,
}: ScrollBasedVelocityProps) {
  return (
    <section className="relative w-full overflow-hidden select-none">
      <ParallaxText
        baseVelocity={default_velocity}
        className={className}
        numCopies={numCopies}
        containerRef={containerRef}
      >
        {text}
      </ParallaxText>
      {numRows === 2 && (
        <ParallaxText
          baseVelocity={-default_velocity}
          className={className}
          numCopies={numCopies}
          containerRef={containerRef}
        >
          {text}
        </ParallaxText>
      )}
    </section>
  );
}
