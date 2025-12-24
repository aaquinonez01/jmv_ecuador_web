"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";

export interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si no está cargando y no hay usuario o el usuario no es admin, redirigir
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/sign-in?redirect=/admin");
    }
  }, [user, loading, router]);

  // Mostrar spinner mientras carga
  if (loading) {
    return <LoadingSpinner fullScreen text="Verificando permisos..." />;
  }

  // Si no hay usuario o no es admin, no mostrar nada (se redirigirá)
  if (!user || user.role !== "admin") {
    return null;
  }

  // Usuario autenticado y es admin, mostrar contenido
  return <>{children}</>;
}
