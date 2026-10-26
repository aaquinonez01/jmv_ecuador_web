import TestimonialsSectionClient from "./TestimonialsSectionClient";
import { ssrFetch } from "@/lib/helpers/apiBase";
import type {
  PaginatedResponse,
  TestimonialItem,
} from "@/types/activity-management";

// showInvite=false en el inicio: justo debajo va la invitación final con foto.
export default async function TestimonialsSection({ showInvite = true }: { showInvite?: boolean } = {}) {
  let items: TestimonialItem[] = [];

  const res = await ssrFetch("/testimonials/public?limit=6", {
    revalidate: 86400,
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

  return <TestimonialsSectionClient testimonials={items} showInvite={showInvite} />;
}
