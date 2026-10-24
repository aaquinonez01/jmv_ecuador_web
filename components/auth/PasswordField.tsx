"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { AlertCircle, Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  id: string;
  label: string;
  error?: string;
  /** Texto de ayuda visible bajo el campo */
  hint?: string;
}

// Campo de contraseña con botón mostrar/ocultar y mensajes asociados por aria-describedby
const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField({ id, label, error, hint, className, ...props }, ref) {
    const [visible, setVisible] = useState(false);
    const hintId = hint ? `${id}-ayuda` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

    return (
      <div>
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          {label}
        </label>
        <div className="relative">
          <Lock
            className={cn(
              "pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2",
              error ? "text-red-600" : "text-gray-500"
            )}
            aria-hidden="true"
          />
          <input
            ref={ref}
            id={id}
            type={visible ? "text" : "password"}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              "min-h-12 w-full rounded-xl border-2 py-3 pr-14 pl-12 text-base text-gray-900 placeholder:text-gray-500 transition-colors",
              error
                ? "border-red-600 bg-red-50/50"
                : "border-gray-300 hover:border-gray-400 focus:border-jmv-blue",
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={visible}
            aria-controls={id}
            className="absolute top-1/2 right-1 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-jmv-blue"
          >
            {visible ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
        {error ? (
          <p
            id={errorId}
            className="mt-2 flex items-start gap-1.5 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        ) : null}
        {hint ? (
          <p id={hintId} className="mt-2 text-sm text-gray-600">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

export default PasswordField;
