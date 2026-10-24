import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { roleLabel } from "@/lib/blog/posts";
import type { User } from "@/types/user";
import AuthorAvatar from "./AuthorAvatar";

// Resumen de la persona con sesión iniciada (solo datos reales del backend)
export default function UserProfileCard({
  user,
  onCreatePost,
}: {
  user: User;
  onCreatePost: () => void;
}) {
  return (
    <section
      aria-labelledby="profile-card-title"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      data-surface="light"
    >
      <div className="flex items-center gap-3">
        <AuthorAvatar name={user.name} avatar={user.avatar} className="h-14 w-14 text-lg" />
        <div className="min-w-0">
          <h2 id="profile-card-title" className="truncate text-lg font-bold text-gray-900">
            {user.name}
          </h2>
          <p className="text-sm text-gray-600">{roleLabel(user.role)}</p>
        </div>
      </div>

      {user.community || user.location ? (
        <ul className="mt-4 space-y-1.5 text-sm text-gray-700">
          {user.community ? (
            <li className="flex items-center gap-2">
              <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{user.community}</span>
            </li>
          ) : null}
          {user.location ? (
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{user.location}</span>
            </li>
          ) : null}
        </ul>
      ) : null}

      <div className="mt-5 space-y-2">
        <button
          type="button"
          onClick={onCreatePost}
          className={buttonVariants({ variant: "secondary", className: "w-full" })}
        >
          Crear publicación
        </button>
        <Link
          href="/blog/profile/me"
          className={buttonVariants({ variant: "outline", className: "w-full" })}
        >
          Ver mi perfil
        </Link>
      </div>
    </section>
  );
}
