import { CalendarPlus, ExternalLink } from "lucide-react";
import { StarsRing } from "@/components/brand";
import { buttonVariants } from "@/components/ui/button-variants";
import CopyLinkButton from "./CopyLinkButton";
import { FEED_GOOGLE, FEED_HTTPS, FEED_WEBCAL } from "./shared";

// Suscripción al calendario completo: las fechas aparecen solas en el celular y se actualizan.
export default function SubscribeBlock() {
  return (
    <section aria-labelledby="suscribete" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative isolate overflow-hidden rounded-[2rem] border border-accent-gold/30 bg-[linear-gradient(135deg,#e6eef9_0%,#f8f4ec_60%,#f6e6c4_100%)] p-8 shadow-card sm:p-12 dark:bg-[linear-gradient(135deg,#132a4f_0%,#0d1a33_60%,#2a1a0a_100%)]">
        <StarsRing
          withCircle
          className="pointer-events-none absolute -right-20 -top-20 -z-10 h-80 w-80 text-accent-gold/15 sm:h-[26rem] sm:w-[26rem]"
        />
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-accent-gold">Que no se te pase ninguna</p>
          <h2 id="suscribete" className="font-display text-3xl font-semibold leading-tight text-fg sm:text-4xl">
            Suscríbete al Año Vicenciano
          </h2>
          <p className="mt-4 text-base leading-relaxed text-fg-soft sm:text-lg">
            Agrega todas las fechas a tu calendario con un toque. Cuando sumemos nuevas fiestas o actividades, se
            actualizan solas en tu celular.
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={FEED_GOOGLE}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "gold", size: "md" })}
          >
            <CalendarPlus className="mr-2 h-5 w-5" aria-hidden />
            Añadir a Google Calendar
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
          <a href={FEED_WEBCAL} className={buttonVariants({ variant: "outlineAuto", size: "md" })}>
            <ExternalLink className="mr-2 h-5 w-5" aria-hidden />
            Apple / Outlook
          </a>
          <CopyLinkButton value={FEED_HTTPS} label="Copiar enlace del calendario" />
        </div>
        <p className="mt-5 text-sm text-fg-muted">
          En Android usa Google Calendar. En iPhone, Mac u Outlook toca «Apple / Outlook» y confirma la suscripción.
        </p>
      </div>
    </section>
  );
}
