import Link from "next/link";
import { CalendarDays, Clock3, FileText, Instagram, MapPin, Users } from "lucide-react";
import CountdownClient from "./CountdownClient";
import EventActions from "./EventActions";
import SectionHeading from "@/components/ui/SectionHeading";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  fetchHomeUpcomingActivities,
  fetchPublicUpcomingActivities,
  onlyPublicUpcoming,
} from "@/lib/api/upcoming-activities.server";
import type { UpcomingActivityItem } from "@/types/activity-management";
import type { CalendarEvent } from "@/lib/calendar";
import { getOptimizedUrl, getSrcSet } from "@/lib/helpers/cloudinary";
import { formatDate, formatTime, toIsoString } from "@/lib/format";
import { SITE, SOCIAL_LINKS } from "@/lib/site";

const instagram = SOCIAL_LINKS.find((s) => s.network === "instagram");

function hasTime(value: string) {
  const t = formatTime(value);
  return t !== "" && t !== "00:00";
}

/** "sábado, 27 de noviembre de 2026, 09:00" o rango de días */
function dateLabel(start?: string | null, end?: string | null) {
  if (!start) return "Fecha por confirmar";
  const day = (v: string) =>
    formatDate(v, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const startDay = day(start);
  if (end && day(end) !== startDay) {
    return `Del ${formatDate(start, { day: "numeric", month: "long" })} al ${formatDate(end)}`;
  }
  return hasTime(start) ? `${startDay}, ${formatTime(start)}` : startDay;
}

function statusLabel(status?: string | null) {
  switch (status) {
    case "inscripciones_abiertas":
      return "Inscripciones abiertas";
    case "inscripciones_cerradas":
      return "Inscripciones cerradas";
    case "programado":
      return "Programado";
    case "proximo":
      return "Próximamente";
    default:
      return null;
  }
}

function badgeClass(status?: string | null) {
  switch (status) {
    case "inscripciones_abiertas":
      return "bg-emerald-300 text-slate-900";
    case "inscripciones_cerradas":
      return "bg-rose-200 text-rose-950";
    case "proximo":
      return "bg-jmv-gold text-jmv-ink";
    default:
      return "bg-white/15 text-white";
  }
}

function toCalendarEvent(item: UpcomingActivityItem): CalendarEvent | null {
  if (!item.startDate) return null;
  return {
    title: item.title,
    start: item.startDate,
    end: item.endDate ?? undefined,
    allDay: !hasTime(item.startDate),
    description: item.summary || item.description,
    location: item.location ?? undefined,
    url: `${SITE.url}/actividades#proximas`,
    uid: `${item.id}@jmvecuador.org`,
  };
}

function shareText(item: UpcomingActivityItem) {
  return `${item.title} · ${dateLabel(item.startDate, item.endDate)}${
    item.location ? ` · ${item.location}` : ""
  }. ¡Te espero en JMV Ecuador!`;
}

function StatusBadge({ status }: { status?: string | null }) {
  const label = statusLabel(status);
  if (!label) return null;
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${badgeClass(status)}`}>
      {label}
    </span>
  );
}

function EventDate({ item }: { item: UpcomingActivityItem }) {
  return item.startDate ? (
    <time dateTime={toIsoString(item.startDate)}>{dateLabel(item.startDate, item.endDate)}</time>
  ) : (
    <span>Fecha por confirmar</span>
  );
}

function Documents({ item, max }: { item: UpcomingActivityItem; max: number }) {
  if (!item.documents.length) return null;
  return (
    <div className="mt-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">Documentos</p>
      <ul className="flex flex-wrap gap-2">
        {item.documents.slice(0, max).map((document) => (
          <li key={document.id}>
            <a
              href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
            >
              <FileText className="h-4 w-4 text-jmv-gold-text" aria-hidden />
              {document.documentType || document.name || "Documento"}
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Agenda de próximas actividades.
 * - variant "home": las marcadas para el inicio, con enlace a /actividades.
 * - variant "page": todas las publicadas, dentro de /actividades#proximas.
 */
export default async function ProximasActividades({
  variant = "home",
}: {
  variant?: "home" | "page";
}) {
  const raw =
    variant === "page" ? await fetchPublicUpcomingActivities() : await fetchHomeUpcomingActivities();
  const items = onlyPublicUpcoming(raw);
  const featured = items.find((item) => item.featuredInHome) || items[0] || null;
  const rest = featured ? items.filter((item) => item.id !== featured.id) : [];
  const secondaryItems = variant === "page" ? rest : rest.slice(0, 3);
  const shareUrl = `${SITE.url}/actividades#proximas`;
  const headingId = variant === "page" ? "proximas-titulo" : "agenda-inicio-titulo";

  return (
    <section
      id={variant === "page" ? "proximas" : undefined}
      aria-labelledby={headingId}
      className="relative scroll-mt-32 overflow-hidden bg-gradient-to-br from-jmv-ink via-[#0C2D69] to-[#0C4EA6] py-16 sm:py-20"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id={headingId}
          align="left"
          eyebrow="Agenda JMV Ecuador"
          title="Próximas actividades"
          description={
            featured
              ? "Agrega la fecha a tu calendario y compártela con tus amigos."
              : undefined
          }
        />

        {!featured ? (
          <div className="rounded-[2rem] border border-white/15 bg-white/5 p-8 text-center sm:p-10">
            <h3 className="text-2xl font-semibold text-white">
              Pronto anunciaremos el próximo encuentro
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-slate-200">
              Síguenos en redes para enterarte primero de los retiros, encuentros y misiones.
            </p>
            {instagram && (
              <a
                href={instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "gold", size: "md", className: "mt-6" })}
              >
                <Instagram className="mr-2 h-5 w-5" aria-hidden />
                Seguir a JMV en Instagram
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_0.9fr]">
            <article
              aria-labelledby={`evento-${featured.id}`}
              className="overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.06] shadow-2xl"
            >
              <div className="flex flex-col lg:flex-row">
                <div className="order-2 flex-1 p-5 sm:p-6 lg:order-1 lg:p-8">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <StatusBadge status={featured.registrationStatus} />
                    {featured.type?.name ? (
                      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                        {featured.type.name}
                      </span>
                    ) : null}
                    {featured.pillar?.name ? (
                      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                        {featured.pillar.name}
                      </span>
                    ) : null}
                  </div>

                  <h3 id={`evento-${featured.id}`} className="text-2xl font-bold text-white lg:text-3xl">
                    {featured.title}
                  </h3>
                  <p className="mt-3 max-w-2xl leading-7 text-slate-200">
                    {featured.summary || featured.description}
                  </p>

                  <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <li className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white">
                      <CalendarDays className="h-5 w-5 shrink-0 text-jmv-gold-text" aria-hidden />
                      <span className="sr-only">Fecha: </span>
                      <EventDate item={featured} />
                    </li>
                    <li className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white">
                      <MapPin className="h-5 w-5 shrink-0 text-jmv-gold-text" aria-hidden />
                      <span className="sr-only">Lugar: </span>
                      {featured.location || "Lugar por confirmar"}
                    </li>
                    {featured.participantsLabel ? (
                      <li className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white">
                        <Users className="h-5 w-5 shrink-0 text-jmv-gold-text" aria-hidden />
                        <span className="sr-only">Participantes: </span>
                        {featured.participantsLabel}
                      </li>
                    ) : null}
                    {featured.maxRegistrationDate ? (
                      <li className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white">
                        <Clock3 className="h-5 w-5 shrink-0 text-jmv-gold-text" aria-hidden />
                        <span>
                          Inscripciones hasta el{" "}
                          <time dateTime={toIsoString(featured.maxRegistrationDate)}>
                            {formatDate(featured.maxRegistrationDate)}
                          </time>
                        </span>
                      </li>
                    ) : null}
                  </ul>

                  <CountdownClient
                    targetDate={
                      featured.countdownTargetType === "registration_close"
                        ? featured.maxRegistrationDate
                        : featured.startDate
                    }
                    countdownTargetType={featured.countdownTargetType}
                  />

                  <div className="mt-6">
                    <EventActions
                      title={featured.title}
                      event={toCalendarEvent(featured)}
                      registrationUrl={featured.externalUrl}
                      shareText={shareText(featured)}
                      shareUrl={shareUrl}
                    />
                  </div>

                  <Documents item={featured} max={4} />

                  {variant === "home" && (
                    <Link
                      href="/actividades#proximas"
                      className="mt-6 inline-flex min-h-11 items-center font-semibold text-jmv-gold-text underline underline-offset-4 hover:text-white"
                    >
                      Ver toda la agenda y las actividades realizadas
                    </Link>
                  )}
                </div>

                <div className="order-1 flex w-full shrink-0 items-center justify-center bg-white/5 p-4 lg:order-2 lg:w-2/5">
                  {featured.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getOptimizedUrl(featured.coverImageUrl, { w: 800 })}
                      srcSet={getSrcSet(featured.coverImageUrl, [400, 800, 1200])}
                      sizes="(min-width: 1280px) 30vw, (min-width: 1024px) 40vw, 100vw"
                      loading="lazy"
                      decoding="async"
                      alt=""
                      className="max-h-72 w-full rounded-2xl object-contain lg:max-h-none"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="h-40 w-full rounded-2xl bg-[linear-gradient(135deg,rgba(217,143,6,0.6),rgba(13,78,166,0.8))] sm:h-64"
                    />
                  )}
                </div>
              </div>
            </article>

            {secondaryItems.length > 0 && (
              <ul className="space-y-4">
                {secondaryItems.map((activity) => (
                  <li key={activity.id}>
                    <article
                      aria-labelledby={`evento-${activity.id}`}
                      className="rounded-[1.75rem] border border-white/15 bg-white/[0.06] p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">
                            {activity.type?.name || "Actividad"}
                          </p>
                          <h3 id={`evento-${activity.id}`} className="mt-2 text-xl font-semibold text-white">
                            {activity.title}
                          </h3>
                        </div>
                        <StatusBadge status={activity.registrationStatus} />
                      </div>

                      <ul className="mt-4 space-y-2 text-sm text-slate-100">
                        <li className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 shrink-0 text-jmv-gold-text" aria-hidden />
                          <span className="sr-only">Fecha: </span>
                          <EventDate item={activity} />
                        </li>
                        <li className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0 text-jmv-gold-text" aria-hidden />
                          <span className="sr-only">Lugar: </span>
                          {activity.location || "Lugar por confirmar"}
                        </li>
                      </ul>

                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-200">
                        {activity.summary || activity.description}
                      </p>

                      <div className="mt-4">
                        <EventActions
                          title={activity.title}
                          event={toCalendarEvent(activity)}
                          registrationUrl={activity.externalUrl}
                          shareText={shareText(activity)}
                          shareUrl={shareUrl}
                        />
                      </div>
                      <Documents item={activity} max={2} />
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
