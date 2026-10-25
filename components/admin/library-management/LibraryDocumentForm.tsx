"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  FileText,
  FileUp,
  ImagePlus,
  Link2,
  Loader2,
  Lock,
  Globe,
  RefreshCw,
  Sparkles,
  Video,
  Wand2,
  X,
} from "lucide-react";
import Button from "@/components/admin/ui/Button";
import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import { AXIS_LABELS, STAGE_LABELS, TYPE_SINGULAR, fileSizeLabel } from "@/lib/biblioteca";
import type { LibraryAxis, LibraryStage, LibraryType, LibraryVisibility } from "@/types/library";
import { Field, FormSection, ToggleCard, inputClass } from "./formParts";

export const SUMMARY_MIN = 10;
export const SUMMARY_MAX = 180;
export const MAX_TAGS = 12;
/** Desde aquí se sugiere comprimir: los PDF salen del VPS y pesan en datos móviles */
export const HEAVY_PDF_BYTES = 15 * 1024 * 1024;

export type SourceMode = "pdf" | "link";

export interface DocumentFormState {
  source: SourceMode;
  /** PDF nuevo elegido en este formulario */
  file: File | null;
  externalUrl: string;
  /** Para enlaces: "video" si es YouTube/Vimeo */
  linkKind: "enlace" | "video";
  title: string;
  author: string;
  summary: string;
  description: string;
  type: LibraryType;
  axis: LibraryAxis | "";
  stage: LibraryStage;
  tags: string[];
  readingMinutes: string;
  /** El admin escribió el tiempo a mano: ya no se recalcula solo */
  minutesTouched: boolean;
  pageCount: number | null;
  visibility: LibraryVisibility;
  published: boolean;
  featured: boolean;
  displayOrder: string;
  slug: string;
  /** Portada nueva (generada del PDF o subida a mano) */
  cover: Blob | null;
  coverOrigin: "auto" | "manual" | null;
  /** Quitar la portada guardada */
  removeCover: boolean;
}

export type DocumentFormErrors = Partial<Record<keyof DocumentFormState, string>>;

export const VIDEO_PATTERN =
  /^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch|shorts\/|embed\/|live\/)|youtu\.be\/|vimeo\.com\/)/i;

export function minutesFromPages(pages: number) {
  return Math.max(1, Math.round(pages * 2));
}

function TypeIcon({ source, linkKind }: { source: SourceMode; linkKind: "enlace" | "video" }) {
  if (source === "pdf") return <FileText className="h-5 w-5" aria-hidden />;
  return linkKind === "video" ? <Video className="h-5 w-5" aria-hidden /> : <Link2 className="h-5 w-5" aria-hidden />;
}

