"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Check,
  ExternalLink,
  EyeOff,
  GripVertical,
  ImagePlus,
  Lock,
  Pencil,
  Plus,
  Route,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  createLibraryCollectionAPI,
  deleteLibraryCollectionAPI,
  getLibraryCollectionsAPI,
  getLibraryDocumentsAPI,
  libraryErrorMessage,
  updateLibraryCollectionAPI,
  type LibraryCollectionPayload,
} from "@/actions/library";
import Button from "@/components/admin/ui/Button";
import Modal from "@/components/admin/ui/Modal";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import PageHeader from "@/components/admin/layout/PageHeader";
import { useToast } from "@/lib/hooks/useToast";
import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import { TYPE_SINGULAR, collectionHref, readingTimeLabel } from "@/lib/biblioteca";
import type { LibraryCollection, LibraryDocument } from "@/types/library";
import {
  Field,
  FormSection,
  LibraryTabs,
  SLUG_PATTERN,
  ToggleCard,
  iconButton,
  KindIcon,
  inputClass,
  normalizeText,
  selectClass,
  toggleButton,
} from "./formParts";

interface CollectionFormState {
  title: string;
  description: string;
  published: boolean;
  displayOrder: string;
  slug: string;
  documentIds: string[];
  cover: File | null;
  removeCover: boolean;
}

type CollectionFormErrors = Partial<Record<keyof CollectionFormState, string>>;

const emptyForm = (): CollectionFormState => ({
  title: "",
  description: "",
  published: true,
  displayOrder: "0",
  slug: "",
  documentIds: [],
  cover: null,
  removeCover: false,
});

function toForm(collection: LibraryCollection): CollectionFormState {
  return {
    ...emptyForm(),
    title: collection.title,
    description: collection.description ?? "",
    published: collection.published,
    displayOrder: String(collection.displayOrder ?? 0),
    slug: collection.slug,
    documentIds: collection.documents.map((d) => d.id),
  };
}

function validate(form: CollectionFormState): CollectionFormErrors {
  const errors: CollectionFormErrors = {};
  const title = form.title.trim();
  if (title.length < 3) errors.title = "Escribe un título de al menos 3 letras.";
  else if (title.length > 150) errors.title = "El título puede tener hasta 150 caracteres.";
  if (form.slug.trim() && !SLUG_PATTERN.test(form.slug.trim())) {
    errors.slug = "Solo minúsculas sin tildes, números y guiones (ej. camino-a-la-promesa).";
  }
  if (form.displayOrder.trim()) {
    const order = Number(form.displayOrder);
    if (!Number.isInteger(order) || order < 0 || order > 9999) {
      errors.displayOrder = "Usa un número entero entre 0 y 9999.";
    }
  }
  if (form.published && form.documentIds.length === 0) {
    errors.documentIds = "Añade al menos un documento o guárdala sin publicar.";
  }
  return errors;
}

function totalMinutes(docs: LibraryDocument[]) {
  return docs.reduce((sum, d) => sum + (d.readingMinutes ?? 0), 0);
}

// --- Lista ordenable -----------------------------------------------------------

