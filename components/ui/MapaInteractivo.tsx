"use client";

import { useEffect, useState } from "react";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
} from "@/components/ui/map";
import { getComunidadesAPI } from "@/actions/comunidades";
import type { ComunidadItem } from "@/types/territory-management";
import { Mail, MapPin, Phone, Users } from "lucide-react";

const ECUADOR_CENTER: [number, number] = [-78.1834, -1.8312];
const ECUADOR_ZOOM = 6.2;

function hasCoords(c: ComunidadItem): c is ComunidadItem & {
  latitud: number;
  longitud: number;
} {
  return (
    typeof c.latitud === "number" &&
    typeof c.longitud === "number" &&
    Number.isFinite(c.latitud) &&
    Number.isFinite(c.longitud)
  );
}

function ComunidadPopupCard({ comunidad }: { comunidad: ComunidadItem }) {
  const initials = (comunidad.zona?.nombre ?? comunidad.nombre)
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="w-[300px] overflow-hidden rounded-2xl border border-jmv-gold/30 bg-white shadow-2xl">
      <div className="bg-gradient-to-br from-jmv-blue via-jmv-blue-dark to-jmv-blue px-4 py-3.5">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-bold text-white ring-1 ring-white/30 backdrop-blur-sm">
            {initials || "JMV"}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-poppins text-base font-bold leading-tight text-white">
              {comunidad.nombre}
            </h3>
            <p className="mt-0.5 text-[11px] uppercase tracking-wider text-white/75">
              Comunidad JMV
            </p>
          </div>
        </div>
        {comunidad.zona?.nombre ? (
          <div className="mt-3">
            <span className="inline-flex items-center rounded-full bg-jmv-gold/95 px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-white shadow-sm">
              <Users className="mr-1 size-3" strokeWidth={2.5} />
              {comunidad.zona.nombre}
            </span>
          </div>
        ) : null}
      </div>

      <div className="space-y-2.5 px-4 py-3.5">
        <div className="flex items-start gap-2.5 text-[12.5px] text-slate-700">
          <MapPin className="mt-0.5 size-4 shrink-0 text-jmv-blue" strokeWidth={2} />
          <div className="min-w-0">
            <div className="font-semibold text-slate-900">{comunidad.ciudad}</div>
            {comunidad.direccion ? (
              <div className="mt-0.5 text-[11.5px] leading-snug text-slate-500">
                {comunidad.direccion}
              </div>
            ) : null}
          </div>
        </div>

        <div className="my-1 border-t border-dashed border-slate-200" />

        <div className="space-y-1.5">
          <a
            href={`mailto:${comunidad.correoElectronico}`}
            className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[12px] text-slate-700 transition-colors hover:bg-jmv-blue/5"
          >
            <Mail
              className="size-4 shrink-0 text-jmv-blue transition-transform group-hover:scale-110"
              strokeWidth={2}
            />
            <span className="truncate font-medium group-hover:text-jmv-blue">
              {comunidad.correoElectronico}
            </span>
          </a>

          {comunidad.telefono ? (
            <a
              href={`tel:${comunidad.telefono.replace(/\s+/g, "")}`}
              className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[12px] text-slate-700 transition-colors hover:bg-jmv-blue/5"
            >
              <Phone
                className="size-4 shrink-0 text-jmv-blue transition-transform group-hover:scale-110"
                strokeWidth={2}
              />
              <span className="font-medium group-hover:text-jmv-blue">
                {comunidad.telefono}
              </span>
            </a>
          ) : null}
        </div>
      </div>

      <div className="border-t border-slate-100 bg-gradient-to-b from-slate-50/40 to-white px-4 py-2.5">
        <p className="text-center font-dancing text-[13px] leading-tight text-jmv-blue">
          ¡Acércate, te esperamos!
        </p>
      </div>
    </div>
  );
}

function MapSkeleton({ message }: { message: string }) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-jmv-blue/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/90 px-6 py-4 shadow-lg">
        <MapPin className="size-6 animate-bounce text-jmv-blue" />
        <div className="text-sm font-medium text-jmv-blue">{message}</div>
      </div>
    </div>
  );
}

function EmptyMapState() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-jmv-blue/40 backdrop-blur-sm">
      <div className="max-w-md rounded-2xl bg-white/95 px-8 py-6 text-center shadow-xl">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-jmv-gold/15">
          <MapPin className="size-6 text-jmv-gold" />
        </div>
        <h3 className="font-poppins text-base font-bold text-jmv-blue">
          Aún no hay comunidades con ubicación
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Pronto agregaremos las comunidades JMV en el mapa. Mientras tanto, contáctanos
          directamente.
        </p>
      </div>
    </div>
  );
}

export default function MapaInteractivo() {
  const [comunidades, setComunidades] = useState<ComunidadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getComunidadesAPI()
      .then((data) => {
        if (!active) return;
        setComunidades(data.filter(hasCoords));
        setError(false);
      })
      .catch(() => {
        if (!active) return;
        setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
      <Map center={ECUADOR_CENTER} zoom={ECUADOR_ZOOM} className="h-full w-full">
        <MapControls
          position="top-right"
          showZoom
          showCompass
          showFullscreen
        />

        {comunidades.map((comunidad) => (
          <MapMarker
            key={comunidad.id}
            longitude={comunidad.longitud as number}
            latitude={comunidad.latitud as number}
          >
            <MarkerContent>
              <div className="group relative cursor-pointer">
                <span className="absolute -inset-2 animate-ping rounded-full bg-jmv-gold/40" />
                <span className="absolute -inset-1 rounded-full bg-jmv-gold/30 blur-sm" />
                <div className="relative flex size-9 items-center justify-center rounded-full border-2 border-white bg-jmv-gold shadow-lg transition-transform duration-200 group-hover:scale-110">
                  <MapPin
                    className="size-5 text-white drop-shadow"
                    strokeWidth={2.5}
                    fill="white"
                  />
                </div>
              </div>
            </MarkerContent>

            <MarkerPopup>
              <ComunidadPopupCard comunidad={comunidad} />
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>

      {loading && <MapSkeleton message="Cargando comunidades..." />}
      {!loading && error && (
        <MapSkeleton message="No se pudo cargar el mapa." />
      )}
      {!loading && !error && comunidades.length === 0 && <EmptyMapState />}
    </div>
  );
}
