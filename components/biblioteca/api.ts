"use client";

import { publicApiBase } from "./shared";

/** Cuenta una vista (una vez por pestaña y documento). Si falla, no pasa nada. */
export function countView(id: string) {
  const key = `jmv-biblioteca-vista-${id}`;
  try {
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "1");
  } catch {}
  fetch(`${publicApiBase()}/library/documents/${encodeURIComponent(id)}/view`, {
    method: "POST",
    keepalive: true,
  }).catch(() => {});
}

// Una petición por documento y token aunque la pidan la ficha y el video
const memberLinks = new Map<string, Promise<string>>();

/** URL de un enlace o video para miembros: la API solo la entrega con sesión */
export function fetchMemberLink(id: string, token: string) {
  const key = `${id}:${token}`;
  let pending = memberLinks.get(key);
  if (!pending) {
    pending = fetch(`${publicApiBase()}/library/documents/${encodeURIComponent(id)}/link`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }).then(async (res) => {
      if (res.status === 401 || res.status === 403) throw new Error("auth");
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { url?: string };
      if (!data.url) throw new Error("vacio");
      return data.url;
    });
    pending.catch(() => memberLinks.delete(key));
    memberLinks.set(key, pending);
  }
  return pending;
}

/** URL del archivo con ?download=1 (el backend lo envía como adjunto y cuenta la descarga) */
export function downloadHref(fileHref: string) {
  try {
    const u = new URL(fileHref);
    u.searchParams.set("download", "1");
    return u.toString();
  } catch {
    return `${fileHref}${fileHref.includes("?") ? "&" : "?"}download=1`;
  }
}

/** Descarga con token (documentos para miembros): fetch + blob + enlace temporal */
export async function downloadWithToken(fileHref: string, token: string, filename: string) {
  const res = await fetch(downloadHref(fileHref), { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 401 || res.status === 403) throw new Error("auth");
  if (!res.ok) throw new Error(String(res.status));
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
