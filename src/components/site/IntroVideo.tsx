import React, { useEffect, useRef, useState } from "react";

interface IntroVideoProps {
  onComplete: () => void;
}

export function IntroVideo({ onComplete }: IntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      onComplete();
    };

    const handleError = () => {
      console.warn("Intro video failed to play or load. Skipping intro.");
      onComplete();
    };

    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);

    // Fallback in case the video is stalled or autoplay is blocked
    const stallTimeout = setTimeout(() => {
      if (!hasStarted) {
        handleError();
      }
    }, 3000);

    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
      clearTimeout(stallTimeout);
    };
  }, [onComplete, hasStarted]);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black cursor-pointer" onClick={onComplete}>
      <video
        ref={videoRef}
        src="/video.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
        onPlay={() => setHasStarted(true)}
        onError={() => onComplete()}
      />
    </div>
  );
}
