export function getApiBase(): string {
  return (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3002/api"
  ).replace(/\/+$/, "");
}

export function shouldSkipRemoteFetch(): boolean {
  return process.env.SKIP_REMOTE_FETCH === "1";
}

function isBuildPhase(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

type SsrFetchOptions = {
  revalidate?: number;
  tags?: string[];
  timeoutMs?: number;
};

/**
 * Fetch del lado del servidor con Data Cache de Next (revalidate + tags).
 *
 * - En `next build`: si el backend no responde devuelve `null` para no romper el
 *   build; la página se regenera sola según su `revalidate`.
 * - En runtime: si el backend falla lanza error. Durante una regeneración ISR eso
 *   hace que Next siga sirviendo la última versión buena en vez de cachear una
 *   página vacía.
 */
export async function ssrFetch(
  path: string,
  opts: SsrFetchOptions = {}
): Promise<Response | null> {
  if (shouldSkipRemoteFetch()) return null;

  const base = getApiBase();
  const url = `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  const { revalidate = 1800, tags, timeoutMs = 8000 } = opts;

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
      next: { revalidate, ...(tags ? { tags } : {}) },
    });
    if (res.ok) return res;
    if (res.status === 404 || isBuildPhase()) return null;
    throw new Error(`ssrFetch ${path} respondió ${res.status}`);
  } catch (err) {
    if (isBuildPhase()) return null;
    throw err;
  }
}
