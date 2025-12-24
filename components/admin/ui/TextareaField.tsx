import React from "react";

interface Props {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  rows?: number;
}

export default function TextareaField({ label, value, onChange, placeholder, error, rows = 3 }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400 resize-none ${error ? "border-red-500 bg-red-50" : "border-gray-300"}`}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}

