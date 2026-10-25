import Link from "next/link";
import { CalendarDays, Camera, MapPin } from "lucide-react";
import { ssrFetch } from "@/lib/helpers/apiBase";
import type { ActivityItem, PaginatedResponse } from "@/types/activity-management";
import { getOptimizedUrl, getSrcSet } from "@/lib/helpers/cloudinary";
import { formatDate, toIsoString } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button-variants";

// Últimas actividades realizadas en el inicio, con enlace a los álbumes completos
export default async function ActivitiesGalleryServer() {
  let items: ActivityItem[] = [];

  const res = await ssrFetch("/activities/public?limit=3", {
    revalidate: 86400,
    tags: ["activities_public_home"],
  });
  if (res) {
    try {
      const data = (await res.json()) as PaginatedResponse<ActivityItem>;
      items = data.items || [];
    } catch {
      items = [];
    }
  }

  if (!items.length) {
    return null;
  }

  return (
    <section aria-labelledby="galeria-inicio-titulo" className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--page)_0%,var(--section-blue)_50%,var(--page-deep)_100%)] dark:bg-[linear-gradient(180deg,#081633_0%,#0C275F_50%,#0A1638_100%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-gold">
              Actividades realizadas
            </p>
            <h2 id="galeria-inicio-titulo" className="mt-3 text-3xl font-bold text-fg sm:text-4xl">
              Historias recientes de misión, encuentro y servicio
            </h2>
          </div>
          <Link
            href="/actividades#realizadas"
            className={buttonVariants({ variant: "gold", size: "md", className: "self-start lg:self-auto" })}
          >
            Ver todos los álbumes
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((activity) => (
            <li key={activity.id}>
              <article className="h-full overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-card dark:border-white/15 dark:shadow-xl">
                <div className="relative aspect-[4/3] bg-surface-sunken dark:bg-slate-900/40">
                  {activity.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getOptimizedUrl(activity.coverImageUrl, { w: 800 })}
                      srcSet={getSrcSet(activity.coverImageUrl, [400, 800, 1200])}
                      sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                      loading="lazy"
                      decoding="async"
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-fg-subtle dark:text-white/60">
                      <Camera className="h-10 w-10" aria-hidden />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07132F] via-[#07132F]/20 to-transparent" />
                  <div className="absolute right-4 bottom-4 left-4 flex flex-wrap gap-2">
                    {activity.type?.name ? (
                      <span className="rounded-full bg-jmv-ink/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                        {activity.type.name}
                      </span>
                    ) : null}
                    {activity.pillar?.name ? (
                      <span className="rounded-full bg-jmv-gold px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-jmv-ink">
                        {activity.pillar.name}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-4 p-6 text-fg">
                  <div>
                    <h3 className="text-2xl font-semibold">{activity.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-fg-muted">
                      {activity.summary || activity.description}
                    </p>
                  </div>

                  <ul className="space-y-2 text-sm text-fg-muted dark:text-slate-100">
                    {activity.startDate && (
                      <li className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-accent-gold" aria-hidden />
                        <time dateTime={toIsoString(activity.startDate)}>
                          {formatDate(activity.startDate, { day: "numeric", month: "short", year: "numeric" })}
                        </time>
                      </li>
                    )}
                    {activity.location && (
                      <li className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-accent-gold" aria-hidden />
                        {activity.location}
                      </li>
                    )}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
