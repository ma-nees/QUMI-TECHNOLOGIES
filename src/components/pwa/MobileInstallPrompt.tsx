import { useEffect, useState, useCallback } from "react";
import {
  DownloadSimple,
  X,
  Export,
  PlusSquare,
  DotsThreeVertical,
  DeviceMobile,
  Sparkle,
  Desktop,
  Check,
} from "@phosphor-icons/react";

type DeviceType = "ios" | "android" | "desktop";

export function MobileInstallPrompt() {
  const [showBanner, setShowBanner] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>("android");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Helper to check if already in PWA standalone mode
  const checkIsStandalone = useCallback(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://")
    );
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Standalone check
    if (checkIsStandalone()) {
      setIsInstalled(true);
      return;
    }

    // 2. Device detection
    const ua = navigator.userAgent || "";
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isAndroidDevice = /Android/i.test(ua);
    const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);

    if (isIOSDevice) {
      setDeviceType("ios");
    } else if (isAndroidDevice) {
      setDeviceType("android");
    } else {
      setDeviceType("desktop");
    }

    const handleResize = () => {
      const mobileWidth = window.innerWidth < 1024;
      setIsMobile(mobileWidth || isMobileUA);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    // 3. Pick up existing global deferred prompt if already captured early
    if ((window as any).__qumi_deferred_prompt) {
      setDeferredPrompt((window as any).__qumi_deferred_prompt);
    }

    // 4. Capture Chromium beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).__qumi_deferred_prompt = e;
      setDeferredPrompt(e);

      // Auto-show banner on mobile view if not dismissed
      const dismissedUntil = localStorage.getItem("qumi_pwa_dismissed_until");
      const isDismissed = dismissedUntil && Date.now() < Number(dismissedUntil);
      if ((window.innerWidth < 1024 || isMobileUA) && !isDismissed) {
        setShowBanner(true);
      }
    };

    // 5. Timer for auto-showing the recommendation banner on mobile view
    const timer = setTimeout(() => {
      const dismissedUntil = localStorage.getItem("qumi_pwa_dismissed_until");
      const isDismissed = dismissedUntil && Date.now() < Number(dismissedUntil);
      const isCurrentlyMobile = window.innerWidth < 1024 || isMobileUA;

      if (isCurrentlyMobile && !isDismissed && !checkIsStandalone()) {
        setShowBanner(true);
      }
    }, 1200);

    // 6. Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setShowGuide(false);
      setDeferredPrompt(null);
      (window as any).__qumi_deferred_prompt = null;
    };

    // 7. Listen for explicit user clicks (from mobile menu or any page element)
    const handleExternalTrigger = () => {
      const promptEvent =
        (window as any).__qumi_deferred_prompt || deferredPrompt;

      if (promptEvent && typeof promptEvent.prompt === "function") {
        promptEvent
          .prompt()
          .then(() => promptEvent.userChoice)
          .then((choice: any) => {
            if (choice && choice.outcome === "accepted") {
              setIsInstalled(true);
              setShowBanner(false);
              setShowGuide(false);
            }
          })
          .catch(() => {
            setShowGuide(true);
          });
      } else {
        // iOS or browser without deferred prompt support -> Open step-by-step guide
        setShowGuide(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("qumi:open-install-prompt", handleExternalTrigger);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("qumi:open-install-prompt", handleExternalTrigger);
      clearTimeout(timer);
    };
  }, [checkIsStandalone, deferredPrompt]);

  const handleInstallClick = async () => {
    const promptEvent =
      deferredPrompt || (window as any).__qumi_deferred_prompt;

    if (promptEvent && typeof promptEvent.prompt === "function") {
      try {
        await promptEvent.prompt();
        const choiceResult = await promptEvent.userChoice;
        if (choiceResult && choiceResult.outcome === "accepted") {
          setShowBanner(false);
          setIsInstalled(true);
          setDeferredPrompt(null);
          (window as any).__qumi_deferred_prompt = null;
        }
      } catch (err) {
        console.error("Install prompt error:", err);
        setShowGuide(true);
      }
    } else {
      // Show step-by-step installation guide for iOS, Safari, or browsers without deferred prompt
      setShowGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Suppress auto-popup for 3 days (explicit clicks in menu will still work)
    localStorage.setItem(
      "qumi_pwa_dismissed_until",
      String(Date.now() + 3 * 24 * 60 * 60 * 1000)
    );
  };

  // Don't render anything if installed and guide is closed
  if (isInstalled && !showGuide) {
    return null;
  }

  // Don't render anything if neither banner nor guide is active
  if (!showBanner && !showGuide) {
    return null;
  }

  return (
    <>
      {/* Mobile Install Smart Recommendation Banner */}
      {showBanner && !isInstalled && (
        <aside
          aria-label="App installation recommendation"
          className="relative z-30 border-b border-primary/20 bg-surface/95 text-foreground backdrop-blur-xl shadow-xs transition-all duration-300 lg:hidden"
        >
          <div className="container-site flex items-center justify-between gap-3 py-2 px-3 sm:px-4">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <img
                src="/favicon.png"
                alt="QUMI App icon"
                className="h-9 w-9 rounded-xl object-contain p-1 bg-primary/10 border border-primary/30 shadow-2xs shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold leading-tight text-foreground truncate">
                    Install QUMI App
                  </p>
                  <span className="rounded-full bg-primary/15 text-primary text-[9px] font-mono font-semibold px-1.5 py-0.5 shrink-0 flex items-center gap-0.5">
                    <Sparkle size={9} weight="fill" /> Recommended
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
                  Fast offline access & instant loading
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition active:scale-95 cursor-pointer"
              >
                <DownloadSimple size={13} weight="bold" />
                <span>Install</span>
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss install recommendation"
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-alt hover:text-foreground transition active:scale-90 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Step-by-step Installation Guide Modal */}
      {showGuide && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-sm animate-fade-in-up"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-2xl text-foreground animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {deviceType === "desktop" ? (
                    <Desktop size={22} weight="bold" />
                  ) : (
                    <DeviceMobile size={22} weight="bold" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-snug">
                    Install QUMI on your device
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Follow these simple steps
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-surface-alt hover:text-foreground transition cursor-pointer"
                aria-label="Close guide"
              >
                <X size={16} />
              </button>
            </div>

            {deviceType === "ios" ? (
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/70 p-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary shrink-0 mt-0.5">
                    <Export size={15} weight="bold" />
                  </div>
                  <p>
                    <strong className="text-foreground">Step 1:</strong> Tap the{" "}
                    <strong className="text-primary">Share</strong> button in
                    the Safari toolbar at the bottom of your screen.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/70 p-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary shrink-0 mt-0.5">
                    <PlusSquare size={15} weight="bold" />
                  </div>
                  <p>
                    <strong className="text-foreground">Step 2:</strong> Scroll
                    down and tap{" "}
                    <strong className="text-primary">Add to Home Screen</strong>
                    .
                  </p>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/70 p-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary shrink-0 mt-0.5">
                    <Check size={15} weight="bold" />
                  </div>
                  <p>
                    <strong className="text-foreground">Step 3:</strong> Tap{" "}
                    <strong className="text-primary">Add</strong> in the
                    top-right corner to complete installation.
                  </p>
                </div>
              </div>
            ) : deviceType === "android" ? (
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/70 p-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary shrink-0 mt-0.5">
                    <DotsThreeVertical size={15} weight="bold" />
                  </div>
                  <p>
                    <strong className="text-foreground">Step 1:</strong> Tap
                    your browser menu button (three dots{" "}
                    <strong className="text-primary">⋮</strong>).
                  </p>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/70 p-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary shrink-0 mt-0.5">
                    <PlusSquare size={15} weight="bold" />
                  </div>
                  <p>
                    <strong className="text-foreground">Step 2:</strong> Select{" "}
                    <strong className="text-primary">Install App</strong> or{" "}
                    <strong className="text-primary">
                      Add to Home Screen
                    </strong>
                    .
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/70 p-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary shrink-0 mt-0.5">
                    <DownloadSimple size={15} weight="bold" />
                  </div>
                  <p>
                    <strong className="text-foreground">Chrome / Edge:</strong>{" "}
                    Click the <strong className="text-primary">Install</strong>{" "}
                    icon in your browser's address bar (or menu{" "}
                    <strong className="text-primary">⋮</strong> → Save & share →
                    Install QUMI).
                  </p>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/70 p-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary shrink-0 mt-0.5">
                    <PlusSquare size={15} weight="bold" />
                  </div>
                  <p>
                    <strong className="text-foreground">Safari (macOS):</strong>{" "}
                    Click <strong className="text-primary">File</strong> in the
                    menu bar and select{" "}
                    <strong className="text-primary">Add to Dock...</strong>
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-4 w-full rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition text-center cursor-pointer shadow-xs active:scale-98"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
