import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

// Webhook llamado por el backend tras cada cambio en el admin.
export async function POST(req: NextRequest) {
  const token = req.headers.get("x-revalidate-token");
  if (!process.env.REVALIDATE_TOKEN || token !== process.env.REVALIDATE_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const tags: string[] = Array.isArray(body?.tags) ? body.tags : [];
    const paths: string[] = Array.isArray(body?.paths) ? body.paths : [];
    // "max" = stale-while-revalidate: la siguiente visita recibe la versión en
    // caché al instante y dispara la regeneración en segundo plano; la siguiente
    // ya ve el cambio. Si el backend fallara en ese momento, se sigue sirviendo
    // la versión anterior en vez de un error.
    for (const t of tags) revalidateTag(t, "max");
    for (const p of paths) revalidatePath(p);
    return NextResponse.json({ revalidated: true, tags, paths });
  } catch {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}
