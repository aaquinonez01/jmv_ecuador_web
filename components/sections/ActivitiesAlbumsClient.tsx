"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import ActivityGalleryModal from "./ActivityGalleryModal";
import ActivityPhotosGrid from "./ActivityPhotosGrid";
import { getOptimizedUrl, getSrcSet } from "@/lib/helpers/cloudinary";
import { createApi } from "@/config/axios.config";
import { formatDate, toIsoString } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ActivityCatalogItem,
  ActivityItem,
  PaginatedResponse,
} from "@/types/activity-management";
import { CalendarDays, Camera, Filter, Grid3x3, Images, Layers3, MapPin, RefreshCw, Shapes, Users, X } from "lucide-react";

const ActivityLightbox = dynamic(() => import("./ActivityLightbox"), {
  ssr: false,
});

export interface AlbumSlide {
  src: string;
  alt: string;
}

function buildSlides(activity: ActivityItem): AlbumSlide[] {
  if (activity.gallery.length > 0) {
    return activity.gallery.map((image, index) => ({
      src: image.url,
      alt: image.alt && image.alt !== activity.title ? image.alt : `${activity.title}, foto ${index + 1}`,
    }));
  }
  if (activity.coverImageUrl) {
    return [{ src: activity.coverImageUrl, alt: activity.title }];
  }
  return [];
}

function cardDate(value?: string | null) {
  if (!value) return null;
  return formatDate(value, { day: "numeric", month: "short", year: "numeric" });
}

/**
 * Álbum con portada grande: la foto ocupa toda la tarjeta y encima van el título,
 * una línea de resumen y los datos clave (isla oscura en ambos modos). Con un solo
 * álbum, la tarjeta se ensancha y muestra algunas fotos más del álbum.
 */
