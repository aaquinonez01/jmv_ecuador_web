"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  /** Nombre accesible, p. ej. "Copiar número de cuenta" */
  label: string;
  /** Texto visible (por defecto "Copiar") */
  children?: string;
  /** Lo que se anuncia al copiar */
  copiedMessage?: string;
  variant?: "compact" | "full";
  className?: string;
}

// Copia al portapapeles con confirmación visual y aviso para lectores de pantalla.
export default function CopyButton({
  value,
  label,
  children = "Copiar",
  copiedMessage = "Copiado",
  variant = "compact",
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Sin permiso de portapapeles (navegadores viejos o http): copia manual
      window.prompt("Copia este dato:", value);
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2500);
  };

  const Icon = copied ? Check : Copy;

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={label}
        className={cn(
          "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl font-semibold transition-colors",
          variant === "compact"
            ? "min-w-11 px-3 text-sm text-jmv-blue ring-1 ring-jmv-blue/25 hover:bg-jmv-blue/10"
            : "w-full bg-jmv-blue px-5 text-base text-white shadow-jmv hover:bg-[#173f70] sm:w-auto",
          copied && variant === "compact" && "bg-emerald-50 text-emerald-800 ring-emerald-300",
          copied && variant === "full" && "bg-emerald-700 hover:bg-emerald-700",
          className,
        )}
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
        {/* En móviles angostos el compacto queda solo con el icono para que el dato no se parta */}
        <span aria-hidden className={variant === "compact" ? "hidden min-[420px]:inline" : undefined}>
          {copied ? "Copiado" : children}
        </span>
      </button>
      <span role="status" className="sr-only">
        {copied ? copiedMessage : ""}
      </span>
    </>
  );
}
