import { useRef, useState, useEffect, type ReactNode } from "react";

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className = "",
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("translate3d(0px, 0px, 0px)");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = Math.abs(e.clientX - rect.left - rect.width / 2);
      const distY = Math.abs(e.clientY - rect.top - rect.height / 2);

      if (distX < rect.width / 2 + padding && distY < rect.height / 2 + padding) {
        setIsActive(true);
        const moveX = (e.clientX - centerX) / strength;
        const moveY = (e.clientY - centerY) / strength;
        setTransform(`translate3d(${moveX}px, ${moveY}px, 0px)`);
      }
    };

    const handleMouseLeave = () => {
      setIsActive(false);
      setTransform("translate3d(0px, 0px, 0px)");
    };

    window.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [padding, strength]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform,
        willChange: "transform",
        transition: isActive ? activeTransition : inactiveTransition,
      }}
    >
      {children}
    </div>
  );
}
