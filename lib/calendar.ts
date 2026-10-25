// "Agregar a mi calendario": enlace de Google Calendar y archivo .ics (Apple/Outlook).

import { SITE } from "./site";
import { isDateOnly } from "./format";
import { escapeText, joinLines } from "./ics-text";

export interface CalendarEvent {
  title: string;
  start: Date | string;
  /** Si falta, se asume 2 horas (o el día completo si allDay). En allDay es el último día, inclusive */
  end?: Date | string;
  allDay?: boolean;
  description?: string;
  location?: string;
  url?: string;
  /** Identificador estable para el .ics */
  uid?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

function toDate(v: Date | string) {
  return v instanceof Date ? v : new Date(v);
}

// En .ics y Google Calendar el final de un evento de día completo es exclusivo:
// se suma un día al último día para que no se pierda.
function resolveEnd(event: CalendarEvent) {
  const start = toDate(event.start);
  if (event.allDay) {
    const last = event.end ? toDate(event.end) : start;
    const end = new Date(Math.max(last.getTime(), start.getTime()));
    end.setUTCDate(end.getUTCDate() + 1);
    return end;
  }
  if (event.end) return toDate(event.end);
  return new Date(start.getTime() + 2 * 60 * 60 * 1000);
}

/** 20261024T183000Z */
function utcStamp(d: Date) {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

/** 20261024 (fecha en hora de Ecuador, UTC-5 sin horario de verano) */
function dateStamp(d: Date) {
  // Las fechas sin hora ya vienen como medianoche UTC del día correcto
  const ec = isDateOnly(d) ? d : new Date(d.getTime() - 5 * 60 * 60 * 1000);
  return `${ec.getUTCFullYear()}${pad(ec.getUTCMonth() + 1)}${pad(ec.getUTCDate())}`;
}

function details(event: CalendarEvent) {
  return [event.description, event.url].filter(Boolean).join("\n\n");
}

export function googleCalendarUrl(event: CalendarEvent) {
  const start = toDate(event.start);
  const end = resolveEnd(event);
  const dates = event.allDay
    ? `${dateStamp(start)}/${dateStamp(end)}`
    : `${utcStamp(start)}/${utcStamp(end)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates,
    ctz: "America/Guayaquil",
  });
  const body = details(event);
  if (body) params.set("details", body);
  if (event.location) params.set("location", event.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Contenido de un archivo .ics con un único evento */
export function buildIcs(event: CalendarEvent) {
  const start = toDate(event.start);
  const end = resolveEnd(event);
  const uid = event.uid ?? `${utcStamp(start)}-${event.title.replace(/\W+/g, "-")}@jmvecuador.org`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${SITE.name}//Agenda//ES`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${utcStamp(new Date())}`,
    event.allDay ? `DTSTART;VALUE=DATE:${dateStamp(start)}` : `DTSTART:${utcStamp(start)}`,
    event.allDay ? `DTEND;VALUE=DATE:${dateStamp(end)}` : `DTEND:${utcStamp(end)}`,
    `SUMMARY:${escapeText(event.title)}`,
  ];
  const body = details(event);
  if (body) lines.push(`DESCRIPTION:${escapeText(body)}`);
  if (event.location) lines.push(`LOCATION:${escapeText(event.location)}`);
  if (event.url) lines.push(`URL:${event.url}`);
  lines.push("END:VEVENT", "END:VCALENDAR");
  return joinLines(lines);
}

/** Descarga el .ics en el navegador (usar sólo en componentes cliente) */
export function downloadIcs(event: CalendarEvent, filename = "evento-jmv.ics") {
  const blob = new Blob([buildIcs(event)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Safari/iOS y algunos Firefox cancelan la descarga si se revoca de inmediato
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
