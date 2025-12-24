import React from "react";

interface Props {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  type?: string;
}

export default function InputField({ label, value, onChange, placeholder, error, required, type = "text" }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400 ${error ? "border-red-500 bg-red-50" : "border-gray-300"}`}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}

