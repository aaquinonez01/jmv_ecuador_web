// Utilidades de presentación del Año Vicenciano (sin "use client": sirven en servidor y cliente).

import type { CSSProperties } from "react";
import type { CalendarCategory, CalendarEntry } from "@/types/calendar";
import { CATEGORY_META, MONTHS, dayLabel } from "@/lib/calendario";
import { SITE } from "@/lib/site";
import type { CalendarEvent } from "@/lib/calendar";

export type EntryCategory = CalendarCategory | "actividad";

/**
 * Color de cada categoría en modo claro: tonos oscuros del mismo matiz que llegan a
 * 4.5:1 como texto sobre blanco, marfil y su propio fondo suave (y el blanco sobre
 * ellos, para el chip activo), y también sobre el cielo de amanecer de la cabecera
 * del detalle (#e5dcce): por eso santos y ecuador son algo más oscuros. El modo oscuro
 * usa CATEGORY_META tal cual.
 */
const CATEGORY_LIGHT: Record<EntryCategory, string> = {
  maria: "#1d5fb4",
  fundadores: "#b42318",
  santos: "#7a4f00",
  familia: "#0b6b45",
  jmv: "#6d3fc0",
  ecuador: "#8f4400",
  actividad: "#334155",
};

const softOf = (hex: string, alpha: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
};

/**
 * Variables CSS de la categoría: --cat (acento) y --cat-soft (fondo suave).
 * El estilo inline trae los valores de los dos temas y la clase CAT_VARS elige uno
 * con la variante dark: (sin JS ni re-render al cambiar de tema). Van siempre juntos:
 * style={categoryStyle(c)} className={cn(CAT_VARS, ...)}.
 */
export function categoryStyle(category: EntryCategory): CSSProperties {
  const meta = CATEGORY_META[category];
  const light = CATEGORY_LIGHT[category];
  return {
    "--cat-d": meta.color,
    "--cat-soft-d": meta.soft,
    "--cat-l": light,
    "--cat-soft-l": softOf(light, 0.1),
  } as CSSProperties;
}

export const CAT_VARS =
  "[--cat:var(--cat-l)] [--cat-soft:var(--cat-soft-l)] dark:[--cat:var(--cat-d)] dark:[--cat-soft:var(--cat-soft-d)]";

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
