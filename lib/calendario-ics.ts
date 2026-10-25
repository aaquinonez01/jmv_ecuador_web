import { CATEGORY_META, calendarHref, todayInEcuador } from "@/lib/calendario";
import { SITE } from "@/lib/site";
import type { CalendarDateItem } from "@/types/calendar";

// Suscripción iCalendar (RFC 5545) a todo el Año Vicenciano: cada fecha es un
// evento de día completo que se repite cada año.

const CAL_NAME = "Año Vicenciano · JMV Ecuador";

const pad = (n: number) => String(n).padStart(2, "0");

function isLeap(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Año de la próxima ocurrencia (hoy incluido); el 29 de febrero espera al próximo bisiesto */
function nextYear(month: number, day: number, today: { year: number; month: number; day: number }) {
  let year = month < today.month || (month === today.month && day < today.day) ? today.year + 1 : today.year;
  if (month === 2 && day === 29) while (!isLeap(year)) year++;
  return year;
}

function dateValue(year: number, month: number, day: number) {
  return `${year}${pad(month)}${pad(day)}`;
}

/** Día siguiente (DTEND es exclusivo en eventos de día completo) */
function nextDay(year: number, month: number, day: number) {
  const d = new Date(Date.UTC(year, month - 1, day + 1));
  return dateValue(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

function utcStamp(d: Date) {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

/** Escapa TEXT según RFC 5545 §3.3.11 */
function escapeText(text: string) {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

const encoder = new TextEncoder();

/** Pliega a 75 octetos (RFC 5545 §3.1) sin partir caracteres UTF-8 */
function fold(line: string) {
  if (encoder.encode(line).length <= 75) return line;
  const parts: string[] = [];
  let current = "";
  let bytes = 0;
  // Las líneas de continuación empiezan con un espacio, que cuenta en sus 75 octetos
  let limit = 75;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (bytes + size > limit) {
      parts.push(current);
      current = "";
      bytes = 0;
      limit = 74;
    }
    current += char;
    bytes += size;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

function eventLines(item: CalendarDateItem, today: ReturnType<typeof todayInEcuador>, now: Date) {
  const stamp = utcStamp(now);
  const year = nextYear(item.month, item.day, today);
  const url = `${SITE.url}${calendarHref(item.slug)}`;
  const description = [
    item.subtitle,
    item.summary,
    item.challenge ? `¿Cómo vivirlo hoy? ${item.challenge}` : null,
    item.verified ? null : "Fecha por confirmar.",
    `Más en ${url}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const lines = [
    "BEGIN:VEVENT",
    `UID:${item.slug}@jmvecuador.org`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${dateValue(year, item.month, item.day)}`,
    `DTEND;VALUE=DATE:${nextDay(year, item.month, item.day)}`,
    // El 29 de febrero solo existe en bisiestos: se fija el mes y el día para que no se corra
    item.month === 2 && item.day === 29
      ? "RRULE:FREQ=YEARLY;BYMONTH=2;BYMONTHDAY=29"
      : "RRULE:FREQ=YEARLY",
    `SUMMARY:${escapeText(item.title)}`,
    `DESCRIPTION:${escapeText(description)}`,
    `CATEGORIES:${escapeText(CATEGORY_META[item.category]?.label ?? item.category)}`,
    `URL:${url}`,
    "TRANSP:TRANSPARENT",
  ];
  if (item.updatedAt) {
    const updated = new Date(item.updatedAt);
    // Nunca en el futuro (si el reloj del servidor y la base no coinciden)
    if (!Number.isNaN(updated.getTime())) lines.push(`LAST-MODIFIED:${utcStamp(updated > now ? now : updated)}`);
  }
  lines.push("END:VEVENT");
  return lines;
}

export function buildYearFeed(items: CalendarDateItem[], now: Date = new Date()) {
  const today = todayInEcuador(now);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${SITE.name}//Año Vicenciano//ES`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `NAME:${escapeText(CAL_NAME)}`,
    `X-WR-CALNAME:${escapeText(CAL_NAME)}`,
    `DESCRIPTION:${escapeText("Fechas de María, san Vicente, los santos vicencianos y JMV.")}`,
    `X-WR-CALDESC:${escapeText("Fechas de María, san Vicente, los santos vicencianos y JMV.")}`,
    "X-WR-TIMEZONE:America/Guayaquil",
    `URL:${SITE.url}/calendario`,
    "REFRESH-INTERVAL;VALUE=DURATION:P1D",
    "X-PUBLISHED-TTL:P1D",
    ...items.filter((item) => item.published).flatMap((item) => eventLines(item, today, now)),
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
