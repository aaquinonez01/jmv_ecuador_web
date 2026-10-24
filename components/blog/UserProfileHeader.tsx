import { Calendar, MapPin, Users } from "lucide-react";
import { StarsRing } from "@/components/brand";
import { formatDate, toIsoString } from "@/lib/format";
import { roleLabel } from "@/lib/blog/posts";
import type { User } from "@/types/user";
import AuthorAvatar from "./AuthorAvatar";

// Cabecera del perfil propio. Solo muestra datos reales del backend.
export default function UserProfileHeader({ user }: { user: User }) {
  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm" data-surface="light">
      <div className="relative h-28 overflow-hidden bg-jmv-ink sm:h-36">
        <div className="absolute inset-0 bg-gradient-jmv" aria-hidden="true" />
        <StarsRing className="absolute -top-10 -right-6 h-56 w-56 text-jmv-gold-text/25" />
      </div>

      <div className="px-4 pb-6 sm:px-8">
        <AuthorAvatar
          name={user.name}
          avatar={user.avatar}
          className="-mt-12 h-24 w-24 border-4 border-white text-3xl shadow-lg sm:h-28 sm:w-28"
        />

        <div className="mt-3 space-y-3">
          <div>
            <h1 className="font-display text-3xl font-semibold text-gray-900">{user.name}</h1>
            <p className="text-base font-semibold text-jmv-blue">{roleLabel(user.role)}</p>
          </div>

          {user.bio ? <p className="max-w-3xl text-base text-gray-700">{user.bio}</p> : null}

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-700">
            {user.community ? (
              <li className="flex items-center gap-1.5">
                <Users className="h-4 w-4" aria-hidden="true" />
                {user.community}
              </li>
            ) : null}
            {user.location ? (
              <li className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {user.location}
              </li>
            ) : null}
            {user.joinedAt ? (
              <li className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span>
                  Se unió el{" "}
                  <time dateTime={toIsoString(user.joinedAt)}>{formatDate(user.joinedAt)}</time>
                </span>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </section>
  );
}
