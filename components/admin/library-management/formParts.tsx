"use client";

import { useId, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleAlert } from "lucide-react";

// Piezas de formulario compartidas por documentos y rutas (mismo estilo que el Año Vicenciano)

export const inputClass =
  "block min-h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-jmv-blue/30 aria-[invalid=true]:border-red-500 sm:min-h-10 border-slate-300 focus:border-jmv-blue";

export const selectClass =
  "min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] text-slate-900 focus:border-jmv-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-jmv-blue/15 sm:min-h-9";

export const iconButton =
  "inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jmv-blue/40 disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9";

export const toggleButton =
  "inline-flex min-h-11 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jmv-blue/40 disabled:opacity-60 sm:min-h-9";

export function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function Field({
  label,
  required,
  hint,
  error,
  counter,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  counter?: ReactNode;
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-semibold text-slate-700">
          {label}
          {required && (
            <span className="ml-0.5 text-red-600" aria-hidden>
              *
            </span>
          )}
          {required && <span className="sr-only"> (obligatorio)</span>}
        </label>
        {counter}
      </div>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {error ? (
        <p id={errorId} className="mt-1 flex items-center gap-1 text-xs font-medium text-red-700">
          <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}
      {hint ? (
        <p id={hintId} className="mt-1 text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function FormSection({
  title,
  step,
  children,
}: {
  title: string;
  step?: number;
  children: ReactNode;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-1 flex w-full items-center gap-3">
        {step ? (
          <span
            aria-hidden
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-jmv-blue text-[11px] font-bold text-white"
          >
            {step}
          </span>
        ) : null}
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
          {step ? <span className="sr-only">Paso {step}: </span> : null}
          {title}
        </span>
        <span className="h-px flex-1 bg-slate-200" aria-hidden />
      </legend>
      {children}
    </fieldset>
  );
}

export function ToggleCard({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <label
      className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border-2 p-3.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-jmv-blue/40 ${
        checked ? "border-jmv-blue bg-blue-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 accent-jmv-blue"
      />
      <span>
        <span className="block text-sm font-semibold text-slate-800">{label}</span>
        <span className="mt-0.5 block text-xs text-slate-500">{description}</span>
      </span>
    </label>
  );
}

/** Barra de subida con nombre accesible y porcentaje anunciado */
export function UploadBar({ percent, label }: { percent: number; label: string }) {
  const value = Math.min(100, Math.max(0, Math.round(percent)));
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-700">
        <span id="library-upload-label">{label}</span>
        <span className="tabular-nums">{value}%</span>
      </div>
      <div
        role="progressbar"
        aria-labelledby="library-upload-label"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-slate-200"
      >
        <div
          className="h-full rounded-full bg-jmv-blue transition-[width] duration-200 motion-reduce:transition-none"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

const TABS = [
  { href: "/admin/biblioteca", label: "Documentos" },
  { href: "/admin/biblioteca/rutas", label: "Rutas de formación" },
];

/** Navegación entre las dos secciones de la biblioteca */
export function LibraryTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Secciones de la biblioteca" className="mb-4 flex gap-1 rounded-xl border border-slate-200 bg-white p-1">
      {TABS.map((tab) => {
        const current = tab.href === "/admin/biblioteca" ? pathname === tab.href : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={current ? "page" : undefined}
            className={`flex min-h-11 flex-1 items-center justify-center rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jmv-blue/40 sm:min-h-9 sm:flex-none ${
              current ? "bg-jmv-blue text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
