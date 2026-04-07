"use server";

import TestimonialsSectionClient from "./TestimonialsSectionClient";
import type {
  PaginatedResponse,
  TestimonialItem,
} from "@/types/activity-management";

export default async function TestimonialsSection() {
  const base = (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3002/api"
  ).replace(/\/+$/, "");

  let items: TestimonialItem[] = [];

  try {
    const res = await fetch(`${base}/testimonials/public?limit=6`, {
      next: { revalidate: 300, tags: ["testimonials_home"] },
    });

    if (!res.ok) {
      throw new Error("No se pudieron cargar testimonios");
    }

    const data = (await res.json()) as PaginatedResponse<TestimonialItem>;
    items = data.items || [];
  } catch {
    items = [];
  }

  return <TestimonialsSectionClient testimonials={items} />;
}
