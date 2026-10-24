import { NextResponse } from "next/server";
import { contactPayloadSchema } from "@/lib/contactValidation";
import { getApiBase } from "@/lib/helpers/apiBase";
import { clientIpHeaders } from "@/lib/helpers/client-ip";
import { whatsappLink } from "@/lib/whatsapp";

// Valida el formulario en el servidor y lo reenvía a POST /contact-messages del
// backend, devolviendo al navegador errores reales (validación, límite, caída).

const WHATSAPP_FALLBACK = whatsappLink(
  "Hola, intenté escribirles desde la web de JMV y no se envió mi mensaje.",
);

function fail(status: number, message: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, message, ...extra }, { status });
}

function serviceDown() {
  return fail(503, "No pudimos enviar tu mensaje. Escríbenos por WhatsApp.", {
    whatsapp: WHATSAPP_FALLBACK,
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "No pudimos leer el formulario. Recarga la página e inténtalo de nuevo.");
  }

  const parsed = contactPayloadSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const first = parsed.error.issues[0]?.message ?? "Revisa los datos del formulario.";
    return fail(400, first, { errors: fieldErrors });
  }

  const { website, telefono, ciudad, ...rest } = parsed.data;
  const payload = {
    ...rest,
    ...(telefono ? { telefono } : {}),
    ...(ciudad ? { ciudad } : {}),
    ...(website ? { website } : {}),
  };

  let res: Response;
  try {
    res = await fetch(`${getApiBase()}/contact-messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...clientIpHeaders(request) },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    return serviceDown();
  }

  if (res.ok) {
    return NextResponse.json(
      { ok: true, message: "Recibimos tu mensaje. Te responderemos lo antes posible." },
      { status: 201 },
    );
  }

  if (res.status === 429) {
    return fail(429, "Has enviado varios mensajes, intenta en unos minutos.", {
      whatsapp: WHATSAPP_FALLBACK,
    });
  }

  if (res.status === 400) {
    const data = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
    const message = Array.isArray(data?.message) ? data.message.join(". ") : data?.message;
    return fail(400, message || "Revisa los datos del formulario.");
  }

  return serviceDown();
}
