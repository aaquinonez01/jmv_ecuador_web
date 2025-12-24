"use server";

import { createApi } from "@/config/axios.config";

export async function getUserById(userId: string) {
  try {
    const api = createApi();
    // Por ahora solo soportamos "me" o el endpoint futuro GET /auth/users/:id
    if (userId === "me") {
      // Necesitamos el token, pero en server no tenemos acceso a localStorage
      // Esto debería llamarse desde el cliente
      return null;
    }

    // TODO: crear endpoint GET /auth/users/:id en backend
    return null;
  } catch {
    return null;
  }
}
