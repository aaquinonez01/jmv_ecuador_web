"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { isLightOnlyPath, reapplyTheme } from "@/lib/theme";

// El panel /admin es siempre claro. En carga directa lo resuelve el script de <head>;
// aquí sólo se reaplica el tema cuando una navegación del cliente entra o sale del panel.
export default function ThemeRouteSync() {
  const pathname = usePathname();
  const lightOnly = isLightOnlyPath(pathname);
  const prev = useRef(lightOnly);

  useEffect(() => {
    if (prev.current === lightOnly) return;
    prev.current = lightOnly;
    reapplyTheme();
  }, [lightOnly]);

  return null;
}
