"use client";

import { useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import Modal from "@/components/admin/ui/Modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ActivityCatalogItem,
  ActivityImageItem,
  ActivityItem,
} from "@/types/activity-management";
import {
  CalendarDays,
  Camera,
  Filter,
  Layers3,
  MapPin,
  Shapes,
  Tag,
  Users,
  X,
} from "lucide-react";

function formatDate(value?: string | null) {
  if (!value) return "Por confirmar";
  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function buildSlides(activity: ActivityItem) {
  if (activity.gallery.length > 0) {
    return activity.gallery.map((image) => ({
      src: image.url,
      alt: image.alt || activity.title,
    }));
  }

  if (activity.coverImageUrl) {
    return [{ src: activity.coverImageUrl, alt: activity.title }];
  }

  return [];
}

function ActivityCard({
  activity,
  onOpen,
}: {
  activity: ActivityItem;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/6 text-left shadow-xl backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/8"
    >
      <div className="relative h-64 overflow-hidden bg-slate-900/40">
        {activity.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activity.coverImageUrl}
            alt={activity.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/45">
            <Camera className="h-10 w-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07132F] via-[#07132F]/25 to-transparent" />
        <div className="absolute right-4 bottom-4 left-4 flex flex-wrap gap-2">
          {activity.type?.name ? (
            <span className="rounded-full bg-white/14 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
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

        <div className="grid grid-cols-1 gap-3 text-sm text-white/75 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-jmv-gold" />
            <span>{formatDate(activity.startDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-jmv-gold" />
            <span>{activity.location || "Lugar por confirmar"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-jmv-gold" />
            <span>{activity.participantsLabel || "Participación abierta"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-jmv-gold" />
            <span>{activity.gallery.length} fotos</span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function ActivitiesAlbumsClient({
  activities,
  pillars,
  types,
}: {
  activities: ActivityItem[];
  pillars: ActivityCatalogItem[];
  types: ActivityCatalogItem[];
}) {
  const [selectedPillar, setSelectedPillar] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [openActivity, setOpenActivity] = useState<ActivityItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesPillar =
        selectedPillar === "all" || activity.pillar?.id === selectedPillar;
      const matchesType =
        selectedType === "all" || activity.type?.id === selectedType;
      return matchesPillar && matchesType;
    });
  }, [activities, selectedPillar, selectedType]);

  const slides = openActivity ? buildSlides(openActivity) : [];

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#07132F_0%,#0C2D69_55%,#0F4A8A_100%)]" />
      <div className="absolute top-12 left-0 h-72 w-72 rounded-full bg-jmv-gold/12 blur-3xl" />
      <div className="absolute right-0 bottom-12 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85 backdrop-blur-sm">
              Memoria visual JMV
            </span>
            <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
              Actividades realizadas con filtros por pilar y tipo
            </h2>
            <p className="mt-4 text-base leading-7 text-white/72">
              Aquí se muestran las actividades históricas que ya pasaron, con su
              clasificación y toda la galería de fotos cargada desde gestión.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/65">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-jmv-gold/15 text-jmv-gold ring-1 ring-jmv-gold/30">
                  <Filter className="h-3.5 w-3.5" strokeWidth={2.4} />
                </span>
                Filtros
              </div>
              {(selectedPillar !== "all" || selectedType !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPillar("all");
                    setSelectedType("all");
                  }}
                  className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10.5px] font-semibold text-white/70 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-3 w-3" strokeWidth={2.4} />
                  Limpiar
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-white/55">
                  <Layers3 className="h-3 w-3" strokeWidth={2.4} />
                  Pilar
                </label>
                <Select
                  value={selectedPillar}
                  onValueChange={setSelectedPillar}
                >
                  <SelectTrigger className="h-11 rounded-xl border-white/10 bg-slate-950/30 px-3.5 text-[13px] text-white shadow-inner shadow-black/20 backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-slate-950/40 focus:border-jmv-gold focus:ring-2 focus:ring-jmv-gold/30 [&>svg]:text-white/60 [&_[data-placeholder]]:text-white/55">
                    <SelectValue placeholder="Todos los pilares" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#0F2A4A] text-white shadow-2xl">
                    <SelectItem
                      value="all"
                      className="text-white/85 focus:bg-white/10 focus:text-white data-[state=checked]:bg-jmv-gold/15 data-[state=checked]:text-jmv-gold"
                    >
                      Todos los pilares
                    </SelectItem>
                    {pillars.map((pillar) => (
                      <SelectItem
                        key={pillar.id}
                        value={pillar.id}
                        className="text-white/85 focus:bg-white/10 focus:text-white data-[state=checked]:bg-jmv-gold/15 data-[state=checked]:text-jmv-gold"
                      >
                        {pillar.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-white/55">
                  <Shapes className="h-3 w-3" strokeWidth={2.4} />
                  Tipo
                </label>
                <Select
                  value={selectedType}
                  onValueChange={setSelectedType}
                >
                  <SelectTrigger className="h-11 rounded-xl border-white/10 bg-slate-950/30 px-3.5 text-[13px] text-white shadow-inner shadow-black/20 backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-slate-950/40 focus:border-jmv-gold focus:ring-2 focus:ring-jmv-gold/30 [&>svg]:text-white/60 [&_[data-placeholder]]:text-white/55">
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#0F2A4A] text-white shadow-2xl">
                    <SelectItem
                      value="all"
                      className="text-white/85 focus:bg-white/10 focus:text-white data-[state=checked]:bg-jmv-gold/15 data-[state=checked]:text-jmv-gold"
                    >
                      Todos los tipos
                    </SelectItem>
                    {types.map((type) => (
                      <SelectItem
                        key={type.id}
                        value={type.id}
                        className="text-white/85 focus:bg-white/10 focus:text-white data-[state=checked]:bg-jmv-gold/15 data-[state=checked]:text-jmv-gold"
                      >
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-white/50">
              <strong className="font-bold text-white/80">
                {filteredActivities.length}
              </strong>{" "}
              actividad{filteredActivities.length === 1 ? "" : "es"} encontrada
              {filteredActivities.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-sm">
            <h3 className="text-2xl font-semibold text-white">
              No hay actividades para esos filtros
            </h3>
            <p className="mt-3 text-white/70">
              Ajusta los filtros o carga nuevas actividades históricas desde el
              panel de administración.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onOpen={() => setOpenActivity(activity)}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={!!openActivity}
        onClose={() => setOpenActivity(null)}
        title={openActivity?.title || "Actividad"}
        size="xl"
      >
        {openActivity ? (
          <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
              <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
                <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 sm:text-xs sm:tracking-[0.2em]">
                  <CalendarDays className="h-3.5 w-3.5 text-[#0066CC] sm:h-4 sm:w-4" />
                  Fecha
                </div>
                <p className="text-xs text-gray-800 sm:text-sm">
                  {formatDate(openActivity.startDate)}
                  {openActivity.endDate
                    ? ` - ${formatDate(openActivity.endDate)}`
                    : ""}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
                <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 sm:text-xs sm:tracking-[0.2em]">
                  <MapPin className="h-3.5 w-3.5 text-[#0066CC] sm:h-4 sm:w-4" />
                  Lugar
                </div>
                <p className="text-xs text-gray-800 sm:text-sm">
                  {openActivity.location || "Sin lugar definido"}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
                <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 sm:text-xs sm:tracking-[0.2em]">
                  <Tag className="h-3.5 w-3.5 text-[#0066CC] sm:h-4 sm:w-4" />
                  Clasificación
                </div>
                <p className="text-xs text-gray-800 sm:text-sm">
                  {openActivity.pillar?.name || "Sin pilar"} /{" "}
                  {openActivity.type?.name || "Sin tipo"}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
                <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 sm:text-xs sm:tracking-[0.2em]">
                  <Camera className="h-3.5 w-3.5 text-[#0066CC] sm:h-4 sm:w-4" />
                  Galería
                </div>
                <p className="text-xs text-gray-800 sm:text-sm">
                  {openActivity.gallery.length} fotografías
                </p>
              </div>
            </div>

            <div>
              {openActivity.summary ? (
                <p className="text-sm font-medium text-gray-700 sm:text-base">
                  {openActivity.summary}
                </p>
              ) : null}
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600 sm:leading-7">
                {openActivity.description}
              </p>
            </div>

            {slides.length ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
                    Galería
                  </h3>
                  <button
                    onClick={() => {
                      setLightboxIndex(0);
                      setLightboxOpen(true);
                    }}
                    className="rounded-xl bg-jmv-blue px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-jmv-blue-dark sm:px-4 sm:py-2 sm:text-sm"
                  >
                    Abrir visor
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
                  {(openActivity.gallery.length
                    ? openActivity.gallery
                    : ([
                        {
                          id: "cover",
                          url: openActivity.coverImageUrl || "",
                          alt: openActivity.title,
                          order: 0,
                        },
                      ] as ActivityImageItem[])
                  ).map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => {
                        setLightboxIndex(index);
                        setLightboxOpen(true);
                      }}
                      className="overflow-hidden rounded-xl border border-gray-200"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.url}
                        alt={image.alt || openActivity.title}
                        className="h-24 w-full object-cover transition hover:scale-105 sm:h-32"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>

      {openActivity && slides.length ? (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={slides}
          plugins={[Zoom, Fullscreen, Slideshow]}
          animation={{ fade: 300 }}
          zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
          slideshow={{ autoplay: false, delay: 3000 }}
          controller={{ closeOnBackdropClick: true }}
        />
      ) : null}
    </section>
  );
}
