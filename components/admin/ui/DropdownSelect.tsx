import React, { useEffect, useRef, useState } from "react";

interface Option {
  id: string;
  name: string;
}

interface Props {
  label: string;
  value?: string;
  options: Option[];
  onChange: (id: string) => void;
  placeholder?: string;
}

export default function DropdownSelect({ label, value, options, onChange, placeholder = "Selecciona una opción" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.id === (value ?? ""));

  return (
    <div className="relative" ref={ref}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full px-4 py-2.5 rounded-lg border bg-white text-gray-900 text-left flex items-center justify-between transition-all ${
          open ? "border-[#0066CC] ring-2 ring-[#0066CC]" : "border-gray-300 hover:border-[#0066CC]"
        }`}
      >
        <span className={`${selected ? "text-gray-900" : "text-gray-400"}`}>
          {selected ? selected.name : placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <ul className="max-h-52 overflow-auto">
            {options.map((o) => {
              const isActive = o.id === (value ?? "");
              return (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(o.id);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      isActive ? "bg-[#0066CC]/10 text-[#004C99]" : "hover:bg-gray-50 text-gray-800"
                    }`}
                  >
                    {o.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

