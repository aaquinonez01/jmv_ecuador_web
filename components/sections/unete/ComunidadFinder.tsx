"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import { LocateFixed, Mail, MapPin, MessageCircle, Phone, RefreshCw } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { getComunidadesAPI } from "@/actions/comunidades";
import { comunidadWhatsappLink, distanceKm, hasCoords } from "@/lib/comunidades";
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

type Coords = { latitude: number; longitude: number };
type GeoState = "idle" | "loading" | "ok" | "denied" | "unavailable";

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
  const [ciudad, setCiudad] = useState("");
  const [coords, setCoords] = useState<Coords | null>(null);
  const [geo, setGeo] = useState<GeoState>("idle");

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

  const ciudadesPorZona = useMemo(() => {
    const groups = new Map<string, Set<string>>();
    for (const c of comunidades) {
      if (!c.ciudad) continue;
      const zona = c.zona?.nombre || "Otras";
      if (!groups.has(zona)) groups.set(zona, new Set());
      groups.get(zona)!.add(c.ciudad);
    }
    return [...groups.entries()]
      .sort(([a], [b]) => a.localeCompare(b, LOCALE))
      .map(([zona, set]) => ({ zona, ciudades: [...set].sort((a, b) => a.localeCompare(b, LOCALE)) }));
  }, [comunidades]);

  const canLocate = comunidades.some(hasCoords);

  const results = useMemo(() => {
    let list = ciudad ? comunidades.filter((c) => c.ciudad === ciudad) : comunidades;
    if (coords) {
      const withDistance = list.map((c) => ({
        comunidad: c,
        distance: hasCoords(c)
          ? distanceKm(coords, { latitude: c.latitud, longitude: c.longitud })
          : undefined,
      }));
      return withDistance.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    }
    list = [...list].sort((a, b) => a.nombre.localeCompare(b.nombre, LOCALE));
    return list.map((comunidad) => ({ comunidad, distance: undefined as number | undefined }));
  }, [comunidades, ciudad, coords]);

  const locate = () => {
    if (!("geolocation" in navigator)) {
      setGeo("unavailable");
      return;
    }
    setGeo("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setCiudad("");
        setGeo("ok");
      },
      (err) => setGeo(err.code === err.PERMISSION_DENIED ? "denied" : "unavailable"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  };

  const summary =
    status !== "ready"
      ? ""
      : results.length === 0
        ? "No encontramos comunidades con ese filtro."
        : coords
          ? `${results.length} ${results.length === 1 ? "comunidad" : "comunidades"}, de la más cercana a la más lejana.`
          : ciudad
            ? `${results.length} ${results.length === 1 ? "comunidad" : "comunidades"} en ${ciudad}.`
            : `${results.length} ${results.length === 1 ? "comunidad" : "comunidades"} en todo el Ecuador.`;

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-2xl border border-line-card bg-surface shadow-card dark:bg-white/[0.07] p-5 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="buscar-ciudad" className="mb-2 block text-sm font-semibold text-fg">
            ¿En qué ciudad vives?
          </label>
          <select
            id="buscar-ciudad"
            value={ciudad}
            onChange={(e) => {
              setCiudad(e.target.value);
              setCoords(null);
              setGeo("idle");
            }}
            disabled={status !== "ready" || comunidades.length === 0}
            className="block min-h-12 w-full rounded-xl border-2 border-slate-500 bg-surface px-4 text-base text-fg disabled:opacity-60 dark:border-white/30 dark:bg-jmv-ink"
          >
            <option value="">Todas las ciudades</option>
            {ciudadesPorZona.map((group) => (
              <optgroup key={group.zona} label={group.zona}>
                {group.ciudades.map((c) => (
                  <option key={`${group.zona}-${c}`} value={c}>
                    {c}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        {canLocate && (
          <button
            type="button"
            onClick={locate}
            disabled={geo === "loading"}
            className={buttonVariants({ variant: "outlineAuto", size: "md" })}
          >
            <LocateFixed className="mr-2 h-5 w-5" aria-hidden />
            {geo === "loading" ? "Buscando tu ubicación…" : "Usar mi ubicación"}
          </button>
        )}
      </div>

      <div aria-live="polite" className="mt-4 min-h-6 text-sm text-fg-soft">
        {geo === "denied" && <p>No pudimos acceder a tu ubicación. Elige tu ciudad en la lista.</p>}
        {geo === "unavailable" && <p>Tu ubicación no está disponible ahora. Elige tu ciudad en la lista.</p>}
        {geo === "ok" && (
          <p className="sr-only">Ordenamos las comunidades según tu ubicación. Solo se usa en tu dispositivo.</p>
        )}
        <p>{summary}</p>
      </div>

      {status === "loading" && (
        <p className="mt-6 text-fg-soft" role="status">
          Cargando comunidades…
        </p>
      )}

      {status === "error" && (
        <div className="mt-6 rounded-2xl border border-line-card bg-surface shadow-card dark:bg-white/[0.07] p-6 text-fg" role="alert">
          <p className="font-semibold">No pudimos cargar la lista de comunidades.</p>
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
        <div className="mt-6 rounded-2xl border border-line-card bg-surface shadow-card dark:bg-white/[0.07] p-6 text-fg">
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

      {status === "ready" && results.length > 0 && (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(({ comunidad, distance }) => (
            <ComunidadCard key={comunidad.id} comunidad={comunidad} distance={distance} />
          ))}
        </ul>
      )}

      {status === "ready" && canLocate && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-fg">También puedes verlas en el mapa</h3>
          <p className="mt-1 mb-4 text-fg-muted">
            Toca un marcador para ver los datos de contacto. En el celular, usa dos dedos para mover el mapa.
          </p>
          <LazyMap comunidades={comunidades} />
        </div>
      )}
    </div>
  );
}
