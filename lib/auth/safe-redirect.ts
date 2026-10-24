// Solo se aceptan rutas internas ("/blog"), nunca "//dominio" ni URLs absolutas,
// para que ?redirect= no sirva para mandar a la persona a otro sitio.
export function safeRedirect(value: string | null | undefined): string | null {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return null;
  }
  return value;
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
