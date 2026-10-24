import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { fetchPost } from "@/lib/api/posts.server";
import { postHeading } from "@/lib/blog/posts";
import PostDetail from "./PostDetail";
import "../blog.css";

export const revalidate = 60;

type Params = Promise<{ id: string }>;

// generateMetadata y la página comparten la misma petición
const getPost = cache(fetchPost);

function excerpt(text: string) {
  const clean = text.trim().replace(/\s+/g, " ");
  return clean.length > 160 ? `${clean.slice(0, 157).trimEnd()}…` : clean;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return { title: "Publicación no encontrada", robots: { index: false } };

  const title = postHeading(post);
  const description = excerpt(post.content) || "Una publicación de la Comunidad JMV Ecuador.";
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.id}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${post.id}`,
      publishedTime: post.createdAt || undefined,
      ...(post.images[0] ? { images: [{ url: post.images[0] }] } : {}),
    },
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();
  return <PostDetail post={post} />;
}
