"use client";

import { useEffect, useRef } from "react";

/**
 * Para listas de pestañas que en móvil se desplazan en horizontal: cuando cambia
 * la pestaña activa (por ejemplo con «Siguiente»), la desliza dentro de la fila
 * para que se vea. Solo mueve la fila, nunca la página.
 */
export function useScrollActiveTab<T extends HTMLElement>(active: number) {
  const ref = useRef<T>(null);
  const first = useRef(true);

  useEffect(() => {
    const list = ref.current;
    if (first.current) {
      first.current = false;
      return;
    }
    if (!list || list.scrollWidth <= list.clientWidth) return;
    const tab = list.children[active] as HTMLElement | undefined;
    if (!tab) return;
    const left = tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
  }, [active]);

  return ref;
}
