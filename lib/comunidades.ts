import type { ComunidadItem } from "@/types/territory-management";
import { whatsappLink } from "./whatsapp";

/**
 * Número ecuatoriano en formato wa.me (593 + 9 dígitos). Solo celulares
 * (09…): un fijo no tiene WhatsApp, así que devuelve null.
 */
export function toWhatsappNumber(phone?: string | null) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (/^5939\d{8}$/.test(digits)) return digits;
  if (/^09\d{8}$/.test(digits)) return `593${digits.slice(1)}`;
  if (/^9\d{8}$/.test(digits)) return `593${digits}`;
  return null;
}

/** Mensaje prellenado para escribir a una comunidad */
export function comunidadMessage(c: Pick<ComunidadItem, "ciudad" | "nombre">) {
  return `Hola, vi la web de JMV y quiero conocer la comunidad de ${c.ciudad || c.nombre}`;
}

/** WhatsApp de la comunidad si tiene celular; si no, el número general de JMV Ecuador */
export function comunidadWhatsappLink(c: ComunidadItem) {
  const phone = toWhatsappNumber(c.telefono);
  return {
    href: whatsappLink(comunidadMessage(c), phone ?? undefined),
    isCommunityPhone: Boolean(phone),
  };
}

export function hasCoords(c: ComunidadItem): c is ComunidadItem & {
  latitud: number;
  longitud: number;
} {
  return (
    typeof c.latitud === "number" &&
    typeof c.longitud === "number" &&
    Number.isFinite(c.latitud) &&
    Number.isFinite(c.longitud)
  );
}

/** Distancia en km entre dos puntos (fórmula del haversine) */
export function distanceKm(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
) {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
