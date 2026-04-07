"use client";

import { useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import Modal from "@/components/admin/ui/Modal";
import type {
  ActivityCatalogItem,
  ActivityImageItem,
  ActivityItem,
} from "@/types/activity-management";
import {
  CalendarDays,
  Camera,
  Filter,
  MapPin,
  Tag,
  Users,
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

          <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
              <Filter className="h-4 w-4 text-jmv-gold" />
              Filtros
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <select
                value={selectedPillar}
                onChange={(event) => setSelectedPillar(event.target.value)}
                className="rounded-xl border border-white/10 bg-slate-950/25 px-4 py-3 text-sm text-white outline-none transition focus:border-jmv-gold"
              >
                <option value="all">Todos los pilares</option>
                {pillars.map((pillar) => (
                  <option key={pillar.id} value={pillar.id}>
                    {pillar.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(event) => setSelectedType(event.target.value)}
                className="rounded-xl border border-white/10 bg-slate-950/25 px-4 py-3 text-sm text-white outline-none transition focus:border-jmv-gold"
              >
                <option value="all">Todos los tipos</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
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
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  <CalendarDays className="h-4 w-4 text-[#0066CC]" />
                  Fecha
                </div>
                <p className="text-sm text-gray-800">
                  {formatDate(openActivity.startDate)}
                  {openActivity.endDate
                    ? ` - ${formatDate(openActivity.endDate)}`
                    : ""}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  <MapPin className="h-4 w-4 text-[#0066CC]" />
                  Lugar
                </div>
                <p className="text-sm text-gray-800">
                  {openActivity.location || "Sin lugar definido"}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  <Tag className="h-4 w-4 text-[#0066CC]" />
                  Clasificación
                </div>
                <p className="text-sm text-gray-800">
                  {openActivity.pillar?.name || "Sin pilar"} /{" "}
                  {openActivity.type?.name || "Sin tipo"}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  <Camera className="h-4 w-4 text-[#0066CC]" />
                  Galería
                </div>
                <p className="text-sm text-gray-800">
                  {openActivity.gallery.length} fotografías
                </p>
              </div>
            </div>

            <div>
              {openActivity.summary ? (
                <p className="text-base font-medium text-gray-700">
                  {openActivity.summary}
                </p>
              ) : null}
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                {openActivity.description}
              </p>
            </div>

            {slides.length ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Galería
                  </h3>
                  <button
                    onClick={() => {
                      setLightboxIndex(0);
                      setLightboxOpen(true);
                    }}
                    className="rounded-xl bg-jmv-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-jmv-blue-dark"
                  >
                    Abrir visor
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
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
                        className="h-32 w-full object-cover transition hover:scale-105"
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
