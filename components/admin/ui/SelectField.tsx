import React from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  id: string;
  name: string;
}

interface Props {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  className?: string;
  required?: boolean;
  hint?: string;
  disabled?: boolean;
  placeholder?: string;
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  className,
  required,
  hint,
  disabled,
  placeholder,
}: Props) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-1 block text-xs font-semibold text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="block h-9 w-full cursor-pointer appearance-none rounded-md border border-slate-300 bg-white pl-3 pr-9 text-sm text-slate-900 transition-colors hover:border-slate-400 focus:border-jmv-blue focus:outline-none focus:ring-2 focus:ring-jmv-blue/30 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
        >
          {placeholder ? (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          ) : null}
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          strokeWidth={2.2}
        />
      </div>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
