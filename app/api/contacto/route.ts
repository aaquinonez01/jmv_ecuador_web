import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    return NextResponse.json({ ok: true, message: "Mensaje recibido." }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Error procesando la solicitud",
      },
      { status: 500 }
    );
  }
}
