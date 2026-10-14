"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

export interface TypographyLine {
  text: string;
  isAccent?: boolean;
  color?: string;
}

export interface CursorDrivenParticleTypographyProps {
  /** Additional CSS classes */
  className?: string;
  /** Single text string (can contain \n for manual line breaks) */
  text?: string;
  /** Structured lines with optional accent styling */
  lines?: (string | TypographyLine)[];
  /** Base font size in pixels (scales down responsively) */
  fontSize?: number;
  /** Font family (defaults to Space Grotesk) */
  fontFamily?: string;
  /** Size of each particle in pixels */
  particleSize?: number;
  /** Density step in pixels (lower = more particles, default 4) */
  particleDensity?: number;
  /** How strongly the cursor pushes particles away */
  dispersionStrength?: number;
  /** Speed at which particles return to origin */
  returnSpeed?: number;
  /** Custom base color for regular particles */
  color?: string;
  /** Custom accent color for accent particles */
  accentColor?: string;
}

class Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  dispersion: number;
  returnSpd: number;

  constructor(
    x: number,
    y: number,
    size: number,
    color: string,
    dispersion: number,
    returnSpd: number
  ) {
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.vx = 0;
    this.vy = 0;
    this.size = size;
    this.color = color;
    this.dispersion = dispersion;
    this.returnSpd = returnSpd;
  }

  update(mouseX: number, mouseY: number, interactionRadius: number): boolean {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Physics interaction with cursor
    if (distance < interactionRadius && mouseX !== -1000 && mouseY !== -1000 && distance > 0.001) {
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      const force = (interactionRadius - distance) / interactionRadius;

      // Smooth quadratic repulsion
      const repulsion = force * force * this.dispersion;
      this.vx -= forceDirectionX * repulsion;
      this.vy -= forceDirectionY * repulsion;
    }

    // Spring physics returning to origin
    this.vx += (this.originX - this.x) * this.returnSpd;
    this.vy += (this.originY - this.y) * this.returnSpd;

    // Friction damping
    this.vx *= 0.86;
    this.vy *= 0.86;

    this.x += this.vx;
    this.y += this.vy;

    // Determine if particle is still active
    const speedSq = this.vx * this.vx + this.vy * this.vy;
    const distSq =
      (this.x - this.originX) * (this.x - this.originX) +
      (this.y - this.originY) * (this.y - this.originY);

    return speedSq > 0.004 || distSq > 0.05;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function normalizeLines(
  text?: string,
  lines?: (string | TypographyLine)[]
): TypographyLine[] {
  if (lines && lines.length > 0) {
    return lines.map((l) => (typeof l === "string" ? { text: l } : l));
  }
  if (text) {
    return text.split("\n").map((t) => ({ text: t }));
  }
  return [{ text: "QUMI Technologies" }];
}

function layoutLines(
  rawLines: TypographyLine[],
  ctx: CanvasRenderingContext2D,
  maxWidth: number
): TypographyLine[] {
  const result: TypographyLine[] = [];

  for (const item of rawLines) {
    const words = item.text.split(" ");
    if (words.length <= 1) {
      result.push(item);
      continue;
    }

    let currentLine = "";
    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i]!;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        result.push({ ...item, text: currentLine });
        currentLine = words[i]!;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      result.push({ ...item, text: currentLine });
    }
  }

  return result;
}

