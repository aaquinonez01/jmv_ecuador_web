"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Check,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import {
  LIBRARY_MAX_FILE_BYTES,
  createLibraryDocumentAPI,
  deleteLibraryDocumentAPI,
  fetchLibraryFileAPI,
  getLibraryDocumentsAPI,
  libraryErrorMessage,
  updateLibraryDocumentAPI,
  type LibraryDocumentPayload,
} from "@/actions/library";
import Button from "@/components/admin/ui/Button";
import Modal from "@/components/admin/ui/Modal";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import PageHeader from "@/components/admin/layout/PageHeader";
import { useToast } from "@/lib/hooks/useToast";
import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import { AXIS_LABELS, TYPE_SINGULAR, fileSizeLabel, libraryHref } from "@/lib/biblioteca";
import type { LibraryAxis, LibraryDocument, LibraryType, LibraryVisibility } from "@/types/library";
import LibraryDocumentForm, {
  MAX_TAGS,
  SUMMARY_MAX,
  SUMMARY_MIN,
  VIDEO_PATTERN,
  minutesFromPages,
  type DocumentFormErrors,
  type DocumentFormState,
} from "./LibraryDocumentForm";
import { KindIcon, LibraryTabs, SLUG_PATTERN, iconButton, normalizeText, selectClass, toggleButton, UploadBar } from "./formParts";
import { looksLikePdf, renderPdfCover } from "./pdfCover";

type PublishedFilter = "todos" | "publicados" | "borradores";

const emptyForm = (): DocumentFormState => ({
  source: "pdf",
  file: null,
  externalUrl: "",
  linkKind: "enlace",
  title: "",
  author: "",
  summary: "",
  description: "",
  type: "libro",
  axis: "",
  stage: "todos",
  tags: [],
  readingMinutes: "",
  minutesTouched: false,
  pageCount: null,
  visibility: "publico",
  published: true,
  featured: false,
  displayOrder: "0",
  slug: "",
  cover: null,
  coverOrigin: null,
  removeCover: false,
});

function toForm(doc: LibraryDocument): DocumentFormState {
  return {
    ...emptyForm(),
    source: doc.kind === "pdf" ? "pdf" : "link",
    externalUrl: doc.externalUrl ?? "",
    linkKind: doc.kind === "video" ? "video" : "enlace",
    title: doc.title,
    author: doc.author ?? "",
    summary: doc.summary,
    description: doc.description ?? "",
    type: doc.type,
    axis: doc.axis ?? "",
    stage: doc.stage,
    tags: doc.tags ?? [],
    readingMinutes: doc.readingMinutes ? String(doc.readingMinutes) : "",
    minutesTouched: Boolean(doc.readingMinutes),
    pageCount: doc.pageCount ?? null,
    visibility: doc.visibility,
    published: doc.published,
    featured: doc.featured,
    displayOrder: String(doc.displayOrder ?? 0),
    slug: doc.slug,
  };
}

function validate(form: DocumentFormState, editing: LibraryDocument | null): DocumentFormErrors {
  const errors: DocumentFormErrors = {};
  const title = form.title.trim();
  if (title.length < 3) errors.title = "Escribe un título de al menos 3 letras.";
  else if (title.length > 200) errors.title = "El título puede tener hasta 200 caracteres.";

  const summary = form.summary.trim().length;
  if (summary < SUMMARY_MIN) errors.summary = `El resumen necesita al menos ${SUMMARY_MIN} caracteres.`;
  else if (summary > SUMMARY_MAX) errors.summary = `El resumen puede tener hasta ${SUMMARY_MAX} caracteres.`;

  if (form.source === "pdf") {
    if (!form.file && editing?.kind !== "pdf") errors.file = "Elige el PDF que quieres compartir.";
  } else if (!/^https?:\/\/\S+\.\S+$/i.test(form.externalUrl.trim())) {
    errors.externalUrl = "Pega un enlace completo que empiece con https://";
  }

  if (form.readingMinutes.trim()) {
    const minutes = Number(form.readingMinutes);
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 999) {
      errors.readingMinutes = "Usa un número de minutos entre 1 y 999, o déjalo vacío.";
    }
  }
  if (form.tags.length > MAX_TAGS) errors.tags = `Puedes poner hasta ${MAX_TAGS} etiquetas.`;
  if (form.slug.trim() && !SLUG_PATTERN.test(form.slug.trim())) {
    errors.slug = "Solo minúsculas sin tildes, números y guiones (ej. guia-de-oracion).";
  }
  if (form.displayOrder.trim()) {
    const order = Number(form.displayOrder);
    if (!Number.isInteger(order) || order < 0 || order > 9999) {
      errors.displayOrder = "Usa un número entero entre 0 y 9999.";
    }
  }
  return errors;
}

