import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  DownloadSimple,
  X,
  Export,
  PlusSquare,
  DotsThreeVertical,
  DeviceMobile,
  Desktop,
  Check,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type DeviceType = "ios" | "android" | "desktop";

export interface InstallGuideModalProps {
  open: boolean;
  onClose: () => void;
  deferredPrompt?: any;
}

export function InstallGuideModal({
  open,
  onClose,
  deferredPrompt: propPrompt,
}: InstallGuideModalProps) {
  const [deviceType, setDeviceType] = useState<DeviceType>("android");
  const [openedAt, setOpenedAt] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setOpenedAt(Date.now());
      // Detect platform
      if (typeof window !== "undefined") {
        const ua = navigator.userAgent || "";
        const isIOSDevice =
          /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
        const isAndroidDevice = /Android/i.test(ua);
        if (isIOSDevice) {
          setDeviceType("ios");
        } else if (isAndroidDevice) {
          setDeviceType("android");
        } else {
          setDeviceType(window.innerWidth < 768 ? "android" : "desktop");
        }
      }

      // Lock body scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  // Handle ESC key
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !mounted || typeof document === "undefined") return null;

  const promptEvent =
    propPrompt ||
    (typeof window !== "undefined"
      ? (window as any).__qumi_deferred_prompt
      : null);

  const handleDirectInstall = async () => {
    if (promptEvent && typeof promptEvent.prompt === "function") {
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (typeof window !== "undefined") {
          (window as any).__qumi_deferred_prompt = null;
        }
        if (choice?.outcome === "accepted") {
          onClose();
        }
      } catch (err) {
        console.error("Direct install error:", err);
      }
    }
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-modal-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        // Prevent accidental closing from ghost clicks right after drawer unmounts
        if (e.target === e.currentTarget && Date.now() - openedAt > 350) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-surface p-5 shadow-2xl text-foreground animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {deviceType === "desktop" ? (
                <Desktop size={22} weight="bold" />
              ) : (
                <DeviceMobile size={22} weight="bold" />
              )}
            </div>
            <div>
              <h3 id="install-modal-title" className="text-sm font-bold leading-snug">
                Install QUMI on your device
              </h3>
              <p className="text-xs text-muted-foreground">
                Native app experience in seconds
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-alt hover:text-foreground transition cursor-pointer"
            aria-label="Close guide"
          >
            <X size={16} />
          </button>
        </div>

        {/* Platform Selection Tabs */}
        <div className="flex rounded-xl bg-surface-alt p-1 mb-4 border border-border/50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setDeviceType("android")}
            className={cn(
              "flex-1 py-1.5 rounded-lg text-center transition cursor-pointer",
              deviceType === "android"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Android
          </button>
          <button
            type="button"
            onClick={() => setDeviceType("ios")}
            className={cn(
              "flex-1 py-1.5 rounded-lg text-center transition cursor-pointer",
              deviceType === "ios"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            iPhone / iPad
          </button>
          <button
            type="button"
            onClick={() => setDeviceType("desktop")}
            className={cn(
              "flex-1 py-1.5 rounded-lg text-center transition cursor-pointer",
              deviceType === "desktop"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            PC / Mac
          </button>
        </div>

        {/* Instructions by Platform */}
        {deviceType === "ios" ? (
          <div className="space-y-2.5 text-xs leading-relaxed">
            <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/70 p-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary shrink-0 mt-0.5">
                <Export size={15} weight="bold" />
              </div>
              <p>
                <strong className="text-foreground">Step 1:</strong> Tap the{" "}
                <strong className="text-primary">Share</strong> button in
                Safari at the bottom of your screen.
              </p>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/70 p-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary shrink-0 mt-0.5">
                <PlusSquare size={15} weight="bold" />
              </div>
              <p>
                <strong className="text-foreground">Step 2:</strong> Scroll down and
                tap <strong className="text-primary">Add to Home Screen</strong>.
              </p>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/70 p-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary shrink-0 mt-0.5">
                <Check size={15} weight="bold" />
              </div>
              <p>
                <strong className="text-foreground">Step 3:</strong> Tap{" "}
                <strong className="text-primary">Add</strong> in the top-right
                corner to finish.
              </p>
            </div>
          </div>
        ) : deviceType === "android" ? (
          <div className="space-y-2.5 text-xs leading-relaxed">
            <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/70 p-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary shrink-0 mt-0.5">
                <DotsThreeVertical size={15} weight="bold" />
              </div>
              <p>
                <strong className="text-foreground">Step 1:</strong> Tap your
                browser menu (three dots <strong className="text-primary">⋮</strong>{" "}
                in Chrome/Edge).
              </p>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/70 p-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary shrink-0 mt-0.5">
                <PlusSquare size={15} weight="bold" />
              </div>
              <p>
                <strong className="text-foreground">Step 2:</strong> Select{" "}
                <strong className="text-primary">Install App</strong> or{" "}
                <strong className="text-primary">Add to Home screen</strong>.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5 text-xs leading-relaxed">
            <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/70 p-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary shrink-0 mt-0.5">
                <DownloadSimple size={15} weight="bold" />
              </div>
              <p>
                <strong className="text-foreground">Chrome / Edge:</strong> Click
                the <strong className="text-primary">Install</strong> icon in
                your address bar (or menu <strong className="text-primary">⋮</strong>{" "}
                → Save & share → Install QUMI).
              </p>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/70 p-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary shrink-0 mt-0.5">
                <PlusSquare size={15} weight="bold" />
              </div>
              <p>
                <strong className="text-foreground">Safari (macOS):</strong> Click{" "}
                <strong className="text-primary">File</strong> in the menu bar and
                select <strong className="text-primary">Add to Dock...</strong>
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col gap-2">
          {promptEvent && (
            <button
              type="button"
              onClick={handleDirectInstall}
              className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition text-center cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-98"
            >
              <DownloadSimple size={15} weight="bold" />
              <span>Install App Directly</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-border bg-surface-alt py-2.5 text-xs font-semibold text-foreground hover:bg-surface-alt/80 transition text-center cursor-pointer active:scale-98"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
