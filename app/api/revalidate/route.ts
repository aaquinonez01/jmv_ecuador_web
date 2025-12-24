import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  const token = req.headers.get("x-revalidate-token") || req.nextUrl.searchParams.get("token");
  if (!token || token !== process.env.REVALIDATE_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const tags: string[] = Array.isArray(body?.tags) ? body.tags : [];
    const paths: string[] = Array.isArray(body?.paths) ? body.paths : [];
    for (const t of tags) revalidateTag(t);
    for (const p of paths) revalidatePath(p);
    return NextResponse.json({ revalidated: true, tags, paths });
  } catch (e) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}

