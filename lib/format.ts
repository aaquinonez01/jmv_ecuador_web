// Formato de fechas en español de Ecuador, siempre en hora de Guayaquil
// (evita que el servidor en UTC muestre otro día).

export const LOCALE = "es-EC";
export const TIME_ZONE = "America/Guayaquil";

type DateInput = Date | string | number;

function toDate(value: DateInput) {
  return value instanceof Date ? value : new Date(value);
}

function isValid(d: Date) {
  return !Number.isNaN(d.getTime());
}

/**
 * Las fechas sin hora (inputs type="date" del admin) llegan como medianoche UTC.
 * Si se mostraran en hora de Ecuador (UTC-5) saldrían un día antes.
 */
export function isDateOnly(value: DateInput) {
  const d = toDate(value);
  return (
    isValid(d) &&
    d.getUTCHours() === 0 &&
    d.getUTCMinutes() === 0 &&
    d.getUTCSeconds() === 0 &&
    d.getUTCMilliseconds() === 0
  );
}

/** Instante real del evento: una fecha sin hora empieza a medianoche de Ecuador */
export function toEventInstant(value: DateInput) {
  const d = toDate(value);
  return isDateOnly(d) ? new Date(d.getTime() + 5 * 60 * 60 * 1000) : d;
}

/** "24 de octubre de 2026" por defecto */
export function formatDate(
  value: DateInput,
  opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
) {
  const d = toDate(value);
  if (!isValid(d)) return "";
  const timeZone = isDateOnly(d) ? "UTC" : TIME_ZONE;
  return new Intl.DateTimeFormat(LOCALE, { timeZone, ...opts }).format(d);
}

/** "24 de octubre de 2026, 18:30" por defecto */
export function formatDateTime(
  value: DateInput,
  opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  },
) {
  return formatDate(value, opts);
}

/** "18:30" ("" si la fecha no tiene hora) */
export function formatTime(value: DateInput) {
  if (isDateOnly(value)) return "";
  return formatDate(value, { hour: "2-digit", minute: "2-digit" });
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

/** "hace 2 h", "en 3 días", "ahora" */
export function formatRelative(value: DateInput, now: DateInput = new Date()) {
  const d = toDate(value);
  if (!isValid(d)) return "";
  const diffSeconds = Math.round((d.getTime() - toDate(now).getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(LOCALE, { numeric: "auto", style: "short" });
  for (const [unit, seconds] of RELATIVE_UNITS) {
    if (Math.abs(diffSeconds) >= seconds) {
      return rtf.format(Math.trunc(diffSeconds / seconds), unit);
    }
  }
  return "ahora";
}

/** Valor para el atributo dateTime de <time> */
export function toIsoString(value: DateInput) {
  const d = toDate(value);
  return isValid(d) ? d.toISOString() : undefined;
}
