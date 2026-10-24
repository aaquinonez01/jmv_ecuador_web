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
