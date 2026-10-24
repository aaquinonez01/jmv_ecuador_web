import { cn } from "@/lib/utils";
import { initials } from "@/lib/blog/posts";
import PostImage from "./PostImage";

// Foto del autor si existe; si no, sus iniciales. Decorativa: el nombre va al lado.
export default function AuthorAvatar({
  name,
  avatar,
  className,
}: {
  name: string;
  avatar?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-jmv-blue/10 font-bold text-jmv-blue",
        className
      )}
      aria-hidden="true"
    >
      {avatar ? (
        <PostImage
          src={avatar}
          alt=""
          maxWidth={320}
          sizes="96px"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        initials(name)
      )}
    </span>
  );
}
