"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

interface SidebarContextValue {
  isMobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useAdminSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    return {
      isMobileOpen: false,
      openMobile: () => {},
      closeMobile: () => {},
    };
  }
  return ctx;
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // Cerrar el drawer cuando cambia la ruta
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Bloquear scroll del body cuando el drawer está abierto en móvil
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileOpen]);

  return (
    <SidebarContext.Provider
      value={{
        isMobileOpen,
        openMobile: () => setIsMobileOpen(true),
        closeMobile: () => setIsMobileOpen(false),
      }}
    >
      <div className="flex h-screen bg-slate-50">
        <AdminSidebar />
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
