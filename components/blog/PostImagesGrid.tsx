"use client";

import { cn } from "@/lib/utils";
import { postHeading } from "@/lib/blog/posts";
import type { Post } from "@/types/user";
import PostImage from "./PostImage";

// Cuadrícula de fotos; cada foto es un botón que abre la galería en esa posición
export default function PostImagesGrid({
  post,
  max = 4,
  onOpen,
  className,
}: {
  post: Post;
  max?: number;
  onOpen: (index: number) => void;
  className?: string;
}) {
  const images = post.images;
  if (!images.length) return null;
  const shown = images.slice(0, max);
  const hidden = images.length - shown.length;
  const heading = postHeading(post);

  return (
    <ul
      className={cn(
        "grid gap-1.5 overflow-hidden rounded-xl",
        shown.length === 1 ? "grid-cols-1" : "grid-cols-2",
        className
      )}
      aria-label={`Fotos (${images.length})`}
    >
      {shown.map((src, index) => {
        const isLast = index === shown.length - 1 && hidden > 0;
        const spanFull = shown.length === 3 && index === 0;
        return (
          <li
            key={`${src}-${index}`}
            className={cn(spanFull && "col-span-2")}
          >
            <button
              type="button"
              onClick={() => onOpen(index)}
              className={cn(
                "group relative block w-full overflow-hidden bg-slate-200",
                shown.length === 1 || spanFull ? "aspect-video" : "aspect-square"
              )}
            >
              <PostImage
                src={src}
                alt=""
                sizes={shown.length === 1 ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 1024px) 320px, 50vw"}
                className="absolute inset-0 h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.03]"
              />
              {isLast ? (
                <span className="absolute inset-0 flex items-center justify-center bg-black/65 text-lg font-bold text-white">
                  +{hidden}
                  <span className="sr-only"> fotos más</span>
                </span>
              ) : null}
              <span className="sr-only">
                Ver foto {index + 1} de {images.length} de «{heading}»
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
