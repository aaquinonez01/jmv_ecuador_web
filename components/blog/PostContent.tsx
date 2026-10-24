import { cn } from "@/lib/utils";
import type { Post } from "@/types/user";

// Los "momentos" se leen como testimonio (serif, comilla y filete dorado);
// los documentos como texto normal.
export default function PostContent({
  post,
  clamp = false,
  className,
}: {
  post: Post;
  clamp?: boolean;
  className?: string;
}) {
  if (post.typePost === "moments") {
    return (
      <div
        className={cn(
          "relative border-l-4 border-jmv-gold pl-4 sm:pl-5",
          className
        )}
      >
        <span
          className="pointer-events-none absolute -top-3 left-3 font-display text-5xl leading-none text-jmv-gold-ink/25 select-none"
          aria-hidden="true"
        >
          “
        </span>
        <p
          className={cn(
            "blog-text font-display text-lg leading-relaxed whitespace-pre-line text-gray-900 sm:text-xl",
            clamp && "line-clamp-5"
          )}
        >
          {post.content}
        </p>
      </div>
    );
  }

  return (
    <p
      className={cn(
        "blog-text text-base leading-relaxed whitespace-pre-line text-gray-800",
        clamp && "line-clamp-5",
        className
      )}
    >
      {post.content}
    </p>
  );
}
