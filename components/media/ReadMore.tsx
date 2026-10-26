"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type TransitionEvent,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReadMoreProps {
  children: ReactNode;
  /** Líneas visibles cuando está plegado (por defecto 4) */
  lines?: number;
  /** Solo se pliega en móvil (< 768px); en tablet y escritorio se ve entero. Por defecto sí */
  mobileOnly?: boolean;
  moreLabel?: string;
  lessLabel?: string;
  className?: string;
  /** Clases del botón (p. ej. para alinearlo al centro) */
  buttonClassName?: string;
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Hijos de texto corrido: con ellos "lines" son líneas reales del párrafo
const TEXT_TAGS = new Set(["P", "BLOCKQUOTE", "SPAN", "H2", "H3", "H4", "H5", "H6"]);

/**
 * Interlineado (px) del texto del primer párrafo de la caja. La altura plegada
 * se calcula con él, no con el del envoltorio, para que las líneas visibles
 * sean enteras aunque el párrafo tenga otro tamaño de letra. Si el contenido es
 * una lista o una rejilla de tarjetas, devuelve null y se usa el interlineado
 * del envoltorio (allí "lines" es solo una altura aproximada).
 */
function firstLineHeight(box: HTMLElement): number | null {
  const first = box.firstElementChild;
  if (!first || !TEXT_TAGS.has(first.tagName)) return null;
  const walker = document.createTreeWalker(first, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      node.textContent?.trim() && !node.parentElement?.closest("[aria-hidden='true']")
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP,
  });
  const text = walker.nextNode();
  const el = text?.parentElement;
  if (!el) return null;
  const cs = getComputedStyle(el);
  const lh = parseFloat(cs.lineHeight);
  if (Number.isFinite(lh) && lh > 0) return lh;
  const fs = parseFloat(cs.fontSize);
  return Number.isFinite(fs) && fs > 0 ? fs * 1.2 : null;
}

type Phase = "collapsed" | "expanding" | "expanded" | "collapsing";

/**
 * Muestra las primeras líneas de un texto largo y un botón "Leer más" que lo
 * despliega con una transición suave. El texto completo está siempre en el HTML
 * (buscadores y lectores de pantalla lo leen entero); solo se recorta a la vista.
 * El botón ocupa siempre su sitio (así el contenido no salta al hidratar); si el
 * texto cabe, queda invisible y fuera del orden de tabulación.
 */
export default function ReadMore({
  children,
  lines = 4,
  mobileOnly = true,
  moreLabel = "Leer más",
  lessLabel = "Leer menos",
  className,
  buttonClassName,
}: ReadMoreProps) {
  const id = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  const collapsedHeight = useRef(0);
  const [phase, setPhase] = useState<Phase>("collapsed");
  // null = aún sin medir (en el servidor)
  const [overflows, setOverflows] = useState<boolean | null>(null);
  const [lineHeight, setLineHeight] = useState<number | null>(null);
  const [animHeight, setAnimHeight] = useState<number | null>(null);

  const expanded = phase !== "collapsed";
  const clamped = phase === "collapsed";

  // Interlineado real del texto y si el texto plegado se corta. Se vuelve a
  // medir si cambia el ancho (o el tamaño de letra responsive).
  useIsoLayoutEffect(() => {
    const box = boxRef.current;
    if (!box || !clamped) return;
    const measure = () => {
      const lh = firstLineHeight(box);
      setLineHeight((prev) => (lh && Math.abs((prev ?? 0) - lh) > 0.5 ? lh : prev));
      collapsedHeight.current = box.clientHeight;
      setOverflows(box.scrollHeight > box.clientHeight + 2);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, [clamped, lineHeight]);

  // Doble rAF: el navegador pinta la altura de partida antes de animar
  const nextFrame = (fn: () => void) => requestAnimationFrame(() => requestAnimationFrame(fn));

  const scrollBack = (box: HTMLElement) => {
    // Si el inicio del bloque quedó arriba de la pantalla, vuelve a él
    if (box.getBoundingClientRect().top < 0) {
      box.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
  };

  const toggle = () => {
    const box = boxRef.current;
    if (!box) return;
    const reduced = prefersReducedMotion();
    if (!expanded) {
      if (reduced) {
        setPhase("expanded");
        return;
      }
      setAnimHeight(box.clientHeight);
      setPhase("expanding");
      nextFrame(() => setAnimHeight(box.scrollHeight));
    } else {
      if (reduced) {
        setPhase("collapsed");
        setAnimHeight(null);
        requestAnimationFrame(() => scrollBack(box));
        return;
      }
      setAnimHeight(box.scrollHeight);
      setPhase("collapsing");
      nextFrame(() => setAnimHeight(collapsedHeight.current));
    }
  };

  const finish = () => {
    const box = boxRef.current;
    if (phase === "expanding") {
      setPhase("expanded");
      setAnimHeight(null);
    } else if (phase === "collapsing") {
      setPhase("collapsed");
      setAnimHeight(null);
      if (box) scrollBack(box);
    }
  };
  const onTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) finish();
  };
  // Respaldo por si el navegador no emite transitionend (p. ej. sin cambio de altura)
  const finishRef = useRef(finish);
  useIsoLayoutEffect(() => {
    finishRef.current = finish;
  });
  useEffect(() => {
    if (phase !== "expanding" && phase !== "collapsing") return;
    const t = window.setTimeout(() => finishRef.current(), 500);
    return () => window.clearTimeout(t);
  }, [phase]);

  const style: CSSProperties = {
    ["--rm-lines" as string]: lines,
    ...(lineHeight ? { ["--rm-lh" as string]: `${lineHeight}px` } : {}),
    ...(animHeight !== null && !clamped ? { maxHeight: animHeight } : {}),
  };
  const buttonHidden = overflows === false && !expanded;

  return (
    <div className={className}>
      <div
        id={id}
        ref={boxRef}
        style={style}
        onTransitionEnd={onTransitionEnd}
        className={cn(
          "overflow-hidden transition-[max-height] duration-300 ease-out motion-reduce:transition-none",
          clamped && "max-h-[calc(var(--rm-lines)*var(--rm-lh,1lh))]",
          clamped && overflows === true && "[mask-image:linear-gradient(to_bottom,#000_55%,transparent)]",
          mobileOnly && "md:max-h-none! md:overflow-visible md:[mask-image:none]",
        )}
      >
        {children}
      </div>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={expanded}
        aria-controls={id}
        aria-hidden={buttonHidden || undefined}
        tabIndex={buttonHidden ? -1 : undefined}
        className={cn(
          "mt-1 inline-flex min-h-11 items-center gap-1 rounded-md text-sm font-semibold text-accent-blue hover:underline",
          buttonHidden && "invisible",
          mobileOnly && "md:hidden",
          buttonClassName,
        )}
      >
        {phase === "expanded" || phase === "expanding" ? lessLabel : moreLabel}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform motion-reduce:transition-none",
            (phase === "expanded" || phase === "expanding") && "rotate-180",
          )}
          aria-hidden
        />
      </button>
    </div>
  );
}
