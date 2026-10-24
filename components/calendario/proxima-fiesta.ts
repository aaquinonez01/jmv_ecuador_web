// Cálculo compartido por ProximaFiesta (servidor) y su corrección en el cliente.

import { daysUntil, nextOccurrence } from "@/lib/calendario";
import type { CalendarDateItem } from "@/types/calendar";

/** Días de anticipación con los que aparece el aviso en la home */
export const PROXIMA_FIESTA_DAYS = 21;

export type FiestaCandidate = Pick<CalendarDateItem, "slug" | "title" | "month" | "day" | "category">;

export type ProximaFiestaInfo = FiestaCandidate & { days: number };

/** La fecha más cercana (hoy incluido) si cae dentro del margen; si no, null */
export function pickProximaFiesta(items: FiestaCandidate[], now: Date = new Date()): ProximaFiestaInfo | null {
  let best: ProximaFiestaInfo | null = null;
  for (const item of items) {
    const iso = nextOccurrence(item.month, item.day, now);
    // El 29 de febrero de un año no bisiesto no existe: se salta
    if (new Date(iso).getUTCDate() !== item.day) continue;
    const days = daysUntil(iso, now);
    if (days < 0 || days > PROXIMA_FIESTA_DAYS) continue;
    if (!best || days < best.days) best = { ...item, days };
  }
  return best;
}
