"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Piezas visuales compartidas de las fiestas: estilos animados, botones con relieve,
// hoja/modal y confeti.

const CSS = `
@keyframes fiesta-sheen { 0% { transform: translateX(0) rotate(12deg); } 100% { transform: translateX(520%) rotate(12deg); } }
@keyframes fiesta-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes fiesta-pulse { 0% { box-shadow: 0 0 0 0 rgba(245,184,61,0.55); } 70% { box-shadow: 0 0 0 16px rgba(245,184,61,0); } 100% { box-shadow: 0 0 0 0 rgba(245,184,61,0); } }
@keyframes fiesta-rays { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: no-preference) {
  .fiesta-sheen { animation: fiesta-sheen 3.6s ease-in-out infinite; }
  .fiesta-float { animation: fiesta-float 6s ease-in-out infinite; }
  .fiesta-pulse { animation: fiesta-pulse 2s ease-out infinite; }
  .fiesta-rays { animation: fiesta-rays 60s linear infinite; }
}
`;

export function FiestaStyles() {
  return (
    <style href="fiesta-styles" precedence="default">
      {CSS}
    </style>
  );
}

type BtnTone = "gold" | "blue" | "glass" | "white" | "red";

const TONES: Record<BtnTone, string> = {
  gold: "bg-gradient-to-b from-[#ffd36e] to-[#f0a81f] text-[#3b2600] shadow-[0_4px_0_#9a6504,0_10px_24px_rgba(240,168,31,0.35)] active:shadow-[0_1px_0_#9a6504]",
  blue: "bg-gradient-to-b from-[#2f68b5] to-[#1d4e8a] text-white shadow-[0_4px_0_#0b2547,0_10px_24px_rgba(13,37,71,0.4)] active:shadow-[0_1px_0_#0b2547]",
  red: "bg-gradient-to-b from-[#e2504f] to-[#c42a29] text-white shadow-[0_4px_0_#8f1f1e,0_10px_24px_rgba(196,42,41,0.35)] active:shadow-[0_1px_0_#8f1f1e]",
  glass: "border border-white/25 bg-white/10 text-white backdrop-blur shadow-[0_3px_0_rgba(0,0,0,0.25),0_8px_20px_rgba(0,0,0,0.25)] hover:bg-white/15 active:shadow-[0_1px_0_rgba(0,0,0,0.25)]",
  white: "bg-white text-[#0f2547] shadow-[0_4px_0_rgba(15,37,71,0.25),0_10px_24px_rgba(0,0,0,0.25)] active:shadow-[0_1px_0_rgba(15,37,71,0.25)]",
};

export function FiestaButton({
  tone = "gold",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: BtnTone }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 font-semibold transition active:translate-y-[3px] disabled:pointer-events-none disabled:opacity-50",
        TONES[tone],
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Tarjeta de vidrio sobre el cielo */
export function Glass({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/15 bg-white/[0.07] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Hoja inferior en el celular, modal centrado en pantallas grandes */
export function Sheet({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setTimeout(() => ref.current?.querySelector<HTMLElement>("input,select,textarea,button")?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6" data-tone="dark">
          <motion.div
            className="absolute inset-0 bg-[#050b18]/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className={cn(
              "relative max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] border border-white/15 bg-gradient-to-b from-[#173763] to-[#0b1a33] p-6 pb-8 text-white shadow-2xl sm:rounded-[28px]",
              wide ? "sm:max-w-2xl" : "sm:max-w-md",
            )}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 shadow-[0_3px_0_rgba(0,0,0,0.25)] transition hover:bg-white/20 active:translate-y-0.5"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

const CONFETTI_COLORS = ["#f5b83d", "#ffe7a3", "#ffffff", "#5b8dd6", "#d3302f", "#9cc3ff"];

/** Lluvia de confeti y estrellas (se monta al ganar algo) */
export function Confetti({ burst = 0 }: { burst?: number }) {
  const reduce = useReducedMotion();
  const pieces = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        id: `${burst}-${i}`,
        x: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 2.2 + Math.random() * 1.6,
        rotate: Math.random() * 720 - 360,
        drift: Math.random() * 160 - 80,
        size: 6 + Math.random() * 8,
        star: i % 5 === 0,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      })),
    [burst],
  );
  if (!burst || reduce) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95] overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0 block"
          style={{ left: `${p.x}%`, width: p.size, height: p.star ? p.size : p.size * 0.45, color: p.color }}
          initial={{ y: -30, x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: "105vh", x: p.drift, rotate: p.rotate, opacity: [1, 1, 0.8, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
        >
          {p.star ? (
            <svg viewBox="0 0 10 10" className="h-full w-full fill-current">
              <polygon points="5,0 6.2,3.6 10,3.8 7,6.1 8.1,10 5,7.8 1.9,10 3,6.1 0,3.8 3.8,3.6" />
            </svg>
          ) : (
            <span className="block h-full w-full rounded-[2px]" style={{ background: p.color }} />
          )}
        </motion.span>
      ))}
    </div>
  );
}
