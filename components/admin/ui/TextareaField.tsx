import React from "react";

interface Props {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  rows?: number;
  required?: boolean;
  className?: string;
  hint?: string;
}

export default function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  error,
  rows = 3,
  required,
  className,
  hint,
}: Props) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-1 block text-xs font-semibold text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`block w-full resize-none rounded-md border bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-jmv-blue/30 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
            : "border-slate-300 focus:border-jmv-blue"
        }`}
      />
      {error ? (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}
