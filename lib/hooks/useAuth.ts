"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { getAxiosClient } from "@/config/axios.config";
import { getToken } from "@/lib/auth/token";

export function useAuth() {
  const { user, setUser, clear } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = getToken();
        if (!token) {
          if (mounted) clear();
          return;
        }
        const api = getAxiosClient();
        const { data } = await api.get("/auth/me");
        if (!mounted) return;
        if (data?.user) setUser(data.user);
        else clear();
      } catch {
        if (mounted) clear();
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [setUser, clear]);

  return { user, loading };
}
