"use client";

import {
  MapPin,
  Briefcase,
  Calendar,
  Mail,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import type { User as LegacyUser } from "@/types/user";
import { useAuth } from "@/lib/hooks/useAuth";

type AnyUser = Partial<LegacyUser> & {
  fullName?: string;
  displayName?: string;
  profilePicture?: string | null;
  createdAt?: string | Date;
};

interface UserAboutProps {
  user?: AnyUser;
}

export default function UserAbout({ user }: UserAboutProps) {
  const { user: authUser } = useAuth();
  const u = user || (authUser as AnyUser) || {};
  const joined =
    u?.joinedDate ||
    (u?.createdAt ? new Date(u.createdAt).toLocaleDateString() : undefined);
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Acerca de</h2>

      <div className="space-y-4">
        {/* Bio */}
        {u.bio && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Biografía
            </h3>
            <p className="text-gray-600 leading-relaxed">{u.bio}</p>
          </div>
        )}

        {/* Details */}
        <div className="space-y-3">
          {u.role && (
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 bg-jmv-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-jmv-blue" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Rol en JMV</div>
                <div className="font-semibold">{u.role}</div>
              </div>
            </div>
          )}

          {u.zone && (
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 bg-jmv-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-jmv-gold" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Zona</div>
                <div className="font-semibold">{u.zone}</div>
              </div>
            </div>
          )}

          {u.location && (
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 bg-jmv-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-jmv-red" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Ubicación</div>
                <div className="font-semibold">{u.location}</div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Miembro desde</div>
              <div className="font-semibold">{joined || "—"}</div>
            </div>
          </div>

          {u.email && (
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Correo</div>
                <a
                  href={`mailto:${u.email}`}
                  className="font-semibold hover:text-jmv-blue transition-colors hover:underline"
                >
                  {u.email}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Social Links */}
        {u.social && Object.values(u.social).some((v) => v) && (
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Redes sociales
            </h3>
            <div className="flex gap-3">
              {u.social.facebook && (
                <a
                  href={u.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
              )}
              {u.social.instagram && (
                <a
                  href={u.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
              )}
              {u.social.twitter && (
                <a
                  href={u.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Twitter className="w-5 h-5 text-white" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
