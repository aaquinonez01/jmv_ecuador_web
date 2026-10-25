"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostAuthorLine, PostBadges } from "@/components/blog/PostMeta";
import PostContent from "@/components/blog/PostContent";
import PostImagesGrid from "@/components/blog/PostImagesGrid";
import ShareButton from "@/components/blog/ShareButton";
import { usePostViewer } from "@/components/blog/usePostViewer";
import { postHeading } from "@/lib/blog/posts";
import type { Post } from "@/types/user";

// Página propia de una publicación: es la URL que se comparte por WhatsApp
export default function PostDetail({ post }: { post: Post }) {
  const { showImage, viewer } = usePostViewer();

  // Claro: banda marfil y fondo bg-page. Oscuro: la banda tinta translúcida y
  // el fondo slate-100 de siempre. La tarjeta es una isla blanca fija.
  return (
    <div className="min-h-screen overflow-x-hidden bg-page dark:bg-slate-100">
      <div className="relative border-b border-line bg-hero-plain pt-20 sm:pt-24 dark:border-b-0 dark:bg-none">
        <div className="absolute inset-0 hidden bg-gradient-jmv dark:block" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 py-3 sm:px-6">
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-semibold text-accent-blue hover:bg-surface-2 dark:text-white dark:hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver a la Comunidad JMV
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-8">
        <article
          className="blog-content rounded-2xl border border-slate-200 bg-white shadow-sm"
          data-surface="light"
        >
          <div className="space-y-5 p-4 sm:p-6">
            <PostAuthorLine post={post} />
            <h1 className="text-2xl leading-snug font-bold text-gray-900 sm:text-3xl">
              {postHeading(post)}
            </h1>
            <PostContent post={post} />
            <PostImagesGrid
              post={post}
              max={6}
              onOpen={(index) => showImage(post, index)}
            />
            <PostBadges post={post} />
          </div>
          <div className="border-t border-slate-100 px-2 py-1 sm:px-3">
            <ShareButton post={post} />
          </div>
        </article>
      </div>
      {viewer}
    </div>
  );
}
