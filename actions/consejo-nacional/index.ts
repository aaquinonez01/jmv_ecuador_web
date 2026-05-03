import { getAxiosClient } from "@/config/axios.config";
import type {
  ConsejoMember,
  ConsejoMemberPayload,
  ConsejoPeriod,
  ConsejoPeriodPayload,
} from "@/types/consejo";

function appendText(
  formData: FormData,
  key: string,
  value?: string | number | boolean | null
) {
  if (value === undefined || value === null || value === "") return;
  formData.append(key, String(value));
}

function normalizePeriodPayload(payload: Partial<ConsejoPeriodPayload>) {
  const out: Record<string, unknown> = { ...payload };
  if (out.active !== undefined && out.active !== null) {
    out.active = String(out.active);
  }
  return out;
}

function buildMemberFormData(payload: ConsejoMemberPayload): FormData {
  const formData = new FormData();
  appendText(formData, "nombre", payload.nombre);
  appendText(formData, "cargo", payload.cargo);
  appendText(formData, "tipoCargo", payload.tipoCargo);
  appendText(formData, "edad", payload.edad as string | number | null);
  appendText(formData, "comunidad", payload.comunidad);
  appendText(formData, "santoFavorito", payload.santoFavorito);
  appendText(formData, "citaBiblica", payload.citaBiblica);
  appendText(formData, "descripcion", payload.descripcion);
  appendText(formData, "email", payload.email);
  appendText(formData, "telefono", payload.telefono);
  appendText(formData, "fechaPosesion", payload.fechaPosesion);
  appendText(formData, "fechaFinCargo", payload.fechaFinCargo);
  appendText(
    formData,
    "displayOrder",
    payload.displayOrder as string | number | null
  );
  appendText(formData, "active", payload.active as string | boolean | null);
  if (payload.image) {
    formData.append("image", payload.image);
  }
  return formData;
}

export async function getConsejoActualAPI(): Promise<ConsejoPeriod | null> {
  const api = getAxiosClient();
  const { data } = await api.get("/consejo-nacional/actual");
  return data as ConsejoPeriod | null;
}

export async function getConsejoPeriodsAPI(): Promise<ConsejoPeriod[]> {
  const api = getAxiosClient();
  const { data } = await api.get("/consejo-nacional/periods");
  return data as ConsejoPeriod[];
}

export async function getConsejoPeriodAPI(
  id: string
): Promise<ConsejoPeriod> {
  const api = getAxiosClient();
  const { data } = await api.get(`/consejo-nacional/periods/${id}`);
  return data as ConsejoPeriod;
}

export async function createConsejoPeriodAPI(
  payload: ConsejoPeriodPayload
): Promise<ConsejoPeriod> {
  const api = getAxiosClient();
  const { data } = await api.post(
    "/consejo-nacional/periods",
    normalizePeriodPayload(payload)
  );
  return data as ConsejoPeriod;
}

export async function updateConsejoPeriodAPI(
  id: string,
  payload: Partial<ConsejoPeriodPayload>
): Promise<ConsejoPeriod> {
  const api = getAxiosClient();
  const { data } = await api.patch(
    `/consejo-nacional/periods/${id}`,
    normalizePeriodPayload(payload)
  );
  return data as ConsejoPeriod;
}

export async function deleteConsejoPeriodAPI(id: string) {
  const api = getAxiosClient();
  const { data } = await api.delete(`/consejo-nacional/periods/${id}`);
  return data as { message: string };
}

export async function createConsejoMemberAPI(
  periodId: string,
  payload: ConsejoMemberPayload
): Promise<ConsejoMember> {
  const api = getAxiosClient();
  const { data } = await api.post(
    `/consejo-nacional/periods/${periodId}/members`,
    buildMemberFormData(payload)
  );
  return data as ConsejoMember;
}

export async function updateConsejoMemberAPI(
  id: string,
  payload: Partial<ConsejoMemberPayload>
): Promise<ConsejoMember> {
  const api = getAxiosClient();
  const { data } = await api.patch(
    `/consejo-nacional/members/${id}`,
    buildMemberFormData(payload as ConsejoMemberPayload)
  );
  return data as ConsejoMember;
}

export async function deleteConsejoMemberAPI(id: string) {
  const api = getAxiosClient();
  const { data } = await api.delete(`/consejo-nacional/members/${id}`);
  return data as { message: string };
}
