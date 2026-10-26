import { cache } from "react";
import { ssrFetch } from "@/lib/helpers/apiBase";
import { SITE_IMAGE_SLOTS, type SiteImageSlotId, type SlotPhoto } from "@/lib/site-images";

// El backend invalida este tag (y la ruta de la página) al subir, editar,
// reordenar o borrar una foto desde /admin/imagenes.
export const SITE_IMAGES_TAG = "site_images";

interface PublicSiteImage {
  id: string;
  url: string;
  alt: string;
  orden: number;
}

function isHttpsUrl(url: unknown): url is string {
  return typeof url === "string" && /^https:\/\/\S+$/.test(url);
}

/**
 * Fotos de un espacio (ISR 30 min, tag 'site_images').
 * Devuelve las fotos subidas desde el panel, en orden y como máximo `max`.
 * Si no hay ninguna, o la API falla o no responde, devuelve las fotos locales
 * de respaldo del registro, así la página nunca se queda sin imagen.
 */
export const fetchSlotImages = cache(async (slotId: SiteImageSlotId): Promise<SlotPhoto[]> => {
  const slot = SITE_IMAGE_SLOTS[slotId];
  const fallback = slot.fallback.slice(0, slot.max);
  try {
    const res = await ssrFetch(`/site-images/public?section=${encodeURIComponent(slotId)}`, {
      revalidate: 1800,
      tags: [SITE_IMAGES_TAG],
    });
    if (!res) return fallback;
    const data = (await res.json()) as { items?: PublicSiteImage[] };
    const items = (data.items ?? [])
      .filter((item) => isHttpsUrl(item.url))
      .slice(0, slot.max)
      .map((item) => ({ src: item.url, alt: item.alt?.trim() ?? "" }));
    return items.length > 0 ? items : fallback;
  } catch {
    return fallback;
  }
});

/** Varios espacios a la vez (las peticiones van en paralelo) */
export async function fetchSlots<const T extends readonly SiteImageSlotId[]>(
  ids: T,
): Promise<{ [K in T[number]]: SlotPhoto[] }> {
  const lists = await Promise.all(ids.map((id) => fetchSlotImages(id)));
  return Object.fromEntries(ids.map((id, i) => [id, lists[i]])) as { [K in T[number]]: SlotPhoto[] };
}