function ActivityCard({
  activity,
  onOpen,
  wide = false,
}: {
  activity: ActivityItem;
  onOpen: () => void;
  wide?: boolean;
}) {
  const date = cardDate(activity.startDate);
  const photos = activity.gallery.length;
  const cover = activity.coverImageUrl || activity.gallery[0]?.url || null;
  const extra = wide ? activity.gallery.filter((g) => g.url !== cover).slice(0, 3) : [];
  return (
    <li className={wide ? "md:col-span-2 xl:col-span-3" : undefined}>
      <article
        data-tone="dark"
        className={`group relative isolate flex h-full flex-col justify-end overflow-hidden rounded-[1.75rem] bg-jmv-ink text-left text-white shadow-card-lg dark:shadow-xl has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(color:--focus-ring) has-[:focus-visible]:outline-solid ${
          wide ? "aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/9]" : "aspect-[4/5]"
        }`}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getOptimizedUrl(cover, { w: 800 })}
            srcSet={getSrcSet(cover, wide ? [400, 800, 1200, 1600] : [400, 800, 1200])}
            sizes={wide ? "(min-width: 1280px) 1200px, 100vw" : "(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"}
            loading="lazy"
            decoding="async"
            alt=""
            className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 motion-safe:group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 -z-20 flex items-center justify-center bg-[linear-gradient(135deg,#0C2D69,#0F4A8A)] text-slate-300">
            <Camera className="h-12 w-12" aria-hidden />
          </div>
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-hero-veil via-hero-veil/65 via-35% to-hero-veil/0 to-65%"
        />

        <div className="absolute top-4 right-4 left-4 flex flex-wrap gap-2">
          {activity.type?.name ? (
            <span className="rounded-full bg-jmv-ink/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
              {activity.type.name}
            </span>
          ) : null}
          {activity.pillar?.name ? (
            <span className="rounded-full bg-jmv-gold px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-jmv-ink">
              {activity.pillar.name}
            </span>
          ) : null}
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-jmv-ink/75 px-3 py-1 text-xs font-semibold text-white" aria-hidden="true">
            <Camera className="h-3.5 w-3.5" />
            {photos} {photos === 1 ? "foto" : "fotos"}
          </span>
        </div>

        <div className="flex flex-col gap-2 p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="min-w-0 lg:max-w-2xl">
            <h3 className={`font-bold leading-tight text-balance [text-shadow:0_1px_10px_rgb(15_23_42/0.5)] ${wide ? "text-2xl sm:text-3xl" : "text-2xl"}`}>
              {/* Botón "estirado": toda la tarjeta abre el álbum, sin anidar contenido de bloque en el botón */}
              <button
                type="button"
                onClick={onOpen}
                className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
              >
                {activity.title}
                <span className="sr-only">. Ver álbum{photos ? ` de ${photos} fotos` : ""}</span>
              </button>
            </h3>
            {activity.summary || activity.description ? (
              <p className="mt-1 line-clamp-2 text-sm leading-snug text-slate-100">
                {activity.summary || activity.description}
              </p>
            ) : null}
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-100">
              {date && (
                <li className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 shrink-0 text-jmv-gold-text" aria-hidden />
                  <time dateTime={toIsoString(activity.startDate!)}>{date}</time>
                </li>
              )}
              {activity.location && (
                <li className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0 text-jmv-gold-text" aria-hidden />
                  {activity.location}
                </li>
              )}
              {activity.participantsLabel && (
                <li className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 shrink-0 text-jmv-gold-text" aria-hidden />
                  <span className="sr-only">Participantes: </span>
                  {activity.participantsLabel}
                </li>
              )}
            </ul>
          </div>

          {extra.length > 0 && (
            <ul aria-hidden="true" className="mt-3 hidden shrink-0 gap-2 sm:flex lg:mt-0">
              {extra.map((image) => (
                <li key={image.id} className="h-20 w-24 overflow-hidden rounded-xl ring-2 ring-white/70 lg:h-24 lg:w-32">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getOptimizedUrl(image.url, { w: 300 })}
                    loading="lazy"
                    decoding="async"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </li>
  );
}

const selectTrigger =
  "h-11 w-full rounded-xl border-line-input bg-surface px-3.5 text-sm text-fg shadow-card data-[size=default]:h-11 hover:border-fg/40 [&>svg]:text-fg/80 [&_[data-placeholder]]:text-fg/80";
const selectItem =
  "min-h-11 text-fg focus:bg-surface-2 focus:text-fg data-[state=checked]:bg-jmv-gold/15 data-[state=checked]:text-accent-gold";

function CatalogSelect({
  id,
  label,
  icon: Icon,
  allLabel,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  icon: typeof Layers3;
  allLabel: string;
  value: string;
  onChange: (v: string) => void;
  options: ActivityCatalogItem[];
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-fg-soft"
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden />
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className={selectTrigger}>
          <SelectValue placeholder={allLabel} />
        </SelectTrigger>
        <SelectContent className="border-line bg-surface-raised text-fg shadow-card-lg dark:bg-[#0F2A4A] dark:shadow-2xl">
          <SelectItem value="all" className={selectItem}>
            {allLabel}
          </SelectItem>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id} className={selectItem}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

type Status = "idle" | "loading" | "loadingMore" | "error";

export default function ActivitiesAlbumsClient({
  initial,
  pageSize,
  pillars,
  types,
}: {
  /** null si el servidor no pudo cargar la primera página */
  initial: PaginatedResponse<ActivityItem> | null;
  pageSize: number;
  pillars: ActivityCatalogItem[];
  types: ActivityCatalogItem[];
}) {
  const [items, setItems] = useState<ActivityItem[]>(initial?.items ?? []);
  const [total, setTotal] = useState(initial?.total ?? 0);
  const [status, setStatus] = useState<Status>(initial ? "idle" : "loading");
  const [selectedPillar, setSelectedPillar] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [openActivity, setOpenActivity] = useState<ActivityItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxRoot, setLightboxRoot] = useState<HTMLElement | null>(null);
  // Vista de la sección: álbumes (una tarjeta por actividad) o todas las fotos en cuadrícula
  const [view, setView] = useState<"albums" | "photos">("albums");
  const [gridPhoto, setGridPhoto] = useState<{ activity: ActivityItem; index: number } | null>(null);
  const requestId = useRef(0);
  const firstNewRef = useRef<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const hasFilters = selectedPillar !== "all" || selectedType !== "all";

  const fetchPage = useCallback(
    async (offset: number, append: boolean) => {
      const id = ++requestId.current;
      setStatus(append ? "loadingMore" : "loading");
      try {
        const { data } = await createApi().get<PaginatedResponse<ActivityItem>>("/activities/public", {
          params: {
            limit: pageSize,
            offset,
            pillarId: selectedPillar === "all" ? undefined : selectedPillar,
            typeId: selectedType === "all" ? undefined : selectedType,
          },
        });
        if (id !== requestId.current) return;
        firstNewRef.current = append ? offset : null;
        setItems((prev) => (append ? [...prev, ...data.items] : data.items));
        setTotal(data.total);
        setStatus("idle");
      } catch {
        if (id !== requestId.current) return;
        setStatus("error");
      }
    },
    [pageSize, selectedPillar, selectedType],
  );

  // Filtros en el backend: así el contador y "Cargar más" cuentan todo, no solo la primera página
  // (si el servidor no pudo traer la primera página, se pide aquí)
  const lastFilters = useRef(initial ? "all|all" : "");
  useEffect(() => {
    const key = `${selectedPillar}|${selectedType}`;
    if (key === lastFilters.current) return;
    lastFilters.current = key;
    void fetchPage(0, false);
  }, [selectedPillar, selectedType, fetchPage]);

  // Tras "Cargar más", el foco pasa a la primera tarjeta nueva
  useEffect(() => {
    if (firstNewRef.current === null || status !== "idle") return;
    const index = firstNewRef.current;
    firstNewRef.current = null;
    listRef.current?.querySelectorAll<HTMLButtonElement>("h3 button")[index]?.focus();
  }, [items, status]);

  // El visor se descarga en segundo plano: la primera foto que se abre no espera a ese código
  useEffect(() => {
    const load = () => void import("./ActivityLightbox");
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(load, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(load, 1500);
    return () => clearTimeout(t);
  }, []);

  // ?vista=fotos abre directamente la cuadrícula (y se mantiene al compartir el enlace)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("vista") === "fotos") setView("photos");
  }, []);

  const changeView = (next: "albums" | "photos") => {
    setView(next);
    const url = new URL(window.location.href);
    if (next === "photos") url.searchParams.set("vista", "fotos");
    else url.searchParams.delete("vista");
    window.history.replaceState(null, "", url);
  };

  const totalPhotos = items.reduce((n, a) => n + buildSlides(a).length, 0);

  // /actividades?pilar=<slug o id> (enlace desde /pilares) abre los álbumes ya filtrados
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("pilar");
    if (!wanted) return;
    const match = pillars.find((p) => p.slug === wanted || p.id === wanted);
    if (match) setSelectedPillar(match.id);
  }, [pillars]);

  const clearFilters = () => {
    setSelectedPillar("all");
    setSelectedType("all");
  };

  const slides = openActivity ? buildSlides(openActivity) : [];
  const canLoadMore = items.length < total;
  const noun = total === 1 ? "actividad" : "actividades";

  return (
    <section
      id="realizadas"
      aria-labelledby="realizadas-titulo"
      className="relative scroll-mt-32 overflow-hidden py-16 sm:py-20"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--section-a)_0%,var(--section-b)_100%)] dark:bg-[linear-gradient(180deg,#07132F_0%,#0C2D69_55%,#0F4A8A_100%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-gold">
              Memoria visual JMV
            </p>
            <h2 id="realizadas-titulo" className="mt-3 text-3xl font-bold text-fg sm:text-4xl">
              Actividades realizadas
            </h2>
            <p className="mt-2 text-lg text-fg-soft">
              {view === "albums" ? "Abre un álbum para ver las fotos." : "Toca una foto para verla en grande."}
            </p>
            <div role="group" aria-label="Cómo ver las actividades" className="mt-4 inline-flex rounded-xl border border-line-card bg-surface p-1 shadow-card dark:bg-white/[0.07]">
              {([
                { id: "albums", label: "Álbumes", icon: Images },
                { id: "photos", label: totalPhotos ? `Todas las fotos (${totalPhotos})` : "Todas las fotos", icon: Grid3x3 },
              ] as const).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={view === id}
                  onClick={() => changeView(id)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors ${
                    view === id ? "bg-jmv-blue text-white shadow-sm" : "text-fg-muted hover:bg-surface-2 hover:text-fg"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div
            role="search"
            aria-label="Filtrar actividades realizadas"
            className="rounded-[1.5rem] border border-line-card bg-surface p-4 shadow-card-lg sm:p-5 lg:min-w-[26rem] dark:bg-white/[0.07] dark:shadow-2xl"
          >
            <div className="mb-3 flex min-h-11 items-center justify-between sm:mb-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-fg-soft">
                <Filter className="h-4 w-4 text-accent-gold" strokeWidth={2.4} aria-hidden />
                Filtros
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex min-h-11 items-center gap-1 rounded-md px-3 text-sm font-semibold text-fg hover:bg-surface-2"
                >
                  <X className="h-4 w-4" strokeWidth={2.4} aria-hidden />
                  Limpiar filtros
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <CatalogSelect
                id="filtro-pilar"
                label="Pilar"
                icon={Layers3}
                allLabel="Todos los pilares"
                value={selectedPillar}
                onChange={(id) => {
                  setSelectedPillar(id);
                  // El tipo elegido deja de valer si es de otro pilar
                  const t = types.find((x) => x.id === selectedType);
                  if (id !== "all" && t?.pillarId && t.pillarId !== id) setSelectedType("all");
                }}
                options={pillars}
              />
              <CatalogSelect
                id="filtro-tipo"
                label="Tipo"
                icon={Shapes}
                allLabel="Todos los tipos"
                value={selectedType}
                onChange={setSelectedType}
                options={
                  selectedPillar === "all"
                    ? types
                    : types.filter((t) => !t.pillarId || t.pillarId === selectedPillar)
                }
              />
            </div>

            <p className="mt-3 text-sm text-fg-soft" aria-live="polite" aria-atomic="true">
              {status === "loading" ? (
                "Buscando actividades…"
              ) : status === "error" ? (
                ""
              ) : (
                <>
                  <strong className="font-bold text-fg">{total}</strong> {noun}{" "}
                  {total === 1 ? "encontrada" : "encontradas"}
                </>
              )}
            </p>
          </div>
        </div>

        {status === "error" && items.length === 0 ? (
          <div role="alert" className="rounded-[2rem] border border-line-card bg-surface-card p-8 text-center shadow-card sm:p-10">
            <h3 className="text-2xl font-semibold text-fg">No pudimos cargar las actividades</h3>
            <p className="mt-2 text-fg-soft">Revisa tu conexión e inténtalo de nuevo en un momento.</p>
            <button
              type="button"
              onClick={() => void fetchPage(0, false)}
              className={buttonVariants({ variant: "gold", size: "md", className: "mt-6" })}
            >
              <RefreshCw className="mr-2 h-5 w-5" aria-hidden />
              Reintentar
            </button>
          </div>
        ) : status === "loading" && items.length === 0 ? (
          <AlbumGridSkeleton />
        ) : items.length === 0 ? (
          <div className="rounded-[2rem] border border-line-card bg-surface-card p-8 text-center shadow-card sm:p-10">
            {hasFilters ? (
              <>
                <h3 className="text-2xl font-semibold text-fg">No hay actividades con esos filtros</h3>
                <p className="mt-2 text-fg-soft">Prueba con otro pilar o tipo de actividad.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className={buttonVariants({ variant: "gold", size: "md", className: "mt-6" })}
                >
                  Limpiar filtros
                </button>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-semibold text-fg">Pronto compartiremos los álbumes</h3>
                <p className="mt-2 text-fg-soft">Aquí verás las fotos de nuestras actividades.</p>
              </>
            )}
          </div>
        ) : (
          <>
            {view === "photos" ? (
              <div aria-busy={status === "loading" || undefined} className={status === "loading" ? "opacity-60" : ""}>
                <ActivityPhotosGrid
                  items={items}
                  slidesFor={buildSlides}
                  onOpenPhoto={(activity, index) => setGridPhoto({ activity, index })}
                  onOpenAlbum={(activity) => setOpenActivity(activity)}
                />
              </div>
            ) : (
            <ul
              ref={listRef}
              aria-busy={status === "loading" || undefined}
              className={`grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 ${
                status === "loading" ? "opacity-60" : ""
              }`}
            >
              {items.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  wide={items.length === 1}
                  onOpen={() => setOpenActivity(activity)}
                />
              ))}
            </ul>
            )}

            {status === "error" && (
              <p role="alert" className="mt-6 text-center text-fg-muted dark:text-slate-100">
                No pudimos cargar más actividades.{" "}
                <button
                  type="button"
                  onClick={() => void fetchPage(items.length, true)}
                  className="min-h-11 font-semibold text-accent-gold underline underline-offset-4"
                >
                  Reintentar
                </button>
              </p>
            )}

            {canLoadMore && status !== "error" && (
              <div className="mt-10 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => void fetchPage(items.length, true)}
                  disabled={status === "loadingMore"}
                  className={buttonVariants({ variant: "outlineAuto", size: "md" })}
                >
                  {status === "loadingMore" ? "Cargando…" : "Cargar más actividades"}
                </button>
                <p className="text-sm text-fg-soft">
                  Mostrando {items.length} de {total}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <ActivityGalleryModal
        activity={openActivity}
        slides={slides}
        lightboxOpen={lightboxOpen}
        onPortalReady={setLightboxRoot}
        onClose={() => {
          setLightboxOpen(false);
          setOpenActivity(null);
        }}
        onOpenLightbox={(index) => {
          setLightboxIndex(index);
          setLightboxOpen(true);
        }}
      />

      {/* Foto abierta desde la cuadrícula: el visor recorre el álbum de esa foto */}
      {gridPhoto ? (
        <ActivityLightbox
          open
          close={() => setGridPhoto(null)}
          index={gridPhoto.index}
          slides={buildSlides(gridPhoto.activity)}
        />
      ) : null}

      {openActivity && slides.length && lightboxRoot ? (
        <ActivityLightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={slides}
          portalRoot={lightboxRoot}
          thumbWidth={200}
        />
      ) : null}
    </section>
  );
}

export function AlbumGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <ul aria-hidden="true" className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-card">
          <div className="aspect-[4/3] bg-fg/10 motion-safe:animate-pulse" />
          <div className="space-y-3 p-6">
            <div className="h-7 w-3/4 rounded bg-fg/10 motion-safe:animate-pulse" />
            <div className="h-4 w-full rounded bg-fg/10 motion-safe:animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-fg/10 motion-safe:animate-pulse" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="h-4 rounded bg-fg/10 motion-safe:animate-pulse" />
              <div className="h-4 rounded bg-fg/10 motion-safe:animate-pulse" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
