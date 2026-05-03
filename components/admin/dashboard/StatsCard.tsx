import React from "react";

export interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
  subtitle?: string;
}

export default function StatsCard({
  icon,
  label,
  value,
  color = "blue",
  subtitle,
}: StatsCardProps) {
  const colorStyles = {
    blue: "bg-jmv-blue/10 text-jmv-blue",
    green: "bg-emerald-50 text-emerald-600",
    yellow: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-3.5 transition-all hover:border-slate-300 hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colorStyles[color]} transition-transform group-hover:scale-105`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-0.5 text-[20px] font-bold leading-tight text-slate-900">
            {value}
          </p>
          {subtitle ? (
            <p className="mt-0.5 truncate text-[10.5px] text-slate-400">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
