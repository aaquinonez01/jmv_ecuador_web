"use client";

/* eslint-disable @next/next/no-img-element */
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { isMedal, type FiestaSymbolInfo } from "@/lib/fiestas/symbol";
import { cn } from "@/lib/utils";
import Medal from "./Medal";

type Face = "front" | "back";

interface Props {
  fiesta: {
    symbol?: FiestaSymbolInfo | null;
    days: { piece: string; layerImage?: string | null }[];
  };
  /** Piezas ya ganadas (el campo `piece` de cada día completado) */
  earned: Set<string>;
  /** Pieza recién ganada: entra con un destello */
  highlight?: string | null;
  className?: string;
  /** Solo para la Medalla */
  initialFace?: Face;
  showFlip?: boolean;
}

// El símbolo de la fiesta tal como va: la Medalla dibujada, o una imagen base
// con las capas de los días completados encima (todas del mismo tamaño).
export default function FiestaSymbol({ fiesta, earned, highlight, className, initialFace, showFlip }: Props) {
  const reduce = useReducedMotion();
  if (isMedal(fiesta)) {
    return <Medal earned={earned} highlight={highlight} className={className} initialFace={initialFace} showFlip={showFlip} />;
  }

  const base = fiesta.symbol?.image;
  const layers = fiesta.days.filter((d) => d.layerImage && earned.has(d.piece));
  const complete = fiesta.days.length > 0 && fiesta.days.every((d) => earned.has(d.piece));

  return (
    <div className={cn("relative", className)}>
      <div
        aria-hidden="true"
        className={cn(
          "absolute -inset-[12%] rounded-full blur-3xl transition-opacity duration-700",
          complete ? "bg-[#f5b83d]/35 opacity-100" : "bg-[#5b8dd6]/25 opacity-80",
        )}
      />
      <div className="relative">
        {base ? (
          <img src={base} alt="" className="block h-auto w-full select-none" draggable={false} />
        ) : (
          <div className="grid aspect-square w-full place-items-center rounded-full border-2 border-dashed border-white/25 text-white/40">
            <Sparkles className="h-10 w-10" aria-hidden="true" />
          </div>
        )}
        {layers.map((d) => {
          const isNew = d.piece === highlight;
          return (
            <motion.img
              key={d.piece}
              src={d.layerImage!}
              alt=""
              draggable={false}
              className="absolute inset-0 h-full w-full select-none object-contain"
              initial={reduce ? false : { opacity: 0, scale: isNew ? 1.12 : 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={isNew ? { duration: 1.1, ease: "easeOut" } : { duration: 0.6 }}
            />
          );
        })}
      </div>
    </div>
  );
}
