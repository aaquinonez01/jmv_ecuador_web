"use client";

import Link from "next/link";
import { User as UserIcon, MapPin, Calendar, Edit } from "lucide-react";
import type { User } from "@/types/user";
import Image from "next/image";

interface UserProfileCardProps {
  user: User;
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  console.log(user.profilePicture);
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Cover Image */}
      <div className="h-20 sm:h-24 bg-gradient-to-r from-jmv-blue to-jmv-blue-dark relative">
        {user.profilePicture && (
          <div className="absolute inset-0 bg-gradient-to-br from-jmv-blue/50 to-jmv-blue-dark/50" />
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        {/* Avatar */}
        {user.profilePicture && (
          <div className="relative -mt-10 sm:-mt-12 mb-3 sm:mb-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-jmv-blue/10 rounded-full border-4 border-white flex items-center justify-center">
              <Image
                src={user.profilePicture!}
                width={120}
                height={120}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        )}

        {/* User Info */}
        <div className="mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
            {user.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{user.role}</p>
          {user.bio && (
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed line-clamp-2">
              {user.bio}
            </p>
          )}
        </div>

        {/* Location & Join Date */}
        <div className="space-y-1.5 mb-4 text-xs sm:text-sm">
          {user.location && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{user.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>Se unió en {user.joinedDate}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 py-3 sm:py-4 border-y border-gray-100 mb-4">
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-jmv-blue">
              {user.stats.posts}
            </div>
            <div className="text-xs text-gray-600">Posts</div>
          </div>
          <div className="text-center border-x border-gray-100">
            <div className="text-lg sm:text-xl font-bold text-jmv-blue">
              {user.stats.followers}
            </div>
            <div className="text-xs text-gray-600">Seguidores</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-jmv-blue">
              {user.stats.following}
            </div>
            <div className="text-xs text-gray-600">Siguiendo</div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Link
            href={`/blog/profile/${user.id}`}
            className="block w-full bg-jmv-blue text-white py-2.5 rounded-xl font-semibold hover:bg-jmv-blue-dark transition-colors text-center text-sm"
          >
            Ver mi perfil
          </Link>
          <button className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm">
            <Edit className="w-4 h-4" />
            Editar perfil
          </button>
        </div>
      </div>
    </div>
  );
}
