import { SITE } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import { formatDate } from "@/lib/format";
import {
  ACCOUNT_TYPE_LABEL,
  type DonationAccount,
  type DonationCampaign,
  type DonationSettings,
} from "@/types/donations";

export const DEFAULT_HEADLINE = "Tu ayuda se vuelve servicio";
export const DEFAULT_INTRO =
  "Con tu aporte, jóvenes de todo Ecuador pueden formarse, encontrarse y servir a los más pobres. Cada dólar se convierte en un encuentro, una misión o un gesto de caridad.";
export const DEFAULT_CONTACT_NOTE = "¿Tienes dudas o necesitas un comprobante? Escríbenos.";
export const DONATION_WHATSAPP_TEXT = "Hola, tengo una consulta sobre las donaciones a JMV Ecuador";
export const IN_KIND_WHATSAPP_TEXT = "Hola, me gustaría donar víveres/ropa/útiles para JMV";

/** Número para wa.me: acepta "099 123 4567" (Ecuador) o "593991234567" */
export function normalizeWhatsapp(raw?: string | null) {
  const digits = (raw ?? "").replace(/\D/g, "");
  if (!digits) return SITE.whatsapp;
  if (digits.length === 10 && digits.startsWith("0")) return `593${digits.slice(1)}`;
  return digits;
}

export function donationContact(settings: DonationSettings | null) {
  const phone = normalizeWhatsapp(settings?.whatsapp);
  const email = settings?.email?.trim() || SITE.email;
  return {
    phone,
    email,
    whatsappHref: whatsappLink(DONATION_WHATSAPP_TEXT, phone),
    inKindHref: whatsappLink(IN_KIND_WHATSAPP_TEXT, phone),
    mailHref: `mailto:${email}?subject=${encodeURIComponent("Donaciones a JMV Ecuador")}`,
  };
}

/** "0000 0000 00": grupos de 4 para leer el número sin perderse */
export function groupDigits(value: string) {
  const compact = value.replace(/\s+/g, "");
  if (!/^\d+$/.test(compact)) return value;
  return compact.replace(/(\d{4})(?=\d)/g, "$1 ");
}

/** El número se copia sin espacios, listo para la app del banco */
export function compactNumber(value: string) {
  return value.replace(/\s+/g, "");
}

export function accountTypeLabel(type: DonationAccount["accountType"]) {
  return ACCOUNT_TYPE_LABEL[type] ?? type;
}

/** Texto para pegar en la app del banco o enviar por chat */
export function accountClipboardText(account: DonationAccount) {
  return [
    `Banco: ${account.bankName}`,
    `Tipo: ${accountTypeLabel(account.accountType)}`,
    `Número: ${compactNumber(account.accountNumber)}`,
    `Titular: ${account.holderName}`,
    account.holderId ? `Cédula/RUC: ${account.holderId}` : null,
    account.email ? `Correo: ${account.email}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function toNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

const money = (value: number) => {
  const decimals = Number.isInteger(value) ? 0 : 2;
  return `$${new Intl.NumberFormat("es-EC", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: "always",
  }).format(value)}`;
};

export function formatMoney(value: number | string | null | undefined) {
  const n = toNumber(value);
  return n === null ? "" : money(n);
}

/** Avance de la campaña; null si no tiene meta */
export function campaignProgress(campaign: DonationCampaign) {
  const goal = toNumber(campaign.goalAmount);
  if (!goal || goal <= 0) return null;
  const raised = Math.max(0, toNumber(campaign.raisedAmount) ?? 0);
  const percent = Math.round((raised / goal) * 100);
  return {
    goal,
    raised,
    percent,
    /** La barra no pasa del 100 % aunque se supere la meta */
    bar: Math.min(100, percent),
    label: `${money(raised)} de ${money(goal)} · ${percent} %`,
  };
}

export function campaignDates(campaign: DonationCampaign) {
  const { startsAt, endsAt } = campaign;
  if (startsAt && endsAt) return `Del ${formatDate(startsAt)} al ${formatDate(endsAt)}`;
  if (endsAt) return `Hasta el ${formatDate(endsAt)}`;
  if (startsAt) return `Desde el ${formatDate(startsAt)}`;
  return "";
}

/** next/image solo optimiza rutas locales y Cloudinary (ver next.config) */
export function isOptimizableImage(url: string) {
  return url.startsWith("/") || url.includes("res.cloudinary.com");
}
