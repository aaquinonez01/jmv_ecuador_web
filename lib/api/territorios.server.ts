import { ssrFetch } from "@/lib/helpers/apiBase";
import type { OrgZona } from "@/lib/data/organigrama";

/**
 * Trae las zonas pastorales con sus comunidades anidadas desde el backend
 * (GET /api/zonas). Se usa para construir el organigrama. Devuelve [] si el
 * backend no está disponible.
 */
export async function fetchZonasOrganigrama(): Promise<OrgZona[]> {
  const res = await ssrFetch("/zonas", {
    revalidate: 2592000,
    tags: ["zonas"],
  });
  if (!res) return [];
  try {
    const data = await res.json();
    return Array.isArray(data) ? (data as OrgZona[]) : [];
  } catch {
    return [];
  }
}
