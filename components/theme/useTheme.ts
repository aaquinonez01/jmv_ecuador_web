"use client";

import { useSyncExternalStore } from "react";
import {
  getResolvedTheme,
  getThemePreference,
  setThemePreference,
  subscribeTheme,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme";

// Instantánea como string para que useSyncExternalStore compare por valor
const snapshot = () => `${getThemePreference()}|${getResolvedTheme()}`;
// En el servidor (y durante la hidratación) no se conoce el tema: "system|dark"
const serverSnapshot = () => "system|dark";

/**
 * Tema actual y setter. Sólo lo necesitan los componentes que MUESTRAN el estado
 * (p. ej. el selector). Para colorear, usa los tokens CSS (bg-page, text-fg…) o
 * la variante dark:, que no requieren JS ni re-render.
 */
export function useTheme(): {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (pref: ThemePreference) => void;
} {
  const value = useSyncExternalStore(subscribeTheme, snapshot, serverSnapshot);
  const [preference, resolved] = value.split("|") as [ThemePreference, ResolvedTheme];
  return { preference, resolved, setPreference: setThemePreference };
}
