"use server";

import Link from "next/link";
import { CalendarDays, Camera, MapPin } from "lucide-react";
import type { ActivityItem, PaginatedResponse } from "@/types/activity-management";

function formatDate(value?: string | null) {
  if (!value) return "Por confirmar";
  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function ActivitiesGalleryServer() {
  const base = (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3002/api"
  ).replace(/\/+$/, "");

  let items: ActivityItem[] = [];

  try {
    const res = await fetch(`${base}/activities/public?limit=3`, {
      next: { revalidate: 300, tags: ["activities_public_home"] },
    });

    if (!res.ok) {
      throw new Error("No se pudo cargar actividades");
    }

    const data = (await res.json()) as PaginatedResponse<ActivityItem>;
    items = data.items || [];
  } catch {
    items = [];
  }

  if (!items.length) {
    return null;
  }

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#081633_0%,#0C275F_50%,#0A1638_100%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-white/80">
              Actividades realizadas
            </span>
            <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
              Historias recientes de misión, encuentro y servicio
            </h2>
          </div>
          <Link
            href="/actividades"
            className="inline-flex h-fit items-center rounded-xl bg-jmv-gold px-5 py-3 font-semibold text-slate-900 transition hover:bg-amber-300"
          >
            Ver todas las actividades
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {items.map((activity) => (
            <article
              key={activity.id}
              className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/6 shadow-xl backdrop-blur-sm"
            >
              <div className="relative h-64 bg-slate-900/40">
                {activity.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activity.coverImageUrl}
                    alt={activity.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/40">
                    <Camera className="h-10 w-10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07132F] via-[#07132F]/20 to-transparent" />
                <div className="absolute right-4 bottom-4 left-4 flex flex-wrap gap-2">
                  {activity.type?.name ? (
                    <span className="rounded-full bg-white/14 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                      {activity.type.name}
                    </span>
                  ) : null}
                  {activity.pillar?.name ? (
                    <span className="rounded-full bg-jmv-gold px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">
                      {activity.pillar.name}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="space-y-4 p-6 text-white">
                <div>
                  <h3 className="text-2xl font-semibold">{activity.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/70">
                    {activity.summary || activity.description}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-white/72">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-jmv-gold" />
                    <span>{formatDate(activity.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-jmv-gold" />
                    <span>{activity.location || "Lugar por confirmar"}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
