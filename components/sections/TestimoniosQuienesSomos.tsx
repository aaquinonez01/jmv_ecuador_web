import TestimoniosQuienesSomosClient from "./TestimoniosQuienesSomosClient";
import { ssrFetch } from "@/lib/helpers/apiBase";
import type {
  PaginatedResponse,
  TestimonialItem,
} from "@/types/activity-management";

export default async function TestimoniosQuienesSomos() {
  let items: TestimonialItem[] = [];

  const res = await ssrFetch("/testimonials/public?limit=12", {
    revalidate: 259200,
    tags: ["testimonials_historia"],
  });
  if (res) {
    try {
      const data = (await res.json()) as PaginatedResponse<TestimonialItem>;
      items = data.items || [];
    } catch {
      items = [];
    }
  }

  return <TestimoniosQuienesSomosClient testimonios={items} />;
}
