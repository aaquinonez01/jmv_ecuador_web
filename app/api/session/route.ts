import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { token } = await request.json();
  if (!token) {
    return NextResponse.json({ message: "Missing token" }, { status: 400 });
  }
  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return new NextResponse(null, { status: 204 });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  return new NextResponse(null, { status: 204 });
}
