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

type SsrFetchOptions = {
  revalidate?: number;
  tags?: string[];
  timeoutMs?: number;
};

export async function ssrFetch(
  path: string,
  opts: SsrFetchOptions = {}
): Promise<Response | null> {
  if (shouldSkipRemoteFetch()) return null;

  const base = getApiBase();
  const url = `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  const { revalidate = 1800, tags, timeoutMs = 8000 } = opts;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate, ...(tags ? { tags } : {}) },
    });
    return res.ok ? res : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
