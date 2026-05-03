"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createActivityAPI,
  deleteActivityAPI,
  getActivitiesAPI,
  updateActivityAPI,
} from "@/actions/activities";
import { getActivityPillarsAPI } from "@/actions/activity-pillars";
import { getActivityTypesAPI } from "@/actions/activity-types";
import Button from "@/components/admin/ui/Button";
import Modal from "@/components/admin/ui/Modal";
import PageHeader from "@/components/admin/layout/PageHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/lib/hooks/useToast";
import type {
  ActivityCatalogItem,
  ActivityImageItem,
  ActivityItem,
} from "@/types/activity-management";
import {
  CalendarDays,
  Camera,
  FolderKanban,
  ImagePlus,
  Images,
  MapPin,
  Pencil,
  Plus,
  Search,
  Star,
  Tag,
  Trash2,
} from "lucide-react";

interface ActivityFormState {
  title: string;
  summary: string;
  description: string;
  location: string;
  participantsLabel: string;
  startDate: string;
  endDate: string;
  pillarId: string;
  typeId: string;
  displayOrder: string;
  published: boolean;
  featured: boolean;
  showInActivitiesPage: boolean;
  coverImage: File | null;
  gallery: File[];
}

const emptyForm = (): ActivityFormState => ({
  title: "",
  summary: "",
  description: "",
  location: "",
  participantsLabel: "",
  startDate: "",
  endDate: "",
  pillarId: "",
  typeId: "",
  displayOrder: "",
  published: true,
  featured: false,
  showInActivitiesPage: true,
  coverImage: null,
  gallery: [],
});

function formatDateInput(value?: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function formatDateLabel(value?: string | null) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatRange(start?: string | null, end?: string | null) {
  if (!start && !end) return "Sin fechas definidas";
  if (start && end) return `${formatDateLabel(start)} - ${formatDateLabel(end)}`;
  return formatDateLabel(start || end);
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-semibold text-gray-700">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </p>
      {children}
    </div>
  );
}

function FormSection({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{title}</span>
      <div className="flex-1 border-t border-gray-200" />
    </div>
  );
}

const F = "h-10 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400";
const ST = "w-full h-10 bg-gray-50 border-gray-300 text-gray-900";

