"use client";

import { getAxiosClient } from "@/config/axios.config";
import { removeToken, setToken } from "@/lib/auth/token";
import type {
  DayResult,
  FiestaDayContent,
  FiestaMe,
  FiestaMode,
  FiestaPhoto,
  FiestaPublic,
  FiestaRanking,
  MyCommunity,
  Reaction,
} from "./types";

const api = () => getAxiosClient();
const base = (slug: string) => `/fiestas/${encodeURIComponent(slug)}`;

export const hasSession = () => {
  try {
    return Boolean(localStorage.getItem("auth_token"));
  } catch {
    return false;
  }
};

export async function getFiesta(slug: string) {
  return (await api().get<FiestaPublic>(base(slug))).data;
}

/** `preview`: los administradores abren cualquier día antes de su fecha */
export async function getDay(slug: string, n: number, preview = false) {
  return (await api().get<FiestaDayContent>(`${base(slug)}/days/${n}${preview ? "/preview" : ""}`)).data;
}

/** Administradores: borra su avance de prueba */
export async function resetMine(slug: string) {
  await api().delete(`${base(slug)}/me`);
}

/** Mi avance; null si no hay sesión o expiró */
export async function getMe(slug: string): Promise<FiestaMe | null> {
  if (!hasSession()) return null;
  try {
    return (await api().get<FiestaMe>(`${base(slug)}/me`)).data;
  } catch (e) {
    if (statusOf(e) === 401) removeToken();
    return null;
  }
}

export async function getResult(slug: string, n: number): Promise<DayResult | null> {
  if (!hasSession()) return null;
  try {
    return (await api().get<DayResult>(`${base(slug)}/days/${n}/result`)).data;
  } catch {
    return null;
  }
}

export async function sendAnswers(slug: string, n: number, answers: number[]) {
  return (await api().post<DayResult>(`${base(slug)}/days/${n}/answers`, { answers })).data;
}

export async function markPurpose(slug: string, n: number) {
  return (await api().post<{ purposeDone: boolean; points: number }>(`${base(slug)}/days/${n}/purpose`)).data;
}

export async function getRanking(slug: string) {
  return (await api().get<FiestaRanking>(`${base(slug)}/ranking`)).data;
}

export async function getPhotos(slug: string, day?: number) {
  return (await api().get<FiestaPhoto[]>(`${base(slug)}/photos`, { params: day ? { day } : {} })).data;
}

export async function getMyReactions(slug: string) {
  if (!hasSession()) return [];
  try {
    return (await api().get<{ photoId: string; emoji: Reaction }[]>(`${base(slug)}/my-reactions`)).data;
  } catch {
    return [];
  }
}

export async function react(photoId: string, emoji: Reaction) {
  return (await api().post<{ reacted: boolean; reactions: Partial<Record<Reaction, number>> }>(
    `/fiestas/photos/${photoId}/react`,
    { emoji },
  )).data;
}

export async function getMyCommunity(slug: string) {
  return (await api().get<MyCommunity>(`${base(slug)}/comunidad`)).data;
}

export async function setMode(slug: string, mode: FiestaMode) {
  return (await api().put<{ mode: FiestaMode }>(`${base(slug)}/comunidad/mode`, { mode })).data;
}

export async function uploadPhotos(slug: string, n: number, files: File[], caption: string) {
  const form = new FormData();
  files.forEach((f) => form.append("photos", f));
  if (caption.trim()) form.append("caption", caption.trim());
  return (await api().post<{ uploaded: number; failed: number }>(`${base(slug)}/days/${n}/photos`, form)).data;
}

export async function removeMyPhoto(photoId: string) {
  await api().delete(`/fiestas/photos/${photoId}`);
}

// ── Cuenta ──

export interface ComunidadOption {
  id: string;
  nombre: string;
  ciudad?: string | null;
  zona?: { id: string; nombre: string } | null;
}

// Se piden una sola vez y en cuanto carga la página: al abrir el registro ya están listas
let comunidadesCache: Promise<ComunidadOption[]> | null = null;
export function getComunidades() {
  comunidadesCache ??= api()
    .get<ComunidadOption[]>("/comunidades")
    .then((r) => r.data.filter((c) => c.nombre))
    .catch((e) => {
      comunidadesCache = null;
      throw e;
    });
  return comunidadesCache;
}

function startSession(token: string) {
  setToken(token);
  // La cookie de la web se guarda en segundo plano: no hace esperar al joven
  void fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
    keepalive: true,
  }).catch(() => null);
}

export async function login(email: string, password: string) {
  const { data } = await api().post<{ token: string }>("/auth/login", { email: email.trim(), password });
  if (!data?.token) throw new Error("Sin token");
  startSession(data.token);
}

export async function register(p: { fullName: string; email: string; password: string; comunidadId: string }) {
  const { data } = await api().post<{ token: string }>("/auth/register", {
    fullName: p.fullName.trim(),
    email: p.email.trim().toLowerCase(),
    password: p.password,
    comunidadId: p.comunidadId,
  });
  if (!data?.token) throw new Error("Sin token");
  startSession(data.token);
}

export async function logout() {
  removeToken();
  await fetch("/api/session", { method: "DELETE" }).catch(() => null);
}

// ── Errores ──

export function statusOf(e: unknown): number | undefined {
  return (e as { response?: { status?: number } })?.response?.status;
}

export function errorMessage(e: unknown, fallback = "Algo salió mal. Inténtalo de nuevo.") {
  const err = e as { response?: { status?: number; data?: { message?: unknown } }; request?: unknown };
  if (!err?.response && err?.request) return "No pudimos conectar. Revisa tu internet e inténtalo de nuevo.";
  if (err?.response?.status === 429) return "Fueron muchos intentos seguidos. Espera un minuto.";
  const m = err?.response?.data?.message;
  if (typeof m === "string") return m;
  if (Array.isArray(m) && typeof m[0] === "string") return m[0];
  return fallback;
}
