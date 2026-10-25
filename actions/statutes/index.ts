import { getAxiosClient } from "@/config/axios.config";
import type { StatuteVersion } from "@/types/statutes";

export interface StatuteVersionPayload {
  slug?: string;
  title: string;
  versionLabel: string;
  /** "AAAA-MM-DD" */
  approvedAt: string;
  approvedBy: string;
  summary?: string | null;
  content: string;
  pdfUrl?: string | null;
  published?: boolean;
}

export async function getStatuteVersionsAPI(): Promise<{ items: StatuteVersion[] }> {
  const api = getAxiosClient();
  const { data } = await api.get("/statutes");
  // El backend puede devolver el arreglo directo o envuelto en { items }
  return Array.isArray(data) ? { items: data as StatuteVersion[] } : (data as { items: StatuteVersion[] });
}

export async function getStatuteVersionAPI(id: string): Promise<StatuteVersion> {
  const api = getAxiosClient();
  const { data } = await api.get(`/statutes/${id}`);
  return data as StatuteVersion;
}

export async function createStatuteVersionAPI(payload: StatuteVersionPayload): Promise<StatuteVersion> {
  const api = getAxiosClient();
  const { data } = await api.post("/statutes", payload);
  return data as StatuteVersion;
}

export async function updateStatuteVersionAPI(
  id: string,
  payload: Partial<StatuteVersionPayload>
): Promise<StatuteVersion> {
  const api = getAxiosClient();
  const { data } = await api.patch(`/statutes/${id}`, payload);
  return data as StatuteVersion;
}

export async function deleteStatuteVersionAPI(id: string) {
  const api = getAxiosClient();
  const { data } = await api.delete(`/statutes/${id}`);
  return data as { message: string };
}

/** Marca la versión como vigente; el backend desmarca las demás */
export async function makeCurrentStatuteVersionAPI(id: string): Promise<StatuteVersion> {
  const api = getAxiosClient();
  const { data } = await api.post(`/statutes/${id}/make-current`);
  return data as StatuteVersion;
}

/** Mensaje de error del backend (class-validator devuelve un arreglo) */
export function statutesErrorMessage(error: unknown, fallback: string) {
  const message = (error as { response?: { data?: { message?: unknown } } })?.response?.data?.message;
  if (Array.isArray(message)) return message.join(". ");
  if (typeof message === "string" && message) return message;
  return fallback;
}
