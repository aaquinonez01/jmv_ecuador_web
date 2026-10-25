"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { ReadingProgress } from "@/lib/biblioteca";

// Progreso de lectura guardado en este teléfono. En el servidor (y antes de
// hidratar) vale null, así las tarjetas no cambian de forma al montar.

const KEY = "jmv-biblioteca-progreso";
const EVENT = "jmv-biblioteca-progreso";

function subscribe(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === KEY) onChange();
  };
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function snapshot() {
  try {
    return window.localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

/** Todo el progreso local; null mientras no se puede leer (servidor e hidratación) */
export function useLibraryProgress(): Record<string, ReadingProgress> | null {
  const raw = useSyncExternalStore(subscribe, snapshot, () => null);
  return useMemo(() => {
    if (raw === null) return null;
    if (!raw) return {};
    try {
      return JSON.parse(raw) as Record<string, ReadingProgress>;
    } catch {
      return {};
    }
  }, [raw]);
}

/** Progreso de un documento (null si no hay o aún no se puede leer) */
export function useDocProgress(slug: string): ReadingProgress | null {
  const all = useLibraryProgress();
  return all?.[slug] ?? null;
}
