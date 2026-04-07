"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarClock,
  FolderKanban,
  Home,
  ImageIcon,
  Layers3,
  LogOut,
  MessageSquareQuote,
  Settings,
  Users,
} from "lucide-react";
import { removeToken } from "@/lib/auth/token";
import { useAuth } from "@/lib/hooks/useAuth";
import { useAuthStore } from "@/lib/store/auth";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  active?: boolean;
  disabled?: boolean;
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { clear } = useAuthStore();

  const handleLogout = async () => {
    removeToken();
    clear();
    await fetch("/api/session", { method: "DELETE" }).catch(() => null);
    router.push("/sign-in?redirect=/admin");
  };

  const navItems: NavItem[] = [
    {
      label: "Próximas Actividades",
      href: "/admin/proximas-actividades",
      icon: <CalendarClock className="w-5 h-5" />,
      active:
        pathname.startsWith("/admin/proximas-actividades") || pathname === "/admin",
    },
    {
      label: "Actividades Históricas",
      href: "/admin/actividades",
      icon: <FolderKanban className="w-5 h-5" />,
      active: pathname.startsWith("/admin/actividades"),
    },
    {
      label: "Catálogos",
      href: "/admin/catalogos",
      icon: <Layers3 className="w-5 h-5" />,
      active: pathname.startsWith("/admin/catalogos"),
    },
    {
      label: "Testimonios",
      href: "/admin/testimonios",
      icon: <MessageSquareQuote className="w-5 h-5" />,
      active: pathname.startsWith("/admin/testimonios"),
    },
    {
      label: "Gestión de Imágenes",
      href: "/admin/imagenes",
      icon: <ImageIcon className="w-5 h-5" />,
      active: pathname.startsWith("/admin/imagenes"),
    },
    {
      label: "Usuarios",
      href: "/admin/usuarios",
      icon: <Users className="w-5 h-5" />,
      disabled: true,
    },
    {
      label: "Configuración",
      href: "/admin/configuracion",
      icon: <Settings className="w-5 h-5" />,
      disabled: true,
    },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 z-30 flex w-72 flex-col border-r border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative h-10 w-10 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="JMV Ecuador"
              fill
              className="object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-bold text-gray-900">
              Panel Admin
            </h2>
            <p className="truncate text-xs text-gray-500">JMV Ecuador</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-[#0066CC]/5 to-[#004C99]/5 p-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0066CC] to-[#004C99] text-sm font-bold text-white">
            {(user?.displayName || user?.fullName)?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">
              {user?.displayName || user?.fullName || "Administrador"}
            </p>
            <p className="truncate text-xs text-gray-500">
              {user?.email || "admin@jmv.ec"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Gestión de Contenido
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              {item.disabled ? (
                <div className="flex cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-gray-400">
                  {item.icon}
                  <span className="flex-1 text-sm font-medium">{item.label}</span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                    Próximo
                  </span>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                    item.active
                      ? "bg-gradient-to-r from-[#0066CC] to-[#004C99] text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#0066CC]"
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-2 border-t border-gray-200 p-4">
        <Link
          href="/"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#0066CC]"
        >
          <Home className="w-5 h-5" />
          <span className="text-sm font-medium">Volver al sitio</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
