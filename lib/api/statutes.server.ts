import { ssrFetch } from "@/lib/helpers/apiBase";
import type { StatuteVersion, StatuteVersionSummary } from "@/types/statutes";

// El backend invalida este tag al crear, editar o marcar como vigente una versión.
export const STATUTES_TAG = "statutes";

/** Versión vigente publicada, o null si todavía no hay ninguna */
export async function fetchCurrentStatutes(): Promise<StatuteVersion | null> {
  const res = await ssrFetch("/statutes/current", { revalidate: 3600, tags: [STATUTES_TAG] });
  if (!res) return null;
  try {
    return (await res.json()) as StatuteVersion;
  } catch {
    return null;
  }
}

/** Versiones publicadas (sin el texto), de la más reciente a la más antigua */
export async function fetchStatuteVersions(): Promise<StatuteVersionSummary[]> {
  const res = await ssrFetch("/statutes/public", { revalidate: 3600, tags: [STATUTES_TAG] });
  if (!res) return [];
  try {
    const data = (await res.json()) as { items?: StatuteVersionSummary[] };
    return data.items ?? [];
  } catch {
    return [];
  }
}

export async function fetchStatuteVersion(slug: string): Promise<StatuteVersion | null> {
  const res = await ssrFetch(`/statutes/public/${encodeURIComponent(slug)}`, {
    revalidate: 3600,
    tags: [STATUTES_TAG],
  });
  if (!res) return null;
  try {
    return (await res.json()) as StatuteVersion;
  } catch {
    return null;
  }
}
