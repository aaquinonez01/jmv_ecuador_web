"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { AlertCircle, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  id: string;
  label?: string;
  error?: string;
  hint?: string;
}

const EmailField = forwardRef<HTMLInputElement, EmailFieldProps>(
  function EmailField(
    { id, label = "Correo electrónico", error, hint, className, ...props },
    ref
  ) {
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
          <Mail
            className={cn(
              "pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2",
              error ? "text-red-600" : "text-gray-500"
            )}
            aria-hidden="true"
          />
          <input
            ref={ref}
            id={id}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              "min-h-12 w-full rounded-xl border-2 py-3 pr-4 pl-12 text-base text-gray-900 placeholder:text-gray-500 transition-colors",
              error
                ? "border-red-600 bg-red-50/50"
                : "border-gray-300 hover:border-gray-400 focus:border-jmv-blue",
              className
            )}
            {...props}
          />
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

export default EmailField;
