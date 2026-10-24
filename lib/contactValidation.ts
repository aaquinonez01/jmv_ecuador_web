import { z } from "zod";

// Esquemas compartidos por los formularios (cliente) y por /api/contacto (servidor).
// Los límites coinciden con CreateContactMessageDto del backend.

const nombre = z
  .string()
  .trim()
  .min(2, "Escribe tu nombre (al menos 2 letras)")
  .max(100, "El nombre es demasiado largo");

const email = z
  .string()
  .trim()
  .min(1, "Escribe tu correo electrónico")
  .email("Revisa tu correo, parece incompleto (ejemplo: nombre@correo.com)")
  .max(254, "El correo es demasiado largo");

const telefono = z
  .string()
  .trim()
  .max(30, "El número es demasiado largo")
  .regex(/^\+?[\d\s()-]{7,}$/, "Escribe un número válido, por ejemplo 099 123 4567");

const ciudad = z
  .string()
  .trim()
  .min(2, "Escribe tu ciudad")
  .max(100, "El nombre de la ciudad es demasiado largo");

/** Campo trampa para bots: en el formulario está oculto y debe llegar vacío */
const website = z.string().max(200).optional();

/** Campo opcional que acepta cadena vacía */
const optional = <T extends z.ZodTypeAny>(schema: T) =>
  z.union([z.literal(""), schema]).optional();

export const contactSchema = z.object({
  nombre,
  email,
  telefono: optional(telefono),
  asunto: z
    .string()
    .trim()
    .min(3, "Cuéntanos el motivo en pocas palabras (al menos 3 letras)")
    .max(150, "El asunto es demasiado largo"),
  mensaje: z
    .string()
    .trim()
    .min(10, "Tu mensaje es muy corto (al menos 10 caracteres)")
    .max(3000, "Tu mensaje es demasiado largo (máximo 3000 caracteres)"),
  website,
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const uneteSchema = z.object({
  nombre,
  email,
  ciudad,
  edad: optional(
    z
      .string()
      .trim()
      .regex(/^\d{1,2}$/, "Escribe tu edad en números")
      .refine((v) => Number(v) >= 12, "Escribe una edad válida"),
  ),
  whatsapp: telefono,
  mensaje: optional(z.string().trim().max(1000, "Tu mensaje es demasiado largo (máximo 1000 caracteres)")),
  website,
});

export type UneteFormData = z.infer<typeof uneteSchema>;

export const ORIGENES_CONTACTO = ["contacto", "unete"] as const;
export type OrigenContacto = (typeof ORIGENES_CONTACTO)[number];

/** Cuerpo que acepta /api/contacto y que se reenvía a POST /contact-messages */
export const contactPayloadSchema = contactSchema.extend({
  ciudad: optional(ciudad),
  origen: z.enum(ORIGENES_CONTACTO).optional(),
});

export type ContactPayload = z.infer<typeof contactPayloadSchema>;

/** Convierte el formulario "Quiero unirme" en un mensaje de contacto */
export function buildUnetePayload(data: UneteFormData): ContactPayload {
  const lineas = [
    `Quiero unirme a una comunidad JMV en ${data.ciudad}.`,
    data.edad ? `Edad: ${data.edad} años` : null,
    `WhatsApp: ${data.whatsapp}`,
    data.mensaje ? `\n${data.mensaje}` : null,
  ].filter(Boolean);

  return {
    nombre: data.nombre,
    email: data.email,
    telefono: data.whatsapp,
    ciudad: data.ciudad,
    asunto: `Quiero unirme a JMV (${data.ciudad})`.slice(0, 150),
    mensaje: lineas.join("\n"),
    origen: "unete",
    website: data.website,
  };
}
