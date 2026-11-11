import { getAxiosClient } from "@/config/axios.config";
import type {
  FormationTopic,
  FormationTopicPayload,
  NationalTraining,
  NationalTrainingPayload,
  Prayer,
  PrayerPayload,
} from "@/types/formation";

// Formación de la app móvil: itinerarios, formaciones nacionales y oraciones (solo administradores)

const api = () => getAxiosClient();

export const getTopicsAPI = async () => (await api().get<FormationTopic[]>("/formation/admin/topics")).data;
export const getTopicAPI = async (id: string) => (await api().get<FormationTopic>(`/formation/admin/topics/${id}`)).data;
export const createTopicAPI = async (p: FormationTopicPayload) => (await api().post<FormationTopic>("/formation/admin/topics", p)).data;
export const updateTopicAPI = async (id: string, p: FormationTopicPayload) => (await api().patch<FormationTopic>(`/formation/admin/topics/${id}`, p)).data;
export const deleteTopicAPI = async (id: string) => { await api().delete(`/formation/admin/topics/${id}`); };

export const getTrainingsAPI = async () => (await api().get<NationalTraining[]>("/formation/admin/trainings")).data;
export const getTrainingAPI = async (id: string) => (await api().get<NationalTraining>(`/formation/admin/trainings/${id}`)).data;
export const createTrainingAPI = async (p: NationalTrainingPayload) => (await api().post<NationalTraining>("/formation/admin/trainings", p)).data;
export const updateTrainingAPI = async (id: string, p: NationalTrainingPayload) => (await api().patch<NationalTraining>(`/formation/admin/trainings/${id}`, p)).data;
export const deleteTrainingAPI = async (id: string) => { await api().delete(`/formation/admin/trainings/${id}`); };

/** Sube un PDF de material de apoyo (hasta 50 MB) y devuelve su nombre en el servidor */
export async function uploadMaterialAPI(file: File): Promise<{ fileName: string; size: number }> {
  const form = new FormData();
  form.append("file", file);
  return (await api().post("/formation/admin/materials", form)).data;
}

/** URL pública de un PDF subido */
export function materialFileUrl(fileName: string) {
  const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
  return `${base.endsWith("/api") ? base : `${base}/api`}/formation/materials/${fileName}`;
}

export const getPrayersAPI = async () => (await api().get<Prayer[]>("/formation/admin/prayers")).data;
export const createPrayerAPI = async (p: PrayerPayload) => (await api().post<Prayer>("/formation/admin/prayers", p)).data;
export const updatePrayerAPI = async (id: string, p: PrayerPayload) => (await api().patch<Prayer>(`/formation/admin/prayers/${id}`, p)).data;
export const deletePrayerAPI = async (id: string) => { await api().delete(`/formation/admin/prayers/${id}`); };

/** Mensaje legible de un error del backend (validaciones de NestJS) */
export function formationErrorMessage(error: unknown, fallback: string): string {
  const msg = (error as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join(". ");
  return msg || fallback;
}
