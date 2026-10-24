"use client";

import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup } from "@/components/ui/map";
import type { ComunidadItem } from "@/types/territory-management";
import { comunidadWhatsappLink, hasCoords } from "@/lib/comunidades";
import { Mail, MapPin, MessageCircle, Phone, Users } from "lucide-react";

const ECUADOR_CENTER: [number, number] = [-78.1834, -1.8312];
const ECUADOR_ZOOM = 6.2;

// Estilo "Liberty" de OpenFreeMap (gratuito, sin API key): mapa pastel pero
// con color —verdes para vegetación, azul para agua, calles y ciudades—, en
// lugar del estilo casi blanco anterior.
const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

// Limita el mapa a Ecuador continental: no se puede arrastrar fuera del país
// ni alejar para ver Colombia/Perú. Formato [[oeste, sur], [este, norte]].
const ECUADOR_BOUNDS: [[number, number], [number, number]] = [
  [-82.0, -5.5],
  [-74.5, 2.0],
];
const ECUADOR_MIN_ZOOM = 6;

const popupLink =
  "flex min-h-11 items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium text-slate-800 transition-colors hover:bg-jmv-blue/5 hover:text-jmv-blue";

function ComunidadPopupCard({ comunidad }: { comunidad: ComunidadItem }) {
  const whatsapp = comunidadWhatsappLink(comunidad);

  return (
    <div className="w-[min(300px,80vw)] overflow-hidden rounded-2xl border border-jmv-gold/30 bg-white shadow-2xl" data-surface="light">
      <div className="bg-gradient-to-br from-jmv-blue via-jmv-blue-dark to-jmv-blue px-4 py-3.5">
        <h3 className="pr-8 text-base font-bold leading-tight text-white">{comunidad.nombre}</h3>
        <p className="mt-0.5 text-xs text-white/90">Comunidad JMV · {comunidad.ciudad}</p>
        {comunidad.zona?.nombre ? (
          <span className="mt-3 inline-flex items-center rounded-full bg-jmv-gold px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-jmv-ink">
            <Users className="mr-1 size-3" strokeWidth={2.5} aria-hidden />
            {comunidad.zona.nombre}
          </span>
        ) : null}
      </div>

      <div className="px-3 py-3">
        {comunidad.direccion ? (
          <p className="mb-2 flex items-start gap-2.5 px-2 text-[12.5px] text-slate-700">
            <MapPin className="mt-0.5 size-4 shrink-0 text-jmv-blue" aria-hidden />
            {comunidad.direccion}
          </p>
        ) : null}

        <a href={whatsapp.href} target="_blank" rel="noopener noreferrer" className={popupLink}>
          <MessageCircle className="size-4 shrink-0 text-jmv-blue" aria-hidden />
          Escribir por WhatsApp
          <span className="sr-only">
            {whatsapp.isCommunityPhone ? "" : " a JMV Ecuador"} (se abre en una pestaña nueva)
          </span>
        </a>
        {comunidad.telefono ? (
          <a href={`tel:${comunidad.telefono.replace(/\s+/g, "")}`} className={popupLink}>
            <Phone className="size-4 shrink-0 text-jmv-blue" aria-hidden />
            Llamar al {comunidad.telefono}
          </a>
        ) : null}
        {comunidad.correoElectronico ? (
          <a href={`mailto:${comunidad.correoElectronico}`} className={popupLink}>
            <Mail className="size-4 shrink-0 text-jmv-blue" aria-hidden />
            <span className="truncate">{comunidad.correoElectronico}</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}

// Mapa de apoyo al buscador de comunidades: la lista HTML de /unete es la vía
// principal (y accesible); el mapa recibe los mismos datos.
export default function MapaInteractivo({ comunidades }: { comunidades: ComunidadItem[] }) {
  const conUbicacion = comunidades.filter(hasCoords);

  return (
    <div className="relative h-[60svh] min-h-[360px] w-full overflow-hidden rounded-2xl border border-white/20 shadow-2xl md:h-[640px]">
      <Map
        center={ECUADOR_CENTER}
        zoom={ECUADOR_ZOOM}
        className="h-full w-full"
        styles={{ light: MAP_STYLE, dark: MAP_STYLE }}
        maxBounds={ECUADOR_BOUNDS}
        minZoom={ECUADOR_MIN_ZOOM}
        cooperativeGestures
      >
        <MapControls position="top-right" showZoom showCompass showFullscreen />

        {conUbicacion.map((comunidad) => (
          <MapMarker
            key={comunidad.id}
            longitude={comunidad.longitud}
            latitude={comunidad.latitud}
            ariaLabel={`Comunidad ${comunidad.nombre}, ${comunidad.ciudad}`}
          >
            <MarkerContent>
              <div className="group relative flex size-11 items-center justify-center">
                <span className="absolute inset-2.5 rounded-full bg-red-500/40 motion-safe:animate-ping" />
                <span className="relative flex size-6 items-center justify-center rounded-full border-2 border-white bg-red-600 shadow-lg transition-transform duration-200 motion-safe:group-hover:scale-125">
                  <MapPin className="size-3.5 text-white drop-shadow" strokeWidth={2.5} fill="white" aria-hidden />
                </span>
              </div>
            </MarkerContent>

            <MarkerPopup
              closeButton
              className="max-w-none border-0 bg-transparent p-0 shadow-none [&>button]:top-2 [&>button]:right-2 [&>button]:text-white [&>button]:hover:bg-white/15"
            >
              <ComunidadPopupCard comunidad={comunidad} />
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>

      {conUbicacion.length === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-jmv-blue/40 p-4 backdrop-blur-sm">
          <div className="max-w-md rounded-2xl bg-white px-8 py-6 text-center shadow-xl">
            <MapPin className="mx-auto size-8 text-jmv-gold-ink" aria-hidden />
            <h3 className="mt-3 text-base font-bold text-jmv-blue">
              Aún no hay comunidades ubicadas en el mapa
            </h3>
            <p className="mt-2 text-sm text-slate-700">
              Usa la lista de comunidades o escríbenos y te ponemos en contacto.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
