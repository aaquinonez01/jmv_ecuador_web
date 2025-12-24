"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ImageIcon, Users, Settings, LogOut, Home, Tag } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = () => {
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/sign-in");
  };

  const navItems: NavItem[] = [
    {
      label: "Gestión de Imágenes",
      href: "/admin/imagenes",
      icon: <ImageIcon className="w-5 h-5" />,
      active: pathname.startsWith("/admin/imagenes") || pathname === "/admin",
    },
    {
      label: "Categorías de Actividades",
      href: "/admin/categorias",
      icon: <Tag className="w-5 h-5" />,
      active: pathname.startsWith("/admin/categorias"),
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
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm fixed left-0 top-16 bottom-0 z-30">
      {/* Header con logo y usuario */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="JMV Ecuador"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-gray-900 truncate">
              Panel Admin
            </h2>
            <p className="text-xs text-gray-500 truncate">JMV Ecuador</p>
          </div>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#0066CC]/5 to-[#004C99]/5 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0066CC] to-[#004C99] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
            {(user?.displayName || user?.fullName)?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.displayName || user?.fullName || "Administrador"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || "admin@jmv.ec"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
          Gestión de Contenido
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              {item.disabled ? (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 cursor-not-allowed">
                  {item.icon}
                  <span className="text-sm font-medium flex-1">
                    {item.label}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    Próximo
                  </span>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
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

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-[#0066CC] transition-colors w-full"
        >
          <Home className="w-5 h-5" />
          <span className="text-sm font-medium">Volver al Sitio</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
