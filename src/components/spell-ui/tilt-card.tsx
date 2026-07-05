"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  tiltLimit?: number;
  scale?: number;
  perspective?: number;
  effect?: "gravitate" | "evade";
  spotlight?: boolean;
  className?: string;
}

export function TiltCard({ children, tiltLimit = 15, scale = 1.05, perspective = 1200, spotlight = true, className }: TiltCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [transform, setTransform] = React.useState("perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [spotlightPos, setSpotlightPos] = React.useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * tiltLimit * 2;
    const rotateY = (x - 0.5) * tiltLimit * 2;
    setTransform(`perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`);
    setSpotlightPos({ x: x * 100, y: y * 100 });
  }, [tiltLimit, scale, perspective]);

  const handleMouseLeave = React.useCallback(() => {
    setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    setIsHovered(false);
  }, [perspective]);

  return (
    <div ref={cardRef} className={cn("relative transition-transform duration-200 ease-out", className)}
      style={{ transform, transformStyle: "preserve-3d", willChange: "transform" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {spotlight && isHovered && (
        <div className="absolute inset-0 z-10 pointer-events-none rounded-[inherit] overflow-hidden"
          style={{ background: `radial-gradient(circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(255,255,255,0.1), transparent 50%)` }}
        />
      )}
      {children}
    </div>
  );
}