// --- Gestor --------------------------------------------------------------------

export default function LibraryDocumentsManager() {
  const toast = useToast();
  const [items, setItems] = useState<LibraryDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<LibraryType | "todos">("todos");
  const [axis, setAxis] = useState<LibraryAxis | "todos">("todos");
  const [visibility, setVisibility] = useState<LibraryVisibility | "todas">("todas");
  const [published, setPublished] = useState<PublishedFilter>("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<LibraryDocument | null>(null);
  const [form, setForm] = useState<DocumentFormState>(emptyForm);
  const [errors, setErrors] = useState<DocumentFormErrors>({});
  const [coverStatus, setCoverStatus] = useState<"idle" | "generating" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);
  const [uploadPercent, setUploadPercent] = useState<number | null>(null);
  const [toDelete, setToDelete] = useState<LibraryDocument | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyToggle, setBusyToggle] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  // Evita que una portada que tarda pise a la de un PDF elegido después
  const coverJob = useRef(0);

  const loadAll = async () => {
    try {
      setLoading(true);
      const data = await getLibraryDocumentsAPI();
      setItems(data.items ?? []);
      setLoadError(false);
    } catch (error) {
      setLoadError(true);
      toast.error(libraryErrorMessage(error, "No se pudo cargar la biblioteca."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const draftCount = items.filter((i) => !i.published).length;
  const membersCount = items.filter((i) => i.visibility === "miembros").length;

  const filtered = useMemo(() => {
    const term = normalizeText(search.trim());
    return items
      .filter((doc) => type === "todos" || doc.type === type)
      .filter((doc) => axis === "todos" || doc.axis === axis)
      .filter((doc) => visibility === "todas" || doc.visibility === visibility)
      .filter((doc) => (published === "todos" ? true : published === "publicados" ? doc.published : !doc.published))
      .filter((doc) => {
        if (!term) return true;
        return [doc.title, doc.author, doc.summary, doc.slug, ...(doc.tags ?? [])]
          .filter(Boolean)
          .some((value) => normalizeText(value!).includes(term));
      });
  }, [items, search, type, axis, visibility, published]);

  const hasFilters =
    Boolean(search.trim()) || type !== "todos" || axis !== "todos" || visibility !== "todas" || published !== "todos";

  const resetModalState = () => {
    coverJob.current += 1;
    setErrors({});
    setCoverStatus("idle");
    setUploadPercent(null);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    resetModalState();
    setIsModalOpen(true);
  };

  const openEdit = (doc: LibraryDocument) => {
    setEditing(doc);
    setForm(toForm(doc));
    resetModalState();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    coverJob.current += 1;
    setIsModalOpen(false);
    setEditing(null);
  };

  const updateForm = (changes: Partial<DocumentFormState>) => {
    setForm((current) => ({ ...current, ...changes }));
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(changes) as (keyof DocumentFormState)[]) delete next[key];
      return next;
    });
  };

  // Portada y páginas desde el PDF; el tiempo de lectura se propone si nadie lo tocó
  const generateCover = async (source: File | ArrayBuffer, job: number) => {
    setCoverStatus("generating");
    try {
      const { cover, pageCount } = await renderPdfCover(source);
      if (job !== coverJob.current) return;
      setForm((current) => ({
        ...current,
        pageCount,
        // Una portada elegida a mano no se reemplaza
        ...(current.coverOrigin === "manual" ? {} : { cover, coverOrigin: "auto" as const, removeCover: false }),
        ...(current.minutesTouched ? {} : { readingMinutes: String(minutesFromPages(pageCount)) }),
      }));
      setCoverStatus("idle");
    } catch {
      if (job !== coverJob.current) return;
      setCoverStatus("error");
    }
  };

  const pickFile = async (file: File | null) => {
    const job = ++coverJob.current;
    if (!file) {
      setCoverStatus("idle");
      setForm((current) => ({
        ...current,
        file: null,
        pageCount: editing?.pageCount ?? null,
        ...(current.coverOrigin === "auto" ? { cover: null, coverOrigin: null } : {}),
      }));
      return;
    }
    const isPdfName = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
    if (!isPdfName || !(await looksLikePdf(file))) {
      setErrors((current) => ({ ...current, file: `«${file.name}» no es un PDF. Elige un archivo .pdf.` }));
      return;
    }
    if (file.size > LIBRARY_MAX_FILE_BYTES) {
      setErrors((current) => ({
        ...current,
        file: `El archivo pesa ${fileSizeLabel(file.size)} y el máximo es 50 MB. Prueba comprimirlo.`,
      }));
      return;
    }
    const titleFromName = file.name
      .replace(/\.pdf$/i, "")
      .replace(/[_-]+/g, " ")
      .trim();
    setForm((current) => ({
      ...current,
      file,
      title: current.title.trim() ? current.title : titleFromName.charAt(0).toUpperCase() + titleFromName.slice(1),
    }));
    setErrors((current) => {
      const next = { ...current };
      delete next.file;
      delete next.title;
      return next;
    });
    await generateCover(file, job);
  };

  const pickCover = (file: File | null) => {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      setErrors((current) => ({ ...current, cover: "Usa una imagen JPG, PNG o WebP." }));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErrors((current) => ({ ...current, cover: "La imagen pesa más de 8 MB. Usa una más liviana." }));
      return;
    }
    coverJob.current += 1;
    setCoverStatus("idle");
    updateForm({ cover: file, coverOrigin: "manual", removeCover: false });
  };

  const regenerateCover = async () => {
    const job = ++coverJob.current;
    setForm((current) => ({ ...current, coverOrigin: current.coverOrigin === "manual" ? null : current.coverOrigin }));
    if (form.file) {
      await generateCover(form.file, job);
      return;
    }
    if (!editing) return;
    setCoverStatus("generating");
    try {
      const buffer = await fetchLibraryFileAPI(editing.id);
      await generateCover(buffer, job);
    } catch (error) {
      if (job !== coverJob.current) return;
      setCoverStatus("error");
      toast.error(libraryErrorMessage(error, "No pudimos abrir el PDF guardado."));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (coverStatus === "generating") {
      toast.info("Espera un momento: estamos creando la portada.");
      return;
    }
    const found = validate(form, editing);
    setErrors(found);
    if (Object.keys(found).length) {
      toast.error("Revisa los campos marcados.");
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      });
      return;
    }

    const isPdf = form.source === "pdf";
    const payload: LibraryDocumentPayload = {
      title: form.title.trim(),
      author: form.author.trim(),
      summary: form.summary.trim(),
      description: form.description.trim(),
      kind: isPdf ? "pdf" : form.linkKind,
      type: form.type,
      axis: form.axis || null,
      stage: form.stage,
      tags: form.tags,
      visibility: form.visibility,
      externalUrl: isPdf ? "" : form.externalUrl.trim(),
      readingMinutes: form.readingMinutes.trim() ? Number(form.readingMinutes) : null,
      featured: form.featured,
      published: form.published,
      displayOrder: form.displayOrder.trim() ? Number(form.displayOrder) : 0,
    };
    if (form.slug.trim()) payload.slug = form.slug.trim();
    if (isPdf && form.pageCount) payload.pageCount = form.pageCount;
    if (!isPdf) payload.pageCount = null;
    if (isPdf && form.file) payload.file = form.file;
    if (!isPdf && editing?.kind === "pdf") payload.removeFile = true;
    if (form.cover) payload.cover = form.cover;
    else if (form.removeCover) payload.removeCover = true;

    const withUpload = Boolean(payload.file);
    try {
      setSubmitting(true);
      if (withUpload) setUploadPercent(0);
      const onProgress = withUpload ? setUploadPercent : undefined;
      if (editing) {
        await updateLibraryDocumentAPI(editing.id, payload, onProgress);
        toast.success(`«${payload.title}» se actualizó.`);
      } else {
        await createLibraryDocumentAPI(payload, onProgress);
        toast.success(
          payload.published
            ? `«${payload.title}» ya está en la biblioteca.`
            : `«${payload.title}» se guardó como borrador.`
        );
      }
      setSubmitting(false);
      setIsModalOpen(false);
      setEditing(null);
      await loadAll();
    } catch (error) {
      toast.error(libraryErrorMessage(error, "No se pudo guardar el documento."));
    } finally {
      setSubmitting(false);
      setUploadPercent(null);
    }
  };

  const toggle = async (doc: LibraryDocument, field: "published" | "featured") => {
    const value = !doc[field];
    setBusyToggle(`${doc.id}-${field}`);
    setItems((current) => current.map((i) => (i.id === doc.id ? { ...i, [field]: value } : i)));
    try {
      await updateLibraryDocumentAPI(doc.id, { [field]: value });
      toast.success(
        field === "published"
          ? value
            ? `«${doc.title}» ya se ve en la biblioteca.`
            : `«${doc.title}» quedó como borrador.`
          : value
            ? `«${doc.title}» ahora es destacado.`
            : `«${doc.title}» ya no es destacado.`
      );
    } catch (error) {
      setItems((current) => current.map((i) => (i.id === doc.id ? { ...i, [field]: !value } : i)));
      toast.error(libraryErrorMessage(error, "No se pudo cambiar el estado."));
    } finally {
      setBusyToggle(null);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      setDeleting(true);
      await deleteLibraryDocumentAPI(toDelete.id);
      toast.success(`«${toDelete.title}» se eliminó de la biblioteca.`);
      setToDelete(null);
      await loadAll();
    } catch (error) {
      toast.error(libraryErrorMessage(error, "No se pudo eliminar el documento."));
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setType("todos");
    setAxis("todos");
    setVisibility("todas");
    setPublished("todos");
  };

  return (
    <>
      <PageHeader
        title="Biblioteca"
        description="Libros, documentos y guías que los jóvenes leen en /biblioteca."
        icon={<BookOpen className="h-[18px] w-[18px]" strokeWidth={2.1} />}
        breadcrumbs={[{ label: "Contenido" }, { label: "Biblioteca" }]}
        actions={
          <Button
            variant="primary"
            size="md"
            className="min-h-11 sm:min-h-9"
            onClick={openCreate}
            icon={<Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />}
          >
            Nuevo documento
          </Button>
        }
      />

      <div className="flex flex-1 flex-col overflow-auto px-4 py-5 sm:px-6">
        <LibraryTabs />

        <div
          role="search"
          aria-label="Filtrar documentos"
          className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:flex sm:flex-wrap sm:items-center"
        >
          <div className="relative col-span-2 sm:min-w-56 sm:flex-1">
            <label htmlFor="library-search" className="sr-only">
              Buscar documentos
            </label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              id="library-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título, autor o etiqueta…"
              className={`${selectClass} w-full pl-9`}
            />
          </div>
          <label htmlFor="library-type-filter" className="sr-only">
            Tipo
          </label>
          <select
            id="library-type-filter"
            value={type}
            onChange={(e) => setType(e.target.value as LibraryType | "todos")}
            className={selectClass}
          >
            <option value="todos">Todos los tipos</option>
            {(Object.keys(TYPE_SINGULAR) as LibraryType[]).map((key) => (
              <option key={key} value={key}>
                {TYPE_SINGULAR[key]}
              </option>
            ))}
          </select>
          <label htmlFor="library-axis-filter" className="sr-only">
            Eje formativo
          </label>
          <select
            id="library-axis-filter"
            value={axis}
            onChange={(e) => setAxis(e.target.value as LibraryAxis | "todos")}
            className={selectClass}
          >
            <option value="todos">Todos los ejes</option>
            {(Object.keys(AXIS_LABELS) as LibraryAxis[]).map((key) => (
              <option key={key} value={key}>
                {AXIS_LABELS[key]}
              </option>
            ))}
          </select>
          <label htmlFor="library-visibility-filter" className="sr-only">
            Visibilidad
          </label>
          <select
            id="library-visibility-filter"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as LibraryVisibility | "todas")}
            className={selectClass}
          >
            <option value="todas">Público y miembros</option>
            <option value="publico">Público</option>
            <option value="miembros">Solo miembros ({membersCount})</option>
          </select>
          <label htmlFor="library-published-filter" className="sr-only">
            Estado
          </label>
          <select
            id="library-published-filter"
            value={published}
            onChange={(e) => setPublished(e.target.value as PublishedFilter)}
            className={selectClass}
          >
            <option value="todos">Publicados y borradores</option>
            <option value="publicados">Publicados</option>
            <option value="borradores">Borradores ({draftCount})</option>
          </select>
          {hasFilters ? (
            <Button variant="ghost" size="md" className="col-span-2 min-h-11 sm:min-h-9" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          ) : null}
        </div>

        <p className="mb-4 text-[12.5px] text-slate-600" aria-live="polite">
          {loading ? (
            "Cargando documentos…"
          ) : (
            <>
              Mostrando <strong className="font-bold text-slate-900">{filtered.length}</strong> de {items.length}{" "}
              documento{items.length === 1 ? "" : "s"}
              {draftCount ? ` · ${draftCount} en borrador` : ""}
              {membersCount ? ` · ${membersCount} solo para miembros` : ""}
            </>
          )}
        </p>

        {loading ? (
          <div className="space-y-3" aria-hidden>
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-100 motion-reduce:animate-none" />
            ))}
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
            No se pudo cargar la biblioteca.
            <Button variant="outline" onClick={() => void loadAll()}>
              Reintentar
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
            <BookOpen className="h-8 w-8 text-slate-400" aria-hidden />
            {items.length === 0
              ? "La biblioteca está vacía. Sube el primer PDF o comparte un enlace para que los jóvenes empiecen a leer."
              : "Ningún documento coincide con los filtros."}
            {items.length === 0 ? (
              <Button variant="primary" onClick={openCreate} icon={<Plus className="h-4 w-4" aria-hidden />}>
                Nuevo documento
              </Button>
            ) : (
              <Button variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            )}
          </div>
        ) : (
          <ul className="space-y-2">
            {filtered.map((doc) => (
              <LibraryDocumentRow
                key={doc.id}
                doc={doc}
                busyToggle={busyToggle}
                onEdit={() => openEdit(doc)}
                onDelete={() => setToDelete(doc)}
                onToggle={(field) => void toggle(doc, field)}
              />
            ))}
          </ul>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editing ? "Editar documento" : "Nuevo documento"}
        description="Los campos con * son obligatorios."
        size="xl"
      >
        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          <div className="p-5 sm:p-6">
            <LibraryDocumentForm
              form={form}
              errors={errors}
              onChange={updateForm}
              onPickFile={(file) => void pickFile(file)}
              onPickCover={pickCover}
              onRegenerateCover={() => void regenerateCover()}
              coverStatus={coverStatus}
              existing={
                editing
                  ? {
                      coverUrl: editing.coverUrl,
                      hasFile: editing.kind === "pdf",
                      fileSize: editing.fileSize,
                      pageCount: editing.pageCount,
                    }
                  : undefined
              }
            />
          </div>
          <div className="sticky bottom-0 flex flex-col gap-3 border-t border-slate-100 bg-white/95 px-5 py-3 backdrop-blur sm:px-6">
            {uploadPercent !== null ? (
              <UploadBar
                percent={uploadPercent}
                label={uploadPercent >= 100 ? "Guardando en el servidor…" : "Subiendo el PDF…"}
              />
            ) : null}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                className="min-h-11 sm:min-h-9"
                onClick={closeModal}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="min-h-11 sm:min-h-9"
                isLoading={submitting}
                disabled={coverStatus === "generating"}
                icon={<BookOpen className="h-4 w-4" aria-hidden />}
              >
                {editing ? "Guardar cambios" : form.published ? "Publicar en la biblioteca" : "Guardar borrador"}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={() => void confirmDelete()}
        title="¿Eliminar este documento?"
        message={
          toDelete
            ? `«${toDelete.title}» desaparecerá de la biblioteca y de las rutas de formación${
                toDelete.kind === "pdf" ? ". También se borrará el PDF del servidor" : ""
              }${toDelete.coverUrl ? " y su portada" : ""}. No se puede deshacer; si solo quieres esconderlo, desmarca «Publicado».`
            : ""
        }
        confirmText="Sí, eliminar"
        variant="danger"
        isLoading={deleting}
      />
    </>
  );
}

