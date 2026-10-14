import React, { Suspense, useEffect, useState } from "react";

const FloatingMascotInner = React.lazy(
  () => import("./FloatingMascotInner")
);

export function FloatingMascot() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only mount on the client after initial hydration
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <FloatingMascotInner />
    </Suspense>
  );
}
