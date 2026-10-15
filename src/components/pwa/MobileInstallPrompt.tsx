import React, { useEffect, useState } from "react";
import { DownloadSimple, X, Export, PlusSquare, DotsThreeVertical, DeviceMobile, Sparkle } from "@phosphor-icons/react";

export function MobileInstallPrompt() {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already in standalone PWA mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if on mobile viewport or mobile device
    const isMobileWidth = window.innerWidth < 1024;
    const isMobileUA = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isMobileWidth && !isMobileUA) {
      return;
    }

    // Check if user dismissed previously
    const dismissedUntil = localStorage.getItem("qumi_pwa_dismissed_until");
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
      return;
    }

    // Detect iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Listen for Chromium PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).__qumi_deferred_prompt = e;
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // On mobile view, show recommendation banner after 800ms
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 800);

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    const handleExternalTrigger = () => {
      setShowBanner(true);
      // If deferredPrompt is available, prompt immediately, else show guide
      if ((window as any).__qumi_deferred_prompt) {
        (window as any).__qumi_deferred_prompt.prompt();
      } else {
        setShowGuide(true);
      }
    };

    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("qumi:open-install-prompt", handleExternalTrigger);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("qumi:open-install-prompt", handleExternalTrigger);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === "accepted") {
          setShowBanner(false);
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.error("Install prompt error:", err);
      }
    } else {
      // If iOS or browser doesn't support deferred prompt, show guide
      setShowGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Dismiss for 3 days
    localStorage.setItem(
      "qumi_pwa_dismissed_until",
      String(Date.now() + 3 * 24 * 60 * 60 * 1000)
    );
  };

  if (isInstalled || !showBanner) {
    return null;
  }

  return (
    <>
      {/* Mobile Install Smart Recommendation Banner */}
      <aside
        aria-label="App installation recommendation"
        className="sticky top-[52px] sm:top-[60px] z-40 border-b border-primary/20 bg-surface/95 text-foreground backdrop-blur-xl shadow-md transition-all duration-300 lg:hidden"
      >
        <div className="container-site flex items-center justify-between gap-3 py-2 px-3 sm:px-4">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <img
              src="/logo.png"
              alt="QUMI App icon"
              className="h-9 w-9 rounded-xl object-cover border border-primary/30 shadow-xs shrink-0"
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
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition active:scale-95 cursor-pointer"
            >
              <DownloadSimple size={13} weight="bold" />
              <span>Install</span>
            </button>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss install recommendation"
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-alt hover:text-foreground transition active:scale-90 cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Step-by-step Installation Guide Modal (for iOS & unsupported browsers) */}
      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm animate-fade-in-up"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-2xl text-foreground animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <DeviceMobile size={22} weight="bold" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-snug">Install QUMI on your device</h3>
                  <p className="text-xs text-muted-foreground">Follow these simple steps</p>
                </div>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-surface-alt hover:text-foreground transition cursor-pointer"
                aria-label="Close guide"
              >
                <X size={16} />
              </button>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/70 p-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary shrink-0 mt-0.5">
                    <Export size={15} weight="bold" />
                  </div>
                  <p>
                    <strong className="text-foreground">Step 1:</strong> Tap the <strong className="text-primary">Share</strong> button in Safari toolbar at the bottom of the screen.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/70 p-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary shrink-0 mt-0.5">
                    <PlusSquare size={15} weight="bold" />
                  </div>
                  <p>
                    <strong className="text-foreground">Step 2:</strong> Scroll down the share sheet and tap <strong className="text-primary">Add to Home Screen</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/70 p-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary shrink-0 mt-0.5">
                    <Sparkle size={15} weight="fill" />
                  </div>
                  <p>
                    <strong className="text-foreground">Step 3:</strong> Tap <strong className="text-primary">Add</strong> in the top-right corner to finish installing.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/70 p-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary shrink-0 mt-0.5">
                    <DotsThreeVertical size={15} weight="bold" />
                  </div>
                  <p>
                    <strong className="text-foreground">Step 1:</strong> Tap your browser's menu button (three dots <strong className="text-primary">⋮</strong>).
                  </p>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/70 p-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary shrink-0 mt-0.5">
                    <PlusSquare size={15} weight="bold" />
                  </div>
                  <p>
                    <strong className="text-foreground">Step 2:</strong> Select <strong className="text-primary">Install App</strong> or <strong className="text-primary">Add to Home Screen</strong>.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="mt-4 w-full rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition text-center cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
