"use client";

import { CalendarPlus, Download, ExternalLink, Share2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { downloadIcs, googleCalendarUrl, type CalendarEvent } from "@/lib/calendar";
import { whatsappShareLink } from "@/lib/whatsapp";

const secondary =
  "inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20";

const external = <span className="sr-only"> (se abre en una pestaña nueva)</span>;

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .toLowerCase()
    .replace(/^-|-$/g, "");
}

/**
 * Acciones de un evento: inscribirse (si hay enlace), agregar al calendario
 * (Google o archivo .ics para Apple/Outlook) y compartir por WhatsApp.
 */
export default function EventActions({
  title,
  event,
  registrationUrl,
  shareText,
  shareUrl,
}: {
  title: string;
  /** null cuando la actividad aún no tiene fecha */
  event: CalendarEvent | null;
  registrationUrl?: string | null;
  shareText: string;
  shareUrl: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {registrationUrl && (
          <a
            href={registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "gold", size: "md" })}
          >
            Inscribirme
            <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
            <span className="sr-only"> en {title}</span>
            {external}
          </a>
        )}
        <a
          href={whatsappShareLink(shareText, shareUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className={secondary}
        >
          <Share2 className="h-4 w-4 text-jmv-gold-text" aria-hidden />
          Compartir por WhatsApp
          {external}
        </a>
      </div>

      {event && (
        <div role="group" aria-label={`Agregar ${title} a mi calendario`} className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="w-full text-sm font-semibold text-slate-200 sm:w-auto" aria-hidden="true">
            Agregar a mi calendario:
          </span>
          <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className={secondary}>
            <CalendarPlus className="h-4 w-4 text-jmv-gold-text" aria-hidden />
            Google Calendar
            {external}
          </a>
          <button
            type="button"
            onClick={() => downloadIcs(event, `${slugify(title) || "evento-jmv"}.ics`)}
            className={secondary}
          >
            <Download className="h-4 w-4 text-jmv-gold-text" aria-hidden />
            Apple u Outlook (.ics)
          </button>
        </div>
      )}
    </div>
  );
}
