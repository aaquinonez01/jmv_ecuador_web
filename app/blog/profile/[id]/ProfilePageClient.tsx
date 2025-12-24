"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProfileClient from "./ProfileClient";
import { getAxiosClient } from "@/config/axios.config";
import { useAuth } from "@/lib/hooks/useAuth";
import { getPostsByUserId } from "@/data/posts";
import type { User } from "@/types/user";

export default function ProfilePageClient() {
  const params = useParams();
  const id = params.id as string;
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const api = getAxiosClient();
        if (id === "me" || id === (authUser as any)?.id) {
          // Usar /auth/me para obtener el usuario logueado
          const { data } = await api.get("/auth/me");
          if (alive && data?.user) setUser(data.user);
        } else {
          // TODO: cuando exista endpoint GET /auth/users/:id
          // const { data } = await api.get(`/auth/users/${id}`);
          // if (alive && data?.user) setUser(data.user);
          if (alive) setUser(null);
        }
      } catch {
        if (alive) setUser(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, authUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#A8C5E0] pt-20 sm:pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-jmv-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#A8C5E0] pt-20 sm:pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Usuario no encontrado</p>
          <button
            onClick={() => window.history.back()}
            className="text-jmv-blue hover:underline"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const userPosts = getPostsByUserId(user.id ?? id);

  // Mapear el usuario del backend al formato esperado por ProfileClient
  const mappedUser: User = {
    id: user.id ?? id,
    name: user.displayName || user.fullName || user.email || "Usuario",
    email: user.email,
    role: user.role ?? "user",
    avatar: user.profilePicture ?? undefined,
    bio: user.bio ?? undefined,
    location: user.address ?? undefined,
    zone: user.zone ?? undefined,
    joinedDate: new Date(user.createdAt ?? Date.now()).toLocaleDateString(),
    stats: { posts: userPosts.length, followers: 0, following: 0 },
    social: undefined,
  };

  return <ProfileClient user={mappedUser} userPosts={userPosts} />;
}
