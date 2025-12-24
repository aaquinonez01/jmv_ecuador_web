import { cookies } from "next/headers";
import { createApi } from "@/config/axios.config";
import Header from "./Header";

export default async function HeaderServer() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const api = createApi(
    token ? { Authorization: `Bearer ${token}` } : undefined
  );
  let user: any = null;
  try {
    const { data } = await api.get("/auth/me");
    user = data.user;
  } catch {}

  return <Header initialUser={user ?? undefined} />;
}
