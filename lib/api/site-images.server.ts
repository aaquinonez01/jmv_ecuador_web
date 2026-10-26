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
 * Si no hay ninguna (o en el build sin API), devuelve las fotos locales
 * de respaldo del registro. Si la API falla en runtime, lanza (ver abajo).
 */
export const fetchSlotImages = cache(async (slotId: SiteImageSlotId): Promise<SlotPhoto[]> => {
  const slot = SITE_IMAGE_SLOTS[slotId];
  const fallback = slot.fallback.slice(0, slot.max);
  // ssrFetch devuelve null en el build o ante un 404 (usamos el respaldo). En
  // runtime, si la API falla o no responde, lanza: así una regeneración ISR
  // fallida conserva la última versión buena en vez de tapar las fotos del panel
  // con las de respaldo.
  const res = await ssrFetch(`/site-images/public?section=${encodeURIComponent(slotId)}`, {
    revalidate: 1800,
    tags: [SITE_IMAGES_TAG],
  });
  if (!res) return fallback;
  let data: { items?: PublicSiteImage[] };
  try {
    data = (await res.json()) as { items?: PublicSiteImage[] };
  } catch {
    return fallback;
  }
  const items = (Array.isArray(data?.items) ? data.items : [])
    .filter((item) => isHttpsUrl(item.url))
    .slice(0, slot.max)
    .map((item) => ({ src: item.url, alt: item.alt?.trim() ?? "" }));
  return items.length > 0 ? items : fallback;
});

/** Varios espacios a la vez (las peticiones van en paralelo) */
export async function fetchSlots<const T extends readonly SiteImageSlotId[]>(
  ids: T,
): Promise<{ [K in T[number]]: SlotPhoto[] }> {
  const lists = await Promise.all(ids.map((id) => fetchSlotImages(id)));
  return Object.fromEntries(ids.map((id, i) => [id, lists[i]])) as { [K in T[number]]: SlotPhoto[] };
}
