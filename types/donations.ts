// Donaciones a JMV Ecuador. Son anónimas: no hay formulario de donante ni de recibo.
// Los datos de la cuenta son del Tesorero/a Nacional y cambian cada período del Consejo.

export type DonationAccountType = "ahorros" | "corriente";

/** Iconos lucide permitidos para "En qué se usa tu donación" (los mismos que valida el backend) */
export const DONATION_PURPOSE_ICONS = [
  "Heart",
  "HandHeart",
  "Users",
  "BookOpen",
  "Tent",
  "Church",
  "GraduationCap",
  "Gift",
  "Sparkles",
  "Globe",
] as const;

export type DonationPurposeIcon = (typeof DONATION_PURPOSE_ICONS)[number];

export interface DonationSettings {
  headline: string;
  intro: string;
  /** Ej. "¿Tienes dudas sobre tu donación? Escríbenos y te ayudamos." */
  contactNote: string;
  /** Número E.164 sin "+" (ej. 593991234567) */
  whatsapp?: string | null;
  email?: string | null;
  paypalUrl?: string | null;
  /** QR de transferencia (Cloudinary) */
  qrImageUrl?: string | null;
  /** Ej. "Deuna / app de tu banco" */
  qrLabel?: string | null;
  /** Donaciones en especie (víveres, ropa, útiles) */
  inKindNote?: string | null;
  transparencyNote?: string | null;
  updatedAt?: string;
}

export interface DonationAccount {
  id: string;
  bankName: string;
  accountType: DonationAccountType;
  accountNumber: string;
  holderName: string;
  /** Cédula o RUC */
  holderId?: string | null;
  /** Ej. "Tesorero/a Nacional" */
  holderRole?: string | null;
  email?: string | null;
  notes?: string | null;
  active: boolean;
  displayOrder: number;
}

export interface DonationPurpose {
  id: string;
  title: string;
  description: string;
  icon: DonationPurposeIcon | string;
  imageUrl?: string | null;
  active: boolean;
  displayOrder: number;
}

export interface DonationCampaign {
  id: string;
  slug: string;
  title: string;
  description: string;
  goalAmount?: number | string | null;
  raisedAmount?: number | string | null;
  currency: "USD";
  imageUrl?: string | null;
  /** Fecha solo día (ISO) */
  startsAt?: string | null;
  endsAt?: string | null;
  active: boolean;
  displayOrder: number;
}

export interface DonationsPublic {
  settings: DonationSettings | null;
  accounts: DonationAccount[];
  purposes: DonationPurpose[];
  campaigns: DonationCampaign[];
}

export const ACCOUNT_TYPE_LABEL: Record<DonationAccountType, string> = {
  ahorros: "Cuenta de ahorros",
  corriente: "Cuenta corriente",
};