function LibraryDocumentRow({
  doc,
  busyToggle,
  onEdit,
  onDelete,
  onToggle,
}: {
  doc: LibraryDocument;
  busyToggle: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (field: "published" | "featured") => void;
}) {
  const cover = doc.coverUrl ? getOptimizedUrl(doc.coverUrl, { w: 120 }) : null;
  const meta = [
    doc.kind === "pdf" && doc.pageCount ? `${doc.pageCount} pág.` : null,
    doc.kind === "pdf" ? fileSizeLabel(doc.fileSize) : doc.kind === "video" ? "Video" : "Enlace",
    doc.author,
  ].filter(Boolean);

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-slate-300 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="relative flex h-[72px] w-[54px] shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100 shadow-sm ring-1 ring-slate-200">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <KindIcon kind={doc.kind} className="h-5 w-5 text-slate-400" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[14.5px] font-bold leading-tight text-slate-900">{doc.title}</h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-slate-600">{meta.join(" · ")}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-jmv-blue">
              {TYPE_SINGULAR[doc.type]}
            </span>
            {doc.axis ? (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                {AXIS_LABELS[doc.axis]}
              </span>
            ) : null}
            {doc.visibility === "miembros" ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900">
                <Lock className="h-3 w-3" aria-hidden />
                Solo miembros
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                <Globe className="h-3 w-3" aria-hidden />
                Público
              </span>
            )}
            {!doc.published ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-800">
                <EyeOff className="h-3 w-3" aria-hidden />
                Borrador
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2 text-[11px] text-slate-600">
              <span className="inline-flex items-center gap-0.5" title="Vistas">
                <Eye className="h-3 w-3" aria-hidden />
                {doc.views ?? 0}
                <span className="sr-only"> vistas</span>
              </span>
              {doc.kind === "pdf" ? (
                <span className="inline-flex items-center gap-0.5" title="Descargas">
                  <Download className="h-3 w-3" aria-hidden />
                  {doc.downloads ?? 0}
                  <span className="sr-only"> descargas</span>
                </span>
              ) : null}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 border-t border-slate-100 pt-2 sm:border-0 sm:pt-0">
        <button
          type="button"
          onClick={() => onToggle("published")}
          disabled={busyToggle === `${doc.id}-published`}
          aria-pressed={doc.published}
          aria-label={`Publicado: ${doc.title}`}
          title={doc.published ? "Publicado (clic para pasar a borrador)" : "Borrador (clic para publicar)"}
          className={`${toggleButton} ${doc.published ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100" : "border-slate-200 text-slate-600 hover:bg-slate-100"}`}
        >
          {doc.published ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden /> : <EyeOff className="h-3.5 w-3.5" aria-hidden />}
          Publicado
        </button>
        <button
          type="button"
          onClick={() => onToggle("featured")}
          disabled={busyToggle === `${doc.id}-featured`}
          aria-pressed={doc.featured}
          aria-label={`Destacado: ${doc.title}`}
          title={doc.featured ? "Destacado (clic para quitar)" : "Clic para destacar"}
          className={`${toggleButton} ${doc.featured ? "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100" : "border-slate-200 text-slate-600 hover:bg-slate-100"}`}
        >
          <Star className={`h-3.5 w-3.5 ${doc.featured ? "fill-current" : ""}`} aria-hidden />
          <span className="max-[419px]:sr-only">Destacado</span>
        </button>
        <div className="ml-auto flex items-center gap-1">
          {doc.published ? (
            <a
              href={libraryHref(doc.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${iconButton} text-slate-600 hover:bg-slate-100 hover:text-jmv-blue`}
              title="Ver en el sitio"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              <span className="sr-only">Ver «{doc.title}» en el sitio (se abre en una pestaña nueva)</span>
            </a>
          ) : (
            <span className={`${iconButton} cursor-not-allowed text-slate-300`} title="Publícalo para verlo en el sitio" aria-hidden>
              <ExternalLink className="h-4 w-4" />
            </span>
          )}
          <button
            type="button"
            onClick={onEdit}
            className={`${iconButton} text-slate-600 hover:bg-jmv-blue/10 hover:text-jmv-blue`}
            aria-label={`Editar ${doc.title}`}
            title="Editar"
          >
            <Pencil className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className={`${iconButton} text-slate-600 hover:bg-red-50 hover:text-red-700`}
            aria-label={`Eliminar ${doc.title}`}
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </li>
  );
}
