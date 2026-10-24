import type { ReactNode } from "react";
import { AlertCircle, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Piezas comunes de los formularios públicos (Contacto y Únete): etiqueta
// asociada, marca de obligatorio, ayuda y error enlazados con aria-describedby.

export interface FieldControlProps {
  id: string;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
  "aria-required"?: true;
  className: string;
}

export function fieldClass(hasError: boolean) {
  return cn(
    "block min-h-12 w-full rounded-xl border-2 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 transition-colors focus:border-jmv-blue",
    hasError ? "border-red-600 bg-red-50/40" : "border-slate-300 hover:border-slate-400",
  );
}

export function FormField({
  id,
  label,
  required,
  hint,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: (props: FieldControlProps) => ReactNode;
}) {
  const hintId = hint ? `${id}-ayuda` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
        {required ? (
          <span className="text-red-700" aria-hidden="true">
            {" "}*
          </span>
        ) : (
          <span className="font-normal text-slate-600"> (opcional)</span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="-mt-1 mb-2 text-sm text-slate-600">
          {hint}
        </p>
      )}
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
        "aria-required": required ? true : undefined,
        className: fieldClass(Boolean(error)),
      })}
      {error && (
        <p id={errorId} className="mt-2 flex items-start gap-1.5 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

/** Campo trampa: invisible para personas y lectores de pantalla, solo lo rellenan bots */
export function HoneypotField({ inputProps }: { inputProps: Record<string, unknown> }) {
  return (
    <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
      <label htmlFor="website">Deja este campo vacío</label>
      <input id="website" type="text" tabIndex={-1} autoComplete="off" {...inputProps} />
    </div>
  );
}

export function RequiredNote() {
  return (
    <p className="text-sm text-slate-600">
      Los campos con <span className="text-red-700" aria-hidden="true">*</span>
      <span className="sr-only">asterisco</span> son obligatorios.
    </p>
  );
}

/** Error del servidor anunciado al momento, con WhatsApp como alternativa */
export function FormErrorAlert({ message, whatsapp }: { message: string; whatsapp?: string }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-xl border-2 border-red-200 bg-red-50 p-4">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" aria-hidden />
      <div className="text-sm text-red-800">
        <p className="font-semibold">{message}</p>
        {whatsapp && (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex min-h-11 items-center gap-2 font-semibold text-red-900 underline underline-offset-4"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Escribir por WhatsApp
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        )}
      </div>
    </div>
  );
}
