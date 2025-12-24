"use client";

import { LayoutGrid, List } from "lucide-react";

export type ViewMode = "grid" | "list";

export interface ViewToggleProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center bg-white border-2 border-gray-200 rounded-xl p-1">
      <button
        onClick={() => onViewChange("grid")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          view === "grid"
            ? "bg-gradient-to-r from-[#0066CC] to-[#004C99] text-white shadow-sm"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        }`}
        aria-label="Vista en cuadrícula"
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="text-sm font-medium">Grid</span>
      </button>
      <button
        onClick={() => onViewChange("list")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          view === "list"
            ? "bg-gradient-to-r from-[#0066CC] to-[#004C99] text-white shadow-sm"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        }`}
        aria-label="Vista en lista"
      >
        <List className="w-4 h-4" />
        <span className="text-sm font-medium">Lista</span>
      </button>
    </div>
  );
}
