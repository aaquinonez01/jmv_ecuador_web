import { fetchCalendarDates } from "@/lib/api/calendar.server";
import { buildYearFeed } from "@/lib/calendario-ics";
import type { CalendarDateItem } from "@/types/calendar";

// Suscripción a todo el Año Vicenciano (Google, Apple, Outlook)
export const revalidate = 3600;

export async function GET() {
  let items: CalendarDateItem[];
  try {
    items = await fetchCalendarDates();
  } catch {
    return new Response("El calendario no está disponible en este momento.", {
      status: 503,
      headers: { "Retry-After": "300", "Cache-Control": "no-store" },
    });
  }

  return new Response(buildYearFeed(items), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="ano-vicenciano-jmv-ecuador.ics"',
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
