"use client";

import { useCallback, useRef, type KeyboardEvent } from "react";

/**
 * Grupo de 12 radios (uno por mes) con foco itinerante: flechas para moverse,
 * Inicio/Fin para ir a enero/diciembre. month es 1-12.
 */
export function useMonthRadio(month: number, onChange: (month: number) => void) {
  const refs = useRef<(HTMLElement | null)[]>([]);

  const move = useCallback(
    (next: number) => {
      const m = ((next - 1 + 12) % 12) + 1;
      onChange(m);
      refs.current[m - 1]?.focus();
    },
    [onChange],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      const keys: Record<string, number> = {
        ArrowRight: month + 1,
        ArrowDown: month + 1,
        ArrowLeft: month - 1,
        ArrowUp: month - 1,
        Home: 1,
        End: 12,
      };
      if (!(e.key in keys)) return;
      e.preventDefault();
      move(keys[e.key]);
    },
    [month, move],
  );

  const radioProps = (m: number) => ({
    ref: (el: HTMLElement | null) => {
      refs.current[m - 1] = el;
    },
    role: "radio" as const,
    "aria-checked": m === month,
    tabIndex: m === month ? 0 : -1,
    onKeyDown,
    onClick: () => onChange(m),
  });

  return { radioProps };
}
