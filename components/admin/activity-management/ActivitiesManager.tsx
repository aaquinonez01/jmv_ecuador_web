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
import InputField from "@/components/admin/ui/InputField";
import Modal from "@/components/admin/ui/Modal";
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
  ImagePlus,
  MapPin,
  Pencil,
  Plus,
  Star,
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
    return <div className="p-6 text-gray-600">Cargando actividades...</div>;
  }

  return (
    <>
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Actividades históricas
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestiona las actividades realizadas que se muestran en la página
              pública de actividades.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <InputField
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por título, lugar o tipo..."
              className="w-64"
            />
            <Button
              variant="primary"
              onClick={openCreateModal}
              icon={<Plus className="h-4 w-4" />}
            >
              Nueva actividad
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filteredActivities.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500 xl:col-span-2">
              No hay actividades cargadas.
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <article
                key={activity.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-4 p-6 lg:flex-row">
                  <div className="h-40 w-full overflow-hidden rounded-2xl bg-gray-100 lg:w-56 lg:flex-shrink-0">
                    {activity.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={activity.coverImageUrl}
                        alt={activity.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        <Camera className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <div className="mb-3 flex flex-wrap gap-2">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            activity.published
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {activity.published ? "Publicada" : "Oculta"}
                        </span>
                        {activity.featured ? (
                          <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            Destacada
                          </span>
                        ) : null}
                        {activity.showInActivitiesPage ? (
                          <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                            Visible en /actividades
                          </span>
                        ) : null}
                      </div>

                      <h2 className="text-xl font-semibold text-gray-900">
                        {activity.title}
                      </h2>
                      <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                        {activity.summary || activity.description}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-600 sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-[#0066CC]" />
                        <span>{formatRange(activity.startDate, activity.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#0066CC]" />
                        <span>{activity.location || "Sin lugar definido"}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">Pilar:</span>{" "}
                        {activity.pillar?.name || "Sin asignar"}
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">Tipo:</span>{" "}
                        {activity.type?.name || "Sin asignar"}
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">Galería:</span>{" "}
                        {activity.gallery.length} imágenes
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">Orden:</span>{" "}
                        {activity.displayOrder}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => openEditModal(activity)}
                        icon={<Pencil className="h-4 w-4" />}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(activity)}
                        icon={<Trash2 className="h-4 w-4" />}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
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
