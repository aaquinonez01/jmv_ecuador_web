"use client";

import type { MouseEvent } from "react";
import { Share2 } from "lucide-react";
import { whatsappShareLink } from "@/lib/whatsapp";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { postHeading } from "@/lib/blog/posts";
import type { Post } from "@/types/user";

/** Enlace del post dentro del feed (el blog todavía no tiene página por publicación) */
export function postShareUrl(post: Post) {
  return `${SITE.url}/blog#publicacion-${post.id}`;
}

// Compartir: usa la hoja nativa del móvil si existe y, si no, abre WhatsApp
export default function ShareButton({
  post,
  className,
}: {
  post: Post;
  className?: string;
}) {
  const heading = postHeading(post);
  const text = `${heading} — compartido en la Comunidad JMV Ecuador`;
  const url = postShareUrl(post);
  const href = whatsappShareLink(text, url);

  const onClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    if (typeof navigator === "undefined" || !navigator.share) return;
    e.preventDefault();
    try {
      await navigator.share({ title: heading, text, url });
    } catch (err) {
      // Si la persona cierra la hoja no hacemos nada; si falla, WhatsApp
      if ((err as DOMException)?.name !== "AbortError") {
        window.open(href, "_blank", "noopener,noreferrer");
      }
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-jmv-blue hover:bg-jmv-blue/10",
        className
      )}
    >
      <Share2 className="h-5 w-5" aria-hidden="true" />
      Compartir
      <span className="sr-only">
        {" "}«{heading}» por WhatsApp u otra aplicación (se abre en otra ventana)
      </span>
    </a>
  );
}