function SortableDocument({
  doc,
  index,
  total,
  onMove,
  onRemove,
}: {
  doc: LibraryDocument;
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: doc.id,
  });
  const cover = doc.coverUrl ? getOptimizedUrl(doc.coverUrl, { w: 80 }) : null;

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-1.5 rounded-xl border bg-white p-1.5 sm:gap-2 sm:p-2 ${
        isDragging ? "z-10 border-jmv-blue shadow-lg ring-2 ring-jmv-blue/20" : "border-slate-200"
      }`}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        className={`${iconButton} shrink-0 cursor-grab touch-none text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:cursor-grabbing`}
        aria-label={`Arrastrar «${doc.title}». Paso ${index + 1} de ${total}. Con el teclado: Espacio para tomarlo y flechas para moverlo.`}
      >
        <GripVertical className="h-4 w-4" aria-hidden />
      </button>
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-jmv-blue text-xs font-bold text-white"
        aria-hidden
      >
        {index + 1}
      </span>
      <span className="hidden h-12 w-9 shrink-0 items-center justify-center overflow-hidden rounded bg-slate-100 ring-1 ring-slate-200 sm:flex">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="h-full w-full object-cover" />
        ) : (
          <KindIcon kind={doc.kind} className="h-4 w-4 text-slate-400" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-sm font-semibold leading-tight text-slate-900">{doc.title}</span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-slate-500">
          {TYPE_SINGULAR[doc.type]}
          {readingTimeLabel(doc.readingMinutes) ? <span>· {readingTimeLabel(doc.readingMinutes)}</span> : null}
          {doc.visibility === "miembros" ? (
            <span className="inline-flex items-center gap-0.5">
              · <Lock className="h-3 w-3" aria-hidden /> Miembros
            </span>
          ) : null}
          {!doc.published ? <span className="font-semibold text-amber-800">· Borrador (no se verá)</span> : null}
        </span>
      </span>
      <span className="flex shrink-0 flex-col sm:flex-row">
        <button
          type="button"
          onClick={() => onMove(index, index - 1)}
          disabled={index === 0}
          className={`${iconButton} text-slate-600 hover:bg-slate-100`}
          aria-label={`Subir «${doc.title}»`}
          title="Subir"
        >
          <ArrowUp className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => onMove(index, index + 1)}
          disabled={index === total - 1}
          className={`${iconButton} text-slate-600 hover:bg-slate-100`}
          aria-label={`Bajar «${doc.title}»`}
          title="Bajar"
        >
          <ArrowDown className="h-4 w-4" aria-hidden />
        </button>
      </span>
      <button
        type="button"
        onClick={onRemove}
        className={`${iconButton} shrink-0 text-slate-500 hover:bg-red-50 hover:text-red-700`}
        aria-label={`Quitar «${doc.title}» de la ruta`}
        title="Quitar de la ruta"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </li>
  );
}

function CollectionForm({
  form,
  errors,
  onChange,
  documents,
  existingCoverUrl,
  onAnnounce,
}: {
  form: CollectionFormState;
  errors: CollectionFormErrors;
  onChange: (changes: Partial<CollectionFormState>) => void;
  documents: LibraryDocument[];
  existingCoverUrl?: string | null;
  onAnnounce: (message: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!form.cover) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(form.cover);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [form.cover]);

  const byId = useMemo(() => new Map(documents.map((d) => [d.id, d])), [documents]);
  const selected = form.documentIds.map((id) => byId.get(id)).filter(Boolean) as LibraryDocument[];

  const candidates = useMemo(() => {
    const term = normalizeText(query.trim());
    return documents
      .filter((d) => !form.documentIds.includes(d.id))
      .filter((d) => {
        if (!term) return true;
        return [d.title, d.author, ...(d.tags ?? [])].filter(Boolean).some((v) => normalizeText(v!).includes(term));
      })
      .slice(0, 8);
  }, [documents, form.documentIds, query]);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= form.documentIds.length) return;
    const doc = byId.get(form.documentIds[from]);
    onChange({ documentIds: arrayMove(form.documentIds, from, to) });
    if (doc) onAnnounce(`«${doc.title}» ahora es el paso ${to + 1} de ${form.documentIds.length}.`);
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = form.documentIds.indexOf(String(active.id));
    const to = form.documentIds.indexOf(String(over.id));
    if (from >= 0 && to >= 0) move(from, to);
  };

  const shownCover = preview ?? (!form.removeCover && existingCoverUrl ? getOptimizedUrl(existingCoverUrl, { w: 500 }) : null);
  const minutes = totalMinutes(selected);

  return (
    <div className="space-y-8">
      <FormSection title="La ruta" step={1}>
        <Field label="Título" required error={errors.title} hint="Ej. «Camino a la promesa mariana» o «Primeros pasos en JMV».">
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              value={form.title}
              onChange={(e) => onChange({ title: e.target.value })}
              maxLength={150}
              aria-invalid={invalid}
              aria-describedby={describedBy}
              className={inputClass}
            />
          )}
        </Field>
        <Field label="Descripción" hint="Para quién es y qué van a vivir al recorrerla.">
          {({ id, describedBy }) => (
            <textarea
              id={id}
              rows={3}
              value={form.description}
              onChange={(e) => onChange({ description: e.target.value })}
              maxLength={1000}
              aria-describedby={describedBy}
              className={`${inputClass} resize-y py-2`}
            />
          )}
        </Field>
        <div className="grid grid-cols-[96px_1fr] gap-4 sm:grid-cols-[160px_1fr]">
          <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-200 bg-slate-50">
            {shownCover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={shownCover} alt="Vista previa de la portada de la ruta" className="h-full w-full object-cover" />
            ) : (
              <span className="flex flex-col items-center gap-1 px-1 text-center text-[11px] text-slate-500">
                <ImagePlus className="h-5 w-5" aria-hidden />
                Sin portada
              </span>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-xs text-slate-600">
              Opcional. Si no subes una, se usan las portadas de sus documentos.
            </p>
            <input
              ref={coverRef}
              id="collection-cover-file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                if (file) onChange({ cover: file, removeCover: false });
              }}
              className="sr-only"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="min-h-11 sm:min-h-9"
                icon={<ImagePlus className="h-4 w-4" aria-hidden />}
                onClick={() => coverRef.current?.click()}
              >
                {shownCover ? "Cambiar portada" : "Subir portada"}
              </Button>
              {shownCover ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="min-h-11 text-red-700 hover:bg-red-50 sm:min-h-9"
                  icon={<X className="h-4 w-4" aria-hidden />}
                  onClick={() => {
                    onChange({ cover: null, removeCover: Boolean(existingCoverUrl) });
                    if (coverRef.current) coverRef.current.value = "";
                  }}
                >
                  Quitar
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="Documentos en orden" step={2}>
        <div>
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-[13px] font-semibold text-slate-700">
              {selected.length
                ? `${selected.length} paso${selected.length === 1 ? "" : "s"}${minutes ? ` · ${readingTimeLabel(minutes)} de lectura` : ""}`
                : "Todavía no hay documentos en la ruta"}
            </p>
            {selected.length > 1 ? (
              <p className="text-xs text-slate-500">Arrastra desde el asa o usa las flechas para ordenar.</p>
            ) : null}
          </div>
          {selected.length ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={form.documentIds} strategy={verticalListSortingStrategy}>
                <ol className="space-y-2" aria-label="Documentos de la ruta, en orden">
                  {selected.map((doc, index) => (
                    <SortableDocument
                      key={doc.id}
                      doc={doc}
                      index={index}
                      total={selected.length}
                      onMove={move}
                      onRemove={() => {
                        onChange({ documentIds: form.documentIds.filter((id) => id !== doc.id) });
                        onAnnounce(`«${doc.title}» se quitó de la ruta.`);
                      }}
                    />
                  ))}
                </ol>
              </SortableContext>
            </DndContext>
          ) : (
            <p
              className={`rounded-xl border-2 border-dashed p-4 text-center text-sm ${
                errors.documentIds ? "border-red-300 bg-red-50/50 text-red-800" : "border-slate-200 text-slate-500"
              }`}
            >
              Busca abajo los documentos y añádelos en el orden en que conviene leerlos.
            </p>
          )}
          {errors.documentIds ? (
            <p className="mt-1 text-xs font-medium text-red-700" role="alert">
              {errors.documentIds}
            </p>
          ) : null}
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <label htmlFor="collection-doc-search" className="mb-1 block text-[13px] font-semibold text-slate-700">
            Añadir documentos
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              id="collection-doc-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título, autor o etiqueta…"
              className={`${inputClass} pl-9`}
            />
          </div>
          {candidates.length ? (
            <ul className="mt-2 space-y-1" aria-label="Resultados para añadir">
              {candidates.map((doc) => (
                <li key={doc.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange({ documentIds: [...form.documentIds, doc.id] });
                      onAnnounce(`«${doc.title}» se añadió como paso ${form.documentIds.length + 1}.`);
                    }}
                    className="flex min-h-11 w-full items-center gap-3 rounded-lg bg-white px-3 py-2 text-left ring-1 ring-slate-200 transition-colors hover:ring-jmv-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jmv-blue"
                  >
                    <Plus className="h-4 w-4 shrink-0 text-jmv-blue" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-900">
                        <span className="sr-only">Añadir </span>
                        {doc.title}
                      </span>
                      <span className="block text-[11px] text-slate-500">
                        {TYPE_SINGULAR[doc.type]}
                        {!doc.published ? " · Borrador" : ""}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-slate-500">
              {documents.length === 0
                ? "Primero sube documentos en la pestaña «Documentos»."
                : query.trim()
                  ? "Ningún documento coincide."
                  : "Ya añadiste todos los documentos."}
            </p>
          )}
        </div>
      </FormSection>

      <FormSection title="Publicación" step={3}>
        <ToggleCard
          checked={form.published}
          onChange={(published) => onChange({ published })}
          label="Publicada"
          description="Se ve en la biblioteca. Los documentos en borrador de la ruta no se muestran."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Orden" error={errors.displayOrder} hint="Las rutas con número menor van primero.">
            {({ id, describedBy, invalid }) => (
              <input
                id={id}
                type="number"
                inputMode="numeric"
                min={0}
                max={9999}
                value={form.displayOrder}
                onChange={(e) => onChange({ displayOrder: e.target.value })}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                className={inputClass}
              />
            )}
          </Field>
          <Field label="Dirección (slug)" error={errors.slug} hint="Opcional. Si lo dejas vacío se crea a partir del título.">
            {({ id, describedBy, invalid }) => (
              <input
                id={id}
                value={form.slug}
                onChange={(e) => onChange({ slug: e.target.value })}
                placeholder="camino-a-la-promesa"
                autoCapitalize="none"
                spellCheck={false}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                className={inputClass}
              />
            )}
          </Field>
        </div>
      </FormSection>
    </div>
  );
}

// --- Gestor --------------------------------------------------------------------

export default function LibraryCollectionsManager() {
  const toast = useToast();
  const [items, setItems] = useState<LibraryCollection[]>([]);
  const [documents, setDocuments] = useState<LibraryDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<LibraryCollection | null>(null);
  const [form, setForm] = useState<CollectionFormState>(emptyForm);
  const [errors, setErrors] = useState<CollectionFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toDelete, setToDelete] = useState<LibraryCollection | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyToggle, setBusyToggle] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [collections, docs] = await Promise.all([getLibraryCollectionsAPI(), getLibraryDocumentsAPI()]);
      setItems(collections.items ?? []);
      setDocuments(docs.items ?? []);
      setLoadError(false);
    } catch (error) {
      setLoadError(true);
      toast.error(libraryErrorMessage(error, "No se pudieron cargar las rutas de formación."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const term = normalizeText(search.trim());
    if (!term) return items;
    return items.filter((c) => [c.title, c.description, c.slug].filter(Boolean).some((v) => normalizeText(v!).includes(term)));
  }, [items, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setErrors({});
    setIsModalOpen(true);
  };

  const openEdit = (collection: LibraryCollection) => {
    setEditing(collection);
    setForm(toForm(collection));
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setIsModalOpen(false);
    setEditing(null);
  };

  const updateForm = (changes: Partial<CollectionFormState>) => {
    setForm((current) => ({ ...current, ...changes }));
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(changes) as (keyof CollectionFormState)[]) delete next[key];
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      toast.error("Revisa los campos marcados.");
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      });
      return;
    }
    const payload: LibraryCollectionPayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      published: form.published,
      displayOrder: form.displayOrder.trim() ? Number(form.displayOrder) : 0,
      documentIds: form.documentIds,
    };
    if (form.slug.trim()) payload.slug = form.slug.trim();
    if (form.cover) payload.cover = form.cover;
    else if (form.removeCover) payload.removeCover = true;

    try {
      setSubmitting(true);
      if (editing) {
        await updateLibraryCollectionAPI(editing.id, payload);
        toast.success(`La ruta «${payload.title}» se actualizó.`);
      } else {
        await createLibraryCollectionAPI(payload);
        toast.success(`La ruta «${payload.title}» se creó.`);
      }
      setSubmitting(false);
      setIsModalOpen(false);
      setEditing(null);
      await loadAll();
    } catch (error) {
      toast.error(libraryErrorMessage(error, "No se pudo guardar la ruta."));
    } finally {
      setSubmitting(false);
    }
  };

  const togglePublished = async (collection: LibraryCollection) => {
    const value = !collection.published;
    setBusyToggle(collection.id);
    setItems((current) => current.map((c) => (c.id === collection.id ? { ...c, published: value } : c)));
    try {
      await updateLibraryCollectionAPI(collection.id, {
        title: collection.title,
        published: value,
        documentIds: collection.documents.map((d) => d.id),
      });
      toast.success(value ? `La ruta «${collection.title}» ya se ve.` : `La ruta «${collection.title}» quedó oculta.`);
    } catch (error) {
      setItems((current) => current.map((c) => (c.id === collection.id ? { ...c, published: !value } : c)));
      toast.error(libraryErrorMessage(error, "No se pudo cambiar el estado."));
    } finally {
      setBusyToggle(null);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      setDeleting(true);
      await deleteLibraryCollectionAPI(toDelete.id);
      toast.success(`La ruta «${toDelete.title}» se eliminó.`);
      setToDelete(null);
      await loadAll();
    } catch (error) {
      toast.error(libraryErrorMessage(error, "No se pudo eliminar la ruta."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Rutas de formación"
        description="Itinerarios de lectura en orden: cada ruta guía a los jóvenes paso a paso."
        icon={<Route className="h-[18px] w-[18px]" strokeWidth={2.1} />}
        breadcrumbs={[{ label: "Contenido" }, { label: "Biblioteca", href: "/admin/biblioteca" }, { label: "Rutas" }]}
        actions={
          <Button
            variant="primary"
            size="md"
            className="min-h-11 sm:min-h-9"
            onClick={openCreate}
            icon={<Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />}
          >
            Nueva ruta
          </Button>
        }
      />

      <div className="flex flex-1 flex-col overflow-auto px-4 py-5 sm:px-6">
        <LibraryTabs />

        {items.length > 3 ? (
          <div role="search" aria-label="Filtrar rutas" className="mb-4 rounded-xl border border-slate-200 bg-white p-3">
            <label htmlFor="collection-search" className="sr-only">
              Buscar rutas
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                id="collection-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar rutas…"
                className={`${selectClass} w-full pl-9`}
              />
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-hidden>
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl bg-slate-100 motion-reduce:animate-none" />
            ))}
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
            No se pudieron cargar las rutas.
            <Button variant="outline" onClick={() => void loadAll()}>
              Reintentar
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
            <Route className="h-8 w-8 text-slate-400" aria-hidden />
            {items.length === 0
              ? "Aún no hay rutas. Agrupa varios documentos en orden, por ejemplo para preparar la promesa mariana."
              : "Ninguna ruta coincide con la búsqueda."}
            {items.length === 0 ? (
              <Button variant="primary" onClick={openCreate} icon={<Plus className="h-4 w-4" aria-hidden />}>
                Nueva ruta
              </Button>
            ) : null}
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                busy={busyToggle === collection.id}
                onEdit={() => openEdit(collection)}
                onDelete={() => setToDelete(collection)}
                onToggle={() => void togglePublished(collection)}
              />
            ))}
          </ul>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editing ? "Editar ruta de formación" : "Nueva ruta de formación"}
        description="Los campos con * son obligatorios."
        size="xl"
      >
        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          <div className="p-5 sm:p-6">
            <CollectionForm
              form={form}
              errors={errors}
              onChange={updateForm}
              documents={documents}
              existingCoverUrl={editing?.coverUrl}
              onAnnounce={setAnnouncement}
            />
            <p className="sr-only" aria-live="assertive">
              {announcement}
            </p>
          </div>
          <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-slate-100 bg-white/95 px-5 py-3 backdrop-blur sm:flex-row sm:justify-end sm:px-6">
            <Button type="button" variant="ghost" className="min-h-11 sm:min-h-9" onClick={closeModal} disabled={submitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="min-h-11 sm:min-h-9"
              isLoading={submitting}
              icon={<Route className="h-4 w-4" aria-hidden />}
            >
              {editing ? "Guardar cambios" : "Crear ruta"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={() => void confirmDelete()}
        title="¿Eliminar esta ruta?"
        message={
          toDelete
            ? `La ruta «${toDelete.title}» desaparecerá de la biblioteca. Sus documentos no se borran: siguen en la biblioteca. No se puede deshacer.`
            : ""
        }
        confirmText="Sí, eliminar"
        variant="danger"
        isLoading={deleting}
      />
    </>
  );
}

function CollectionCard({
  collection,
  busy,
  onEdit,
  onDelete,
  onToggle,
}: {
  collection: LibraryCollection;
  busy: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const docs = collection.documents ?? [];
  const covers = docs.filter((d) => d.coverUrl).slice(0, 3);
  const minutes = totalMinutes(docs);

  return (
    <li className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-slate-300">
      <div className="relative flex h-28 items-end gap-1.5 overflow-hidden bg-gradient-to-br from-jmv-blue to-jmv-blue-dark px-4 pb-3">
        {collection.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getOptimizedUrl(collection.coverUrl, { w: 600 })}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : covers.length ? (
          covers.map((doc, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={doc.id}
              src={getOptimizedUrl(doc.coverUrl!, { w: 120 })}
              alt=""
              className="h-20 w-[60px] rounded-sm object-cover shadow-lg ring-1 ring-white/30"
              style={{ transform: `rotate(${(i - 1) * 4}deg)` }}
            />
          ))
        ) : (
          <BookOpen className="h-10 w-10 text-white/70" aria-hidden />
        )}
        {!collection.published ? (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-slate-800">
            <EyeOff className="h-3 w-3" aria-hidden />
            Oculta
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-[14.5px] font-bold leading-tight text-slate-900">{collection.title}</h3>
        <p className="mt-0.5 text-xs text-slate-600">
          {docs.length} documento{docs.length === 1 ? "" : "s"}
          {minutes ? ` · ${readingTimeLabel(minutes)}` : ""}
        </p>
        {docs.length ? (
          <ol className="mt-2 space-y-0.5 text-xs text-slate-600">
            {docs.slice(0, 3).map((doc, i) => (
              <li key={doc.id} className="truncate">
                <span className="font-semibold text-slate-800">{i + 1}.</span> {doc.title}
              </li>
            ))}
            {docs.length > 3 ? <li className="text-slate-500">y {docs.length - 3} más…</li> : null}
          </ol>
        ) : null}
        <div className="mt-auto flex items-center gap-1 border-t border-slate-100 pt-2">
          <button
            type="button"
            onClick={onToggle}
            disabled={busy}
            aria-pressed={collection.published}
            aria-label={`Publicada: ${collection.title}`}
            className={`${toggleButton} ${collection.published ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100" : "border-slate-200 text-slate-600 hover:bg-slate-100"}`}
          >
            {collection.published ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden /> : <EyeOff className="h-3.5 w-3.5" aria-hidden />}
            Publicada
          </button>
          <div className="ml-auto flex items-center gap-1">
            {collection.published ? (
              <a
                href={collectionHref(collection.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className={`${iconButton} text-slate-600 hover:bg-slate-100 hover:text-jmv-blue`}
                title="Ver en el sitio"
              >
                <ExternalLink className="h-4 w-4" aria-hidden />
                <span className="sr-only">Ver la ruta «{collection.title}» en el sitio (se abre en una pestaña nueva)</span>
              </a>
            ) : null}
            <button
              type="button"
              onClick={onEdit}
              className={`${iconButton} text-slate-600 hover:bg-jmv-blue/10 hover:text-jmv-blue`}
              aria-label={`Editar la ruta ${collection.title}`}
              title="Editar"
            >
              <Pencil className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className={`${iconButton} text-slate-600 hover:bg-red-50 hover:text-red-700`}
              aria-label={`Eliminar la ruta ${collection.title}`}
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
