"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth";
import { removeToken } from "@/lib/auth/token";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

const navigation = [
  {
    name: "Inicio",
    href: "/",
  },
  {
    name: "Nosotros",
    href: "/quienes-somos",
    children: [
      { name: "Historia", href: "/quienes-somos/historia" },
      { name: "Estructura", href: "/estructura" },
      { name: "Nuestros Pilares", href: "/pilares" },
    ],
  },
  {
    name: "Formación",
    href: "/formacion",
    children: [
      { name: "Ejes Formativos", href: "/formacion/ejes" },
      { name: "Santos Vicencianos", href: "/formacion/santos" },
    ],
  },
  {
    name: "Actividades",
    href: "/actividades",
  },
  {
    name: "Blog",
    href: "/blog",
  },
  {
    name: "Contacto",
    href: "/contacto",
  },
];

type InitialUser = {
  fullName?: string;
  displayName?: string;
  profilePicture?: string | null;
};

export default function Header({ initialUser }: { initialUser?: InitialUser }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const { user, setUser, clear } = useAuthStore();
  const router = useRouter();
  // Hook que refresca el perfil desde /api/me tras recargas/navegación
  useAuth();

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    } else {
      clear();
    }
  }, [initialUser, setUser, clear]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 bg-[#D98F06]",
        scrolled ? "shadow-xl" : ""
      )}
      style={{ backgroundColor: "#D98F06" }}
    >
      <div className=" mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center flex-shrink-0 justify-center max-w-72"
          >
            <img src="/logo.png" alt="JMV Ecuador" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="flex items-center px-4 py-3 text-sm font-bold text-white/90 hover:text-white transition-all duration-200 rounded-lg hover:bg-white/10 hover:scale-105"
                >
                  {item.name}
                  {item.children && <ChevronDown className="ml-1 h-3 w-3" />}
                </Link>

                {/* Dropdown Menu */}
                {item.children && (
                  <div className="absolute top-full left-0 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 mt-1">
                    <div className="py-3">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {item.name}
                        </span>
                      </div>
                      {item.children.map((child, index) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:text-jmv-blue hover:bg-jmv-blue/10 transition-all duration-200 hover:pl-6 group/item"
                        >
                          <span className="w-1.5 h-1.5 bg-jmv-blue rounded-full mr-3 opacity-0 group-hover/item:opacity-100 transition-opacity"></span>
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* CTA Button */}
            <Link
              href="/unete"
              className="bg-jmv-red text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-jmv-red-dark transition-all duration-200 ml-4 whitespace-nowrap shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <span className="hidden md:inline">Únete a JMV</span>
              <span className="md:hidden">Únete</span>
            </Link>
            {user || initialUser ? (
              <div className="relative ml-3">
                <button
                  onClick={() => setOpenProfile((s) => !s)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 text-white font-bold hover:bg-white/30 transition"
                >
                  {user?.profilePicture ?? initialUser?.profilePicture ? (
                    <Image
                      src={
                        (user?.profilePicture ??
                          initialUser?.profilePicture) as string
                      }
                      alt="avatar"
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span>
                      {(() => {
                        const name =
                          user?.displayName ||
                          initialUser?.displayName ||
                          user?.fullName ||
                          initialUser?.fullName ||
                          "U";
                        const parts = name.trim().split(/\s+/);
                        const initials =
                          (parts[0]?.[0] || "U") + (parts[1]?.[0] || "");
                        return initials.toUpperCase();
                      })()}
                    </span>
                  )}
                </button>
                {openProfile && (
                  <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-xl py-2 z-50">
                    <Link
                      href="/auth/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setOpenProfile(false)}
                    >
                      Perfil
                    </Link>
                    <button
                      onClick={() => {
                        removeToken();
                        clear();
                        setOpenProfile(false);
                        router.replace("/");
                      }}
                      className="w-full text-left block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="ml-4 bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all duration-200 whitespace-nowrap shadow-lg hover:shadow-xl hover:scale-105"
              >
                Iniciar sesión
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 sm:p-3 rounded-lg text-white hover:bg-white/10 transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
          >
            {isMenuOpen ? (
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Full Screen */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-[#D98F06] overflow-y-auto"
          style={{ backgroundColor: "#D98F06", top: "64px" }}
        >
          <div className="min-h-full flex flex-col px-5 sm:px-6 pt-6 sm:pt-8 pb-6 sm:pb-8">
            <div className="flex-1 space-y-3">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="border-b border-white/10 pb-5 last:border-b-0"
                >
                  <Link
                    href={item.href}
                    className="flex items-center justify-between px-4 py-3.5 text-lg sm:text-xl font-bold text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                    {item.children && (
                      <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6 opacity-60" />
                    )}
                  </Link>
                  {item.children && (
                    <div className="ml-4 sm:ml-5 mt-3 space-y-2 pl-4 sm:pl-5 border-l-2 border-white/20">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="flex items-center px-3 py-2.5 text-base sm:text-lg font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-all duration-200 hover:pl-5"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="w-1.5 h-1.5 bg-white rounded-full mr-3"></span>
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Botón Únete - Pegado al fondo */}
            <div className="pt-6 mt-auto">
              <Link
                href="/unete"
                className="flex items-center justify-center w-full bg-jmv-red text-white px-6 py-4 rounded-xl font-bold hover:bg-jmv-red-dark transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="w-5 h-5 mr-2" />
                Únete a JMV
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
