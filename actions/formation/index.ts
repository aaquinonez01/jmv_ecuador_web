import { getAxiosClient } from "@/config/axios.config";
import type { FormationEncounter, FormationEncounterPayload } from "@/types/formation";

// Encuentros de formación de la app móvil (solo administradores)

export async function getFormationEncountersAPI(): Promise<FormationEncounter[]> {
  const { data } = await getAxiosClient().get("/formation/admin/encounters");
  return data as FormationEncounter[];
}

export async function getFormationEncounterAPI(id: string): Promise<FormationEncounter> {
  const { data } = await getAxiosClient().get(`/formation/admin/encounters/${id}`);
  return data as FormationEncounter;
}

export async function createFormationEncounterAPI(payload: FormationEncounterPayload): Promise<FormationEncounter> {
  const { data } = await getAxiosClient().post("/formation/admin/encounters", payload);
  return data as FormationEncounter;
}

export async function updateFormationEncounterAPI(id: string, payload: FormationEncounterPayload): Promise<FormationEncounter> {
  const { data } = await getAxiosClient().patch(`/formation/admin/encounters/${id}`, payload);
  return data as FormationEncounter;
}

export async function deleteFormationEncounterAPI(id: string): Promise<void> {
  await getAxiosClient().delete(`/formation/admin/encounters/${id}`);
}

/** Mensaje legible de un error del backend (validaciones de NestJS) */
export function formationErrorMessage(error: unknown, fallback: string): string {
  const msg = (error as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join(". ");
  return msg || fallback;
}
