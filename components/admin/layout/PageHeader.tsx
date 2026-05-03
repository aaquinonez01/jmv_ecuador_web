"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  /** Optional accent icon shown next to the title */
  icon?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  icon,
}: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      {/* Top brand accent */}
      <div className="h-[3px] bg-gradient-to-r from-jmv-blue via-jmv-blue/70 to-jmv-gold" />

      <div className="flex flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <nav
              aria-label="Breadcrumb"
              className="mb-3 flex items-center gap-1.5 text-[13px] text-slate-400"
            >
              <Link
                href="/admin"
                className="flex items-center gap-1 font-semibold text-slate-400 transition-colors hover:text-jmv-blue"
              >
                <Home className="h-3.5 w-3.5" strokeWidth={2.4} />
                Admin
              </Link>
              {breadcrumbs.map((item, index) => (
                <div key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                  <ChevronRight
                    className="h-3.5 w-3.5 text-slate-300"
                    strokeWidth={2.4}
                  />
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="font-medium text-slate-500 transition-colors hover:text-jmv-blue"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="font-bold text-jmv-blue">{item.label}</span>
                  )}
                </div>
              ))}
            </nav>
          ) : null}

          <div className="flex items-center gap-3">
            {icon ? (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-jmv-blue/15 to-jmv-blue/5 text-jmv-blue ring-1 ring-jmv-blue/15">
                {icon}
              </span>
            ) : null}
            <div className="min-w-0">
              <h1 className="truncate text-[24px] font-bold leading-tight text-slate-900">
                {title}
              </h1>
              {description ? (
                <p className="mt-0.5 truncate text-[13px] text-slate-500">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}
