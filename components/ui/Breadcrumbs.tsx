import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

export interface BreadcrumbItem {
  label: string;
  /** Sin href = página actual */
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Añade "Inicio" al principio (por defecto sí) */
  includeHome?: boolean;
  /** Emite JSON-LD BreadcrumbList para buscadores */
  jsonLd?: boolean;
  /** "dark" para fondos oscuros/fotografía, "light" para fondos claros */
  tone?: "dark" | "light";
  className?: string;
}

export default function Breadcrumbs({
  items,
  includeHome = true,
  jsonLd = false,
  tone = "dark",
  className,
}: BreadcrumbsProps) {
  const all: BreadcrumbItem[] = includeHome ? [{ label: "Inicio", href: "/" }, ...items] : items;

  const structured = jsonLd
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: all.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.label,
          ...(item.href ? { item: new URL(item.href, SITE.url).toString() } : {}),
        })),
      }
    : null;

  return (
    <nav aria-label="Ruta de navegación" className={className}>
      <ol
        className={cn(
          "flex flex-wrap items-center gap-x-1 gap-y-1 text-sm",
          tone === "dark" ? "text-white/80" : "text-slate-600",
        )}
      >
        {all.map((item, i) => {
          const isLast = i === all.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    "rounded px-1 py-1 underline-offset-4 hover:underline",
                    tone === "dark" ? "hover:text-white" : "hover:text-jmv-blue",
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn("px-1 py-1 font-medium", tone === "dark" ? "text-white" : "text-slate-900")}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-3.5 w-3.5 opacity-70" aria-hidden />}
            </li>
          );
        })}
      </ol>
      {structured && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }}
        />
      )}
    </nav>
  );
}
