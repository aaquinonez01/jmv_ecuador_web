import TestimonialsSectionClient from "./TestimonialsSectionClient";
import { ssrFetch } from "@/lib/helpers/apiBase";
import type {
  PaginatedResponse,
  TestimonialItem,
} from "@/types/activity-management";

// Testimonios de /quienes-somos: reutiliza el carrusel accesible de inicio con
// más elementos (la etiqueta de caché se mantiene para la revalidación del admin).
export default async function TestimoniosQuienesSomos() {
  let items: TestimonialItem[] = [];

  const res = await ssrFetch("/testimonials/public?limit=12", {
    revalidate: 86400,
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

  return <TestimonialsSectionClient testimonials={items} />;
}
