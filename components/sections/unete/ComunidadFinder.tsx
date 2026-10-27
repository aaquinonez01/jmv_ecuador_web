"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import { ChevronDown, Mail, MapPin, MessageCircle, Phone, RefreshCw } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { getComunidadesAPI } from "@/actions/comunidades";
import { comunidadWhatsappLink, hasCoords } from "@/lib/comunidades";
import { whatsappLink } from "@/lib/whatsapp";
import { LOCALE } from "@/lib/format";
import type { ComunidadItem } from "@/types/territory-management";

const MapaInteractivo = dynamic(() => import("@/components/ui/MapaInteractivo"), {
  ssr: false,
  loading: () => <MapPlaceholder text="Cargando mapa…" />,
});

function MapPlaceholder({ text }: { text: string }) {
  return (
    <div className="flex h-[60svh] min-h-[360px] w-full items-center justify-center rounded-2xl border border-line-strong bg-surface md:h-[640px]">
      <p className="flex items-center gap-2 text-fg-soft">
        <MapPin className="h-5 w-5 text-accent-gold" aria-hidden />
        {text}
      </p>
    </div>
  );
}

/** El mapa (MapLibre + teselas) solo se descarga cuando la sección entra en pantalla */
function LazyMap({ comunidades }: { comunidades: ComunidadItem[] }) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "300px 0px" });
  return (
    <div ref={ref}>
      {inView ? <MapaInteractivo comunidades={comunidades} /> : <MapPlaceholder text="Mapa de comunidades" />}
    </div>
  );
}

const km = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 });

const GENERAL_WHATSAPP = whatsappLink("Hola, vi la web de JMV y quiero encontrar una comunidad cerca de mí.");

function ComunidadCard({ comunidad, distance }: { comunidad: ComunidadItem; distance?: number }) {
  const whatsapp = comunidadWhatsappLink(comunidad);
  return (
    <li className="flex flex-col rounded-2xl border border-line-card bg-surface shadow-card dark:bg-white/[0.07] p-5 text-fg">
      <h3 className="text-lg font-semibold">{comunidad.nombre}</h3>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-fg-soft">
        <MapPin className="h-4 w-4 shrink-0 text-accent-gold" aria-hidden />
        {comunidad.ciudad}
        {comunidad.zona?.nombre ? ` · ${comunidad.zona.nombre}` : ""}
      </p>
      {distance !== undefined && (
        <p className="mt-1 text-sm font-semibold text-accent-gold">
          A unos {km.format(distance)} km de ti
        </p>
      )}
      {comunidad.direccion && <p className="mt-2 text-sm text-fg-muted">{comunidad.direccion}</p>}

      <div className="mt-auto flex flex-col gap-2 pt-5">
        <a
          href={whatsapp.href}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "gold", size: "md", className: "w-full" })}
        >
          <MessageCircle className="mr-2 h-5 w-5" aria-hidden />
          Escribir por WhatsApp
          <span className="sr-only"> a la comunidad {comunidad.nombre} (se abre en una pestaña nueva)</span>
        </a>
        {!whatsapp.isCommunityPhone && (
          <p className="text-xs text-fg-muted">
            Te responde el equipo nacional y te pone en contacto con la comunidad.
          </p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {comunidad.telefono && (
            <a
              href={`tel:${comunidad.telefono.replace(/\s+/g, "")}`}
              className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-fg underline underline-offset-4 hover:text-accent-gold"
            >
              <Phone className="h-4 w-4" aria-hidden />
              Llamar
            </a>
          )}
          {comunidad.correoElectronico && (
            <a
              href={`mailto:${comunidad.correoElectronico}`}
              className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-fg underline underline-offset-4 hover:text-accent-gold"
            >
              <Mail className="h-4 w-4" aria-hidden />
              Escribir un correo
            </a>
          )}
        </div>
      </div>
    </li>
  );
}

