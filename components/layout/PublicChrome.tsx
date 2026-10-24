"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { isChromelessPath } from "@/lib/site";

// Oculta el contenido (p. ej. el footer, que es Server Component) en /admin y /sign-in
export default function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (isChromelessPath(pathname)) return null;
  return <>{children}</>;
}