export function CursorDrivenParticleTypography({
  className,
  text,
  lines,
  fontSize = 64,
  fontFamily = '"Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  particleSize = 1.7,
  particleDensity = 4,
  dispersionStrength = 14,
  returnSpeed = 0.08,
  color,
  accentColor,
}: CursorDrivenParticleTypographyProps) {
  const { resolvedTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  const initialLines = normalizeLines(text, lines);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let isRunning = false;

    let mouseX = -1000;
    let mouseY = -1000;

    let containerWidth = 0;
    let containerHeight = 0;

    const wakeAnimation = () => {
      if (!isRunning) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    const init = () => {
      containerWidth = container.clientWidth;
      containerHeight = container.clientHeight;

      if (containerWidth <= 0 || containerHeight <= 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = containerWidth * dpr;
      canvas.height = containerHeight * dpr;
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Explicitly check class on documentElement for light vs dark mode
      const hasDarkClass = document.documentElement.classList.contains("dark");
      const isDark = resolvedTheme ? resolvedTheme === "dark" : hasDarkClass;

      // High contrast colors: In light mode, deep saturated ink black/charcoal
      const defaultFg = isDark ? "#f8fafc" : "#090d16";
      const textColor = color || defaultFg;

      // Determine responsive font size
      const maxWidth = Math.max(240, containerWidth - 20);
      let calculatedFontSize = fontSize;

      if (containerWidth < 380) {
        calculatedFontSize = Math.min(fontSize, 30);
      } else if (containerWidth < 480) {
        calculatedFontSize = Math.min(fontSize, 34);
      } else if (containerWidth < 768) {
        calculatedFontSize = Math.min(fontSize, 46);
      } else if (containerWidth < 1024) {
        calculatedFontSize = Math.min(fontSize, 56);
      } else {
        calculatedFontSize = Math.min(fontSize, 66);
      }

      ctx.font = `800 ${calculatedFontSize}px ${fontFamily}`;

      // Dynamically scale down font size so lines fit within available width smoothly on all screens
      if (initialLines[0]) {
        const minFont = containerWidth < 480 ? 24 : 34;
        while (
          ctx.measureText(initialLines[0].text).width > maxWidth &&
          calculatedFontSize > minFont
        ) {
          calculatedFontSize -= 1;
          ctx.font = `800 ${calculatedFontSize}px ${fontFamily}`;
        }
      }

      const activeLines = layoutLines(initialLines, ctx, maxWidth);
      const lineHeight = calculatedFontSize * (containerWidth < 480 ? 1.25 : 1.16);
      const totalTextHeight = (activeLines.length - 1) * lineHeight;
      // Ensure startY has a safe margin so letters with accents or ascenders are never cut off
      const minTopMargin = calculatedFontSize * 0.58;
      const startY = Math.max(minTopMargin, (containerHeight - totalTextHeight) / 2);

      ctx.clearRect(0, 0, containerWidth, containerHeight);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      activeLines.forEach((line, index) => {
        const lineY = startY + index * lineHeight;

        if (line.isAccent) {
          const metrics = ctx.measureText(line.text);
          const textWidth = metrics.width;
          const startX = containerWidth / 2 - textWidth / 2;
          const endX = containerWidth / 2 + textWidth / 2;

          const gradient = ctx.createLinearGradient(startX, 0, endX, 0);
          if (accentColor) {
            gradient.addColorStop(0, accentColor);
            gradient.addColorStop(1, accentColor);
          } else if (isDark) {
            gradient.addColorStop(0, "#60a5fa"); // sky-400
            gradient.addColorStop(0.5, "#38bdf8"); // cyan-400
            gradient.addColorStop(1, "#818cf8"); // indigo-400
          } else {
            gradient.addColorStop(0, "#0047ab"); // royal cobalt
            gradient.addColorStop(0.5, "#1d4ed8"); // blue-700
            gradient.addColorStop(1, "#0284c7"); // deep sky-600
          }
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = line.color || textColor;
        }

        ctx.fillText(line.text, containerWidth / 2, lineY);
      });

      // Adaptive particle density: smaller fonts need tighter step (2-3px) so thin letter stems don't get skipped
      const effectiveDensity = Math.max(
        2,
        Math.min(particleDensity, Math.floor(calculatedFontSize / 16))
      );
      const effectiveParticleSize = Math.max(
        1.2,
        Math.min(particleSize, calculatedFontSize * 0.038)
      );

      // Sample pixel data from drawn typography
      const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, containerWidth, containerHeight);

      particles = [];
      const step = Math.max(1, Math.round(effectiveDensity * dpr));

      for (let y = 0; y < textCoordinates.height; y += step) {
        for (let x = 0; x < textCoordinates.width; x += step) {
          const index = (y * textCoordinates.width + x) * 4;
          const alpha = textCoordinates.data[index + 3] || 0;

          if (alpha > 45) {
            const r = textCoordinates.data[index];
            const g = textCoordinates.data[index + 1];
            const b = textCoordinates.data[index + 2];
            const a = alpha / 255;
            const effectiveAlpha = isDark ? (a > 0.8 ? 1 : a) : Math.min(1, a * 1.3);
            const particleColor = `rgba(${r},${g},${b},${effectiveAlpha.toFixed(2)})`;

            particles.push(
              new Particle(
                x / dpr,
                y / dpr,
                effectiveParticleSize,
                particleColor,
                dispersionStrength,
                returnSpeed
              )
            );
          }
        }
      }

      // Draw initial static state immediately
      particles.forEach((p) => p.draw(ctx));
      wakeAnimation();
    };

    const animate = () => {
      ctx.clearRect(0, 0, containerWidth, containerHeight);

      let hasActiveParticles = false;
      const isMouseActive = mouseX !== -1000 && mouseY !== -1000;
      const interactionRadius = Math.min(110, Math.max(80, containerWidth * 0.12));

      for (let i = 0; i < particles.length; i++) {
        const isMoving = particles[i]!.update(
          mouseX,
          mouseY,
          interactionRadius
        );
        particles[i]!.draw(ctx);
        if (isMoving) {
          hasActiveParticles = true;
        }
      }

      if (hasActiveParticles || isMouseActive) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        isRunning = false;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      wakeAnimation();
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      wakeAnimation();
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = e.touches[0].clientX - rect.left;
      mouseY = e.touches[0].clientY - rect.top;
      wakeAnimation();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = e.touches[0].clientX - rect.left;
      mouseY = e.touches[0].clientY - rect.top;
      wakeAnimation();
    };

    // Ensure fonts are fully loaded before rendering
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(init);
    } else {
      setTimeout(init, 50);
    }

    const resizeObserver = new ResizeObserver(() => {
      init();
    });
    resizeObserver.observe(container);

    const themeObserver = new MutationObserver(() => {
      init();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleMouseLeave);

    return () => {
      resizeObserver.disconnect();
      themeObserver.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    resolvedTheme,
    isMounted,
    text,
    lines,
    fontSize,
    fontFamily,
    particleSize,
    particleDensity,
    dispersionStrength,
    returnSpeed,
    color,
    accentColor,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex w-full items-center justify-center select-none touch-pan-y cursor-default",
        className
      )}
      aria-hidden="true"
    >
      {!isMounted ? (
        <div className="flex flex-col items-center justify-center font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] text-center">
          {initialLines.map((line, idx) => (
            <span
              key={idx}
              className={
                line.isAccent
                  ? "bg-gradient-to-r from-primary via-[#60a5fa] to-primary bg-clip-text text-transparent"
                  : "text-foreground"
              }
            >
              {line.text}
            </span>
          ))}
        </div>
      ) : (
        <canvas ref={canvasRef} className="block w-full h-full" />
      )}
    </div>
  );
}
