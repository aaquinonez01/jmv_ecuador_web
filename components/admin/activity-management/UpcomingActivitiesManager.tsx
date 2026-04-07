"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createUpcomingActivityAPI,
  deleteUpcomingActivityAPI,
  getUpcomingActivitiesAPI,
  updateUpcomingActivityAPI,
} from "@/actions/upcoming-activities";
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
  UpcomingActivityItem,
  UpcomingDocumentInput,
} from "@/types/activity-management";
import {
  CalendarClock,
  Clock3,
  FileText,
  ImagePlus,
  Link2,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";

interface UpcomingFormState {
  title: string;
  summary: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  maxRegistrationDate: string;
  externalUrl: string;
  participantsLabel: string;
  registrationStatus: string;
  countdownTargetType: string;
  pillarId: string;
  typeId: string;
  displayOrder: string;
  published: boolean;
  featuredInHome: boolean;
  showInHome: boolean;
  coverImage: File | null;
  documents: UpcomingDocumentInput[];
}

const DOCUMENT_TYPE_OPTIONS = [
  { value: "convocatoria", label: "Convocatoria" },
  { value: "ficha", label: "Ficha" },
  { value: "formulario", label: "Formulario" },
  { value: "cronograma", label: "Cronograma" },
  { value: "otro", label: "Otro" },
];

const STATUS_OPTIONS = [
  { value: "programado", label: "Programado" },
  { value: "inscripciones_abiertas", label: "Inscripciones abiertas" },
  { value: "inscripciones_cerradas", label: "Inscripciones cerradas" },
  { value: "proximo", label: "Próximamente" },
  { value: "draft", label: "Borrador" },
];

const COUNTDOWN_OPTIONS = [
  { value: "event", label: "Contar hasta el evento" },
  { value: "registration_close", label: "Contar hasta cierre de inscripción" },
];

const emptyForm = (): UpcomingFormState => ({
  title: "",
  summary: "",
  description: "",
  location: "",
  startDate: "",
  endDate: "",
  maxRegistrationDate: "",
  externalUrl: "",
  participantsLabel: "",
  registrationStatus: "programado",
  countdownTargetType: "event",
  pillarId: "",
  typeId: "",
  displayOrder: "",
  published: true,
  featuredInHome: false,
  showInHome: true,
  coverImage: null,
  documents: [],
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

function statusLabel(status?: string | null) {
  return (
    STATUS_OPTIONS.find((item) => item.value === status)?.label ||
    status ||
    "Sin estado"
  );
}

// Helpers locales del form
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

// Clases mínimas para que los componentes shadcn sean visibles sobre fondo blanco
const F = "h-10 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400";
const ST = "w-full h-10 bg-gray-50 border-gray-300 text-gray-900";

function UpcomingForm({
  form,
  onChange,
  pillars,
  types,
  existingCoverImageUrl,
}: {
  form: UpcomingFormState;
  onChange: (changes: Partial<UpcomingFormState>) => void;
  pillars: ActivityCatalogItem[];
  types: ActivityCatalogItem[];
  existingCoverImageUrl?: string | null;
}) {
  return (
    <div className="space-y-6">

      <FormSection title="Información general" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Título" required>
          <Input className={F} value={form.title} onChange={(e) => onChange({ title: e.target.value })} placeholder="Ej. Encuentro Nacional JMV" />
        </FormField>
        <FormField label="Participantes">
          <Input className={F} value={form.participantsLabel} onChange={(e) => onChange({ participantsLabel: e.target.value })} placeholder="Ej. JMV Ecuador / 300 jóvenes" />
        </FormField>
      </div>

      <FormField label="Resumen">
        <Textarea className={F} value={form.summary} onChange={(e) => onChange({ summary: e.target.value })} placeholder="Texto corto que aparece en el home" rows={2} />
      </FormField>

      <FormField label="Descripción">
        <Textarea className={F} value={form.description} onChange={(e) => onChange({ description: e.target.value })} placeholder="Descripción completa del evento" rows={4} />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Lugar">
          <Input className={F} value={form.location} onChange={(e) => onChange({ location: e.target.value })} placeholder="Chone, casa de retiro, virtual..." />
        </FormField>
        <FormField label="Link externo">
          <Input className={F} value={form.externalUrl} onChange={(e) => onChange({ externalUrl: e.target.value })} placeholder="https://..." />
        </FormField>
      </div>

      <FormSection title="Fechas" />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <FormField label="Inicio">
          <Input className={F} type="date" value={form.startDate} onChange={(e) => onChange({ startDate: e.target.value })} />
        </FormField>
        <FormField label="Fin">
          <Input className={F} type="date" value={form.endDate} onChange={(e) => onChange({ endDate: e.target.value })} />
        </FormField>
        <FormField label="Límite inscripción">
          <Input className={F} type="date" value={form.maxRegistrationDate} onChange={(e) => onChange({ maxRegistrationDate: e.target.value })} />
        </FormField>
        <FormField label="Orden visual">
          <Input className={F} type="number" value={form.displayOrder} onChange={(e) => onChange({ displayOrder: e.target.value })} placeholder="1" />
        </FormField>
      </div>

      <FormSection title="Clasificación" />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <FormField label="Pilar">
          <Select value={form.pillarId || "__none__"} onValueChange={(v) => onChange({ pillarId: v === "__none__" ? "" : v })}>
            <SelectTrigger className={ST}><SelectValue placeholder="Sin pilar" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Sin pilar</SelectItem>
              {pillars.filter((p) => p.active).map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Tipo">
          <Select value={form.typeId || "__none__"} onValueChange={(v) => onChange({ typeId: v === "__none__" ? "" : v })}>
            <SelectTrigger className={ST}><SelectValue placeholder="Sin tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Sin tipo</SelectItem>
              {types.filter((t) => t.active).map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Estado inscripción">
          <Select value={form.registrationStatus} onValueChange={(v) => onChange({ registrationStatus: v })}>
            <SelectTrigger className={ST}><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Contador apunta a">
          <Select value={form.countdownTargetType} onValueChange={(v) => onChange({ countdownTargetType: v })}>
            <SelectTrigger className={ST}><SelectValue /></SelectTrigger>
            <SelectContent>
              {COUNTDOWN_OPTIONS.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <FormSection title="Visibilidad" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {([
          { id: "published", label: "Publicada", sub: "Visible en el sitio", checked: form.published, key: "published" as const },
          { id: "showInHome", label: "Mostrar en home", sub: "Aparece en la sección", checked: form.showInHome, key: "showInHome" as const },
          { id: "featuredInHome", label: "Destacada", sub: "Ocupa el lugar principal", checked: form.featuredInHome, key: "featuredInHome" as const },
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
            type="file" accept="image/*"
            onChange={(e) => onChange({ coverImage: e.target.files?.[0] || null })}
            className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-jmv-blue file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-jmv-blue-dark"
          />
          <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
            <ImagePlus className="h-3.5 w-3.5 shrink-0" />
            {form.coverImage ? form.coverImage.name : existingCoverImageUrl ? "Se mantiene la portada actual" : "Sin portada cargada"}
          </p>
        </div>
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4">
          <p className="mb-2 text-sm font-semibold text-gray-700">Documentos</p>
          <input
            type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
            onChange={(e) => onChange({ documents: Array.from(e.target.files || []).map((file) => ({ file, documentType: "otro" })) })}
            className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-jmv-blue file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-jmv-blue-dark"
          />
          <p className="mt-2 text-xs text-gray-500">Convocatoria, ficha, formulario u otros anexos.</p>
        </div>
      </div>

      {form.documents.length ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="mb-3 text-sm font-semibold text-gray-700">Clasificar documentos nuevos</p>
          <div className="space-y-2">
            {form.documents.map((doc, index) => (
              <div key={`${doc.file.name}-${index}`} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{doc.file.name}</p>
                  <p className="text-xs text-gray-500">{(doc.file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Select value={doc.documentType} onValueChange={(v) => onChange({ documents: form.documents.map((item, i) => i === index ? { ...item, documentType: v } : item) })}>
                  <SelectTrigger className="w-40 h-9 bg-gray-50 border-gray-300 text-gray-900"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPE_OPTIONS.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function UpcomingActivitiesManager() {
  const toast = useToast();
  const [activities, setActivities] = useState<UpcomingActivityItem[]>([]);
  const [pillars, setPillars] = useState<ActivityCatalogItem[]>([]);
  const [types, setTypes] = useState<ActivityCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<UpcomingActivityItem | null>(
    null
  );
  const [form, setForm] = useState<UpcomingFormState>(emptyForm);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [activitiesResponse, pillarsData, typesData] = await Promise.all([
        getUpcomingActivitiesAPI(),
        getActivityPillarsAPI(),
        getActivityTypesAPI(),
      ]);
      setActivities(activitiesResponse.items);
      setPillars(pillarsData);
      setTypes(typesData);
    } catch {
      toast.error("No se pudo cargar la gestión de próximas actividades.");
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

  const openEditModal = (activity: UpcomingActivityItem) => {
    setEditingActivity(activity);
    setForm({
      title: activity.title,
      summary: activity.summary || "",
      description: activity.description,
      location: activity.location || "",
      startDate: formatDateInput(activity.startDate),
      endDate: formatDateInput(activity.endDate),
      maxRegistrationDate: formatDateInput(activity.maxRegistrationDate),
      externalUrl: activity.externalUrl || "",
      participantsLabel: activity.participantsLabel || "",
      registrationStatus: activity.registrationStatus || "programado",
      countdownTargetType: activity.countdownTargetType || "event",
      pillarId: activity.pillar?.id || "",
      typeId: activity.type?.id || "",
      displayOrder: String(activity.displayOrder || ""),
      published: activity.published,
      featuredInHome: activity.featuredInHome,
      showInHome: activity.showInHome,
      coverImage: null,
      documents: [],
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
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        maxRegistrationDate: form.maxRegistrationDate || undefined,
        externalUrl: form.externalUrl.trim() || undefined,
        participantsLabel: form.participantsLabel.trim() || undefined,
        registrationStatus: form.registrationStatus,
        countdownTargetType: form.countdownTargetType,
        pillarId: form.pillarId || undefined,
        typeId: form.typeId || undefined,
        published: form.published,
        featuredInHome: form.featuredInHome,
        showInHome: form.showInHome,
        displayOrder: form.displayOrder ? Number(form.displayOrder) : undefined,
        coverImage: form.coverImage,
        documents: form.documents,
      };

      if (editingActivity) {
        await updateUpcomingActivityAPI(editingActivity.id, payload);
        toast.success("Próxima actividad actualizada.");
      } else {
        await createUpcomingActivityAPI(payload);
        toast.success("Próxima actividad creada.");
      }

      closeModal();
      await loadAll();
    } catch {
      toast.error("No se pudo guardar la próxima actividad.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (activity: UpcomingActivityItem) => {
    const ok = window.confirm(
      `Se eliminará "${activity.title}" y sus documentos asociados.`
    );
    if (!ok) return;

    try {
      await deleteUpcomingActivityAPI(activity.id);
      toast.success("Próxima actividad eliminada.");
      await loadAll();
    } catch {
      toast.error("No se pudo eliminar la próxima actividad.");
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Cargando próximas actividades...</div>;
  }

  return (
    <>
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Próximas actividades
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Administra los eventos futuros del home, con links, documentos,
              fechas de inscripción y countdown.
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
              No hay próximas actividades cargadas.
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
                        <CalendarClock className="h-8 w-8" />
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
                        {activity.featuredInHome ? (
                          <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            Destacada en home
                          </span>
                        ) : null}
                        {activity.showInHome ? (
                          <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                            Visible en home
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
                        <CalendarClock className="h-4 w-4 text-[#0066CC]" />
                        <span>
                          {formatDateLabel(activity.startDate)}
                          {activity.endDate
                            ? ` - ${formatDateLabel(activity.endDate)}`
                            : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-[#0066CC]" />
                        <span>
                          Límite inscripción:{" "}
                          {formatDateLabel(activity.maxRegistrationDate)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">Estado:</span>{" "}
                        {statusLabel(activity.registrationStatus)}
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">Tipo:</span>{" "}
                        {activity.type?.name || "Sin asignar"}
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">
                          Documentos:
                        </span>{" "}
                        {activity.documents.length}
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">Link:</span>{" "}
                        {activity.externalUrl ? "Sí" : "No"}
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
        title={editingActivity ? "Editar próxima actividad" : "Nueva próxima actividad"}
        size="xl"
      >
        <div className="space-y-6 p-6">
          <UpcomingForm
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
          />

          {editingActivity?.documents?.length ? (
            <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Documentos actuales
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {editingActivity.documents.map((document) => (
                  <a
                    key={document.id}
                    href={document.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 hover:border-[#0066CC] hover:text-[#0066CC]"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <FileText className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{document.name}</span>
                    </span>
                    <span className="ml-3 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                      {document.documentType || "otro"}
                    </span>
                  </a>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Si subes nuevos documentos, reemplazarán el listado actual.
              </p>
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
              icon={<Sparkles className="h-4 w-4" />}
            >
              {editingActivity ? "Guardar cambios" : "Crear próxima actividad"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
