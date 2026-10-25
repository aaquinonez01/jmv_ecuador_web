import { ssrFetch } from "@/lib/helpers/apiBase";
import type { DonationsPublic } from "@/types/donations";

// El backend invalida este tag al guardar cualquier cambio de donaciones en el admin.
export const DONATIONS_TAG = "donations";

const EMPTY: DonationsPublic = { settings: null, accounts: [], purposes: [], campaigns: [] };

/** Configuración pública: datos generales, cuentas, usos y campañas activas */
export async function fetchDonationsPublic(): Promise<DonationsPublic> {
  const res = await ssrFetch("/donations/public", {
    revalidate: 3600,
    tags: [DONATIONS_TAG],
  });
  if (!res) return EMPTY;
  try {
    const data = (await res.json()) as Partial<DonationsPublic>;
    return {
      settings: data.settings ?? null,
      accounts: data.accounts ?? [],
      purposes: data.purposes ?? [],
      campaigns: data.campaigns ?? [],
    };
  } catch {
    return EMPTY;
  }
}
