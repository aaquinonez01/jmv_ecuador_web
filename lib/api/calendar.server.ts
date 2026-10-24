import { ssrFetch } from "@/lib/helpers/apiBase";
import type { CalendarDateItem } from "@/types/calendar";

// El backend invalida este tag al crear, editar o borrar fechas en el admin.
export const CALENDAR_TAG = "calendar_dates";

/** Fechas publicadas, ordenadas por mes y día */
export async function fetchCalendarDates(): Promise<CalendarDateItem[]> {
  const res = await ssrFetch("/calendar-dates/public", {
    revalidate: 3600,
    tags: [CALENDAR_TAG],
  });
  if (!res) return [];
  try {
    const data = (await res.json()) as { items?: CalendarDateItem[] };
    return data.items ?? [];
  } catch {
    return [];
  }
}

export async function fetchCalendarDate(slug: string): Promise<CalendarDateItem | null> {
  const res = await ssrFetch(`/calendar-dates/public/${encodeURIComponent(slug)}`, {
    revalidate: 3600,
    tags: [CALENDAR_TAG],
  });
  if (!res) return null;
  try {
    return (await res.json()) as CalendarDateItem;
  } catch {
    return null;
  }
}
