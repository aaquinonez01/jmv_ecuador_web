// Schema de validación con Zod
import * as z from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Escribe tu correo electrónico")
    .email("Revisa tu correo: debe tener el formato nombre@ejemplo.com"),
  password: z.string().min(1, "Escribe tu contraseña"),
});

export type SignInFormData = z.infer<typeof signInSchema>;
