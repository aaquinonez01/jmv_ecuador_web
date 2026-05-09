import { ssrFetch } from "@/lib/helpers/apiBase";
import type { Asesor, ConsejoPeriod, HomeAnnouncement } from "@/types/consejo";

export async function fetchConsejoActual(): Promise<ConsejoPeriod | null> {
  const res = await ssrFetch("/consejo-nacional/actual", {
    revalidate: 2592000,
    tags: ["consejo_actual"],
  });
  if (!res) return null;
  try {
    return (await res.json()) as ConsejoPeriod | null;
  } catch {
    return null;
  }
}

export async function fetchAsesoresActuales(): Promise<Asesor[]> {
  const res = await ssrFetch("/asesores/actuales", {
    revalidate: 2592000,
    tags: ["asesores_actuales"],
  });
  if (!res) return [];
  try {
    return (await res.json()) as Asesor[];
  } catch {
    return [];
  }
}

export async function fetchActiveAnnouncements(): Promise<HomeAnnouncement[]> {
  const res = await ssrFetch("/home-announcements/active", {
    revalidate: 3600,
    tags: ["home_announcements_active"],
  });
  if (!res) return [];
  try {
    return (await res.json()) as HomeAnnouncement[];
  } catch {
    return [];
  }
}
