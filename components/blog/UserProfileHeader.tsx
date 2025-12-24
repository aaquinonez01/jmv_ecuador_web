"use client";

import { useState } from "react";
import {
  Camera,
  MapPin,
  Calendar,
  Mail,
  UserPlus,
  UserMinus,
  Settings,
} from "lucide-react";
import type { User } from "@/types/user";

interface UserProfileHeaderProps {
  user: User;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
}

export default function UserProfileHeader({
  user,
  isOwnProfile = false,
  isFollowing = false,
  onFollow,
  onUnfollow,
}: UserProfileHeaderProps) {
  const [following, setFollowing] = useState(isFollowing);

  const handleFollowClick = () => {
    if (following) {
      setFollowing(false);
      onUnfollow?.();
    } else {
      setFollowing(true);
      onFollow?.();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-48 sm:h-64 md:h-80 bg-gradient-to-br from-jmv-blue via-jmv-gold to-jmv-red overflow-hidden">
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Camera className="w-20 h-20 text-white" />
          </div>
        )}

        {/* Edit Cover Button - Solo en perfil propio */}
        {isOwnProfile && (
          <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-lg">
            <Camera className="w-4 h-4" />
            Cambiar portada
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 sm:px-6 md:px-8 pb-6">
        {/* Avatar & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-jmv-blue to-jmv-blue-dark overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-5xl font-bold">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>

            {isOwnProfile && (
              <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                <Camera className="w-5 h-5 text-gray-700" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            {isOwnProfile ? (
              <button className="flex-1 sm:flex-initial bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2">
                <Settings className="w-5 h-5" />
                Editar perfil
              </button>
            ) : (
              <>
                <button
                  onClick={handleFollowClick}
                  className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    following
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      : "bg-jmv-blue hover:bg-jmv-blue-dark text-white"
                  }`}
                >
                  {following ? (
                    <>
                      <UserMinus className="w-5 h-5" />
                      Siguiendo
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Seguir
                    </>
                  )}
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-semibold transition-all duration-200">
                  Mensaje
                </button>
              </>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              {user.name}
            </h1>
            <p className="text-lg text-jmv-blue font-semibold">{user.role}</p>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-gray-600 text-base max-w-3xl">{user.bio}</p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {user.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
            )}
            {user.zone && (
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">Zona:</span>
                <span>{user.zone}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Se unió {user.joinedDate}</span>
            </div>
            {!isOwnProfile && user.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                <a
                  href={`mailto:${user.email}`}
                  className="hover:text-jmv-blue transition-colors hover:underline"
                >
                  Contactar
                </a>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 sm:gap-8 pt-3 border-t border-gray-100">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {user.stats.posts}
              </div>
              <div className="text-sm text-gray-600">Publicaciones</div>
            </div>
            <div className="cursor-pointer hover:text-jmv-blue transition-colors">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {user.stats.followers}
              </div>
              <div className="text-sm text-gray-600">Seguidores</div>
            </div>
            <div className="cursor-pointer hover:text-jmv-blue transition-colors">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {user.stats.following}
              </div>
              <div className="text-sm text-gray-600">Siguiendo</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
