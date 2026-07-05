import { useRef, type RefObject } from "react";
import { useScroll, useTransform, motion, type MotionValue } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export default function AnimatedText({ text, className = "" }: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null) as RefObject<HTMLParagraphElement>;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });

  return (
    <p ref={containerRef} className={className}>
      {text.split("").map((char, i) => (
        <Char key={i} index={i} total={text.length} progress={scrollYProgress} char={char} />
      ))}
    </p>
  );
}

function Char({
  char,
  index,
  total,
  progress,
}: {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, [index / total, (index + 1) / total], [0.2, 1]);

  return (
    <span className="relative inline-block">
      <span className="invisible">{char === " " ? "\u00A0" : char}</span>
      <motion.span style={{ opacity }} className="absolute inset-0">
        {char === " " ? "\u00A0" : char}
      </motion.span>
    </span>
  );
}
