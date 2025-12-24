"use server";

import { redirect } from "next/navigation";

export const logout = async () => {
  await fetch("/api/session", { method: "DELETE" });
  redirect("/");
};
