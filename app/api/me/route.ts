import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createApi } from "@/config/axios.config";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 200 });

    const api = createApi({ Authorization: `Bearer ${token}` });
    const { data } = await api.get("/auth/me");
    return NextResponse.json({ user: data.user ?? null }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
