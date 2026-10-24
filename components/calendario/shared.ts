// Utilidades de presentación del Año Vicenciano (sin "use client": sirven en servidor y cliente).

import type { CSSProperties } from "react";
import type { CalendarCategory, CalendarEntry } from "@/types/calendar";
import { CATEGORY_META, MONTHS, dayLabel } from "@/lib/calendario";
import { SITE } from "@/lib/site";
import type { CalendarEvent } from "@/lib/calendar";

export type EntryCategory = CalendarCategory | "actividad";

/** Variables CSS de la categoría: --cat (acento) y --cat-soft (fondo suave) */
export function categoryStyle(category: EntryCategory): CSSProperties {
  const meta = CATEGORY_META[category];
  return { "--cat": meta.color, "--cat-soft": meta.soft } as CSSProperties;
}

export const MONTHS_SHORT = MONTHS.map((m) => m.slice(0, 3));

/** Días de cada mes (febrero con 29 para que el 29 tenga sitio en el anillo) */
export const MONTH_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** "27 de noviembre: Nuestra Señora de la Medalla Milagrosa" */
export function entryAccessibleName(entry: Pick<CalendarEntry, "month" | "day" | "title">) {
  return `${dayLabel(entry.month, entry.day)}: ${entry.title}`;
}

/** Evento de día completo en la próxima ocurrencia, para Google Calendar y .ics */
export function entryToEvent(entry: CalendarEntry): CalendarEvent {
  const year = new Date(entry.date).getUTCFullYear();
  return {
    title: entry.title,
    start: entry.date,
    end: entry.endDate ?? undefined,
    allDay: true,
    description: entry.summary ?? undefined,
    url: new URL(entry.href, SITE.url).toString(),
    uid: `${entry.key}-${year}@jmvecuador.org`,
  };
}

export function slugifyFile(text: string) {
  return (
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .toLowerCase()
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "fecha-jmv"
  );
}

/** Nombre del PNG para historias (el mismo en la descarga y en la respuesta) */
export function storyFilename(slug: string) {
  return `ano-vicenciano-${slugifyFile(slug)}-historia.png`;
}

const FEED_HOST = new URL(SITE.url).host;
export const FEED_PATH = "/calendario/feed.ics";
export const FEED_WEBCAL = `webcal://${FEED_HOST}${FEED_PATH}`;
export const FEED_HTTPS = `${SITE.url}${FEED_PATH}`;
export const FEED_GOOGLE = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(FEED_WEBCAL)}`;

/** "Faltan 12 días", "Mañana", "¡Es hoy!" */
export function countdownLabel(days: number) {
  if (days <= 0) return "¡Es hoy!";
  if (days === 1) return "Es mañana";
  return `Faltan ${days} días`;
}

export function isCloudinary(url: string) {
  return url.includes("res.cloudinary.com");
}

/** Años desde el hecho hasta hoy (el aniversario de este año cuenta si ya pasó o es hoy) */
export function yearsAgo(
  item: { year?: number | null; month: number; day: number },
  today: { year: number; month: number; day: number },
) {
  if (!item.year) return null;
  const pending = item.month > today.month || (item.month === today.month && item.day > today.day);
  const years = today.year - item.year - (pending ? 1 : 0);
  return years > 0 ? years : null;
}
