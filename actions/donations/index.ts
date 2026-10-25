import { getAxiosClient } from "@/config/axios.config";
import type {
  DonationAccount,
  DonationAccountType,
  DonationCampaign,
  DonationPurpose,
  DonationSettings,
} from "@/types/donations";

export interface DonationSettingsPayload {
  headline?: string;
  intro?: string;
  contactNote?: string;
  whatsapp?: string | null;
  email?: string | null;
  paypalUrl?: string | null;
  qrLabel?: string | null;
  inKindNote?: string | null;
  transparencyNote?: string | null;
  qrImage?: File | null;
  removeQr?: boolean;
}

export interface DonationAccountPayload {
  bankName: string;
  accountType: DonationAccountType;
  accountNumber: string;
  holderName: string;
  holderId?: string | null;
  holderRole?: string | null;
  email?: string | null;
  notes?: string | null;
  active?: boolean;
  displayOrder?: number;
}

export interface DonationPurposePayload {
  title: string;
  description: string;
  icon: string;
  active?: boolean;
  displayOrder?: number;
  image?: File | null;
  removeImage?: boolean;
}

export interface DonationCampaignPayload {
  slug?: string;
  title: string;
  description: string;
  goalAmount?: number | null;
  raisedAmount?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  active?: boolean;
  displayOrder?: number;
  image?: File | null;
  removeImage?: boolean;
}

// Igual que en el Año Vicenciano: el backend convierte "" en null para borrar un campo opcional.
function buildFormData(payload: object, fileKey: string, removeKey: string): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || key === fileKey || key === removeKey) continue;
    formData.append(key, value === null ? "" : String(value));
  }
  const file = (payload as Record<string, unknown>)[fileKey];
  if (file instanceof File) formData.append(fileKey, file);
  if ((payload as Record<string, unknown>)[removeKey]) formData.append(removeKey, "true");
  return formData;
}

/** Las listas del admin pueden llegar como arreglo o como { items } */
function asItems<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  return ((data as { items?: T[] })?.items ?? []) as T[];
}

// --- Datos generales ---------------------------------------------------------

export async function getDonationSettingsAPI(): Promise<DonationSettings | null> {
  try {
    const { data } = await getAxiosClient().get("/donations/settings");
    return (data as DonationSettings) || null;
  } catch (error) {
    // Aún no se ha guardado nada: el formulario arranca con los textos por defecto
    if ((error as { response?: { status?: number } })?.response?.status === 404) return null;
    throw error;
  }
}

export async function updateDonationSettingsAPI(payload: DonationSettingsPayload): Promise<DonationSettings> {
  const { data } = await getAxiosClient().patch(
    "/donations/settings",
    buildFormData(payload, "qrImage", "removeQr")
  );
  return data as DonationSettings;
}

// --- Cuentas (JSON) ----------------------------------------------------------

export async function getDonationAccountsAPI(): Promise<DonationAccount[]> {
  const { data } = await getAxiosClient().get("/donations/accounts");
  return asItems<DonationAccount>(data);
}

export async function createDonationAccountAPI(payload: DonationAccountPayload): Promise<DonationAccount> {
  const { data } = await getAxiosClient().post("/donations/accounts", payload);
  return data as DonationAccount;
}

export async function updateDonationAccountAPI(
  id: string,
  payload: Partial<DonationAccountPayload>
): Promise<DonationAccount> {
  const { data } = await getAxiosClient().patch(`/donations/accounts/${id}`, payload);
  return data as DonationAccount;
}

export async function deleteDonationAccountAPI(id: string) {
  const { data } = await getAxiosClient().delete(`/donations/accounts/${id}`);
  return data as { message: string };
}

// --- En qué se usa (multipart con "image") -----------------------------------

export async function getDonationPurposesAPI(): Promise<DonationPurpose[]> {
  const { data } = await getAxiosClient().get("/donations/purposes");
  return asItems<DonationPurpose>(data);
}

export async function createDonationPurposeAPI(payload: DonationPurposePayload): Promise<DonationPurpose> {
  const { data } = await getAxiosClient().post(
    "/donations/purposes",
    buildFormData(payload, "image", "removeImage")
  );
  return data as DonationPurpose;
}

export async function updateDonationPurposeAPI(
  id: string,
  payload: Partial<DonationPurposePayload>
): Promise<DonationPurpose> {
  const { data } = await getAxiosClient().patch(
    `/donations/purposes/${id}`,
    buildFormData(payload, "image", "removeImage")
  );
  return data as DonationPurpose;
}

export async function deleteDonationPurposeAPI(id: string) {
  const { data } = await getAxiosClient().delete(`/donations/purposes/${id}`);
  return data as { message: string };
}

// --- Campañas (multipart con "image") ----------------------------------------

export async function getDonationCampaignsAPI(): Promise<DonationCampaign[]> {
  const { data } = await getAxiosClient().get("/donations/campaigns");
  return asItems<DonationCampaign>(data);
}

export async function createDonationCampaignAPI(payload: DonationCampaignPayload): Promise<DonationCampaign> {
  const { data } = await getAxiosClient().post(
    "/donations/campaigns",
    buildFormData(payload, "image", "removeImage")
  );
  return data as DonationCampaign;
}

export async function updateDonationCampaignAPI(
  id: string,
  payload: Partial<DonationCampaignPayload>
): Promise<DonationCampaign> {
  const { data } = await getAxiosClient().patch(
    `/donations/campaigns/${id}`,
    buildFormData(payload, "image", "removeImage")
  );
  return data as DonationCampaign;
}

export async function deleteDonationCampaignAPI(id: string) {
  const { data } = await getAxiosClient().delete(`/donations/campaigns/${id}`);
  return data as { message: string };
}

/** Mensaje de error del backend (class-validator devuelve un arreglo) */
export function donationsErrorMessage(error: unknown, fallback: string) {
  const message = (error as { response?: { data?: { message?: unknown } } })?.response?.data
    ?.message;
  if (Array.isArray(message)) return message.join(". ");
  if (typeof message === "string" && message) return message;
  return fallback;
}
