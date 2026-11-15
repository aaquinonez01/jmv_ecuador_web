import { getAxiosClient } from "@/config/axios.config";
import type { PhotoStatus } from "./types";

// Administración de fiestas (solo administradores)

export interface AdminQuestion {
  id?: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation?: string | null;
}

export interface AdminDay {
  id: string;
  dayNumber: number;
  date: string;
  label: string;
  title: string;
  piece: string;
  theme: string | null;
  prayer: string | null;
  purpose: string | null;
  source: string | null;
  questions: AdminQuestion[];
  published: boolean;
  stats: { answered: number; purposes: number; photos: number };
}

export interface AdminFiesta {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  intro: string | null;
  dailyPrayers: string | null;
  feastDate: string;
  published: boolean;
  today: string;
  days: AdminDay[];
}

export interface AdminFiestaRow {
  id: string;
  slug: string;
  title: string;
  feastDate: string;
  published: boolean;
  dayCount: number;
  participants: number;
  pendingPhotos: number;
}

export interface AdminPhoto {
  id: string;
  url: string;
  caption: string | null;
  status: PhotoStatus;
  createdAt: string;
  dayNumber: number;
  label: string;
  comunidad: string;
  uploadedBy: string | null;
}

export interface LeadRow {
  id: string;
  fullName: string;
  email: string;
  isCommunityLead: boolean;
  comunidadId: string | null;
  comunidad: string | null;
}

const api = () => getAxiosClient();

export const listFiestasAPI = async () => (await api().get<AdminFiestaRow[]>("/admin/fiestas")).data;
export const getFiestaAPI = async (id: string) => (await api().get<AdminFiesta>(`/admin/fiestas/${id}`)).data;
export const updateFiestaAPI = async (
  id: string,
  p: Partial<Pick<AdminFiesta, "title" | "subtitle" | "intro" | "dailyPrayers" | "feastDate" | "published">>,
) => (await api().put<AdminFiesta>(`/admin/fiestas/${id}`, p)).data;
export const updateDayAPI = async (dayId: string, p: Partial<Omit<AdminDay, "id" | "dayNumber" | "stats">>) =>
  (await api().put<AdminDay>(`/admin/fiestas/days/${dayId}`, p)).data;
export const listPhotosAPI = async (id: string, status?: PhotoStatus) =>
  (await api().get<AdminPhoto[]>(`/admin/fiestas/${id}/photos`, { params: status ? { status } : {} })).data;
export const setPhotoStatusAPI = async (photoId: string, status: PhotoStatus) =>
  (await api().patch(`/admin/fiestas/photos/${photoId}`, { status })).data;
export const deletePhotoAPI = async (photoId: string) => {
  await api().delete(`/admin/fiestas/photos/${photoId}`);
};
export const listLeadsAPI = async (p: { search?: string; onlyLeads?: boolean }) =>
  (await api().get<LeadRow[]>("/admin/fiestas/leads", {
    params: Object.fromEntries(Object.entries(p).filter(([, v]) => v !== "" && v !== undefined && v !== false)),
  })).data;
export const setLeadAPI = async (userId: string, lead: boolean) =>
  (await api().patch(`/admin/fiestas/leads/${userId}`, { lead })).data;

export function adminError(e: unknown, fallback: string) {
  const msg = (e as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join(". ");
  return msg || fallback;
}
