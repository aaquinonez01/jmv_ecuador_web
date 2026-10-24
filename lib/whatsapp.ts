import { SITE } from "./site";

/** Enlace para escribir a JMV Ecuador por WhatsApp, con mensaje opcional */
export function whatsappLink(text?: string, phone: string = SITE.whatsapp) {
  const base = `https://wa.me/${phone.replace(/\D/g, "")}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Enlace para compartir un texto (y URL) en WhatsApp sin destinatario fijo */
export function whatsappShareLink(text: string, url?: string) {
  const message = url ? `${text}\n${url}` : text;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
