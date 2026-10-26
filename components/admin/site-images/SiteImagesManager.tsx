"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Eye,
  EyeOff,
  ImageIcon,
  Images,
  Pencil,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";
import PageHeader from "@/components/admin/layout/PageHeader";
import Button from "@/components/admin/ui/Button";
import Modal from "@/components/admin/ui/Modal";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import { useToast } from "@/lib/hooks/useToast";
import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import {
  deleteSiteImageAPI,
  getAllSiteImagesAPI,
  reorderSiteImagesAPI,
  siteImagesErrorMessage,
  updateSiteImageAPI,
  type AdminSiteImage,
} from "@/actions/site-images";
import { ASPECT_CLASS, slotsByPage, type SiteImageSlot, type SiteImageSlotId } from "@/lib/site-images";
import UploadModal from "./UploadModal";
import { ALT_MAX, ALT_MIN, ASPECT_HINT } from "./shared";

const iconButton =
  "inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jmv-blue/40 disabled:cursor-not-allowed disabled:opacity-35 sm:h-9 sm:w-9";

const linkButton =
  "inline-flex min-h-11 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jmv-blue/40 sm:min-h-9";

const GROUPS = slotsByPage();

export default function SiteImagesManager() {
  const toast = useToast();
  const [images, setImages] = useState<AdminSiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [uploadFor, setUploadFor] = useState<SiteImageSlotId | null>(null);
  const [editing, setEditing] = useState<AdminSiteImage | null>(null);
  const [altDraft, setAltDraft] = useState("");
  const [altError, setAltError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<AdminSiteImage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busySlot, setBusySlot] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setImages(await getAllSiteImagesAPI());
      setLoadError(false);
    } catch (error) {
      setLoadError(true);
      toast.error(siteImagesErrorMessage(error, "No se pudieron cargar las fotos."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bySlot = useMemo(() => {
    const map = new Map<string, AdminSiteImage[]>();
    for (const img of images) {
      if (img.subsection) continue;
      const list = map.get(img.section) ?? [];
      list.push(img);
      map.set(img.section, list);
    }
    for (const list of map.values()) list.sort((a, b) => a.orden - b.orden);
    return map;
  }, [images]);

  const totalSlots = GROUPS.reduce((n, g) => n + g.slots.length, 0);
  const withOwn = GROUPS.reduce((n, g) => n + g.slots.filter(({ id }) => (bySlot.get(id)?.length ?? 0) > 0).length, 0);
  const visibleGroups = filter === "all" ? GROUPS : GROUPS.filter((g) => g.page === filter);

  const move = async (slotId: string, index: number, direction: -1 | 1) => {
    const list = bySlot.get(slotId) ?? [];
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    const next = [...list];
    [next[index], next[target]] = [next[target], next[index]];
    const previous = images;
    const orden = new Map(next.map((img, i) => [img.id, i + 1]));
    setImages((current) => current.map((img) => (orden.has(img.id) ? { ...img, orden: orden.get(img.id)! } : img)));
    setBusySlot(slotId);
    try {
      await reorderSiteImagesAPI(slotId, next.map((img) => img.id));
    } catch (error) {
      setImages(previous);
      toast.error(siteImagesErrorMessage(error, "No se pudo cambiar el orden."));
    } finally {
      setBusySlot(null);
    }
  };

  const openEdit = (img: AdminSiteImage) => {
    setEditing(img);
    setAltDraft(img.alt);
    setAltError(null);
  };

  const saveAlt = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    const alt = altDraft.trim();
    if (alt.length < ALT_MIN) {
      setAltError("Describe la foto (al menos 3 caracteres).");
      return;
    }
    try {
      setSaving(true);
      await updateSiteImageAPI(editing.id, { alt });
      setImages((current) => current.map((img) => (img.id === editing.id ? { ...img, alt } : img)));
      toast.success("Se guardó el texto alternativo.");
      setEditing(null);
    } catch (error) {
      toast.error(siteImagesErrorMessage(error, "No se pudo guardar."));
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (img: AdminSiteImage) => {
    const activo = !img.activo;
    setImages((current) => current.map((i) => (i.id === img.id ? { ...i, activo } : i)));
    try {
      await updateSiteImageAPI(img.id, { activo });
      toast.success(activo ? "La foto vuelve a verse en la página." : "La foto quedó oculta.");
    } catch (error) {
      setImages((current) => current.map((i) => (i.id === img.id ? { ...i, activo: !activo } : i)));
      toast.error(siteImagesErrorMessage(error, "No se pudo cambiar."));
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      setDeleting(true);
      await deleteSiteImageAPI(toDelete.id);
      setImages((current) => current.filter((img) => img.id !== toDelete.id));
      toast.success("Se eliminó la foto.");
      setToDelete(null);
    } catch (error) {
      toast.error(siteImagesErrorMessage(error, "No se pudo eliminar."));
    } finally {
      setDeleting(false);
    }
  };

  const uploadSlot = uploadFor ? GROUPS.flatMap((g) => g.slots).find((s) => s.id === uploadFor) : null;
  const deleteWillFallback = toDelete ? (bySlot.get(toDelete.section)?.length ?? 0) === 1 : false;

  return (
    <>
      <PageHeader
        title="Imágenes del sitio"
        description="Fotos de las cabeceras y secciones de cada página. Si un espacio no tiene fotos, se usan las de respaldo."
        icon={<Images className="h-[18px] w-[18px]" strokeWidth={2.1} />}
        breadcrumbs={[{ label: "Contenido" }, { label: "Imágenes" }]}
      />

      <div className="flex flex-1 flex-col overflow-auto px-4 py-5 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-[13px] text-slate-600" aria-live="polite">
              {loading
                ? "Cargando fotos…"
                : loadError
                  ? "No se pudieron cargar las fotos subidas. Se muestran solo las de respaldo."
                  : `${withOwn} de ${totalSlots} espacios ya tienen fotos propias.`}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="slot-filter" className="text-[13px] font-semibold text-slate-700">
                Página
              </label>
              <select
                id="slot-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="min-h-11 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-jmv-blue focus:outline-none focus:ring-2 focus:ring-jmv-blue/30 sm:min-h-9 sm:flex-none"
              >
                <option value="all">Todas ({GROUPS.length})</option>
                {GROUPS.map((g) => (
                  <option key={g.page} value={g.page}>
                    {g.label} ({g.slots.length})
                  </option>
                ))}
              </select>
              {loadError && (
                <Button variant="outline" className="min-h-11 sm:min-h-9" onClick={() => void load()} icon={<RefreshCw className="h-4 w-4" aria-hidden />}>
                  Reintentar
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {visibleGroups.map((group) => (
              <section key={group.page} aria-labelledby={`grp-${group.page}`}>
                <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-200 pb-2">
                  <h2 id={`grp-${group.page}`} className="text-base font-bold text-slate-900">
                    {group.label}
                  </h2>
                  <a href={group.page} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 text-[13px] font-semibold text-jmv-blue hover:underline sm:min-h-0">
                    Ver página
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    <span className="sr-only"> {group.label} (se abre en una pestaña nueva)</span>
                  </a>
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {group.slots.map(({ id, slot }) => (
                    <SlotCard
                      key={id}
                      id={id}
                      slot={slot}
                      images={bySlot.get(id) ?? []}
                      loading={loading}
                      busy={busySlot === id}
                      onUpload={() => setUploadFor(id)}
                      onMove={(index, dir) => void move(id, index, dir)}
                      onEdit={openEdit}
                      onToggle={(img) => void toggleActive(img)}
                      onDelete={setToDelete}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      {uploadSlot && (
        <UploadModal
          slotId={uploadSlot.id}
          slot={uploadSlot.slot}
          remaining={Math.max(0, uploadSlot.slot.max - (bySlot.get(uploadSlot.id)?.length ?? 0))}
          isOpen={Boolean(uploadFor)}
          onClose={() => setUploadFor(null)}
          onUploaded={() => void load()}
        />
      )}

      <Modal
        isOpen={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Editar texto alternativo"
        description="Describe lo que se ve en la foto, para quien no puede verla."
        size="md"
      >
        <form onSubmit={saveAlt} noValidate>
          <div className="space-y-3 p-5">
            {editing && (
              <div className="relative mx-auto aspect-video w-full max-w-xs overflow-hidden rounded-lg bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element -- miniatura de Cloudinary ya redimensionada */}
                <img src={getOptimizedUrl(editing.url, { w: 480 })} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            <label htmlFor="alt-edit" className="block text-[13px] font-semibold text-slate-700">
              Texto alternativo<span className="ml-0.5 text-red-600" aria-hidden>*</span>
            </label>
            <textarea
              id="alt-edit"
              rows={3}
              value={altDraft}
              maxLength={ALT_MAX}
              onChange={(e) => {
                setAltDraft(e.target.value);
                setAltError(null);
              }}
              aria-invalid={Boolean(altError)}
              aria-describedby={altError ? "alt-edit-err" : undefined}
              className="block w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-jmv-blue focus:outline-none focus:ring-2 focus:ring-jmv-blue/30 aria-[invalid=true]:border-red-500"
            />
            {altError && (
              <p id="alt-edit-err" className="text-xs font-medium text-red-700">
                {altError}
              </p>
            )}
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" className="min-h-11 sm:min-h-9" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="min-h-11 sm:min-h-9" isLoading={saving}>
              Guardar
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={() => void confirmDelete()}
        title="¿Eliminar esta foto?"
        message={
          deleteWillFallback
            ? "Se borrará de la web y del almacenamiento. Es la única de este espacio: la página volverá a mostrar la foto de respaldo. No se puede deshacer."
            : "Se borrará de la web y del almacenamiento. No se puede deshacer; si solo quieres esconderla, usa «Ocultar»."
        }
        confirmText="Sí, eliminar"
        variant="danger"
        isLoading={deleting}
      />
    </>
  );
}

function SlotCard({
  id,
  slot,
  images,
  loading,
  busy,
  onUpload,
  onMove,
  onEdit,
  onToggle,
  onDelete,
}: {
  id: string;
  slot: SiteImageSlot;
  images: AdminSiteImage[];
  loading: boolean;
  busy: boolean;
  onUpload: () => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onEdit: (img: AdminSiteImage) => void;
  onToggle: (img: AdminSiteImage) => void;
  onDelete: (img: AdminSiteImage) => void;
}) {
  const count = images.length;
  const full = count >= slot.max;
  const titleId = `slot-${id}`;

  return (
    <article aria-labelledby={titleId} className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 id={titleId} className="text-[15px] font-bold leading-tight text-slate-900">
            {slot.label}
          </h3>
          <p className="mt-0.5 font-mono text-[11px] text-slate-500">{id}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold tabular-nums ${
            count > 0 ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200" : "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
          }`}
          aria-label={`${count} de ${slot.max} fotos`}
        >
          {count} de {slot.max}
        </span>
      </div>
      <p className="mt-2 text-[13px] leading-snug text-slate-600">{slot.description}</p>
      <p className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
        <ImageIcon className="h-3.5 w-3.5" aria-hidden />
        {ASPECT_HINT[slot.aspect]}
        {slot.max > 1 ? " · se muestran en orden" : ""}
      </p>

      <div className="mt-3 flex-1">
        {loading ? (
          <div className="h-20 animate-pulse rounded-lg bg-slate-100" aria-hidden />
        ) : count > 0 ? (
          <ol className="space-y-2">
            {images.map((img, index) => (
              <li key={img.id} className="grid grid-cols-[6rem_1fr] gap-x-3 rounded-lg border border-slate-200 p-2 sm:grid-cols-[7rem_1fr]">
                <div className={`relative self-start overflow-hidden rounded-md bg-slate-100 ${ASPECT_CLASS[slot.aspect]}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- miniatura de Cloudinary ya redimensionada */}
                  <img
                    src={getOptimizedUrl(img.url, { w: 240 })}
                    alt=""
                    loading="lazy"
                    className={`h-full w-full object-cover ${img.activo ? "" : "opacity-40 grayscale"}`}
                  />
                  <span className="absolute left-1 top-1 rounded bg-slate-900/75 px-1.5 text-[11px] font-bold text-white">{index + 1}</span>
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-3 text-[13px] text-slate-800">
                    <span className="sr-only">Foto {index + 1}: </span>
                    {img.alt}
                  </p>
                  {!img.activo && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded bg-slate-200 px-1.5 py-0.5 text-[11px] font-semibold text-slate-800">
                      <EyeOff className="h-3 w-3" aria-hidden /> Oculta
                    </span>
                  )}
                </div>
                  <div className="col-span-2 mt-1 flex flex-wrap items-center gap-0.5 sm:col-span-1 sm:col-start-2">
                    {count > 1 && (
                      <>
                        <button
                          type="button"
                          className={`${iconButton} hover:bg-slate-100 hover:text-jmv-blue`}
                          onClick={() => onMove(index, -1)}
                          disabled={busy || index === 0}
                          aria-label={`Subir la foto ${index + 1}`}
                          title="Subir"
                        >
                          <ArrowUp className="h-4 w-4" aria-hidden />
                        </button>
                        <button
                          type="button"
                          className={`${iconButton} hover:bg-slate-100 hover:text-jmv-blue`}
                          onClick={() => onMove(index, 1)}
                          disabled={busy || index === count - 1}
                          aria-label={`Bajar la foto ${index + 1}`}
                          title="Bajar"
                        >
                          <ArrowDown className="h-4 w-4" aria-hidden />
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      className={`${iconButton} hover:bg-jmv-blue/10 hover:text-jmv-blue`}
                      onClick={() => onEdit(img)}
                      aria-label={`Editar el texto alternativo de la foto ${index + 1}`}
                      title="Editar texto alternativo"
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      className={`${iconButton} hover:bg-slate-100`}
                      onClick={() => onToggle(img)}
                      aria-pressed={!img.activo}
                      aria-label={`Ocultar la foto ${index + 1}`}
                      title={img.activo ? "Ocultar" : "Mostrar"}
                    >
                      {img.activo ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                    </button>
                    <button
                      type="button"
                      className={`${iconButton} hover:bg-red-50 hover:text-red-700`}
                      onClick={() => onDelete(img)}
                      aria-label={`Eliminar la foto ${index + 1}`}
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
              </li>
            ))}
          </ol>
        ) : slot.fallback.length === 0 ? (
          <p className="text-xs text-slate-500">Aún no hay foto: la página muestra un icono en su lugar.</p>
        ) : (
          <div>
            <ul className="flex gap-2 overflow-x-auto pb-1" aria-label="Fotos de respaldo">
              {slot.fallback.slice(0, slot.max).map((photo) => (
                <li key={photo.src} className={`relative w-24 shrink-0 overflow-hidden rounded-md bg-slate-100 sm:w-28 ${ASPECT_CLASS[slot.aspect]}`}>
                  <Image src={photo.src} alt={photo.alt} fill sizes="112px" className="object-cover opacity-70" style={{ objectPosition: photo.position ?? "center" }} />
                  <span className="absolute inset-x-0 bottom-0 bg-slate-900/75 px-1 py-0.5 text-center text-[10px] font-semibold leading-tight text-white">
                    Foto de respaldo
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-1.5 text-xs text-slate-500">Aún no hay fotos propias: la página muestra estas.</p>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        <Button
          variant="primary"
          className="min-h-11 sm:min-h-9"
          onClick={onUpload}
          disabled={loading || full}
          icon={<Upload className="h-4 w-4" aria-hidden />}
        >
          {full ? "Espacio completo" : slot.max === 1 ? "Subir foto" : "Subir fotos"}
        </Button>
        <a href={slot.page} target="_blank" rel="noopener noreferrer" className={linkButton}>
          <ExternalLink className="h-4 w-4" aria-hidden />
          Ver en la página
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      </div>
      {full && slot.max === 1 && count === 1 && (
        <p className="mt-2 text-xs text-slate-500">Para cambiarla, elimina la actual y sube otra.</p>
      )}
    </article>
  );
}
