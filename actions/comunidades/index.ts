import { getAxiosClient } from "@/config/axios.config";
import type {
  ComunidadItem,
  ComunidadPayload,
} from "@/types/territory-management";

export async function getComunidadesAPI(): Promise<ComunidadItem[]> {
  const api = getAxiosClient();
  const { data } = await api.get("/comunidades");
  return data as ComunidadItem[];
}

export async function createComunidadAPI(
  payload: ComunidadPayload
): Promise<ComunidadItem> {
  const api = getAxiosClient();
  const { data } = await api.post("/comunidades", payload);
  return data as ComunidadItem;
}

export async function updateComunidadAPI(
  id: string,
  payload: Partial<ComunidadPayload>
): Promise<ComunidadItem> {
  const api = getAxiosClient();
  const { data } = await api.patch(`/comunidades/${id}`, payload);
  return data as ComunidadItem;
}

export async function deleteComunidadAPI(
  id: string
): Promise<{ message: string }> {
  const api = getAxiosClient();
  const { data } = await api.delete(`/comunidades/${id}`);
  return data as { message: string };
}

