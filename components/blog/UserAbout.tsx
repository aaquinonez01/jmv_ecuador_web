import { Briefcase, Calendar, Mail, MapPin, Users } from "lucide-react";
import { formatDate, toIsoString } from "@/lib/format";
import { roleLabel } from "@/lib/blog/posts";
import type { User } from "@/types/user";

// Datos de la cuenta propia; cada fila solo aparece si hay dato real
export default function UserAbout({ user }: { user: User }) {
  const rows = [
    { icon: Briefcase, label: "Rol en JMV", value: roleLabel(user.role) },
    user.community ? { icon: Users, label: "Comunidad", value: user.community } : null,
    user.location ? { icon: MapPin, label: "Ubicación", value: user.location } : null,
    user.joinedAt
      ? {
          icon: Calendar,
          label: "Miembro desde",
          value: <time dateTime={toIsoString(user.joinedAt)}>{formatDate(user.joinedAt)}</time>,
        }
      : null,
    user.email ? { icon: Mail, label: "Correo", value: user.email } : null,
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: React.ReactNode }[];

  return (
    <div className="space-y-6">
      {user.bio ? (
        <div>
          <h2 className="mb-2 text-base font-semibold text-gray-900">Sobre mí</h2>
          <p className="leading-relaxed text-gray-700">{user.bio}</p>
        </div>
      ) : null}

      <dl className="space-y-4">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-jmv-blue/10">
              <Icon className="h-5 w-5 text-jmv-blue" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <dt className="text-sm text-gray-600">{label}</dt>
              <dd className="font-semibold break-words text-gray-900">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
