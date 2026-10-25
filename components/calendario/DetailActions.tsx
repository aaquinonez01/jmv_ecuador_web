"use client";

import { useEffect, useState } from "react";
import { ImageDown, Send, Share2 } from "lucide-react";
import { whatsappShareLink } from "@/lib/whatsapp";
import type { CalendarEvent } from "@/lib/calendar";
import AddToCalendarMenu from "./AddToCalendarMenu";

const secondary =
  "inline-flex min-h-11 w-full items-center gap-3 rounded-xl border border-line-strong bg-surface px-4 py-2 text-sm font-semibold text-fg transition-colors hover:bg-surface-2 dark:hover:bg-white/15";

// Agregar al calendario, compartir (WhatsApp o el menú del sistema) y descargar la imagen para historias.
export default function DetailActions({
  event,
  filename,
  shareText,
  shareUrl,
  storyHref,
  storyFilename,
}: {
  event: CalendarEvent;
  filename: string;
  shareText: string;
  shareUrl: string;
  storyHref: string;
  storyFilename: string;
}) {
  const [canShare, setCanShare] = useState(false);
  useEffect(() => setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function"), []);

  const share = async () => {
    try {
      await navigator.share({ title: event.title, text: shareText, url: shareUrl });
    } catch {
      // El usuario canceló o el navegador no lo permite
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <AddToCalendarMenu event={event} filename={filename} variant="gold" className="w-full justify-start" />
      <a href={whatsappShareLink(shareText, shareUrl)} target="_blank" rel="noopener noreferrer" className={secondary}>
        <Send className="h-4 w-4 text-accent-gold" aria-hidden />
        Compartir por WhatsApp
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      </a>
      <a href={storyHref} download={storyFilename} className={secondary}>
        <ImageDown className="h-4 w-4 text-accent-gold" aria-hidden />
        Descargar para mi historia
      </a>
      {canShare && (
        <button type="button" onClick={share} className={secondary}>
          <Share2 className="h-4 w-4 text-accent-gold" aria-hidden />
          Compartir…
        </button>
      )}
    </div>
  );
}
