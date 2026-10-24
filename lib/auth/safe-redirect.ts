// Solo se aceptan rutas internas ("/blog"), nunca "//dominio" ni URLs absolutas,
// para que ?redirect= no sirva para mandar a la persona a otro sitio.
// Se rechazan caracteres de control, espacios y "\" porque el navegador los
// elimina o normaliza ("/\t/evil.com" acabaría en "//evil.com").
export function safeRedirect(value: string | null | undefined): string | null {
  if (!value) return null;
  if (/[\u0000-\u001F\u007F\s\\]/.test(value)) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  if (typeof window === "undefined") return value;
  try {
    const url = new URL(value, window.location.origin);
    // "/a/..//evil.com" se normaliza a "//evil.com"
    if (url.origin !== window.location.origin || url.pathname.startsWith("//")) return null;
    return url.pathname + url.search + url.hash;
  } catch {
    return null;
  }
}

/** Ruta interna desde la que se llegó (document.referrer del mismo origen) */
export function sameOriginReferrerPath(): string | null {
  if (typeof document === "undefined" || !document.referrer) return null;
  try {
    const ref = new URL(document.referrer);
    if (ref.origin !== window.location.origin) return null;
    return safeRedirect(ref.pathname + ref.search);
  } catch {
    return null;
  }
}
