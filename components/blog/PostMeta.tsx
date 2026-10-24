import { Camera, FileText } from "lucide-react";
import { formatDateTime, formatRelative, toIsoString } from "@/lib/format";
import { POST_TYPE_LABEL, roleLabel } from "@/lib/blog/posts";
import type { Post } from "@/types/user";
import AuthorAvatar from "./AuthorAvatar";

/** Autor, rol y fecha relativa (con la fecha completa en title) */
export function PostAuthorLine({ post, now }: { post: Post; now?: Date }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <AuthorAvatar name={post.author.name} avatar={post.author.avatar} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-900">
          {post.author.name}
        </p>
        <p className="truncate text-sm text-gray-600">
          {roleLabel(post.author.role)}
          {post.createdAt ? (
            <>
              <span aria-hidden="true"> · </span>
              <time
                dateTime={toIsoString(post.createdAt)}
                title={formatDateTime(post.createdAt)}
                suppressHydrationWarning
              >
                {formatRelative(post.createdAt, now)}
              </time>
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
}

/** Tipo de publicación + alcance, actividad y subtipo */
export function PostBadges({ post }: { post: Post }) {
  const TypeIcon = post.typePost === "documents" ? FileText : Camera;
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Clasificación">
      <li className="inline-flex items-center gap-1 rounded-full bg-jmv-ink px-2.5 py-1 text-xs font-semibold text-white">
        <TypeIcon className="h-3.5 w-3.5" aria-hidden="true" />
        {POST_TYPE_LABEL[post.typePost]}
      </li>
      {post.scope ? (
        <li className="rounded-full bg-jmv-blue px-2.5 py-1 text-xs font-semibold text-white">
          {post.scope.name}
        </li>
      ) : null}
      {post.activityType ? (
        <li className="rounded-full bg-jmv-blue/10 px-2.5 py-1 text-xs font-semibold text-jmv-blue">
          {post.activityType.name}
        </li>
      ) : null}
      {post.subtype ? (
        <li className="rounded-full bg-jmv-gold px-2.5 py-1 text-xs font-semibold text-jmv-ink">
          {post.subtype.name}
        </li>
      ) : null}
    </ul>
  );
}
