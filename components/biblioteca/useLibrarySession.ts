"use client";

import { useEffect, useState } from "react";

// ¿Hay sesión en este navegador? El token vive en localStorage "auth_token"
// (lo usa config/axios.config.ts). Si el JWT ya venció, cuenta como sin sesión.

export type SessionState = { status: "loading" | "out"; token: null } | { status: "in"; token: string };

function tokenExpired(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" && payload.exp * 1000 < Date.now();
  } catch {
    return false;
  }
}

export function readSessionToken(): string | null {
  try {
    const token = window.localStorage.getItem("auth_token");
    return token && !tokenExpired(token) ? token : null;
  } catch {
    return null;
  }
}

export function useLibrarySession(): SessionState {
  const [state, setState] = useState<SessionState>({ status: "loading", token: null });
  useEffect(() => {
    const check = () => {
      const token = readSessionToken();
      setState(token ? { status: "in", token } : { status: "out", token: null });
    };
    check();
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === "auth_token") check();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return state;
}
