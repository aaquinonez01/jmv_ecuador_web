"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/hooks/useAuth";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    // TODO: Implementar logout
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/sign-in");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Logo y Título */}
      <Link href="/admin" className="flex items-center gap-3">
        <div className="relative w-10 h-10">
          <Image
            src="/logo.png"
            alt="JMV Ecuador"
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Panel Administrativo
          </h1>
          <p className="text-xs text-gray-500">JMV Ecuador</p>
        </div>
      </Link>

      {/* User Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-jmv-blue text-white flex items-center justify-center text-sm font-semibold">
            {(user?.displayName || user?.fullName)?.charAt(0).toUpperCase() || "A"}
          </div>
          <span className="text-sm font-medium text-gray-900 hidden sm:block">
            {user?.displayName || user?.fullName || "Admin"}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20 animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.displayName || user?.fullName || "Admin"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {user?.email || "admin@jmvecuador.org"}
                </p>
              </div>

              <Link
                href="/blog/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                <User className="w-4 h-4" />
                Mi Perfil
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
