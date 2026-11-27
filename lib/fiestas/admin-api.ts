import { getAxiosClient } from "@/config/axios.config";
import type { SymbolKind } from "./symbol";
import type { FiestaMode, PhotoStatus } from "./types";

// Administración de fiestas (solo administradores)

export interface AdminQuestion {
  id?: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation?: string | null;
  /** Retirada: ya no se sortea, pero la conserva quien la respondió */
  retired?: boolean;
}

export interface AdminDay {
  id: string;
  dayNumber: number;
  date: string;
  label: string;
  title: string;
  piece: string;
  /** Símbolo por capas: nombre e imagen de lo que se gana este día */
  pieceName: string | null;
  layerImage: string | null;
  theme: string | null;
  prayer: string | null;
  purpose: string | null;
  source: string | null;
  questions: AdminQuestion[];
  /** Cuántas preguntas le tocan a cada persona (sorteadas); null = todas */
  quizSize: number | null;
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
  earlyPhotos: boolean;
  /** Horario para subir fotos (hora de Ecuador); null = sin horario */
  photoStartHour: number | null;
  photoEndHour: number | null;
  symbolKind: SymbolKind;
  symbolName: string | null;
  symbolImage: string | null;
  pieceWord: string | null;
  piecesWord: string | null;
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
  /** Sale en el recuerdo de la portada */
  featured: boolean;
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
  p: Partial<Pick<AdminFiesta, "title" | "subtitle" | "intro" | "dailyPrayers" | "feastDate" | "published" | "earlyPhotos" | "photoStartHour" | "photoEndHour" | "symbolKind" | "symbolName" | "symbolImage" | "pieceWord" | "piecesWord">>,
) => (await api().put<AdminFiesta>(`/admin/fiestas/${id}`, p)).data;
export const updateDayAPI = async (dayId: string, p: Partial<Omit<AdminDay, "id" | "dayNumber" | "stats">>) =>
  (await api().put<AdminDay>(`/admin/fiestas/days/${dayId}`, p)).data;
export const createFiestaAPI = async (p: { title: string; slug: string; feastDate: string; symbolKind: SymbolKind }) =>
  (await api().post<AdminFiesta>("/admin/fiestas", p)).data;
export const deleteFiestaAPI = async (id: string) => {
  await api().delete(`/admin/fiestas/${id}`);
};
export const addDayAPI = async (id: string, p: { date: string; label: string }) =>
  (await api().post<AdminFiesta>(`/admin/fiestas/${id}/days`, p)).data;
export const deleteDayAPI = async (dayId: string) => (await api().delete<AdminFiesta>(`/admin/fiestas/days/${dayId}`)).data;
/** Sube una imagen del símbolo (base o capa) y devuelve su dirección */
export const uploadSymbolImageAPI = async (id: string, file: File) => {
  const body = new FormData();
  body.append("image", file);
  return (await api().post<{ url: string }>(`/admin/fiestas/${id}/image`, body)).data.url;
};
export interface CommunityRow {
  id: string;
  nombre: string;
  zona: string | null;
  /** Nombres de sus responsables */
  leads: string | null;
  mode: FiestaMode | null;
  /** Permiso especial para subir fuera del horario, hasta esta hora */
  openUntil: string | null;
  photoDays: number;
}
export const listCommunitiesAPI = async (id: string) => (await api().get<CommunityRow[]>(`/admin/fiestas/${id}/communities`)).data;
export const setCommunityAPI = async (id: string, comunidadId: string, p: { mode?: FiestaMode; open?: boolean }) =>
  (await api().put<CommunityRow[]>(`/admin/fiestas/${id}/communities/${comunidadId}`, p)).data;
/** Quita la foto de recuerdo de un joven (día de la fiesta) */
export const removeKeepsakeAPI = async (id: string, userId: string) => {
  await api().delete(`/admin/fiestas/${id}/recuerdos/${userId}`);
};
export const listPhotosAPI = async (id: string, status?: PhotoStatus) =>
  (await api().get<AdminPhoto[]>(`/admin/fiestas/${id}/photos`, { params: status ? { status } : {} })).data;
export const setPhotoFeaturedAPI = async (photoId: string, featured: boolean) =>
  (await api().patch(`/admin/fiestas/photos/${photoId}/featured`, { featured })).data;
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
