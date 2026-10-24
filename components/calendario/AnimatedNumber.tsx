"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";

// Número que, al cambiar, cuenta suavemente hasta el nuevo valor (sin re-render por cuadro).
// El servidor pinta el valor final: funciona sin JS y no rompe la hidratación.
export default function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => String(Math.round(v)));
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      // Primera vez en pantalla: cuenta desde un poco antes para dar vida sin parpadeo
      if (reduce || value < 2) return;
      mv.set(Math.max(0, value - Math.min(value, 30)));
    }
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration: 0.9, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [value, reduce, mv]);

  return <motion.span className={className}>{text}</motion.span>;
}
