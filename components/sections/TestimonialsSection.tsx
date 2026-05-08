"use server";

import TestimonialsSectionClient from "./TestimonialsSectionClient";
import { ssrFetch } from "@/lib/helpers/apiBase";
import type {
  PaginatedResponse,
  TestimonialItem,
} from "@/types/activity-management";

export default async function TestimonialsSection() {
  let items: TestimonialItem[] = [];

  const res = await ssrFetch("/testimonials/public?limit=6", {
    revalidate: 300,
    tags: ["testimonials_home"],
  });
  if (res) {
    try {
      const data = (await res.json()) as PaginatedResponse<TestimonialItem>;
      items = data.items || [];
    } catch {
      items = [];
    }
  }

  return <TestimonialsSectionClient testimonials={items} />;
}
