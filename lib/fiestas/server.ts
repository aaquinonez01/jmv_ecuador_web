import { ssrFetch } from "@/lib/helpers/apiBase";
import type { FiestaPublic } from "./types";

/** Portada pública de una fiesta (se refresca cada minuto: los días se abren por fecha) */
export async function fetchFiesta(slug: string): Promise<FiestaPublic | null> {
  const res = await ssrFetch(`/fiestas/${encodeURIComponent(slug)}`, { revalidate: 60 });
  if (!res) return null;
  try {
    return (await res.json()) as FiestaPublic;
  } catch {
    return null;
  }
}
