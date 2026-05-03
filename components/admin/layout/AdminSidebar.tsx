"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BrainCircuit,
  CalendarClock,
  Crown,
  ExternalLink,
  FolderKanban,
  HeartHandshake,
  ImageIcon,
  Layers3,
  LogOut,
  MapPinned,
  Megaphone,
  MessageSquareQuote,
  Settings,
  Sparkles,
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
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
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

  const groups: NavGroup[] = [
    {
      label: "Contenido",
      items: [
        {
          label: "Próximas actividades",
          href: "/admin/proximas-actividades",
          icon: (
            <CalendarClock className="h-[18px] w-[18px]" strokeWidth={1.85} />
          ),
          active:
            pathname.startsWith("/admin/proximas-actividades") ||
            pathname === "/admin",
        },
        {
          label: "Actividades históricas",
          href: "/admin/actividades",
          icon: (
            <FolderKanban className="h-[18px] w-[18px]" strokeWidth={1.85} />
          ),
          active: pathname.startsWith("/admin/actividades"),
        },
        {
          label: "Catálogos",
          href: "/admin/catalogos",
          icon: <Layers3 className="h-[18px] w-[18px]" strokeWidth={1.85} />,
          active: pathname.startsWith("/admin/catalogos"),
        },
        {
          label: "Territorios",
          href: "/admin/territorios",
          icon: <MapPinned className="h-[18px] w-[18px]" strokeWidth={1.85} />,
          active: pathname.startsWith("/admin/territorios"),
        },
        {
          label: "Testimonios",
          href: "/admin/testimonios",
          icon: (
            <MessageSquareQuote
              className="h-[18px] w-[18px]"
              strokeWidth={1.85}
            />
          ),
          active: pathname.startsWith("/admin/testimonios"),
        },
        {
          label: "Anuncios destacados",
          href: "/admin/anuncios",
          icon: <Megaphone className="h-[18px] w-[18px]" strokeWidth={1.85} />,
          active: pathname.startsWith("/admin/anuncios"),
        },
        {
          label: "Imágenes",
          href: "/admin/imagenes",
          icon: <ImageIcon className="h-[18px] w-[18px]" strokeWidth={1.85} />,
          active: pathname.startsWith("/admin/imagenes"),
        },
      ],
    },
    {
      label: "Estructura",
      items: [
        {
          label: "Consejo Nacional",
          href: "/admin/consejo",
          icon: <Crown className="h-[18px] w-[18px]" strokeWidth={1.85} />,
          active: pathname.startsWith("/admin/consejo"),
        },
        {
          label: "Asesores Nacionales",
          href: "/admin/asesores",
          icon: (
            <HeartHandshake className="h-[18px] w-[18px]" strokeWidth={1.85} />
          ),
          active: pathname.startsWith("/admin/asesores"),
        },
      ],
    },
    {
      label: "Interactivo",
      items: [
        {
          label: "Quiz en vivo",
          href: "/admin/quiz",
          icon: (
            <BrainCircuit className="h-[18px] w-[18px]" strokeWidth={1.85} />
          ),
          active: pathname.startsWith("/admin/quiz"),
          badge: "EN VIVO",
        },
      ],
    },
    {
      label: "Sistema",
      items: [
        {
          label: "Usuarios",
          href: "/admin/usuarios",
          icon: <Users className="h-[18px] w-[18px]" strokeWidth={1.85} />,
          disabled: true,
        },
        {
          label: "Configuración",
          href: "/admin/configuracion",
          icon: <Settings className="h-[18px] w-[18px]" strokeWidth={1.85} />,
          disabled: true,
        },
      ],
    },
  ];

  const fullName = user?.displayName || user?.fullName || "Administrador";
  const userInitial = fullName.charAt(0).toUpperCase() || "A";

  return (
    <aside className="relative z-30 flex h-screen w-[320px] shrink-0 flex-col bg-gradient-to-b from-[#0F2A4A] via-[#13325A] to-[#0F2A4A] text-slate-100 shadow-[4px_0_24px_-8px_rgba(15,42,74,0.35)]">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-jmv-gold/10 to-transparent" />
      <div className="pointer-events-none absolute -left-10 top-1/3 h-48 w-48 rounded-full bg-jmv-blue/30 blur-3xl" />

      {/* Brand */}
      <div className="relative flex h-[72px] items-center gap-3 border-b border-white/10 px-5">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/95 p-1 shadow-lg ring-1 ring-white/30">
          <Image
            src="/logo.png"
            alt="JMV Ecuador"
            fill
            sizes="44px"
            className="object-contain p-1"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-white">
            JMV Ecuador
          </p>
          <p className="mt-0.5 flex items-center gap-1 truncate text-[10px] font-bold uppercase leading-tight tracking-[0.16em] text-jmv-gold/90">
            <Sparkles className="h-2.5 w-2.5" />
            Panel admin
          </p>
        </div>
      </div>

      {/* Nav groups */}
      <nav className="relative flex-1 overflow-y-auto px-3 py-5">
        {groups.map((group) => (
          <div key={group.label} className="mb-6 last:mb-0">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.href}>
                  {item.disabled ? (
                    <div className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-white/30">
                      <span>{item.icon}</span>
                      <span className="flex-1 text-[13.5px] font-medium">
                        {item.label}
                      </span>
                      <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/40">
                        Pronto
                      </span>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-all ${
                        item.active
                          ? "bg-gradient-to-r from-white/[0.18] via-white/[0.12] to-white/[0.06] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                          : "text-white/75 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      {item.active && (
                        <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-jmv-gold shadow-[0_0_12px_rgba(217,143,6,0.7)]" />
                      )}
                      <span
                        className={
                          item.active
                            ? "text-jmv-gold"
                            : "text-white/55 transition-colors group-hover:text-white"
                        }
                      >
                        {item.icon}
                      </span>
                      <span
                        className={`flex-1 truncate ${item.active ? "font-semibold" : ""}`}
                      >
                        {item.label}
                      </span>
                      {item.badge ? (
                        <span className="rounded-md bg-jmv-red/95 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer: user + actions */}
      <div className="relative border-t border-white/10 bg-black/15 p-3">
        <div className="mb-2.5 flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.06] px-2.5 py-2 backdrop-blur-sm">
          <div className="relative shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-jmv-gold via-amber-500 to-jmv-gold-dark text-[14px] font-bold text-white shadow-md ring-2 ring-white/20">
              {userInitial}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#13325A] bg-emerald-400 shadow-sm" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold leading-tight text-white">
              {fullName}
            </p>
            <p className="mt-0.5 truncate text-[10.5px] leading-tight text-white/55">
              {user?.email || "admin@jmv.ec"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.06] px-2.5 py-2 text-[12px] font-semibold text-white/85 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
            title="Volver al sitio"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Ver sitio
          </Link>
          <button
            onClick={handleLogout}
            className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-white/65 transition-colors hover:border-red-400/40 hover:bg-red-500/15 hover:text-red-300"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
