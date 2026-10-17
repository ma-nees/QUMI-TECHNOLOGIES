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
import { cn } from "@/lib/utils";
import { InstallGuideModal } from "./InstallGuideModal";

type DeviceType = "ios" | "android" | "desktop";

export function MobileInstallPrompt() {
  const [showBanner, setShowBanner] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>("android");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [openedAt, setOpenedAt] = useState<number>(0);

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
    if (showGuide) {
      setOpenedAt(Date.now());
    }
  }, [showGuide]);

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
      // Default to Android on small screen widths (common for mobile testers)
      setDeviceType(window.innerWidth < 768 ? "android" : "desktop");
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
    }, 1500);

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
            (window as any).__qumi_deferred_prompt = null;
            setDeferredPrompt(null);
            if (choice && choice.outcome === "accepted") {
              setIsInstalled(true);
              setShowBanner(false);
              setShowGuide(false);
            } else {
              setShowGuide(true);
            }
          })
          .catch(() => {
            (window as any).__qumi_deferred_prompt = null;
            setDeferredPrompt(null);
            setShowGuide(true);
          });
      } else {
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
  }, [checkIsStandalone]);

  const handleInstallClick = async () => {
    const promptEvent =
      deferredPrompt || (window as any).__qumi_deferred_prompt;

    if (promptEvent && typeof promptEvent.prompt === "function") {
      try {
        await promptEvent.prompt();
        const choiceResult = await promptEvent.userChoice;
        (window as any).__qumi_deferred_prompt = null;
        setDeferredPrompt(null);
        if (choiceResult && choiceResult.outcome === "accepted") {
          setShowBanner(false);
          setShowGuide(false);
          setIsInstalled(true);
        }
      } catch (err) {
        console.error("Install prompt error:", err);
        (window as any).__qumi_deferred_prompt = null;
        setDeferredPrompt(null);
        setShowGuide(true);
      }
    } else {
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
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/25 text-primary">
                <Sparkle size={16} weight="fill" className="animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold leading-tight text-foreground">
                  Install QUMI App
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  Faster access, offline cache & native feel
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs transition-transform hover:bg-primary/90 active:scale-95 cursor-pointer"
              >
                <DownloadSimple size={13} weight="bold" />
                <span>Install</span>
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-alt hover:text-foreground transition cursor-pointer"
                aria-label="Dismiss install recommendation"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Step-by-step Installation Guide Modal */}
      <InstallGuideModal
        open={showGuide}
        onClose={() => setShowGuide(false)}
        deferredPrompt={deferredPrompt}
      />
    </>
  );
}
