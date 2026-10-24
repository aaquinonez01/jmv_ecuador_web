"use client";

import { useId } from "react";
import { ArrowRight } from "lucide-react";
import { postHeading } from "@/lib/blog/posts";
import type { Post } from "@/types/user";
import { PostAuthorLine, PostBadges } from "./PostMeta";
import PostContent from "./PostContent";
import PostImagesGrid from "./PostImagesGrid";
import ShareButton from "./ShareButton";

interface BlogPostProps {
  post: Post;
  onOpen: (post: Post) => void;
  onOpenImage: (post: Post, index: number) => void;
  now?: Date;
}

// Tarjeta del feed: <article> semántico. Toda la tarjeta abre la publicación
// gracias al pseudo-elemento del botón "Ver publicación"; fotos y "Compartir"
// quedan por encima (z-10) con su propia acción.
export default function BlogPost({ post, onOpen, onOpenImage, now }: BlogPostProps) {
  const titleId = useId();
  const heading = postHeading(post);

  return (
    <article
      id={`publicacion-${post.id}`}
      aria-labelledby={titleId}
      className="blog-content relative scroll-mt-28 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md motion-safe:transition-shadow"
      data-surface="light"
    >
      <div className="space-y-4 p-4 sm:p-5">
        <PostAuthorLine post={post} now={now} />

        <h3 id={titleId} className="text-lg leading-snug font-bold text-gray-900 sm:text-xl">
          {heading}
        </h3>

        <PostContent post={post} clamp />

        <PostImagesGrid
          post={post}
          onOpen={(index) => onOpenImage(post, index)}
          className="relative z-10"
        />

        <PostBadges post={post} />
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-2 py-1 sm:px-3">
        <ShareButton post={post} className="relative z-10" />
        <button
          type="button"
          onClick={() => onOpen(post)}
          aria-describedby={titleId}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-jmv-blue after:absolute after:inset-0 after:rounded-2xl after:content-[''] hover:bg-jmv-blue/10"
        >
          Ver publicación
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
