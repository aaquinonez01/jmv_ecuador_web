import type { ContactPayload } from "@/lib/contactValidation";
import { whatsappLink } from "@/lib/whatsapp";

export interface ContactResult {
  ok: boolean;
  message: string;
  /** Enlace de WhatsApp como alternativa cuando el envío falla */
  whatsapp?: string;
}

/** Envía un mensaje a /api/contacto (formularios de Contacto y Únete) */
export async function sendContactMessage(payload: ContactPayload): Promise<ContactResult> {
  try {
    const res = await fetch("/api/contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = (await res.json().catch(() => null)) as Partial<ContactResult> | null;
    if (res.ok) {
      return { ok: true, message: json?.message || "Recibimos tu mensaje." };
    }
    return {
      ok: false,
      message: json?.message || "No pudimos enviar tu mensaje. Escríbenos por WhatsApp.",
      whatsapp: json?.whatsapp,
    };
  } catch {
    return {
      ok: false,
      message: "No hay conexión. Revisa tu internet o escríbenos por WhatsApp.",
      whatsapp: whatsappLink("Hola, quiero comunicarme con JMV Ecuador."),
    };
  }
}
