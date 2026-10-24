import { getAxiosClient } from "@/config/axios.config";
import type { CalendarCategory, CalendarDateItem } from "@/types/calendar";

export interface CalendarDatePayload {
  slug?: string;
  title: string;
  subtitle?: string;
  month: number;
  day: number;
  year?: number | null;
  category: CalendarCategory;
  summary: string;
  story?: string;
  quote?: string;
  quoteAuthor?: string;
  challenge?: string;
  /** Ruta local (/images/...) o URL https; se ignora si se sube "image" */
  imageUrl?: string;
  source?: string;
  verified?: boolean;
  published?: boolean;
  displayOrder?: number | null;
  image?: File | null;
  removeImage?: boolean;
}

// El backend convierte "" en null: así un campo opcional que se vacía en el
// formulario se borra de verdad al editar.
function append(formData: FormData, key: string, value: unknown) {
  if (value === undefined) return;
  formData.append(key, value === null ? "" : String(value));
}

function buildCalendarDateFormData(payload: Partial<CalendarDatePayload>): FormData {
  const formData = new FormData();
  const { image, removeImage, ...fields } = payload;

  for (const [key, value] of Object.entries(fields)) {
    append(formData, key, value);
  }
  if (image) formData.append("image", image);
  if (removeImage) formData.append("removeImage", "true");

  return formData;
}

export async function getCalendarDatesAPI(): Promise<{ items: CalendarDateItem[] }> {
  const api = getAxiosClient();
  const { data } = await api.get("/calendar-dates");
  return data as { items: CalendarDateItem[] };
}

export async function createCalendarDateAPI(
  payload: CalendarDatePayload
): Promise<CalendarDateItem> {
  const api = getAxiosClient();
  const { data } = await api.post("/calendar-dates", buildCalendarDateFormData(payload));
  return data as CalendarDateItem;
}

export async function updateCalendarDateAPI(
  id: string,
  payload: Partial<CalendarDatePayload>
): Promise<CalendarDateItem> {
  const api = getAxiosClient();
  const { data } = await api.patch(
    `/calendar-dates/${id}`,
    buildCalendarDateFormData(payload)
  );
  return data as CalendarDateItem;
}

export async function deleteCalendarDateAPI(id: string) {
  const api = getAxiosClient();
  const { data } = await api.delete(`/calendar-dates/${id}`);
  return data as { message: string };
}

/** Mensaje de error del backend (class-validator devuelve un arreglo) */
export function calendarErrorMessage(error: unknown, fallback: string) {
  const message = (error as { response?: { data?: { message?: unknown } } })?.response?.data
    ?.message;
  if (Array.isArray(message)) return message.join(". ");
  if (typeof message === "string" && message) return message;
  return fallback;
}
