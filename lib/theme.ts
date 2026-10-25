// Tema claro/oscuro del sitio público (guía: docs/MODO-CLARO.md).
//
// - El tema se aplica SOLO con la clase "dark" y data-theme en <html>; los colores
//   salen de variables CSS (app/globals.css), así que cambiar de tema no re-renderiza React.
// - THEME_INIT_SCRIPT corre inline en <head> antes de pintar (sin parpadeo) y escucha
//   los cambios del sistema y de otras pestañas. No hay cookies ni headers(): las
//   páginas siguen siendo estáticas/ISR.
// - Preferencia guardada en localStorage["jmv-tema"]: "light" | "dark" | "system".

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "jmv-tema";
/** Evento que se emite en window cuando cambia el tema aplicado */
export const THEME_CHANGE_EVENT = "jmv-theme-change";

export const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Oscuro" },
  { value: "system", label: "Sistema" },
];

/** Colores de la barra del navegador (meta theme-color): el header es azul en ambos modos */
export const THEME_COLOR = { light: "#1D4E8A", dark: "#0f172a" } as const;

/**
 * El panel /admin es siempre claro (no se adaptó al tema): ahí el script fuerza "light"
 * aunque la preferencia sea oscura. ThemeRouteSync reaplica el tema al entrar o salir
 * del panel con navegación del cliente.
 */
export const LIGHT_ONLY_PREFIX = "/admin";

export function isLightOnlyPath(pathname: string | null | undefined) {
  return !!pathname && (pathname === LIGHT_ONLY_PREFIX || pathname.startsWith(`${LIGHT_ONLY_PREFIX}/`));
}

// Script inline mínimo (se ejecuta antes del primer pintado). Expone window.__jmvTheme
// para que lib/theme.ts reutilice exactamente la misma lógica.
export const THEME_INIT_SCRIPT = `(function(){try{var d=document.documentElement,k=${JSON.stringify(
  THEME_STORAGE_KEY,
)},q=matchMedia("(prefers-color-scheme: dark)");function g(){var t;try{t=localStorage.getItem(k)}catch(e){}return t==="light"||t==="dark"?t:"system"}function a(p,s){var r=(location.pathname+"/").indexOf(${JSON.stringify(
  `${LIGHT_ONLY_PREFIX}/`,
)})===0?"light":p==="system"?(q.matches?"dark":"light"):p;if(s){d.classList.add("theme-switching")}d.classList.toggle("dark",r==="dark");d.setAttribute("data-theme",r);d.setAttribute("data-theme-pref",p);if(s){requestAnimationFrame(function(){requestAnimationFrame(function(){d.classList.remove("theme-switching")})});dispatchEvent(new Event(${JSON.stringify(
  THEME_CHANGE_EVENT,
)}))}}a(g(),0);window.__jmvTheme={get:g,apply:a};q.addEventListener("change",function(){if(g()==="system")a("system",1)});addEventListener("storage",function(e){if(e.key===k)a(g(),1)})}catch(e){}})()`;

type ThemeRuntime = {
  get: () => ThemePreference;
  apply: (pref: ThemePreference, animate: 0 | 1) => void;
};

function runtime(): ThemeRuntime | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { __jmvTheme?: ThemeRuntime }).__jmvTheme;
}

/** Preferencia guardada ("system" en el servidor o si no hay nada guardado) */
export function getThemePreference(): ThemePreference {
  if (typeof document === "undefined") return "system";
  const pref = document.documentElement.getAttribute("data-theme-pref");
  return pref === "light" || pref === "dark" ? pref : "system";
}

/** Tema aplicado ahora mismo ("dark" en el servidor, que es el aspecto histórico) */
export function getResolvedTheme(): ResolvedTheme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** Guarda la preferencia y la aplica al instante (sin transiciones de color) */
export function setThemePreference(pref: ThemePreference) {
  try {
    if (pref === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    // Navegación privada / almacenamiento bloqueado: se aplica sólo en esta visita
  }
  const rt = runtime();
  if (rt) {
    rt.apply(pref, 1);
    return;
  }
  // Respaldo si el script inline no corrió (CSP, etc.)
  const dark =
    pref === "dark" || (pref === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.setAttribute("data-theme", dark ? "dark" : "light");
  root.setAttribute("data-theme-pref", pref);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

/** Vuelve a aplicar la preferencia guardada (p. ej. al entrar o salir de /admin) */
export function reapplyTheme() {
  const rt = runtime();
  if (rt) rt.apply(rt.get(), 1);
}

/** Suscripción a cambios de tema (para useSyncExternalStore) */
export function subscribeTheme(callback: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, callback);
}
