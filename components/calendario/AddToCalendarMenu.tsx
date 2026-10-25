"use client";

import { DropdownMenu } from "radix-ui";
import { CalendarPlus, ChevronDown, Download, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { downloadIcs, googleCalendarUrl, type CalendarEvent } from "@/lib/calendar";

const itemClass =
  "flex min-h-11 cursor-pointer select-none items-center gap-3 rounded-xl px-3 text-sm font-medium text-fg outline-none data-highlighted:bg-surface-2";

/**
 * "Agregar a mi calendario": menú con Google Calendar y archivo .ics (Apple/Outlook).
 * El evento es de día completo en la próxima vez que cae la fecha.
 */
export default function AddToCalendarMenu({
  event,
  filename,
  label = "Agregar a mi calendario",
  className,
  variant = "soft",
}: {
  event: CalendarEvent;
  filename: string;
  label?: string;
  className?: string;
  variant?: "soft" | "gold";
}) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        className={cn(
          "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
          variant === "gold"
            ? "bg-jmv-gold text-jmv-ink hover:bg-jmv-gold-text"
            : "border border-jmv-blue/25 bg-surface text-fg shadow-card hover:bg-jmv-blue/10 dark:border-white/25 dark:bg-white/10 dark:hover:bg-white/20",
          className,
        )}
      >
        <CalendarPlus className={cn("h-4 w-4", variant === "soft" && "text-accent-gold")} aria-hidden />
        {label}
        <ChevronDown className="h-4 w-4 opacity-80" aria-hidden />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={8}
          className="z-50 min-w-60 rounded-2xl border border-line bg-surface-raised p-1.5 shadow-card-lg dark:border-white/15 dark:bg-[#13213b] dark:shadow-2xl dark:shadow-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <DropdownMenu.Item asChild className={itemClass}>
            <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 text-accent-gold" aria-hidden />
              Google Calendar
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </DropdownMenu.Item>
          <DropdownMenu.Item className={itemClass} onSelect={() => downloadIcs(event, filename)}>
            <Download className="h-4 w-4 text-accent-gold" aria-hidden />
            Apple u Outlook (.ics)
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
