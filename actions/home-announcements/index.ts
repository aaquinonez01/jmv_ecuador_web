import { getAxiosClient } from "@/config/axios.config";
import type {
  HomeAnnouncement,
  HomeAnnouncementPayload,
} from "@/types/consejo";

function appendText(
  formData: FormData,
  key: string,
  value?: string | number | boolean | null
) {
  if (value === undefined || value === null || value === "") return;
  formData.append(key, String(value));
}

function buildAnnouncementFormData(
  payload: HomeAnnouncementPayload
): FormData {
  const formData = new FormData();
  appendText(formData, "titulo", payload.titulo);
  appendText(formData, "subtitulo", payload.subtitulo);
  appendText(formData, "mensaje", payload.mensaje);
  appendText(formData, "tipo", payload.tipo);
  appendText(formData, "ctaLabel", payload.ctaLabel);
  appendText(formData, "ctaUrl", payload.ctaUrl);
  appendText(formData, "fechaPublicacion", payload.fechaPublicacion);
  appendText(formData, "fechaExpiracion", payload.fechaExpiracion);
  appendText(
    formData,
    "displayOrder",
    payload.displayOrder as string | number | null
  );
  appendText(
    formData,
    "featuredInHome",
    payload.featuredInHome as string | boolean | null
  );
  appendText(formData, "active", payload.active as string | boolean | null);
  if (payload.image) {
    formData.append("image", payload.image);
  }
  return formData;
}

export async function getActiveAnnouncementsAPI(): Promise<HomeAnnouncement[]> {
  const api = getAxiosClient();
  const { data } = await api.get("/home-announcements/active");
  return data as HomeAnnouncement[];
}

export async function getAnnouncementsAPI(): Promise<HomeAnnouncement[]> {
  const api = getAxiosClient();
  const { data } = await api.get("/home-announcements");
  return data as HomeAnnouncement[];
}

export async function getAnnouncementAPI(
  id: string
): Promise<HomeAnnouncement> {
  const api = getAxiosClient();
  const { data } = await api.get(`/home-announcements/${id}`);
  return data as HomeAnnouncement;
}

export async function createAnnouncementAPI(
  payload: HomeAnnouncementPayload
): Promise<HomeAnnouncement> {
  const api = getAxiosClient();
  const { data } = await api.post(
    "/home-announcements",
    buildAnnouncementFormData(payload)
  );
  return data as HomeAnnouncement;
}

export async function updateAnnouncementAPI(
  id: string,
  payload: Partial<HomeAnnouncementPayload>
): Promise<HomeAnnouncement> {
  const api = getAxiosClient();
  const { data } = await api.patch(
    `/home-announcements/${id}`,
    buildAnnouncementFormData(payload as HomeAnnouncementPayload)
  );
  return data as HomeAnnouncement;
}

export async function deleteAnnouncementAPI(id: string) {
  const api = getAxiosClient();
  const { data } = await api.delete(`/home-announcements/${id}`);
  return data as { message: string };
}