export default function LibraryDocumentForm({
  form,
  errors,
  onChange,
  onPickFile,
  onPickCover,
  onRegenerateCover,
  coverStatus,
  existing,
}: {
  form: DocumentFormState;
  errors: DocumentFormErrors;
  onChange: (changes: Partial<DocumentFormState>) => void;
  onPickFile: (file: File | null) => void;
  onPickCover: (file: File | null) => void;
  /** Al editar un PDF guardado sin portada nueva: vuelve a generarla */
  onRegenerateCover?: () => void;
  coverStatus: "idle" | "generating" | "error";
  existing?: {
    coverUrl?: string | null;
    hasFile: boolean;
    fileSize?: number | null;
    pageCount?: number | null;
  };
}) {
  const [dragging, setDragging] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [tagDraft, setTagDraft] = useState("");
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!form.cover) {
      setCoverPreview(null);
      return;
    }
    const url = URL.createObjectURL(form.cover);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [form.cover]);

  const savedCover = !form.removeCover && existing?.coverUrl ? getOptimizedUrl(existing.coverUrl, { w: 400 }) : null;
  const shownCover = coverPreview ?? savedCover;
  const summaryLength = form.summary.trim().length;

  const addTag = (raw: string) => {
    const parts = raw
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);
    if (!parts.length) return;
    const next = [...form.tags];
    for (const tag of parts) {
      if (next.length >= MAX_TAGS) break;
      if (!next.some((t) => t.toLowerCase() === tag.toLowerCase())) next.push(tag.slice(0, 40));
    }
    onChange({ tags: next });
    setTagDraft("");
  };

  const onTagKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagDraft);
    } else if (e.key === "Backspace" && !tagDraft && form.tags.length) {
      onChange({ tags: form.tags.slice(0, -1) });
    }
  };

  const changeUrl = (value: string) => {
    onChange({
      externalUrl: value,
      linkKind: VIDEO_PATTERN.test(value.trim()) ? "video" : form.linkKind === "video" && !value.trim() ? "enlace" : form.linkKind,
    });
  };

  const pageCount = form.pageCount ?? existing?.pageCount ?? null;
  const suggestedMinutes = pageCount ? minutesFromPages(pageCount) : null;

  return (
    <div className="space-y-8">
      {/* 1. Origen */}
      <FormSection title="¿Qué vas a compartir?" step={1}>
        <div role="radiogroup" aria-label="Origen del documento" className="grid grid-cols-2 gap-2">
          {(
            [
              { value: "pdf", label: "Subir PDF", hint: "Se lee dentro de la web", icon: FileUp },
              { value: "link", label: "Pegar enlace", hint: "Drive, página web o video", icon: Link2 },
            ] as const
          ).map((option) => {
            const checked = form.source === option.value;
            const Icon = option.icon;
            return (
              <label
                key={option.value}
                className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-jmv-blue/40 ${
                  checked ? "border-jmv-blue bg-blue-50" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="library-source"
                  value={option.value}
                  checked={checked}
                  onChange={() => onChange({ source: option.value })}
                  className="sr-only"
                />
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    checked ? "bg-jmv-blue text-white" : "bg-slate-100 text-slate-600"
                  }`}
                  aria-hidden
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-900">{option.label}</span>
                  <span className="block text-xs text-slate-500">{option.hint}</span>
                </span>
              </label>
            );
          })}
        </div>

        {form.source === "pdf" ? (
          <div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const dropped = e.dataTransfer.files?.[0];
                if (dropped) onPickFile(dropped);
              }}
              className={`flex flex-col items-center gap-3 rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
                errors.file
                  ? "border-red-400 bg-red-50/50"
                  : dragging
                    ? "border-jmv-blue bg-blue-50"
                    : "border-slate-300 bg-slate-50"
              }`}
            >
              {form.file ? (
                <div className="flex w-full items-center gap-3 rounded-lg bg-white p-3 text-left ring-1 ring-slate-200">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-700" aria-hidden>
                    <FileText className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-900">{form.file.name}</span>
                    <span className="block text-xs text-slate-500">
                      {fileSizeLabel(form.file.size)}
                      {form.pageCount ? ` · ${form.pageCount} página${form.pageCount === 1 ? "" : "s"}` : ""}
                      {existing?.hasFile ? " · Reemplazará al archivo actual" : ""}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onPickFile(null);
                      if (pdfInputRef.current) pdfInputRef.current.value = "";
                    }}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jmv-blue/40 sm:h-9 sm:w-9"
                    aria-label={`Quitar ${form.file.name}`}
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              ) : existing?.hasFile ? (
                <div className="flex w-full items-center gap-3 rounded-lg bg-white p-3 text-left ring-1 ring-slate-200">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700" aria-hidden>
                    <FileText className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-900">PDF guardado</span>
                    <span className="block text-xs text-slate-500">
                      {[fileSizeLabel(existing.fileSize), existing.pageCount ? `${existing.pageCount} páginas` : null]
                        .filter(Boolean)
                        .join(" · ") || "Listo para leer"}
                    </span>
                  </span>
                </div>
              ) : (
                <>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-jmv-blue ring-1 ring-slate-200" aria-hidden>
                    <FileUp className="h-6 w-6" />
                  </span>
                  <span className="text-sm text-slate-700">
                    <strong className="font-semibold text-slate-900">Arrastra el PDF aquí</strong>
                    <span className="hidden sm:inline"> o elígelo de tu equipo</span>
                  </span>
                </>
              )}
              <input
                ref={pdfInputRef}
                id="library-pdf-file"
                type="file"
                accept="application/pdf,.pdf"
                aria-describedby="library-pdf-hint"
                aria-invalid={Boolean(errors.file)}
                onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                className="sr-only"
              />
              <Button
                type="button"
                variant={form.file || existing?.hasFile ? "outline" : "primary"}
                className="min-h-11 sm:min-h-9"
                icon={existing?.hasFile && !form.file ? <RefreshCw className="h-4 w-4" aria-hidden /> : <FileUp className="h-4 w-4" aria-hidden />}
                onClick={() => pdfInputRef.current?.click()}
              >
                {form.file ? "Elegir otro PDF" : existing?.hasFile ? "Reemplazar archivo" : "Elegir PDF"}
              </Button>
            </div>
            {errors.file ? (
              <p className="mt-1 text-xs font-medium text-red-700" role="alert">
                {errors.file}
              </p>
            ) : null}
            {!errors.file && form.file && form.file.size > HEAVY_PDF_BYTES ? (
              <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900" role="status">
                Este PDF pesa {fileSizeLabel(form.file.size)}. Se puede subir, pero tardará en abrirse con datos
                móviles. Si puedes, comprímelo antes (por ejemplo en ilovepdf.com, «Comprimir PDF»): suele quedar en menos
                de 10 MB sin perder calidad.
              </p>
            ) : null}
            <p id="library-pdf-hint" className="mt-1 text-xs text-slate-500">
              Solo PDF, hasta 50 MB. La portada y el número de páginas salen solos.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <Field
              label="Enlace"
              required
              error={errors.externalUrl}
              hint="Google Drive, una página web o un video de YouTube. Debe empezar con https://"
            >
              {({ id, describedBy, invalid }) => (
                <input
                  id={id}
                  type="url"
                  inputMode="url"
                  value={form.externalUrl}
                  onChange={(e) => changeUrl(e.target.value)}
                  placeholder="https://"
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                  className={inputClass}
                />
              )}
            </Field>
            <div role="radiogroup" aria-label="Tipo de enlace" className="flex flex-wrap gap-2">
              {(["enlace", "video"] as const).map((value) => (
                <label
                  key={value}
                  className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 px-3.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-jmv-blue/40 sm:min-h-9 ${
                    form.linkKind === value ? "border-jmv-blue bg-blue-50 font-semibold text-jmv-blue" : "border-slate-200 text-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="library-link-kind"
                    checked={form.linkKind === value}
                    onChange={() => onChange({ linkKind: value })}
                    className="sr-only"
                  />
                  <TypeIcon source="link" linkKind={value} />
                  {value === "video" ? "Video" : "Página o documento"}
                </label>
              ))}
              {form.linkKind === "video" && VIDEO_PATTERN.test(form.externalUrl.trim()) ? (
                <span className="inline-flex items-center gap-1 self-center text-xs font-medium text-emerald-700">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  Detectamos un video
                </span>
              ) : null}
            </div>
            {existing?.hasFile ? (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
                Al guardar como enlace se borrará el PDF que estaba subido.
              </p>
            ) : null}
          </div>
        )}
      </FormSection>

      {/* 2. Datos */}
      <FormSection title="Cuéntanos de qué trata" step={2}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_minmax(0,240px)]">
          <Field label="Título" required error={errors.title}>
            {({ id, describedBy, invalid }) => (
              <input
                id={id}
                value={form.title}
                onChange={(e) => onChange({ title: e.target.value })}
                maxLength={200}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                className={inputClass}
              />
            )}
          </Field>
          <Field label="Autor">
            {({ id }) => (
              <input
                id={id}
                value={form.author}
                onChange={(e) => onChange({ author: e.target.value })}
                placeholder="Ej. Consejo Nacional"
                maxLength={150}
                className={inputClass}
              />
            )}
          </Field>
        </div>

        <Field
          label="Resumen"
          required
          error={errors.summary}
          hint="1 o 2 frases que den ganas de leerlo. Se ve en la tarjeta."
          counter={
            <span
              className={`text-xs tabular-nums ${
                summaryLength > SUMMARY_MAX || (summaryLength > 0 && summaryLength < SUMMARY_MIN)
                  ? "font-semibold text-red-700"
                  : "text-slate-500"
              }`}
            >
              {summaryLength}/{SUMMARY_MAX}
            </span>
          }
        >
          {({ id, describedBy, invalid }) => (
            <textarea
              id={id}
              rows={2}
              value={form.summary}
              onChange={(e) => onChange({ summary: e.target.value })}
              aria-invalid={invalid}
              aria-describedby={describedBy}
              className={`${inputClass} resize-y py-2`}
            />
          )}
        </Field>

        <Field label="Descripción" hint="Opcional. Para la ficha: qué vas a encontrar, para quién es, cómo usarlo en el grupo.">
          {({ id, describedBy }) => (
            <textarea
              id={id}
              rows={4}
              value={form.description}
              onChange={(e) => onChange({ description: e.target.value })}
              maxLength={4000}
              aria-describedby={describedBy}
              className={`${inputClass} resize-y py-2`}
            />
          )}
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Tipo" required>
            {({ id }) => (
              <select
                id={id}
                value={form.type}
                onChange={(e) => onChange({ type: e.target.value as LibraryType })}
                className={inputClass}
              >
                {(Object.keys(TYPE_SINGULAR) as LibraryType[]).map((key) => (
                  <option key={key} value={key}>
                    {TYPE_SINGULAR[key]}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Eje formativo">
            {({ id }) => (
              <select
                id={id}
                value={form.axis}
                onChange={(e) => onChange({ axis: e.target.value as LibraryAxis | "" })}
                className={inputClass}
              >
                <option value="">Sin eje</option>
                {(Object.keys(AXIS_LABELS) as LibraryAxis[]).map((key) => (
                  <option key={key} value={key}>
                    {AXIS_LABELS[key]}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Etapa" required>
            {({ id }) => (
              <select
                id={id}
                value={form.stage}
                onChange={(e) => onChange({ stage: e.target.value as LibraryStage })}
                className={inputClass}
              >
                {(Object.keys(STAGE_LABELS) as LibraryStage[]).map((key) => (
                  <option key={key} value={key}>
                    {STAGE_LABELS[key]}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </div>

        <Field
          label="Etiquetas"
          error={errors.tags}
          hint={`Escribe y pulsa Enter o coma. Hasta ${MAX_TAGS}. Ej. oración, Medalla Milagrosa, retiro.`}
        >
          {({ id, describedBy, invalid }) => (
            <div
              className={`flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border bg-white px-2 py-1.5 focus-within:border-jmv-blue focus-within:ring-2 focus-within:ring-jmv-blue/30 ${
                invalid ? "border-red-500" : "border-slate-300"
              }`}
            >
              <ul className="contents" aria-label="Etiquetas añadidas">
                {form.tags.map((tag) => (
                  <li key={tag} className="inline-flex items-center gap-1 rounded-full bg-slate-100 py-0.5 pl-2.5 pr-1 text-xs font-semibold text-slate-800">
                    {tag}
                    <button
                      type="button"
                      onClick={() => onChange({ tags: form.tags.filter((t) => t !== tag) })}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jmv-blue/40"
                      aria-label={`Quitar etiqueta ${tag}`}
                    >
                      <X className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
              <input
                id={id}
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={onTagKey}
                onBlur={() => addTag(tagDraft)}
                disabled={form.tags.length >= MAX_TAGS}
                placeholder={form.tags.length ? "" : "Añadir etiqueta"}
                enterKeyHint="enter"
                aria-describedby={describedBy}
                className="min-h-8 min-w-28 flex-1 border-0 bg-transparent px-1 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>
          )}
        </Field>

        <Field
          label="Tiempo de lectura (minutos)"
          error={errors.readingMinutes}
          hint={
            suggestedMinutes && form.source === "pdf" ? (
              <>
                Sugerimos {suggestedMinutes} min ({pageCount} páginas × 2 min).
                {form.minutesTouched && Number(form.readingMinutes) !== suggestedMinutes ? (
                  <>
                    {" "}
                    <button
                      type="button"
                      onClick={() => onChange({ readingMinutes: String(suggestedMinutes), minutesTouched: false })}
                      className="font-semibold text-jmv-blue underline underline-offset-2"
                    >
                      Usar sugerencia
                    </button>
                  </>
                ) : null}
              </>
            ) : (
              "Opcional. Ayuda a decidir: «lo leo en el bus» o «lo leo el fin de semana»."
            )
          }
        >
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              type="number"
              inputMode="numeric"
              min={1}
              max={999}
              value={form.readingMinutes}
              onChange={(e) => onChange({ readingMinutes: e.target.value, minutesTouched: true })}
              aria-invalid={invalid}
              aria-describedby={describedBy}
              className={`${inputClass} sm:max-w-40`}
            />
          )}
        </Field>
      </FormSection>

      {/* 3. Portada */}
      <FormSection title="Portada" step={3}>
        <div className="grid grid-cols-[112px_1fr] gap-4 sm:grid-cols-[150px_1fr]">
          <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 shadow-sm">
            {coverStatus === "generating" ? (
              <span className="flex flex-col items-center gap-1.5 px-2 text-center text-xs text-slate-600" role="status">
                <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden />
                Creando portada…
              </span>
            ) : shownCover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={shownCover} alt="Vista previa de la portada" className="h-full w-full object-cover" />
            ) : (
              <span className="flex flex-col items-center gap-1 px-2 text-center text-xs text-slate-500">
                <ImagePlus className="h-6 w-6" aria-hidden />
                Sin portada
              </span>
            )}
          </div>
          <div className="space-y-2.5">
            <p className="text-xs text-slate-600" aria-live="polite">
              {coverStatus === "error"
                ? "No pudimos crear la portada desde el PDF. Puedes subir una imagen."
                : form.coverOrigin === "auto"
                  ? "Creada a partir de la primera página del PDF."
                  : form.coverOrigin === "manual"
                    ? "Usarás la imagen que elegiste."
                    : form.source === "pdf"
                      ? "Al elegir el PDF, la portada se crea sola con la primera página."
                      : "Sube una imagen vertical (3:4) para que la tarjeta se vea bonita."}
            </p>
            <input
              ref={coverInputRef}
              id="library-cover-file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => onPickCover(e.target.files?.[0] ?? null)}
              className="sr-only"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="min-h-11 sm:min-h-9"
                icon={<ImagePlus className="h-4 w-4" aria-hidden />}
                onClick={() => coverInputRef.current?.click()}
              >
                {shownCover ? "Usar otra imagen" : "Subir imagen"}
              </Button>
              {form.source === "pdf" && (form.file || existing?.hasFile) && form.coverOrigin !== "auto" && onRegenerateCover ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="min-h-11 sm:min-h-9"
                  icon={<Wand2 className="h-4 w-4" aria-hidden />}
                  onClick={onRegenerateCover}
                  disabled={coverStatus === "generating"}
                >
                  Crear desde el PDF
                </Button>
              ) : null}
              {shownCover ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="min-h-11 text-red-700 hover:bg-red-50 sm:min-h-9"
                  icon={<X className="h-4 w-4" aria-hidden />}
                  onClick={() => {
                    onChange({ cover: null, coverOrigin: null, removeCover: Boolean(existing?.coverUrl) });
                    if (coverInputRef.current) coverInputRef.current.value = "";
                  }}
                >
                  Quitar portada
                </Button>
              ) : null}
            </div>
            {form.removeCover && existing?.coverUrl && !form.cover ? (
              <p className="text-xs font-medium text-amber-800">La portada actual se quitará al guardar.</p>
            ) : null}
            {errors.cover ? <p className="text-xs font-medium text-red-700">{errors.cover}</p> : null}
          </div>
        </div>
      </FormSection>

      {/* 4. Quién lo ve */}
      <FormSection title="¿Quién puede leerlo?" step={4}>
        <div role="radiogroup" aria-label="Visibilidad" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {(
            [
              {
                value: "publico",
                label: "Público",
                description: "Cualquier persona puede abrirlo y descargarlo, sin cuenta.",
                icon: Globe,
              },
              {
                value: "miembros",
                label: "Solo miembros con cuenta",
                description: "Todos ven la tarjeta, pero para leerlo hay que iniciar sesión. Ideal para material interno.",
                icon: Lock,
              },
            ] as const
          ).map((option) => {
            const checked = form.visibility === option.value;
            const Icon = option.icon;
            return (
              <label
                key={option.value}
                className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border-2 p-3.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-jmv-blue/40 ${
                  checked ? "border-jmv-blue bg-blue-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="library-visibility"
                  checked={checked}
                  onChange={() => onChange({ visibility: option.value })}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-jmv-blue"
                />
                <span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                    <Icon className="h-4 w-4" aria-hidden />
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">{option.description}</span>
                </span>
              </label>
            );
          })}
        </div>
        {form.visibility === "miembros" && form.source === "link" ? (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Ojo: un enlace externo lo puede abrir cualquiera que lo tenga. «Solo miembros» protege de verdad los PDF subidos aquí.
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ToggleCard
            checked={form.published}
            onChange={(published) => onChange({ published })}
            label="Publicado"
            description="Se ve en la biblioteca. Desmárcalo para dejarlo en borrador."
          />
          <ToggleCard
            checked={form.featured}
            onChange={(featured) => onChange({ featured })}
            label="Destacado"
            description="Aparece arriba, en la portada de la biblioteca."
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Orden" error={errors.displayOrder} hint="Los números menores van primero.">
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
                placeholder="guia-de-oracion"
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
