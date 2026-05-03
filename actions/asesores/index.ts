import { getAxiosClient } from "@/config/axios.config";
import type { Asesor, AsesorPayload } from "@/types/consejo";

function appendText(
  formData: FormData,
  key: string,
  value?: string | number | boolean | null
) {
  if (value === undefined || value === null || value === "") return;
  formData.append(key, String(value));
}

function buildAsesorFormData(payload: AsesorPayload): FormData {
  const formData = new FormData();
  appendText(formData, "tipo", payload.tipo);
  appendText(formData, "nombre", payload.nombre);
  appendText(formData, "cargo", payload.cargo);
  appendText(formData, "comunidad", payload.comunidad);
  appendText(formData, "santoFavorito", payload.santoFavorito);
  appendText(formData, "citaBiblica", payload.citaBiblica);
  appendText(formData, "descripcion", payload.descripcion);
  appendText(formData, "email", payload.email);
  appendText(formData, "telefono", payload.telefono);
  appendText(formData, "fechaInicio", payload.fechaInicio);
  appendText(formData, "fechaFin", payload.fechaFin);
  appendText(formData, "active", payload.active as string | boolean | null);
  if (payload.image) {
    formData.append("image", payload.image);
  }
  return formData;
}

export async function getAsesoresActualesAPI(): Promise<Asesor[]> {
  const api = getAxiosClient();
  const { data } = await api.get("/asesores/actuales");
  return data as Asesor[];
}

export async function getAsesoresAPI(): Promise<Asesor[]> {
  const api = getAxiosClient();
  const { data } = await api.get("/asesores");
  return data as Asesor[];
}

export async function getAsesorAPI(id: string): Promise<Asesor> {
  const api = getAxiosClient();
  const { data } = await api.get(`/asesores/${id}`);
  return data as Asesor;
}

export async function createAsesorAPI(
  payload: AsesorPayload
): Promise<Asesor> {
  const api = getAxiosClient();
  const { data } = await api.post("/asesores", buildAsesorFormData(payload));
  return data as Asesor;
}

export async function updateAsesorAPI(
  id: string,
  payload: Partial<AsesorPayload>
): Promise<Asesor> {
  const api = getAxiosClient();
  const { data } = await api.patch(
    `/asesores/${id}`,
    buildAsesorFormData(payload as AsesorPayload)
  );
  return data as Asesor;
}

export async function deleteAsesorAPI(id: string) {
  const api = getAxiosClient();
  const { data } = await api.delete(`/asesores/${id}`);
  return data as { message: string };
}
