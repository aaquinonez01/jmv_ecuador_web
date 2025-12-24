import axios, { AxiosInstance } from "axios";

function normalizeBaseUrl(raw?: string): string {
  const base = (raw || "http://localhost:3002").replace(/\/+$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
}

const baseURL = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL);

export function createApi(
  extraHeaders?: Record<string, string>
): AxiosInstance {
  return axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      ...(extraHeaders || {}),
    },
  });
}

export function getAxiosClient(): AxiosInstance {
  const instance = axios.create({
    baseURL,
  });

  instance.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token") || undefined;
      if (token) {
        config.headers = {
          ...(config.headers || {}),
          Authorization: `Bearer ${token}`,
        } as any;
      }
    }

    // Solo establecer Content-Type si no es FormData
    // FormData establece automáticamente el Content-Type correcto con boundary
    if (!(config.data instanceof FormData)) {
      config.headers = {
        ...(config.headers || {}),
        "Content-Type": "application/json",
      } as any;
    }

    return config;
  });

  return instance;
}
