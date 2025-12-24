"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import type { User } from "@/types/user";
import type { AuthUser } from "@/lib/store/auth";

/**
 * Custom hook para manejar la lógica del BlogLayout
 * Extrae la lógica de mapeo de usuario y estados del componente
 */
export function useBlogLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const { user: authUser, loading } = useAuth();

  /**
   * Mapea el AuthUser del hook useAuth al tipo User requerido por los componentes del blog
   * Usa useMemo para evitar re-cálculos innecesarios
   */
  const mappedUser: User | undefined = useMemo(() => {
    if (!authUser) return undefined;

    const typedUser = authUser as AuthUser;

    return {
      id: typedUser.id ?? "me",
      name:
        typedUser.displayName ||
        typedUser.fullName ||
        typedUser.email ||
        "Usuario",
      email: typedUser.email ?? "",
      role: typedUser.role ?? "user",
      avatar: typedUser.profilePicture ?? undefined,
      profilePicture: typedUser.profilePicture ?? undefined,
      bio: undefined,
      location: undefined,
      zone: undefined,
      joinedDate: new Date().toLocaleDateString(),
      stats: { posts: 0, followers: 0, following: 0 },
      social: undefined,
    };
  }, [authUser]);

  return {
    searchQuery,
    setSearchQuery,
    showSidebar,
    setShowSidebar,
    mappedUser,
    loading,
  };
}