function ActivityForm({
  form,
  onChange,
  pillars,
  types,
  existingCoverImageUrl,
  existingGallery,
}: {
  form: ActivityFormState;
  onChange: (changes: Partial<ActivityFormState>) => void;
  pillars: ActivityCatalogItem[];
  types: ActivityCatalogItem[];
  existingCoverImageUrl?: string | null;
  existingGallery?: ActivityImageItem[];
}) {
  return (
    <div className="space-y-6">

      <FormSection title="Información general" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Título" required>
          <Input className={F} value={form.title} onChange={(e) => onChange({ title: e.target.value })} placeholder="Ej. Misión zonal de verano" />
        </FormField>
        <FormField label="Participantes">
          <Input className={F} value={form.participantsLabel} onChange={(e) => onChange({ participantsLabel: e.target.value })} placeholder="Ej. 120 jóvenes" />
        </FormField>
      </div>

      <FormField label="Resumen">
        <Textarea className={`${F} min-h-[4rem]`} value={form.summary} onChange={(e) => onChange({ summary: e.target.value })} placeholder="Texto corto para tarjetas y listados" rows={2} />
      </FormField>

      <FormField label="Descripción" required>
        <Textarea className={`${F} min-h-[7rem]`} value={form.description} onChange={(e) => onChange({ description: e.target.value })} placeholder="Descripción completa de la actividad" rows={5} />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Lugar">
          <Input className={F} value={form.location} onChange={(e) => onChange({ location: e.target.value })} placeholder="Ciudad, casa de retiros, comunidad..." />
        </FormField>
        <FormField label="Orden visual">
          <Input className={F} type="number" value={form.displayOrder} onChange={(e) => onChange({ displayOrder: e.target.value })} placeholder="1" />
        </FormField>
      </div>

      <FormSection title="Fechas y clasificación" />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <FormField label="Fecha inicio">
          <Input className={F} type="date" value={form.startDate} onChange={(e) => onChange({ startDate: e.target.value })} />
        </FormField>
        <FormField label="Fecha fin">
          <Input className={F} type="date" value={form.endDate} onChange={(e) => onChange({ endDate: e.target.value })} />
        </FormField>
        <FormField label="Pilar">
          <Select value={form.pillarId || "__none__"} onValueChange={(v) => onChange({ pillarId: v === "__none__" ? "" : v })}>
            <SelectTrigger className={ST}><SelectValue placeholder="Sin pilar" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Sin pilar</SelectItem>
              {pillars.filter((p) => p.active).map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Tipo de actividad">
          <Select value={form.typeId || "__none__"} onValueChange={(v) => onChange({ typeId: v === "__none__" ? "" : v })}>
            <SelectTrigger className={ST}><SelectValue placeholder="Sin tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Sin tipo</SelectItem>
              {types.filter((t) => t.active).map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <FormSection title="Visibilidad" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {([
          { id: "published", label: "Publicada", sub: "Visible en el sitio", checked: form.published, key: "published" as const },
          { id: "featured", label: "Destacada", sub: "Resaltada visualmente", checked: form.featured, key: "featured" as const },
          { id: "showInActivitiesPage", label: "Mostrar en /actividades", sub: "Aparece en el listado", checked: form.showInActivitiesPage, key: "showInActivitiesPage" as const },
        ] as const).map(({ id, label, sub, checked, key }) => (
          <label
            key={id}
            htmlFor={id}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all ${checked ? "border-jmv-blue bg-blue-50" : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"}`}
          >
            <Checkbox id={id} checked={checked} onCheckedChange={(val) => onChange({ [key]: val === true })} className="mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-800">{label}</p>
              <p className="mt-0.5 text-xs text-gray-500">{sub}</p>
            </div>
          </label>
        ))}
      </div>

      <FormSection title="Archivos" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4">
          <p className="mb-2 text-sm font-semibold text-gray-700">Portada</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onChange({ coverImage: e.target.files?.[0] || null })}
            className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-jmv-blue file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-jmv-blue-dark"
          />
          <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
            <ImagePlus className="h-3.5 w-3.5 shrink-0" />
            {form.coverImage ? form.coverImage.name : existingCoverImageUrl ? "Se mantiene la portada actual" : "Sin portada cargada"}
          </p>
        </div>
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4">
          <p className="mb-2 text-sm font-semibold text-gray-700">Galería</p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => onChange({ gallery: Array.from(e.target.files || []) })}
            className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-jmv-blue file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-jmv-blue-dark"
          />
          <p className="mt-2 text-xs text-gray-500">
            {form.gallery.length > 0
              ? `${form.gallery.length} imágenes nuevas listas para subir`
              : `${existingGallery?.length || 0} imágenes guardadas actualmente`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ActivitiesManager() {
  const toast = useToast();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [pillars, setPillars] = useState<ActivityCatalogItem[]>([]);
  const [types, setTypes] = useState<ActivityCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);
  const [form, setForm] = useState<ActivityFormState>(emptyForm);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [activitiesResponse, pillarsData, typesData] = await Promise.all([
        getActivitiesAPI(),
        getActivityPillarsAPI(),
        getActivityTypesAPI(),
      ]);
      setActivities(activitiesResponse.items);
      setPillars(pillarsData);
      setTypes(typesData);
    } catch {
      toast.error("No se pudo cargar la gestión de actividades.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const filteredActivities = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return activities;
    return activities.filter((item) =>
      [item.title, item.description, item.location, item.pillar?.name, item.type?.name]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term))
    );
  }, [activities, search]);

  const openCreateModal = () => {
    setEditingActivity(null);
    setForm(emptyForm());
    setIsModalOpen(true);
  };

  const openEditModal = (activity: ActivityItem) => {
    setEditingActivity(activity);
    setForm({
      title: activity.title,
      summary: activity.summary || "",
      description: activity.description,
      location: activity.location || "",
      participantsLabel: activity.participantsLabel || "",
      startDate: formatDateInput(activity.startDate),
      endDate: formatDateInput(activity.endDate),
      pillarId: activity.pillar?.id || "",
      typeId: activity.type?.id || "",
      displayOrder: String(activity.displayOrder || ""),
      published: activity.published,
      featured: activity.featured,
      showInActivitiesPage: activity.showInActivitiesPage,
      coverImage: null,
      gallery: [],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingActivity(null);
    setForm(emptyForm());
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Título y descripción son obligatorios.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: form.title.trim(),
        summary: form.summary.trim() || undefined,
        description: form.description.trim(),
        location: form.location.trim() || undefined,
        participantsLabel: form.participantsLabel.trim() || undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        pillarId: form.pillarId || undefined,
        typeId: form.typeId || undefined,
        published: form.published,
        featured: form.featured,
        showInActivitiesPage: form.showInActivitiesPage,
        displayOrder: form.displayOrder ? Number(form.displayOrder) : undefined,
        coverImage: form.coverImage,
        gallery: form.gallery,
      };

      if (editingActivity) {
        await updateActivityAPI(editingActivity.id, payload);
        toast.success("Actividad actualizada.");
      } else {
        await createActivityAPI(payload);
        toast.success("Actividad creada.");
      }

      closeModal();
      await loadAll();
    } catch {
      toast.error("No se pudo guardar la actividad.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (activity: ActivityItem) => {
    const ok = window.confirm(
      `Se eliminará "${activity.title}" junto con su galería asociada.`
    );
    if (!ok) return;

    try {
      await deleteActivityAPI(activity.id);
      toast.success("Actividad eliminada.");
      await loadAll();
    } catch {
      toast.error("No se pudo eliminar la actividad.");
    }
  };

  if (loading) {
    return (
      <div className="px-6 py-10 text-sm text-slate-500">
        Cargando actividades...
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Actividades históricas"
        description="Gestiona las actividades realizadas en la página pública."
        icon={<FolderKanban className="h-[18px] w-[18px]" strokeWidth={2.1} />}
        breadcrumbs={[{ label: "Contenido" }, { label: "Actividades" }]}
        actions={
          <>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar..."
                className="h-9 w-56 rounded-md border border-slate-200 bg-slate-50 pl-8 pr-3 text-[13px] text-slate-900 placeholder-slate-400 transition-colors focus:border-jmv-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-jmv-blue/15"
              />
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={openCreateModal}
              icon={<Plus className="h-3.5 w-3.5" strokeWidth={2.5} />}
            >
              Nueva
            </Button>
          </>
        }
      />

      <div className="flex flex-1 flex-col overflow-auto px-6 py-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[12.5px] text-slate-500">
            Mostrando{" "}
            <strong className="font-bold text-slate-900">
              {filteredActivities.length}
            </strong>{" "}
            actividad{filteredActivities.length === 1 ? "" : "es"}
          </span>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
            No hay actividades cargadas.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onEdit={() => openEditModal(activity)}
                onDelete={() => void handleDelete(activity)}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingActivity ? "Editar actividad" : "Nueva actividad"}
        size="xl"
      >
        <div className="space-y-6 p-6">
          <ActivityForm
            form={form}
            onChange={(changes) =>
              setForm((current) => ({
                ...current,
                ...changes,
              }))
            }
            pillars={pillars}
            types={types}
            existingCoverImageUrl={editingActivity?.coverImageUrl}
            existingGallery={editingActivity?.gallery}
          />

          {editingActivity?.gallery?.length ? (
            <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Galería actual
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {editingActivity.gallery.slice(0, 8).map((image) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt={image.alt || editingActivity.title}
                      className="h-24 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              {editingActivity.gallery.length > 8 ? (
                <p className="text-xs text-gray-500">
                  Se muestran 8 imágenes. La galería completa sigue disponible.
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={submitting}
              icon={<Star className="h-4 w-4" />}
            >
              {editingActivity ? "Guardar cambios" : "Crear actividad"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function ActivityCard({
  activity,
  onEdit,
  onDelete,
}: {
  activity: ActivityItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-slate-300 hover:shadow-md">
      <div className="relative h-28 w-full overflow-hidden bg-slate-100">
        {activity.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activity.coverImageUrl}
            alt={activity.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">
            <Camera className="h-8 w-8" strokeWidth={1.5} />
          </div>
        )}

        <span
          className={`absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide backdrop-blur ${
            activity.published
              ? "bg-emerald-500/90 text-white"
              : "bg-slate-900/70 text-white"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${activity.published ? "bg-white" : "bg-slate-300"}`}
          />
          {activity.published ? "Publicada" : "Oculta"}
        </span>

        {activity.featured ? (
          <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-amber-400/95 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-amber-950 backdrop-blur">
            <Star className="h-2.5 w-2.5 fill-amber-950" strokeWidth={0} />
            Destacada
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="min-w-0">
          <h3 className="line-clamp-1 text-[14.5px] font-bold leading-tight text-slate-900">
            {activity.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-slate-500">
            {activity.summary || activity.description}
          </p>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-slate-600">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3 w-3 text-jmv-blue" strokeWidth={2.2} />
            <span className="font-medium text-slate-700">
              {formatRange(activity.startDate, activity.endDate)}
            </span>
          </span>
          {activity.location ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3 text-slate-400" strokeWidth={2.2} />
              <span className="truncate">{activity.location}</span>
            </span>
          ) : null}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {activity.pillar?.name ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-jmv-blue/10 px-1.5 py-0.5 text-[10.5px] font-semibold text-jmv-blue">
              {activity.pillar.name}
            </span>
          ) : null}
          {activity.type?.name ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10.5px] font-semibold text-slate-700">
              <Tag className="h-2.5 w-2.5" strokeWidth={2.5} />
              {activity.type.name}
            </span>
          ) : null}
          {activity.gallery.length > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10.5px] font-semibold text-slate-700">
              <Images className="h-2.5 w-2.5" strokeWidth={2.5} />
              {activity.gallery.length}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-3 py-2">
        <span className="text-[10.5px] font-medium text-slate-400">
          Orden #{activity.displayOrder || "—"}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-jmv-blue/10 hover:text-jmv-blue"
            title="Editar"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Eliminar"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
