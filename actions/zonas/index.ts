import { getAxiosClient } from "@/config/axios.config";
import type { ZonaItem, ZonaPayload } from "@/types/territory-management";

export async function getZonasAPI(): Promise<ZonaItem[]> {
  const api = getAxiosClient();
  const { data } = await api.get("/zonas");
  return data as ZonaItem[];
}

export async function createZonaAPI(payload: ZonaPayload): Promise<ZonaItem> {
  const api = getAxiosClient();
  const { data } = await api.post("/zonas", payload);
  return data as ZonaItem;
}

export async function updateZonaAPI(
  id: string,
  payload: Partial<ZonaPayload>
): Promise<ZonaItem> {
  const api = getAxiosClient();
  const { data } = await api.patch(`/zonas/${id}`, payload);
  return data as ZonaItem;
}

export async function deleteZonaAPI(id: string): Promise<{ message: string }> {
  const api = getAxiosClient();
  const { data } = await api.delete(`/zonas/${id}`);
  return data as { message: string };
}

