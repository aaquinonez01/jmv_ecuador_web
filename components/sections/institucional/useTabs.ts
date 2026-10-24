"use client";

import { useCallback, useRef, useState, type KeyboardEvent } from "react";

// Pestañas según el patrón WAI-ARIA Tabs: roving tabindex, flechas, Inicio/Fin
// y activación automática. El panel inactivo se oculta con `hidden`.
export function useTabs(
  count: number,
  idPrefix: string,
  initial = 0,
  onChange?: (index: number) => void,
) {
  const [active, setActive] = useState(initial);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = useCallback(
    (index: number, focus = false) => {
      const next = (index + count) % count;
      setActive(next);
      onChange?.(next);
      if (focus) tabRefs.current[next]?.focus();
    },
    [count, onChange],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      let next: number | null = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = active + 1;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = active - 1;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = count - 1;
      if (next === null) return;
      e.preventDefault();
      select(next, true);
    },
    [active, count, select],
  );

  const tabId = (i: number) => `${idPrefix}-tab-${i}`;
  const panelId = (i: number) => `${idPrefix}-panel-${i}`;

  const getTabProps = (i: number) => ({
    id: tabId(i),
    type: "button" as const,
    role: "tab" as const,
    "aria-selected": active === i,
    "aria-controls": panelId(i),
    tabIndex: active === i ? 0 : -1,
    onClick: () => select(i),
    onKeyDown,
    ref: (el: HTMLButtonElement | null) => {
      tabRefs.current[i] = el;
    },
  });

  const getPanelProps = (i: number) => ({
    id: panelId(i),
    role: "tabpanel" as const,
    "aria-labelledby": tabId(i),
    hidden: active !== i,
    tabIndex: 0,
  });

  return { active, select, getTabProps, getPanelProps, panelId };
}
