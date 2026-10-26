import { Metadata } from "next";
import BlogClient from "./BlogClient";
import { fetchInitialPosts, fetchPostCategories } from "@/lib/api/posts.server";
import { fetchSlotImages } from "@/lib/api/site-images.server";
import "./blog.css";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Comunidad JMV",
  description:
    "Momentos, testimonios y recursos que comparten jóvenes de Juventudes Marianas Vicencianas en todo el Ecuador.",
  keywords: ["JMV Ecuador", "blog", "comunidad", "jóvenes", "formación", "documentos"],
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  // Primera página y categorías en el servidor (ISR); el cliente sigue paginando
  const [initialPage, { scopes, activityTypes }, heroImages] = await Promise.all([
    fetchInitialPosts(),
    fetchPostCategories(),
    fetchSlotImages("blog.hero"),
  ]);

  return (
    <BlogClient
      initialPage={initialPage}
      initialScopes={scopes}
      initialActivityTypes={activityTypes}
      heroImages={heroImages}
    />
  );
}
