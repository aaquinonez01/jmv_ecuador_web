"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Copia un enlace al portapapeles y avisa (también a lectores de pantalla).
export default function CopyLinkButton({ value, label, className }: { value: string; label: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copia este enlace:", value);
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-fg transition-colors hover:bg-fg/10",
        className,
      )}
    >
      {copied ? <Check className="h-4 w-4 text-accent-gold" aria-hidden /> : <Link2 className="h-4 w-4 text-accent-gold" aria-hidden />}
      {copied ? "¡Enlace copiado!" : label}
      <span className="sr-only" aria-live="polite">
        {copied ? "Enlace copiado al portapapeles" : ""}
      </span>
    </button>
  );
}