export default function ComunidadFinder({ initial }: { initial: ComunidadItem[] | null }) {
  const [comunidades, setComunidades] = useState<ComunidadItem[]>(initial ?? []);
  const [status, setStatus] = useState<"ready" | "loading" | "error">(initial?.length ? "ready" : "loading");

  const load = () => {
    setStatus("loading");
    getComunidadesAPI()
      .then((data) => {
        setComunidades(Array.isArray(data) ? data : []);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  // Si el servidor no pudo traer las comunidades (o la página quedó en caché con la
  // lista vacía), se piden de nuevo desde el navegador
  useEffect(() => {
    if (!initial || initial.length === 0) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sorted = useMemo(
    () => [...comunidades].sort((a, b) => a.nombre.localeCompare(b.nombre, LOCALE)),
    [comunidades],
  );
  const onMap = comunidades.filter(hasCoords).length;
  const canShowMap = onMap > 0;
  const missing = comunidades.length - onMap;

  const list = (
    <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((comunidad) => (
        <ComunidadCard key={comunidad.id} comunidad={comunidad} />
      ))}
    </ul>
  );

  return (
    <div>
      {status === "loading" && (
        <p className="text-fg-soft" role="status">
          Cargando comunidades…
        </p>
      )}

      {status === "error" && (
        <div className="rounded-2xl border border-line-card bg-surface shadow-card dark:bg-white/[0.07] p-6 text-fg" role="alert">
          <p className="font-semibold">No pudimos cargar las comunidades.</p>
          <p className="mt-1 text-fg-soft">
            Escríbenos por WhatsApp y te ponemos en contacto con la más cercana.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={GENERAL_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "gold", size: "md" })}
            >
              <MessageCircle className="mr-2 h-5 w-5" aria-hidden />
              Escribir por WhatsApp
            </a>
            <button type="button" onClick={load} className={buttonVariants({ variant: "outlineAuto", size: "md" })}>
              <RefreshCw className="mr-2 h-5 w-5" aria-hidden />
              Reintentar
            </button>
          </div>
        </div>
      )}

      {status === "ready" && comunidades.length === 0 && (
        <div className="rounded-2xl border border-line-card bg-surface shadow-card dark:bg-white/[0.07] p-6 text-fg">
          <p className="font-semibold">Pronto publicaremos aquí las comunidades JMV.</p>
          <p className="mt-1 text-fg-soft">Mientras tanto, escríbenos y te ponemos en contacto.</p>
          <a
            href={GENERAL_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "gold", size: "md", className: "mt-4" })}
          >
            <MessageCircle className="mr-2 h-5 w-5" aria-hidden />
            Escribir por WhatsApp
          </a>
        </div>
      )}

      {status === "ready" && comunidades.length > 0 && canShowMap && (
        <>
          <p className="mb-4 flex items-start gap-2 text-sm text-fg-muted">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" aria-hidden />
            Toca un marcador para ver la comunidad y escribirle por WhatsApp. En el celular, usa dos dedos para mover el mapa.
          </p>
          <LazyMap comunidades={comunidades} />

          {/* Alternativa al mapa (teclado, lector de pantalla o comunidades sin ubicación): plegada para no ocupar espacio */}
          <details className="group mt-4 rounded-2xl border border-line-card bg-surface shadow-card dark:bg-white/[0.07]">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-5 py-3 font-semibold text-fg [&::-webkit-details-marker]:hidden">
              <span>
                Ver lista de comunidades ({comunidades.length})
                {missing > 0 && (
                  <span className="ml-2 text-sm font-normal text-fg-soft">
                    · {missing === 1 ? "1 aún no aparece" : `${missing} aún no aparecen`} en el mapa
                  </span>
                )}
              </span>
              <ChevronDown className="h-5 w-5 shrink-0 text-fg-soft transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <div className="px-5 pb-5">{list}</div>
          </details>
        </>
      )}

      {/* Sin ubicaciones cargadas no hay mapa posible: se muestra la lista directamente */}
      {status === "ready" && comunidades.length > 0 && !canShowMap && list}
    </div>
  );
}
