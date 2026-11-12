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

  // En el admin la página nunca desliza: solo el área de contenido (<main>).
  // El panel vive dentro del layout público, que suma su propio alto.
  useEffect(() => {
    const html = document.documentElement;
    const prev = { html: html.style.overflow, body: document.body.style.overflow };
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev.html;
      document.body.style.overflow = prev.body;
    };
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isMobileOpen,
        openMobile: () => setIsMobileOpen(true),
        closeMobile: () => setIsMobileOpen(false),
      }}
    >
      <div className="fixed inset-0 flex h-dvh bg-slate-50">
        <AdminSidebar />
        <main id="admin-main" className="flex min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain scroll-smooth">
          {children}
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
