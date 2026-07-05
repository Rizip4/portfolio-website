"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  duration?: number;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  fade?: boolean;
  fadeAmount?: number;
  className?: string;
}

export function Marquee({ children, duration = 20, pauseOnHover = false, direction = "left", fade = true, fadeAmount = 10, className }: MarqueeProps) {
  const animDir = direction === "left" ? "normal" : "reverse";
  return (
    <div className={cn("relative overflow-hidden flex", className)}>
      {fade && (
        <>
          <div className="absolute inset-y-0 left-0 z-10" style={{ width: fadeAmount, background: "linear-gradient(to right, #0C0C0C, transparent)" }} />
          <div className="absolute inset-y-0 right-0 z-10" style={{ width: fadeAmount, background: "linear-gradient(to left, #0C0C0C, transparent)" }} />
        </>
      )}
      <div className="flex shrink-0" style={{ animation: `marquee ${duration}s linear infinite`, animationDirection: animDir, ...(pauseOnHover ? {} : {}) }}
        onMouseEnter={pauseOnHover ? (e) => (e.currentTarget.style.animationPlayState = "paused") : undefined}
        onMouseLeave={pauseOnHover ? (e) => (e.currentTarget.style.animationPlayState = "running") : undefined}
      >
        <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
