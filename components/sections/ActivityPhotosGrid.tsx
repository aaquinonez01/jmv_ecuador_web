"use client";

import { Images } from "lucide-react";
import type { ActivityItem } from "@/types/activity-management";
import { getOptimizedUrl, getSrcSet } from "@/lib/helpers/cloudinary";
import { formatDate, toIsoString } from "@/lib/format";
import type { AlbumSlide } from "./ActivitiesAlbumsClient";

/**
 * Vista "Todas las fotos": las fotos de cada actividad en una cuadrícula, agrupadas
 * por actividad. Tocar una foto la abre a pantalla completa con el resto del álbum.
 */
export default function ActivityPhotosGrid({
  items,
  slidesFor,
  onOpenPhoto,
  onOpenAlbum,
}: {
  items: ActivityItem[];
  slidesFor: (activity: ActivityItem) => AlbumSlide[];
  onOpenPhoto: (activity: ActivityItem, index: number) => void;
  onOpenAlbum: (activity: ActivityItem) => void;
}) {
  const groups = items
    .map((activity) => ({ activity, slides: slidesFor(activity) }))
    .filter((g) => g.slides.length > 0);

  if (groups.length === 0) {
    return (
      <div className="rounded-[2rem] border border-line-card bg-surface-card p-8 text-center shadow-card sm:p-10">
        <h3 className="text-2xl font-semibold text-fg">Aún no hay fotos en estas actividades</h3>
        <p className="mt-2 text-fg-soft">Prueba con otro pilar o vuelve a la vista de álbumes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {groups.map(({ activity, slides }) => {
        const titleId = `fotos-${activity.id}`;
        return (
          <section key={activity.id} aria-labelledby={titleId}>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
              <div>
                <h3 id={titleId} className="text-lg font-bold text-fg sm:text-xl">
                  {activity.title}
                </h3>
                <p className="text-sm text-fg-soft">
                  {activity.startDate && (
                    <time dateTime={toIsoString(activity.startDate)}>
                      {formatDate(activity.startDate, { day: "numeric", month: "long", year: "numeric" })}
                    </time>
                  )}
                  {activity.startDate ? " · " : ""}
                  {slides.length === 1 ? "1 foto" : `${slides.length} fotos`}
                  {activity.pillar?.name ? ` · ${activity.pillar.name}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenAlbum(activity)}
                className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-accent-gold underline underline-offset-4 hover:text-fg"
              >
                <Images className="h-4 w-4" aria-hidden />
                Ver como álbum
              </button>
            </div>

            <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-2 lg:grid-cols-6">
              {slides.map((slide, index) => (
                <li key={`${slide.src}-${index}`}>
                  <button
                    type="button"
                    onClick={() => onOpenPhoto(activity, index)}
                    aria-label={`Ver en grande: ${slide.alt} (${index + 1} de ${slides.length})`}
                    className="group relative block aspect-square w-full overflow-hidden rounded-lg bg-surface-2 sm:rounded-xl"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getOptimizedUrl(slide.src, { w: 320 })}
                      srcSet={getSrcSet(slide.src, [200, 320, 480])}
                      sizes="(min-width: 1024px) 200px, (min-width: 640px) 25vw, 33vw"
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
