// Utilidades del Año Vicenciano. Todo se calcula con el "hoy" de Ecuador.

import type { CalendarCategory, CalendarDateItem, CalendarEntry } from "@/types/calendar";
import type { UpcomingActivityItem } from "@/types/activity-management";
import { TIME_ZONE, isDateOnly } from "./format";

export const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
] as const;

type CategoryMeta = {
  label: string;
  /** Color de acento (texto/punto) legible sobre fondo oscuro */
  color: string;
  /** Fondo suave para chips y tarjetas */
  soft: string;
};

export const CATEGORY_META: Record<CalendarCategory | "actividad", CategoryMeta> = {
  maria: { label: "María y la Medalla", color: "#7DB7FF", soft: "rgba(125,183,255,0.16)" },
  fundadores: { label: "San Vicente y los fundadores", color: "#FF8A80", soft: "rgba(255,138,128,0.16)" },
  santos: { label: "Santos y beatos", color: "#F5B83D", soft: "rgba(245,184,61,0.16)" },
  familia: { label: "Familia Vicenciana", color: "#8BE0B5", soft: "rgba(139,224,181,0.16)" },
  jmv: { label: "JMV en el mundo", color: "#C9A7FF", soft: "rgba(201,167,255,0.16)" },
  ecuador: { label: "JMV Ecuador", color: "#FFD36E", soft: "rgba(255,211,110,0.16)" },
  actividad: { label: "Actividades", color: "#FFFFFF", soft: "rgba(255,255,255,0.12)" },
};

export const CATEGORY_ORDER: (CalendarCategory | "actividad")[] = [
  "maria", "fundadores", "santos", "familia", "jmv", "ecuador", "actividad",
];

const pad = (n: number) => String(n).padStart(2, "0");

/** Año, mes (1-12) y día de hoy en Ecuador */
export function todayInEcuador(now: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

/** Fecha ISO "solo día" (medianoche UTC), coherente con lib/format */
export function dayIso(year: number, month: number, day: number) {
  return `${year}-${pad(month)}-${pad(day)}T00:00:00.000Z`;
}

export function isLeap(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Próxima vez que cae un mes/día (hoy cuenta como próxima); el 29 de febrero espera al próximo bisiesto */
export function nextOccurrence(month: number, day: number, now: Date = new Date()) {
  const t = todayInEcuador(now);
  const passed = month < t.month || (month === t.month && day < t.day);
  let year = passed ? t.year + 1 : t.year;
  if (month === 2 && day === 29) while (!isLeap(year)) year++;
  return dayIso(year, month, day);
}

/** Días que faltan desde hoy (Ecuador) hasta una fecha "solo día"; 0 = hoy */
export function daysUntil(iso: string, now: Date = new Date()) {
  const t = todayInEcuador(now);
  const today = Date.UTC(t.year, t.month - 1, t.day);
  const d = new Date(iso);
  const target = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return Math.round((target - today) / 86_400_000);
}

export function isToday(month: number, day: number, now: Date = new Date()) {
  const t = todayInEcuador(now);
  return t.month === month && t.day === day;
}

/** "27 de noviembre" */
export function dayLabel(month: number, day: number) {
  return `${day} de ${MONTHS[month - 1].toLowerCase()}`;
}

/** Años transcurridos en la próxima celebración (p. ej. 196 años de la Medalla) */
export function anniversary(item: Pick<CalendarDateItem, "year" | "month" | "day">, now: Date = new Date()) {
  if (!item.year) return null;
  const next = new Date(nextOccurrence(item.month, item.day, now));
  const years = next.getUTCFullYear() - item.year;
  return years > 0 ? years : null;
}

export function calendarHref(slug: string) {
  return `/calendario/${slug}`;
}

/** Convierte las fechas fijas en entradas del año que viene (desde hoy) */
export function datesToEntries(items: CalendarDateItem[], now: Date = new Date()): CalendarEntry[] {
  return items.map((item) => ({
    key: `fecha-${item.id}`,
    kind: "fecha",
    title: item.title,
    subtitle: item.subtitle,
    summary: item.summary,
    category: item.category,
    month: item.month,
    day: item.day,
    date: nextOccurrence(item.month, item.day, now),
    href: calendarHref(item.slug),
    imageUrl: item.imageUrl,
    verified: item.verified,
    item,
  }));
}

/** Las próximas actividades del admin también aparecen en el calendario */
export function activitiesToEntries(items: UpcomingActivityItem[]): CalendarEntry[] {
  return items
    .filter((a) => a.startDate && a.registrationStatus !== "draft")
    .map((a) => {
      const start = new Date(a.startDate as string);
      // Las fechas del admin sin hora vienen como medianoche UTC del día correcto
      const d = isDateOnly(start) ? start : new Date(start.getTime() - 5 * 3_600_000);
      const month = d.getUTCMonth() + 1;
      const day = d.getUTCDate();
      return {
        key: `actividad-${a.id}`,
        kind: "actividad" as const,
        title: a.title,
        summary: a.summary || a.description,
        category: "actividad" as const,
        month,
        day,
        date: dayIso(d.getUTCFullYear(), month, day),
        endDate: a.endDate ?? null,
        href: "/actividades#proximas",
        imageUrl: a.coverImageUrl,
        verified: true,
      };
    });
}

/** Ordena por cercanía: primero lo de hoy, luego lo que viene */
export function sortByUpcoming(entries: CalendarEntry[]) {
  return [...entries].sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
}

/** Ordena por mes y día (vista de año completo) */
export function sortByMonthDay(entries: CalendarEntry[]) {
  return [...entries].sort((a, b) => a.month - b.month || a.day - b.day || a.title.localeCompare(b.title));
}
