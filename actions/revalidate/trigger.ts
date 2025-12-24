export async function triggerRevalidate(input: { tags?: string[]; paths?: string[] }) {
  const token = process.env.REVALIDATE_TOKEN;
  const url = "/api/revalidate";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-revalidate-token": token || "",
    },
    body: JSON.stringify({ tags: input.tags || [], paths: input.paths || [] }),
  });
  if (!res.ok) {
    // swallow error to not block admin UX
    return { ok: false };
  }
  return { ok: true };
}

