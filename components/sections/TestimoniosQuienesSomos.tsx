import TestimoniosQuienesSomosClient from "./TestimoniosQuienesSomosClient";
import type {
  PaginatedResponse,
  TestimonialItem,
} from "@/types/activity-management";

export default async function TestimoniosQuienesSomos() {
  const base = (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3002/api"
  ).replace(/\/+$/, "");

  let items: TestimonialItem[] = [];

  try {
    const res = await fetch(`${base}/testimonials/public?limit=12`, {
      next: { revalidate: 300, tags: ["testimonials_historia"] },
    });

    if (res.ok) {
      const data = (await res.json()) as PaginatedResponse<TestimonialItem>;
      items = data.items || [];
    }
  } catch {
    items = [];
  }

  return <TestimoniosQuienesSomosClient testimonios={items} />;
}
