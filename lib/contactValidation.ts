import { z } from "zod";

export const contactSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
  email: z
    .string()
    .email("Correo electrónico inválido")
    .max(120, "El correo es demasiado largo"),
  asunto: z
    .string()
    .min(3, "El asunto debe tener al menos 3 caracteres")
    .max(150, "El asunto es demasiado largo"),
  mensaje: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(3000, "El mensaje es demasiado largo"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

