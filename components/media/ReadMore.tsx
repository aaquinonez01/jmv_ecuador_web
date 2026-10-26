"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
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

/**
 * Muestra las primeras líneas de un texto largo y un botón "Leer más" que lo
 * despliega con una transición suave. El texto completo está siempre en el HTML
 * (buscadores y lectores de pantalla lo leen entero); solo se recorta a la vista.
 * Si el texto cabe, no aparece el botón.
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
  const [expanded, setExpanded] = useState(false);
  // null = aún sin medir (en el servidor el botón se muestra)
  const [overflows, setOverflows] = useState<boolean | null>(null);
  const [animHeight, setAnimHeight] = useState<number | null>(null);

  // ¿El texto plegado se corta? Se vuelve a medir si cambia el ancho
  useIsoLayoutEffect(() => {
    const box = boxRef.current;
    if (!box || expanded) return;
    const measure = () => setOverflows(box.scrollHeight > box.clientHeight + 2);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, [expanded]);

  const toggle = () => {
    const box = boxRef.current;
    if (!box) return;
    if (!expanded) {
      // De la altura plegada a la altura completa
      setAnimHeight(box.clientHeight);
      setExpanded(true);
      requestAnimationFrame(() => setAnimHeight(box.scrollHeight));
    } else {
      setAnimHeight(box.scrollHeight);
      requestAnimationFrame(() => {
        setExpanded(false);
        setAnimHeight(null);
        // Si el inicio del bloque quedó arriba de la pantalla, vuelve a él
        const top = box.getBoundingClientRect().top;
        if (top < 0) box.scrollIntoView({ block: "start", behavior: "smooth" });
      });
    }
  };

  const collapsed = !expanded;
  const showButton = overflows !== false || expanded;
  const style: CSSProperties = {
    ["--rm-lines" as string]: lines,
    ...(animHeight !== null && expanded ? { maxHeight: animHeight } : {}),
  };

  return (
    <div className={className}>
      <div
        id={id}
        ref={boxRef}
        style={style}
        onTransitionEnd={() => expanded && setAnimHeight(null)}
        className={cn(
          "overflow-hidden transition-[max-height] duration-300 ease-out",
          collapsed && "max-h-[calc(var(--rm-lines)*1lh)]",
          collapsed && showButton && "[mask-image:linear-gradient(to_bottom,#000_55%,transparent)]",
          mobileOnly && "md:max-h-none! md:overflow-visible md:[mask-image:none]",
        )}
      >
        {children}
      </div>
      {showButton && (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          aria-controls={id}
          className={cn(
            "mt-1 inline-flex min-h-11 items-center gap-1 rounded-md text-sm font-semibold text-accent-blue hover:underline",
            mobileOnly && "md:hidden",
            buttonClassName,
          )}
        >
          {expanded ? lessLabel : moreLabel}
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} aria-hidden />
        </button>
      )}
    </div>
  );
}
