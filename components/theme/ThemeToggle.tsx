"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { THEME_OPTIONS, type ThemePreference } from "@/lib/theme";
import { useTheme } from "./useTheme";

// Selector de tema Claro / Oscuro / Sistema.
// - variant="menu": botón de 44px con icono (sol/luna según el tema aplicado, por CSS,
//   así no cambia en la hidratación) que abre un panel con un radiogroup.
// - variant="segmented": las 3 opciones visibles (menú móvil).
// Pensado para el header azul (texto blanco); el panel es blanco como los submenús.

const ICONS: Record<ThemePreference, LucideIcon> = { light: Sun, dark: Moon, system: Monitor };
const LABEL: Record<ThemePreference, string> = { light: "Claro", dark: "Oscuro", system: "Sistema" };

function useRovingRadios(
  value: ThemePreference,
  onSelect: (v: ThemePreference) => void,
) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const current = THEME_OPTIONS.findIndex((o) => o.value === value);
    const n = THEME_OPTIONS.length;
    let next = current;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (current + 1) % n;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (current - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else next = n - 1;
    onSelect(THEME_OPTIONS[next].value);
    refs.current[next]?.focus();
  };
  return { refs, onKeyDown };
}

export default function ThemeToggle({
  variant = "menu",
  className,
}: {
  variant?: "menu" | "segmented";
  className?: string;
}) {
  return variant === "segmented" ? (
    <ThemeSegmented className={className} />
  ) : (
    <ThemeMenu className={className} />
  );
}

function ThemeMenu({ className }: { className?: string }) {
  const { preference, resolved, setPreference } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const { refs, onKeyDown } = useRovingRadios(preference, setPreference);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    // Foco en la opción marcada al abrir
    const i = THEME_OPTIONS.findIndex((o) => o.value === preference);
    refs.current[i]?.focus();
    return () => document.removeEventListener("pointerdown", onPointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const current =
    preference === "system"
      ? `Sistema (${resolved === "dark" ? "oscuro" : "claro"})`
      : LABEL[preference];

  return (
    <div
      ref={rootRef}
      className={cn("relative", className)}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          close(true);
        }
      }}
      onBlur={(e) => {
        if (open && !e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Tema: ${current}`}
        title="Cambiar tema"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white hover:bg-white/10"
      >
        {/* Icono por CSS (clase dark en <html>): correcto desde el primer pintado */}
        <Sun className="h-5 w-5 theme-dark:hidden" aria-hidden />
        <Moon className="hidden h-5 w-5 theme-dark:block" aria-hidden />
      </button>

      <div id={panelId} hidden={!open} className="absolute right-0 top-full z-50 w-48 pt-2">
        <div
          role="radiogroup"
          aria-label="Tema del sitio"
          data-tone="light"
          data-surface="light"
          onKeyDown={onKeyDown}
          className="rounded-xl border border-slate-200 bg-white py-2 text-slate-700 shadow-2xl"
        >
          {THEME_OPTIONS.map((opt, i) => {
            const Icon = ICONS[opt.value];
            const checked = preference === opt.value;
            return (
              <button
                key={opt.value}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={checked}
                tabIndex={checked ? 0 : -1}
                onClick={() => {
                  setPreference(opt.value);
                  close(true);
                }}
                className={cn(
                  "flex min-h-11 w-full items-center gap-3 px-4 text-left text-sm hover:bg-jmv-blue/10 hover:text-jmv-blue",
                  checked && "bg-jmv-blue/5 font-semibold text-jmv-blue",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span className="flex-1">{opt.label}</span>
                {checked && <Check className="h-4 w-4 shrink-0" aria-hidden />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ThemeSegmented({ className }: { className?: string }) {
  const { preference, setPreference } = useTheme();
  const labelId = useId();
  const { refs, onKeyDown } = useRovingRadios(preference, setPreference);

  return (
    <div className={className}>
      <p id={labelId} className="mb-2 px-1 text-sm font-semibold text-white/85">
        Tema
      </p>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        onKeyDown={onKeyDown}
        className="grid grid-cols-3 gap-1 rounded-xl bg-black/20 p-1 ring-1 ring-white/15"
      >
        {THEME_OPTIONS.map((opt, i) => {
          const Icon = ICONS[opt.value];
          const checked = preference === opt.value;
          return (
            <button
              key={opt.value}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              onClick={() => setPreference(opt.value)}
              className={cn(
                "flex min-h-11 items-center justify-center gap-2 rounded-lg px-2 text-sm font-semibold",
                checked
                  ? "bg-white text-jmv-blue shadow"
                  : "text-white/90 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
