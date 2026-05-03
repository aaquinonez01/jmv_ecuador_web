import type { Asesor, ConsejoPeriod, HomeAnnouncement } from "@/types/consejo";

function getInternalBase(): string {
  return (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3002/api"
  ).replace(/\/+$/, "");
}

export async function fetchConsejoActual(): Promise<ConsejoPeriod | null> {
  const base = getInternalBase();
  try {
    const res = await fetch(`${base}/consejo-nacional/actual`, {
      next: { revalidate: 300, tags: ["consejo_actual"] },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as ConsejoPeriod | null;
    return data;
  } catch {
    return null;
  }
}

export async function fetchAsesoresActuales(): Promise<Asesor[]> {
  const base = getInternalBase();
  try {
    const res = await fetch(`${base}/asesores/actuales`, {
      next: { revalidate: 300, tags: ["asesores_actuales"] },
    });
    if (!res.ok) return [];
    return (await res.json()) as Asesor[];
  } catch {
    return [];
  }
}

export async function fetchActiveAnnouncements(): Promise<HomeAnnouncement[]> {
  const base = getInternalBase();
  try {
    const res = await fetch(`${base}/home-announcements/active`, {
      next: { revalidate: 120, tags: ["home_announcements_active"] },
    });
    if (!res.ok) return [];
    return (await res.json()) as HomeAnnouncement[];
  } catch {
    return [];
  }
}
