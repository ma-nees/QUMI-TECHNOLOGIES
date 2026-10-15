import React, { Suspense, useEffect, useState } from "react";

const FloatingMascotInner = React.lazy(
  () => import("./FloatingMascotInner")
);

export function FloatingMascot() {
  const [mounted, setMounted] = useState(false);
  const [isPreloaderActive, setIsPreloaderActive] = useState(() => {
    if (typeof document === "undefined") return true;
    return (
      document.documentElement.getAttribute("data-preloader-active") === "true" ||
      Boolean(document.getElementById("eye-preloader-overlay")) ||
      Boolean(document.querySelector('[data-preloader="active"]'))
    );
  });

  useEffect(() => {
    setMounted(true);

    const checkPreloader = () => {
      if (typeof document === "undefined") return;
      const active =
        document.documentElement.getAttribute("data-preloader-active") === "true" ||
        Boolean(document.getElementById("eye-preloader-overlay")) ||
        Boolean(document.querySelector('[data-preloader="active"]'));
      setIsPreloaderActive(active);
    };

    checkPreloader();

    const handlePreloaderChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ active?: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.active === "boolean") {
        setIsPreloaderActive(customEvent.detail.active);
      } else {
        checkPreloader();
      }
    };

    window.addEventListener("qumi:preloader-change", handlePreloaderChange);

    // Actively poll during initial page load to immediately react
    const interval = setInterval(checkPreloader, 100);
    const stopChecking = setTimeout(() => {
      clearInterval(interval);
      checkPreloader();
    }, 6500);

    return () => {
      window.removeEventListener("qumi:preloader-change", handlePreloaderChange);
      clearInterval(interval);
      clearTimeout(stopChecking);
    };
  }, []);

  // Do not render or display the chatbot while the preloader animation is active
  if (!mounted || isPreloaderActive) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <FloatingMascotInner />
    </Suspense>
  );
}
