import React from "react";

interface Props {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  type?: string;
  className?: string;
  hint?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

export default function InputField({
  label,
  value,
  onChange,
  placeholder,
  error,
  required,
  type = "text",
  className,
  hint,
  disabled,
  autoFocus,
}: Props) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-1 block text-xs font-semibold text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className={`block h-9 w-full rounded-md border bg-white px-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-jmv-blue/30 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${
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
