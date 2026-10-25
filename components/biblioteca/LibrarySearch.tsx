"use client";

import { Suspense, useEffect, useId, useState, type ChangeEvent, type FormEvent } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLibraryFilters } from "./useLibraryFilters";

interface Props {
  label: string;
  placeholder?: string;
  size?: "lg" | "md";
  className?: string;
}

function Field({ label, placeholder, size = "lg", className, value, onChange }: Props & { value: string; onChange?: (v: string) => void }) {
  const id = useId();
  const lg = size === "lg";

  const submit = (e: FormEvent) => {
    // Sin JS el formulario va a /biblioteca?q=…; con JS solo baja a los resultados
    if (!onChange) return;
    e.preventDefault();
    const target = document.getElementById("explorar");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    (document.activeElement as HTMLElement | null)?.blur();
  };

  return (
    <form role="search" action="/biblioteca#explorar" method="get" onSubmit={submit} className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-jmv-blue",
          lg ? "left-5 h-6 w-6" : "left-4 h-5 w-5",
        )}
      />
      <input
        id={id}
        type="search"
        name="q"
        {...(onChange ? { value, onChange: (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value) } : { defaultValue: value })}
        placeholder={placeholder}
        autoComplete="off"
        enterKeyHint="search"
        className={cn(
          // Campo blanco en los dos temas; en claro se separa del marfil con borde y sombra suave
          "w-full rounded-full border-0 bg-white text-jmv-ink shadow-card-lg ring-1 ring-jmv-ink/15 placeholder:text-slate-500 dark:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)] dark:ring-white/30",
          "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus",
          "[&::-webkit-search-cancel-button]:appearance-none",
          lg ? "min-h-16 pl-14 pr-14 text-lg" : "min-h-12 pl-12 pr-12 text-base",
        )}
      />
      {value && onChange && (
        <button
          type="button"
          onClick={() => onChange("")}
          className={cn(
            "absolute top-1/2 grid -translate-y-1/2 place-items-center rounded-full text-slate-600 hover:bg-slate-100 hover:text-jmv-ink",
            lg ? "right-2.5 h-11 w-11" : "right-1 h-11 w-11",
          )}
        >
          <X className="h-5 w-5" aria-hidden />
          <span className="sr-only">Borrar búsqueda</span>
        </button>
      )}
    </form>
  );
}

function Connected(props: Props) {
  const { filters, setFilters } = useLibraryFilters();
  const [value, setValue] = useState(filters.q);

  // Si la URL cambia desde fuera (p. ej. "Limpiar filtros"), se refleja aquí
  useEffect(() => {
    setValue((v) => (v === filters.q ? v : filters.q));
  }, [filters.q]);

  const change = (v: string) => {
    setValue(v);
    setFilters({ q: v });
  };

  return <Field {...props} value={value} onChange={change} />;
}

/** Buscador de la biblioteca: escribe en ?q= y filtra al instante. */
export default function LibrarySearch(props: Props) {
  return (
    <Suspense fallback={<Field {...props} value="" />}>
      <Connected {...props} />
    </Suspense>
  );
}
