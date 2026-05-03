"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  createZonaAPI,
  deleteZonaAPI,
  getZonasAPI,
  updateZonaAPI,
} from "@/actions/zonas";
import {
  createComunidadAPI,
  deleteComunidadAPI,
  getComunidadesAPI,
  updateComunidadAPI,
} from "@/actions/comunidades";
import Button from "@/components/admin/ui/Button";
import InputField from "@/components/admin/ui/InputField";
import Modal from "@/components/admin/ui/Modal";
import PageHeader from "@/components/admin/layout/PageHeader";
import { useToast } from "@/lib/hooks/useToast";
import type {
  ComunidadItem,
  ComunidadPayload,
  ZonaItem,
  ZonaPayload,
} from "@/types/territory-management";
import {
  ChevronDown,
  MapPinned,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";

interface ZonaFormState {
  nombre: string;
  ciudadesTexto: string;
  nombreCoordinador: string;
}

interface ComunidadFormState {
  nombre: string;
  ciudad: string;
  correoElectronico: string;
  direccion: string;
  telefono: string;
  latitud: string;
  longitud: string;
  zonaId: string;
}

const emptyZonaForm = (): ZonaFormState => ({
  nombre: "",
  ciudadesTexto: "",
  nombreCoordinador: "",
});

const emptyComunidadForm = (): ComunidadFormState => ({
  nombre: "",
  ciudad: "",
  correoElectronico: "",
  direccion: "",
  telefono: "",
  latitud: "",
  longitud: "",
  zonaId: "",
});

function parseCiudades(value: string): string[] {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatCiudades(ciudades: string[]): string {
  return ciudades.join(", ");
}

function toZonaPayload(form: ZonaFormState): ZonaPayload {
  return {
    nombre: form.nombre.trim(),
    ciudades: parseCiudades(form.ciudadesTexto),
    nombreCoordinador: form.nombreCoordinador.trim() || undefined,
  };
}

function parseCoord(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toComunidadPayload(form: ComunidadFormState): ComunidadPayload {
  return {
    nombre: form.nombre.trim(),
    ciudad: form.ciudad.trim(),
    correoElectronico: form.correoElectronico.trim(),
    direccion: form.direccion.trim() || undefined,
    telefono: form.telefono.trim() || undefined,
    latitud: parseCoord(form.latitud),
    longitud: parseCoord(form.longitud),
    zonaId: form.zonaId,
  };
}

function SectionShell({
  title,
  description,
  icon,
  count,
  onCreate,
  children,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  count: number;
  onCreate: () => void;
  children: ReactNode;
}) {
  return (
    <section className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      <header className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-slate-50/60 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-jmv-blue/10 text-jmv-blue ring-1 ring-jmv-blue/15">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-[14px] font-bold leading-tight text-slate-900">
              {title}
            </h2>
            <span className="rounded-md bg-white px-1.5 py-0.5 text-[10.5px] font-bold text-slate-600 ring-1 ring-slate-200">
              {count}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[11.5px] leading-tight text-slate-500">
            {description}
          </p>
        </div>
        <Button
          size="sm"
          variant="primary"
          onClick={onCreate}
          icon={<Plus className="h-3.5 w-3.5" strokeWidth={2.5} />}
        >
          Nuevo
        </Button>
      </header>
      {children}
    </section>
  );
}

function EmptyState({
  icon,
  message,
  cta,
  onCta,
}: {
  icon: ReactNode;
  message: string;
  cta: string;
  onCta: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        {icon}
      </div>
      <p className="text-[12.5px] font-medium text-slate-600">{message}</p>
      <button
        onClick={onCta}
        className="text-[11.5px] font-semibold text-jmv-blue hover:underline"
      >
        {cta}
      </button>
    </div>
  );
}

export default function TerritoriosManager() {
  const toast = useToast();
  const [zonas, setZonas] = useState<ZonaItem[]>([]);
  const [comunidades, setComunidades] = useState<ComunidadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [zonaEditor, setZonaEditor] = useState<{
    item: ZonaItem | null;
    form: ZonaFormState;
  } | null>(null);
  const [comunidadEditor, setComunidadEditor] = useState<{
    item: ComunidadItem | null;
    form: ComunidadFormState;
  } | null>(null);

  const zonasOptions = useMemo(
    () => zonas.map((zona) => ({ id: zona.id, nombre: zona.nombre })),
    [zonas]
  );

  const loadAll = async () => {
    try {
      setLoading(true);
      const [zonasData, comunidadesData] = await Promise.all([
        getZonasAPI(),
        getComunidadesAPI(),
      ]);
      setZonas(zonasData);
      setComunidades(comunidadesData);
    } catch {
      toast.error("No se pudo cargar la gestión de territorios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const openCreateZona = () =>
    setZonaEditor({ item: null, form: emptyZonaForm() });

  const openEditZona = (zona: ZonaItem) =>
    setZonaEditor({
      item: zona,
      form: {
        nombre: zona.nombre,
        ciudadesTexto: formatCiudades(zona.ciudades),
        nombreCoordinador: zona.nombreCoordinador || "",
      },
    });

  const openCreateComunidad = () => {
    if (zonas.length === 0) {
      toast.error("Primero crea al menos una zona.");
      return;
    }
    setComunidadEditor({
      item: null,
      form: { ...emptyComunidadForm(), zonaId: zonas[0]?.id || "" },
    });
  };

  const openEditComunidad = (item: ComunidadItem) =>
    setComunidadEditor({
      item,
      form: {
        nombre: item.nombre,
        ciudad: item.ciudad,
        correoElectronico: item.correoElectronico,
        direccion: item.direccion ?? "",
        telefono: item.telefono ?? "",
        latitud:
          item.latitud !== null && item.latitud !== undefined
            ? String(item.latitud)
            : "",
        longitud:
          item.longitud !== null && item.longitud !== undefined
            ? String(item.longitud)
            : "",
        zonaId: item.zona?.id || "",
      },
    });

  const handleSubmitZona = async () => {
    if (!zonaEditor) return;
    const payload = toZonaPayload(zonaEditor.form);
    if (!payload.nombre) {
      toast.error("El nombre de la zona es obligatorio.");
      return;
    }
    if (payload.ciudades.length === 0) {
      toast.error("Debes ingresar al menos una ciudad.");
      return;
    }

    try {
      setSubmitting(true);
      if (zonaEditor.item) {
        await updateZonaAPI(zonaEditor.item.id, payload);
        toast.success("Zona actualizada.");
      } else {
        await createZonaAPI(payload);
        toast.success("Zona creada correctamente.");
      }
      setZonaEditor(null);
      await loadAll();
    } catch {
      toast.error("No se pudo guardar la zona.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitComunidad = async () => {
    if (!comunidadEditor) return;
    const payload = toComunidadPayload(comunidadEditor.form);
    if (!payload.nombre || !payload.ciudad || !payload.correoElectronico) {
      toast.error("Nombre, ciudad y correo son obligatorios.");
      return;
    }
    if (!payload.zonaId) {
      toast.error("Debes seleccionar una zona.");
      return;
    }
    const hasLat = payload.latitud !== undefined;
    const hasLng = payload.longitud !== undefined;
    if (hasLat !== hasLng) {
      toast.error("Latitud y longitud deben completarse juntas.");
      return;
    }
    if (hasLat && (payload.latitud! < -90 || payload.latitud! > 90)) {
      toast.error("La latitud debe estar entre -90 y 90.");
      return;
    }
    if (hasLng && (payload.longitud! < -180 || payload.longitud! > 180)) {
      toast.error("La longitud debe estar entre -180 y 180.");
      return;
    }

    try {
      setSubmitting(true);
      if (comunidadEditor.item) {
        await updateComunidadAPI(comunidadEditor.item.id, payload);
        toast.success("Comunidad actualizada.");
      } else {
        await createComunidadAPI(payload);
        toast.success("Comunidad creada correctamente.");
      }
      setComunidadEditor(null);
      await loadAll();
    } catch {
      toast.error("No se pudo guardar la comunidad.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteZona = async (zona: ZonaItem) => {
    const ok = window.confirm(
      `Se eliminará la zona "${zona.nombre}". Si tiene comunidades asociadas, primero debes moverlas o eliminarlas.`
    );
    if (!ok) return;
    try {
      await deleteZonaAPI(zona.id);
      toast.success("Zona eliminada.");
      await loadAll();
    } catch {
      toast.error("No se pudo eliminar la zona.");
    }
  };

  const handleDeleteComunidad = async (comunidad: ComunidadItem) => {
    const ok = window.confirm(
      `Se eliminará la comunidad "${comunidad.nombre}". Esta acción no se puede deshacer.`
    );
    if (!ok) return;
    try {
      await deleteComunidadAPI(comunidad.id);
      toast.success("Comunidad eliminada.");
      await loadAll();
    } catch {
      toast.error("No se pudo eliminar la comunidad.");
    }
  };

  if (loading) {
    return (
      <div className="px-6 py-10 text-sm text-slate-500">
        Cargando territorios...
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Zonas y comunidades"
        description="Administra zonas pastorales y las comunidades vinculadas."
        icon={<MapPinned className="h-[18px] w-[18px]" strokeWidth={2.1} />}
        breadcrumbs={[{ label: "Contenido" }, { label: "Territorios" }]}
      />

      <div className="flex-1 overflow-auto px-6 py-5">
        <div className="grid h-full grid-cols-1 gap-4 xl:grid-cols-2">
          {/* Zonas */}
          <SectionShell
            title="Zonas"
            description="Nombre, ciudades y coordinador opcional."
            icon={<MapPinned className="h-[18px] w-[18px]" strokeWidth={2} />}
            count={zonas.length}
            onCreate={openCreateZona}
          >
            {zonas.length === 0 ? (
              <EmptyState
                icon={<MapPinned className="h-5 w-5" strokeWidth={1.8} />}
                message="Aún no hay zonas creadas."
                cta="Crear la primera"
                onCta={openCreateZona}
              />
            ) : (
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead className="sticky top-0 bg-slate-50">
                      <tr className="text-[10px] uppercase tracking-wider text-slate-500">
                        <th className="px-3 py-2 text-left font-bold">Zona</th>
                        <th className="px-3 py-2 text-left font-bold">Ciudades</th>
                        <th className="px-3 py-2 text-left font-bold">Coordinador</th>
                        <th className="px-3 py-2 text-right font-bold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {zonas.map((zona) => (
                        <tr
                          key={zona.id}
                          className="transition-colors hover:bg-slate-50/50"
                        >
                          <td className="px-3 py-2 text-[12px] font-bold text-slate-900">
                            {zona.nombre}
                          </td>
                          <td className="px-3 py-2 text-[11.5px] text-slate-600">
                            <span className="line-clamp-2">
                              {formatCiudades(zona.ciudades) || "—"}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-[11.5px] text-slate-600">
                            {zona.nombreCoordinador || (
                              <span className="text-slate-400">Sin asignar</span>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex justify-end gap-0.5">
                              <button
                                onClick={() => openEditZona(zona)}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-jmv-blue/10 hover:text-jmv-blue"
                                title="Editar"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => void handleDeleteZona(zona)}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-600 transition-colors hover:bg-red-50"
                                title="Eliminar"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <footer className="shrink-0 border-t border-slate-100 bg-slate-50/40 px-3 py-1.5 text-[10.5px] text-slate-500">
                  <strong className="font-bold text-slate-700">{zonas.length}</strong>{" "}
                  zona{zonas.length === 1 ? "" : "s"} ·{" "}
                  {zonas.reduce((sum, z) => sum + z.ciudades.length, 0)} ciudades
                </footer>
              </div>
            )}
          </SectionShell>

          {/* Comunidades */}
          <SectionShell
            title="Comunidades"
            description="Vinculadas a una zona y una ciudad."
            icon={<Users className="h-[18px] w-[18px]" strokeWidth={2} />}
            count={comunidades.length}
            onCreate={openCreateComunidad}
          >
            {comunidades.length === 0 ? (
              <EmptyState
                icon={<Users className="h-5 w-5" strokeWidth={1.8} />}
                message="Aún no hay comunidades creadas."
                cta="Crear la primera"
                onCta={openCreateComunidad}
              />
            ) : (
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead className="sticky top-0 bg-slate-50">
                      <tr className="text-[10px] uppercase tracking-wider text-slate-500">
                        <th className="px-3 py-2 text-left font-bold">Comunidad</th>
                        <th className="px-3 py-2 text-left font-bold">Ciudad</th>
                        <th className="px-3 py-2 text-left font-bold">Zona</th>
                        <th className="px-3 py-2 text-left font-bold">Correo</th>
                        <th className="px-3 py-2 text-right font-bold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {comunidades.map((comunidad) => (
                        <tr
                          key={comunidad.id}
                          className="transition-colors hover:bg-slate-50/50"
                        >
                          <td className="px-3 py-2 text-[12px] font-bold text-slate-900">
                            {comunidad.nombre}
                          </td>
                          <td className="px-3 py-2 text-[11.5px] text-slate-600">
                            {comunidad.ciudad}
                          </td>
                          <td className="px-3 py-2 text-[11.5px]">
                            {comunidad.zona?.nombre ? (
                              <span className="inline-flex items-center rounded-full bg-jmv-blue/10 px-2 py-0.5 font-semibold text-jmv-blue">
                                {comunidad.zona.nombre}
                              </span>
                            ) : (
                              <span className="text-slate-400">Sin zona</span>
                            )}
                          </td>
                          <td className="max-w-[180px] truncate px-3 py-2 text-[11.5px] text-slate-600">
                            {comunidad.correoElectronico}
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex justify-end gap-0.5">
                              <button
                                onClick={() => openEditComunidad(comunidad)}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-jmv-blue/10 hover:text-jmv-blue"
                                title="Editar"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => void handleDeleteComunidad(comunidad)}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-600 transition-colors hover:bg-red-50"
                                title="Eliminar"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <footer className="shrink-0 border-t border-slate-100 bg-slate-50/40 px-3 py-1.5 text-[10.5px] text-slate-500">
                  <strong className="font-bold text-slate-700">
                    {comunidades.length}
                  </strong>{" "}
                  comunidad{comunidades.length === 1 ? "" : "es"} en{" "}
                  {new Set(comunidades.map((c) => c.zona?.id).filter(Boolean)).size}{" "}
                  zona
                  {new Set(comunidades.map((c) => c.zona?.id).filter(Boolean)).size === 1
                    ? ""
                    : "s"}
                </footer>
              </div>
            )}
          </SectionShell>
        </div>
      </div>

      {/* Zona editor */}
      <Modal
        isOpen={!!zonaEditor}
        onClose={() => setZonaEditor(null)}
        title={zonaEditor?.item ? "Editar zona" : "Nueva zona"}
        footer={
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZonaEditor(null)}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleSubmitZona}
              isLoading={submitting}
              icon={
                zonaEditor?.item ? undefined : (
                  <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                )
              }
            >
              {zonaEditor?.item ? "Guardar cambios" : "Crear zona"}
            </Button>
          </>
        }
      >
        {zonaEditor ? (
          <div className="space-y-3.5 px-5 py-4">
            <InputField
              label="Nombre de la zona"
              required
              value={zonaEditor.form.nombre}
              onChange={(event) =>
                setZonaEditor((current) =>
                  current
                    ? {
                        ...current,
                        form: { ...current.form, nombre: event.target.value },
                      }
                    : current
                )
              }
              placeholder="Ej. Zona Norte"
            />
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Ciudades
                <span className="ml-1 text-[10.5px] font-normal text-slate-400">
                  (separadas por coma o salto de línea)
                </span>
              </label>
              <textarea
                value={zonaEditor.form.ciudadesTexto}
                onChange={(event) =>
                  setZonaEditor((current) =>
                    current
                      ? {
                          ...current,
                          form: {
                            ...current.form,
                            ciudadesTexto: event.target.value,
                          },
                        }
                      : current
                  )
                }
                placeholder="Quito, Ibarra, Tulcán"
                rows={3}
                className="block w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-jmv-blue focus:outline-none focus:ring-2 focus:ring-jmv-blue/30"
              />
            </div>
            <InputField
              label="Coordinador (opcional)"
              value={zonaEditor.form.nombreCoordinador}
              onChange={(event) =>
                setZonaEditor((current) =>
                  current
                    ? {
                        ...current,
                        form: {
                          ...current.form,
                          nombreCoordinador: event.target.value,
                        },
                      }
                    : current
                )
              }
              placeholder="Ej. María Fernanda Pérez"
            />
          </div>
        ) : null}
      </Modal>

      {/* Comunidad editor */}
      <Modal
        isOpen={!!comunidadEditor}
        onClose={() => setComunidadEditor(null)}
        title={comunidadEditor?.item ? "Editar comunidad" : "Nueva comunidad"}
        footer={
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setComunidadEditor(null)}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleSubmitComunidad}
              isLoading={submitting}
              icon={
                comunidadEditor?.item ? undefined : (
                  <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                )
              }
            >
              {comunidadEditor?.item ? "Guardar cambios" : "Crear comunidad"}
            </Button>
          </>
        }
      >
        {comunidadEditor ? (
          <div className="space-y-3.5 px-5 py-4">
            <InputField
              label="Nombre de la comunidad"
              required
              value={comunidadEditor.form.nombre}
              onChange={(event) =>
                setComunidadEditor((current) =>
                  current
                    ? {
                        ...current,
                        form: { ...current.form, nombre: event.target.value },
                      }
                    : current
                )
              }
              placeholder="Ej. Comunidad San Vicente"
            />
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Ciudad"
                required
                value={comunidadEditor.form.ciudad}
                onChange={(event) =>
                  setComunidadEditor((current) =>
                    current
                      ? {
                          ...current,
                          form: { ...current.form, ciudad: event.target.value },
                        }
                      : current
                  )
                }
                placeholder="Ej. Quito"
              />
              <InputField
                label="Correo"
                required
                type="email"
                value={comunidadEditor.form.correoElectronico}
                onChange={(event) =>
                  setComunidadEditor((current) =>
                    current
                      ? {
                          ...current,
                          form: {
                            ...current.form,
                            correoElectronico: event.target.value,
                          },
                        }
                      : current
                  )
                }
                placeholder="comunidad@email.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Zona
              </label>
              <div className="relative">
                <select
                  value={comunidadEditor.form.zonaId}
                  onChange={(event) =>
                    setComunidadEditor((current) =>
                      current
                        ? {
                            ...current,
                            form: {
                              ...current.form,
                              zonaId: event.target.value,
                            },
                          }
                        : current
                    )
                  }
                  className="block h-9 w-full cursor-pointer appearance-none rounded-md border border-slate-300 bg-white pl-3 pr-9 text-sm text-slate-900 transition-colors hover:border-slate-400 focus:border-jmv-blue focus:outline-none focus:ring-2 focus:ring-jmv-blue/30"
                >
                  <option value="">Selecciona una zona</option>
                  {zonasOptions.map((zona) => (
                    <option key={zona.id} value={zona.id}>
                      {zona.nombre}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  strokeWidth={2.2}
                />
              </div>
            </div>

            <div className="rounded-md border border-dashed border-slate-200 bg-slate-50/40 p-3.5">
              <div className="mb-2.5 flex items-center justify-between">
                <h3 className="text-[11.5px] font-bold uppercase tracking-wider text-slate-600">
                  Ubicación en el mapa
                </h3>
                <a
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10.5px] font-semibold text-jmv-blue hover:underline"
                >
                  Buscar en Google Maps ↗
                </a>
              </div>
              <p className="mb-3 text-[10.5px] leading-snug text-slate-500">
                Tip: en Google Maps haz click derecho sobre el lugar y haz click
                en las coordenadas para copiarlas (formato: latitud, longitud).
              </p>
              <InputField
                label="Dirección"
                value={comunidadEditor.form.direccion}
                onChange={(event) =>
                  setComunidadEditor((current) =>
                    current
                      ? {
                          ...current,
                          form: {
                            ...current.form,
                            direccion: event.target.value,
                          },
                        }
                      : current
                  )
                }
                placeholder="Ej. Av. 12 de Octubre N24-563 y Cordero"
              />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <InputField
                  label="Latitud"
                  type="text"
                  inputMode="decimal"
                  value={comunidadEditor.form.latitud}
                  onChange={(event) =>
                    setComunidadEditor((current) =>
                      current
                        ? {
                            ...current,
                            form: {
                              ...current.form,
                              latitud: event.target.value,
                            },
                          }
                        : current
                    )
                  }
                  placeholder="-0.1807"
                  hint="Entre -90 y 90"
                />
                <InputField
                  label="Longitud"
                  type="text"
                  inputMode="decimal"
                  value={comunidadEditor.form.longitud}
                  onChange={(event) =>
                    setComunidadEditor((current) =>
                      current
                        ? {
                            ...current,
                            form: {
                              ...current.form,
                              longitud: event.target.value,
                            },
                          }
                        : current
                    )
                  }
                  placeholder="-78.4678"
                  hint="Entre -180 y 180"
                />
              </div>
              <div className="mt-3">
                <InputField
                  label="Teléfono (opcional)"
                  type="tel"
                  value={comunidadEditor.form.telefono}
                  onChange={(event) =>
                    setComunidadEditor((current) =>
                      current
                        ? {
                            ...current,
                            form: {
                              ...current.form,
                              telefono: event.target.value,
                            },
                          }
                        : current
                    )
                  }
                  placeholder="+593 99 123 4567"
                />
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
