"use client";

import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-media-query";

/**
 * A short, silent loop. It plays while it is on screen and pauses when it leaves;
 * with reduced motion it stays still until the visitor presses play.
 */
export function Clip({ src, poster, label }: { src: string; poster?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [reduced]);

  return <video ref={ref} src={src} poster={poster} aria-label={label} muted loop playsInline controls preload="metadata" className="absolute inset-0 size-full object-contain" />;
}
