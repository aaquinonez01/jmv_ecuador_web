"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  ExternalLink,
  FileText,
  MapPin,
  Users,
} from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";
import { Skeleton } from "../ui/Skeleton";
import { getHomeUpcomingActivitiesAPI } from "@/actions/upcoming-activities";
import type { UpcomingActivityItem } from "@/types/activity-management";

function formatDate(value?: string | null) {
  if (!value) return "Por confirmar";
  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function useCountdown(targetDate?: string | null) {
  const calculate = () => {
    if (!targetDate) return null;

    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, isFinished: false };
  };

  const [countdown, setCountdown] = useState(calculate);

  useEffect(() => {
    setCountdown(calculate());
    if (!targetDate) return;

    const interval = window.setInterval(() => {
      setCountdown(calculate());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  return countdown;
}

function Countdown({
  activity,
}: {
  activity: UpcomingActivityItem;
}) {
  const target =
    activity.countdownTargetType === "registration_close"
      ? activity.maxRegistrationDate
      : activity.startDate;
  const countdown = useCountdown(target);

  if (!target || !countdown) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-white/75">
        Define una fecha del evento o de cierre para activar el contador.
      </div>
    );
  }

  if (countdown.isFinished) {
    return (
      <div className="rounded-2xl border border-amber-300/20 bg-amber-500/10 p-4 text-amber-100">
        {activity.countdownTargetType === "registration_close"
          ? "La fecha máxima de inscripción ya venció."
          : "La fecha del evento ya llegó o pasó."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      {[
        { label: "Días", value: countdown.days },
        { label: "Horas", value: countdown.hours },
        { label: "Min", value: countdown.minutes },
        { label: "Seg", value: countdown.seconds },
      ].map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-white/15 bg-white/10 px-2 py-3 text-center backdrop-blur-sm sm:px-3 sm:py-4"
        >
          <div className="text-xl font-bold text-white sm:text-2xl">{item.value}</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/65 sm:text-xs sm:tracking-[0.25em]">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
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
    case "draft":
      return "Borrador";
    default:
      return "Próximo evento";
  }
}

function badgeClass(status?: string | null) {
  switch (status) {
    case "inscripciones_abiertas":
      return "bg-emerald-400 text-slate-900";
    case "inscripciones_cerradas":
      return "bg-rose-500 text-white";
    case "programado":
      return "bg-sky-500 text-white";
    case "proximo":
      return "bg-amber-400 text-slate-900";
    default:
      return "bg-white/15 text-white";
  }
}

function ProximasActividadesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr,0.9fr]">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 shadow-2xl backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 p-5 sm:p-6 lg:p-8">
            <div className="mb-4 flex gap-2">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-8 w-3/4 rounded-xl" />
            <Skeleton className="mt-2 h-4 w-full rounded-lg" />
            <Skeleton className="mt-1 h-4 w-5/6 rounded-lg" />
            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Skeleton className="h-12 rounded-2xl" />
              <Skeleton className="h-12 rounded-2xl" />
              <Skeleton className="h-12 rounded-2xl" />
              <Skeleton className="h-12 rounded-2xl" />
            </div>
            <Skeleton className="mt-5 h-4 w-16 rounded-lg" />
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Skeleton className="h-11 w-36 rounded-xl" />
              <Skeleton className="h-11 w-44 rounded-xl" />
            </div>
          </div>
          <div className="flex w-full shrink-0 items-center justify-center bg-white/5 p-4 lg:w-2/5">
            <Skeleton className="h-48 w-full rounded-2xl sm:h-64" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-48 rounded-[1.75rem]" />
        <Skeleton className="h-48 rounded-[1.75rem]" />
        <Skeleton className="h-48 rounded-[1.75rem]" />
      </div>
    </div>
  );
}

export default function ProximasActividades() {
  const [items, setItems] = useState<UpcomingActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHomeUpcomingActivitiesAPI()
      .then((res) => setItems(res.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const featured = useMemo(() => {
    return items.find((item) => item.featuredInHome) || items[0] || null;
  }, [items]);

  const secondaryItems = useMemo(() => {
    if (!featured) return [];
    return items.filter((item) => item.id !== featured.id).slice(0, 3);
  }, [featured, items]);

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_35%),linear-gradient(135deg,#0D1B52_0%,#0C4EA6_48%,#06163F_100%)]" />
      <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-jmv-gold/15 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" delay={50}>
          <div className="mb-10 max-w-3xl">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85 backdrop-blur-sm">
              Agenda JMV Ecuador
            </span>
            <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Próximas actividades
            </h2>
          </div>
        </ScrollReveal>

        {loading ? (
          <ProximasActividadesSkeleton />
        ) : !featured ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-sm">
            <h3 className="text-2xl font-semibold text-white">
              Aún no hay próximas actividades publicadas
            </h3>
            <p className="mt-3 text-white/70">
              Desde el panel admin puedes crear la primera actividad futura y
              marcarla para mostrarse en el home.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr,0.9fr]">
            <ScrollReveal direction="up" delay={120}>
              <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 shadow-2xl backdrop-blur-sm">
                <div className="flex flex-col lg:flex-row">
                  <div className="order-2 flex-1 p-5 sm:p-6 lg:order-1 lg:p-8">
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${badgeClass(
                          featured.registrationStatus
                        )}`}
                      >
                        {statusLabel(featured.registrationStatus)}
                      </span>
                      {featured.type?.name ? (
                        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                          {featured.type.name}
                        </span>
                      ) : null}
                      {featured.pillar?.name ? (
                        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                          {featured.pillar.name}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="text-2xl font-bold text-white lg:text-3xl">
                      {featured.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/78">
                      {featured.summary || featured.description}
                    </p>

                    <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white/85">
                        <CalendarDays className="h-5 w-5 text-jmv-gold" />
                        <span>{formatDate(featured.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white/85">
                        <MapPin className="h-5 w-5 text-jmv-gold" />
                        <span>{featured.location || "Lugar por confirmar"}</span>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white/85">
                        <Users className="h-5 w-5 text-jmv-gold" />
                        <span>
                          {featured.participantsLabel || "Participantes por confirmar"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white/85">
                        <Clock3 className="h-5 w-5 text-jmv-gold" />
                        <span>
                          Límite inscripción:{" "}
                          {formatDate(featured.maxRegistrationDate)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                        ¡Faltan!
                      </p>
                      <Countdown activity={featured} />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {featured.externalUrl ? (
                        <a
                          href={featured.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-jmv-gold px-5 py-3 font-semibold text-slate-900 transition hover:bg-amber-300"
                        >
                          Ir al enlace oficial
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : null}
                      <Link
                        href="/actividades"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/15"
                      >
                        Ver actividades realizadas
                      </Link>
                    </div>

                    {featured.documents.length ? (
                      <div className="mt-5">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                          Documentos
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {featured.documents.slice(0, 4).map((document) => (
                            <a
                              key={document.id}
                              href={document.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/15"
                            >
                              <FileText className="h-4 w-4 text-jmv-gold" />
                              {document.documentType || "Documento"}
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="order-1 flex w-full shrink-0 items-center justify-center bg-white/5 p-4 lg:order-2 lg:w-2/5">
                    {featured.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={featured.coverImageUrl}
                        alt={featured.title}
                        className="max-h-72 w-full rounded-2xl object-contain lg:max-h-none"
                      />
                    ) : (
                      <div className="h-48 w-full rounded-2xl bg-[linear-gradient(135deg,rgba(217,143,6,0.6),rgba(13,78,166,0.8))] sm:h-64" />
                    )}
                  </div>
                </div>
              </article>
            </ScrollReveal>

            <div className="space-y-4">
              {secondaryItems.map((activity, index) => (
                <ScrollReveal
                  key={activity.id}
                  direction="up"
                  delay={170 + index * 50}
                >
                  <article className="rounded-[1.75rem] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
                          {activity.type?.name || "Actividad"}
                        </p>
                        <h4 className="mt-2 text-xl font-semibold text-white">
                          {activity.title}
                        </h4>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${badgeClass(
                          activity.registrationStatus
                        )}`}
                      >
                        {statusLabel(activity.registrationStatus)}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-white/72">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-jmv-gold" />
                        <span>{formatDate(activity.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-jmv-gold" />
                        <span>{activity.location || "Lugar por confirmar"}</span>
                      </div>
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/70">
                      {activity.summary || activity.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {activity.externalUrl ? (
                        <a
                          href={activity.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/85 transition hover:bg-white/15"
                        >
                          Link
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : null}
                      {activity.documents.slice(0, 2).map((document) => (
                        <a
                          key={document.id}
                          href={document.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/85 transition hover:bg-white/15"
                        >
                          <FileText className="h-4 w-4 text-jmv-gold" />
                          {document.documentType || "Documento"}
                        </a>
                      ))}
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
