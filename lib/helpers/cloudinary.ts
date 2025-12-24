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

