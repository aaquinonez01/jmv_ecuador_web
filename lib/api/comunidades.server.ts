import { ssrFetch } from "@/lib/helpers/apiBase";
import type { ComunidadItem } from "@/types/territory-management";

/**
 * Comunidades públicas (GET /api/comunidades) para el buscador de /unete.
 * Devuelve null si el backend falla: el buscador muestra el aviso y vuelve a
 * intentarlo desde el navegador en lugar de romper la página.
 */
export async function fetchComunidades(): Promise<ComunidadItem[] | null> {
  try {
    const res = await ssrFetch("/comunidades", {
      revalidate: 86400,
      tags: ["comunidades"],
    });
    if (!res) return null;
    const data = await res.json();
    return Array.isArray(data) ? (data as ComunidadItem[]) : null;
  } catch {
    return null;
  }
}
