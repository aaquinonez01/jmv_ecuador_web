export function getOptimizedUrl(url: string, opts?: { w?: number; q?: 'auto' | 'auto:best' | 'auto:good' }) {
  try {
    if (!url.includes('res.cloudinary.com')) return url;
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;
    const trans: string[] = ['f_auto', 'dpr_auto'];
    if (opts?.q) trans.push(`q_${opts.q}`);
    else trans.push('q_auto');
    if (opts?.w) trans.push(`w_${opts.w}`);
    const transformed = `${parts[0]}/upload/${trans.join(',')}/${parts[1]}`;
    return transformed;
  } catch {
    return url;
  }
}

/** srcset con transformaciones de Cloudinary (sin pasar por el optimizador de Next) */
export function getSrcSet(url: string, widths: number[] = [400, 800, 1200]) {
  if (!url.includes('res.cloudinary.com')) return undefined;
  return widths.map((w) => `${getOptimizedUrl(url, { w })} ${w}w`).join(', ');
}

// Anchos fijos para ver fotos a pantalla completa: al repetirse siempre los mismos,
// Cloudinary los genera una vez y luego los sirve desde su caché.
const VIEWER_WIDTHS = [800, 1080, 1600, 1920];

/** Ancho adecuado para ver una foto a pantalla completa en este dispositivo */
export function viewerWidth() {
  if (typeof window === 'undefined') return 1600;
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  const need = Math.max(window.innerWidth, window.innerHeight * 0.75) * dpr;
  return VIEWER_WIDTHS.find((w) => w >= need) ?? 1920;
}

export function viewerUrl(url: string) {
  return getOptimizedUrl(url, { w: viewerWidth() });
}

/** Empieza a descargar la versión grande (p. ej. al tocar una miniatura, antes de soltar) */
export function preloadViewerImage(url: string) {
  if (typeof window === 'undefined') return;
  const img = new Image();
  img.decoding = 'async';
  img.src = viewerUrl(url);
}
