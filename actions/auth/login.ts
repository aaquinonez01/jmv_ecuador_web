"use server";

import { createApi } from "@/config/axios.config";

export const login = async (email: string, password: string) => {
  const api = createApi();
  const { data } = await api.post("/auth/login", { email, password });
  const token: string = data.token;
  const user = data.user;
  await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  return { user };
};
