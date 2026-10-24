"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AlertDialog } from "radix-ui";
import { Camera, Check, FileText, ImagePlus, Loader2, Send, X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { useSubtypes } from "@/lib/hooks/usePostCategories";
import type { BlogCategory, PostType } from "@/types/user";

export interface CreatePostValues {
  title: string;
  content: string;
  scope: string;
  activityType: string;
  subtype?: string;
  typePost: PostType;
  attachments: File[];
}

interface CreatePostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: CreatePostValues) => Promise<void>;
  scopes: BlogCategory[];
  activityTypes: BlogCategory[];
}

type FieldKey = "title" | "content" | "scope" | "activityType";

const MAX_FILES = 10;
const MAX_FILE_MB = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
// El backend exige al menos 10 caracteres en el texto
const MIN_CONTENT = 10;
const MAX_CONTENT = 1000;
const MAX_TITLE = 100;

const TYPE_OPTIONS: { value: PostType; label: string; hint: string; icon: typeof Camera }[] = [
  {
    value: "moments",
    label: "Momento",
    hint: "Algo que viviste: un encuentro, una misión, un servicio.",
    icon: Camera,
  },
  {
    value: "documents",
    label: "Documento",
    hint: "Un recurso para otras comunidades: guía, formación, material.",
    icon: FileText,
  },
];

const fieldClass = (invalid: boolean) =>
  cn(
    "w-full rounded-xl border-2 bg-white px-4 text-base text-gray-900 placeholder:text-gray-500",
    invalid ? "border-red-600" : "border-slate-300 focus:border-jmv-blue"
  );

type Attachment = { key: string; file: File; url: string };

export default function CreatePostForm({
  isOpen,
  onClose,
  onSubmit,
  scopes,
  activityTypes,
}: CreatePostFormProps) {
  const ids = useId();
  const formId = `${ids}-form`;
  const [typePost, setTypePost] = useState<PostType>("moments");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [scope, setScope] = useState("");
  const [activityType, setActivityType] = useState("");
  const [subtype, setSubtype] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [fileError, setFileError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const attachmentsRef = useRef<Attachment[]>([]);
  attachmentsRef.current = attachments;

  const { subtypes, loading: subtypesLoading } = useSubtypes(activityType || undefined);

  // Libera las vistas previas al desmontar
  useEffect(
    () => () => attachmentsRef.current.forEach((a) => URL.revokeObjectURL(a.url)),
    []
  );

  const isDirty =
    !!title.trim() || !!content.trim() || !!scope || !!activityType || attachments.length > 0;

  const reset = () => {
    attachments.forEach((a) => URL.revokeObjectURL(a.url));
    setTypePost("moments");
    setTitle("");
    setContent("");
    setScope("");
    setActivityType("");
    setSubtype("");
    setAttachments([]);
    setErrors({});
    setFileError(null);
    setServerError(null);
  };

  const requestClose = () => {
    if (isSubmitting) return;
    if (isDirty) setConfirmDiscard(true);
    else onClose();
  };

  const discard = () => {
    setConfirmDiscard(false);
    reset();
    onClose();
  };

  const validate = () => {
    const next: Partial<Record<FieldKey, string>> = {};
    if (!title.trim()) next.title = "Escribe un título para tu publicación.";
    if (content.trim().length < MIN_CONTENT)
      next.content = `Cuéntanos un poco más: el texto necesita al menos ${MIN_CONTENT} caracteres.`;
    if (!scope) next.scope = "Elige el alcance (local, zonal o nacional).";
    if (!activityType) next.activityType = "Elige el tipo de actividad.";
    return next;
  };

  const focusField = (key: FieldKey) => {
    document.getElementById(`${ids}-${key}`)?.focus();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        scope,
        activityType,
        subtype: subtype || undefined,
        typePost,
        attachments: attachments.map((a) => a.file),
      });
      reset();
      onClose();
    } catch (err) {
      setServerError(
        err instanceof Error && err.message
          ? err.message
          : "No pudimos publicar en este momento. Inténtalo de nuevo."
      );
      requestAnimationFrame(() => summaryRef.current?.focus());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFiles = (list: FileList | null) => {
    const files = Array.from(list ?? []);
    if (!files.length) return;
    const room = MAX_FILES - attachments.length;
    const problems: string[] = [];
    const accepted: Attachment[] = [];

    for (const file of files) {
      if (accepted.length >= room) {
        problems.push(`Puedes subir hasta ${MAX_FILES} fotos por publicación.`);
        break;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        problems.push(`«${file.name}» no es una foto válida (usa JPG, PNG, WebP o GIF).`);
        continue;
      }
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        problems.push(`«${file.name}» pesa más de ${MAX_FILE_MB} MB.`);
        continue;
      }
      accepted.push({
        key: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
        file,
        url: URL.createObjectURL(file),
      });
    }

    setAttachments((prev) => [...prev, ...accepted]);
    setFileError(problems.length ? problems.join(" ") : null);
  };

  const removeAttachment = (key: string) => {
    setAttachments((prev) => {
      const target = prev.find((a) => a.key === key);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((a) => a.key !== key);
    });
  };

  const errorList = Object.entries(errors) as [FieldKey, string][];
  const describedBy = (key: FieldKey, extra?: string) =>
    [errors[key] ? `${ids}-${key}-error` : null, extra].filter(Boolean).join(" ") || undefined;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={requestClose}
        title="Nueva publicación"
        description="Comparte con la comunidad JMV Ecuador. Los campos con * son obligatorios."
        size="md"
        footer={
          <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={requestClose}
              disabled={isSubmitting}
              className={buttonVariants({ variant: "ghost", className: "w-full sm:w-auto" })}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form={formId}
              disabled={isSubmitting}
              aria-busy={isSubmitting || undefined}
              className={buttonVariants({ variant: "primary", className: "w-full gap-2 sm:w-auto" })}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 motion-safe:animate-spin" aria-hidden="true" />
                  Publicando…
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" aria-hidden="true" />
                  Publicar
                </>
              )}
            </button>
          </div>
        }
      >
        <form id={formId} onSubmit={handleSubmit} noValidate className="space-y-8">
          {errorList.length || serverError ? (
            <div
              ref={summaryRef}
              tabIndex={-1}
              role="alert"
              className="rounded-xl border-2 border-red-200 bg-red-50 p-4 text-sm text-red-800"
            >
              {serverError ? (
                <p className="font-semibold">{serverError}</p>
              ) : (
                <>
                  <p className="font-semibold">Antes de publicar, revisa esto:</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {errorList.map(([key, message]) => (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => focusField(key)}
                          className="text-left underline underline-offset-2"
                        >
                          {message}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ) : null}

          {/* 1. Tipo */}
          <fieldset>
            <legend className="mb-3 text-base font-semibold text-gray-900">
              1. ¿Qué quieres compartir? *
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {TYPE_OPTIONS.map(({ value, label, hint, icon: Icon }) => {
                const checked = typePost === value;
                return (
                  <label
                    key={value}
                    className={cn(
                      "relative flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4",
                      "has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-(color:--focus-ring) has-[input:focus-visible]:outline-solid",
                      checked ? "border-jmv-blue bg-jmv-blue/5" : "border-slate-300 hover:border-slate-400"
                    )}
                  >
                    <input
                      type="radio"
                      name={`${ids}-type`}
                      value={value}
                      checked={checked}
                      onChange={() => setTypePost(value)}
                      className="sr-only"
                    />
                    <Icon className="mt-0.5 h-6 w-6 shrink-0 text-jmv-blue" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-gray-900">{label}</span>
                      <span className="block text-sm text-gray-700">{hint}</span>
                    </span>
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                        checked ? "border-jmv-blue bg-jmv-blue text-white" : "border-slate-400"
                      )}
                      aria-hidden="true"
                    >
                      {checked ? <Check className="h-4 w-4" strokeWidth={3} /> : null}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* 2. Texto */}
          <fieldset className="space-y-4">
            <legend className="mb-3 text-base font-semibold text-gray-900">2. Cuéntanos</legend>
            <div>
              <label htmlFor={`${ids}-title`} className="mb-1 block text-sm font-semibold text-gray-800">
                Título *
              </label>
              <input
                id={`${ids}-title`}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={MAX_TITLE}
                placeholder={typePost === "moments" ? "Ej.: Misión de Semana Santa en Esmeraldas" : "Ej.: Guía para preparar un retiro"}
                aria-invalid={errors.title ? true : undefined}
                aria-describedby={describedBy("title")}
                className={cn(fieldClass(!!errors.title), "min-h-12")}
              />
              {errors.title ? (
                <p id={`${ids}-title-error`} className="mt-1 text-sm text-red-700">
                  {errors.title}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor={`${ids}-content`} className="mb-1 block text-sm font-semibold text-gray-800">
                {typePost === "moments" ? "¿Qué viviste? *" : "¿De qué trata este recurso? *"}
              </label>
              <p id={`${ids}-content-hint`} className="mb-2 text-sm text-gray-600">
                {typePost === "moments"
                  ? "Te puede ayudar pensar: ¿qué vi?, ¿qué sentí?, ¿a qué me compromete?"
                  : "Cuenta para quién es útil y cómo se usa."}
              </p>
              <textarea
                id={`${ids}-content`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                maxLength={MAX_CONTENT}
                aria-invalid={errors.content ? true : undefined}
                aria-describedby={describedBy("content", `${ids}-content-hint ${ids}-content-count`)}
                className={cn(fieldClass(!!errors.content), "resize-y py-3")}
              />
              <div className="mt-1 flex items-start justify-between gap-3">
                {errors.content ? (
                  <p id={`${ids}-content-error`} className="text-sm text-red-700">
                    {errors.content}
                  </p>
                ) : (
                  <span />
                )}
                <p id={`${ids}-content-count`} className="shrink-0 text-sm text-gray-600">
                  {content.length}/{MAX_CONTENT}
                </p>
              </div>
            </div>
          </fieldset>

          {/* 3. Clasificación */}
          <fieldset className="space-y-4">
            <legend className="mb-3 text-base font-semibold text-gray-900">
              3. ¿Dónde y en qué actividad?
            </legend>
            <div>
              <label htmlFor={`${ids}-scope`} className="mb-1 block text-sm font-semibold text-gray-800">
                Alcance *
              </label>
              <select
                id={`${ids}-scope`}
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                aria-invalid={errors.scope ? true : undefined}
                aria-describedby={describedBy("scope")}
                className={cn(fieldClass(!!errors.scope), "min-h-12")}
              >
                <option value="">Elige una opción</option>
                {scopes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {errors.scope ? (
                <p id={`${ids}-scope-error`} className="mt-1 text-sm text-red-700">
                  {errors.scope}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor={`${ids}-activityType`} className="mb-1 block text-sm font-semibold text-gray-800">
                Tipo de actividad *
              </label>
              <select
                id={`${ids}-activityType`}
                value={activityType}
                onChange={(e) => {
                  setActivityType(e.target.value);
                  setSubtype("");
                }}
                aria-invalid={errors.activityType ? true : undefined}
                aria-describedby={describedBy("activityType")}
                className={cn(fieldClass(!!errors.activityType), "min-h-12")}
              >
                <option value="">Elige una opción</option>
                {activityTypes.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              {errors.activityType ? (
                <p id={`${ids}-activityType-error`} className="mt-1 text-sm text-red-700">
                  {errors.activityType}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor={`${ids}-subtype`} className="mb-1 block text-sm font-semibold text-gray-800">
                Subtipo (opcional)
              </label>
              <select
                id={`${ids}-subtype`}
                value={subtype}
                onChange={(e) => setSubtype(e.target.value)}
                disabled={!activityType || subtypesLoading || subtypes.length === 0}
                aria-describedby={`${ids}-subtype-hint`}
                className={cn(fieldClass(false), "min-h-12 disabled:bg-slate-100 disabled:text-gray-500")}
              >
                <option value="">Sin subtipo</option>
                {subtypes.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name}
                  </option>
                ))}
              </select>
              <p id={`${ids}-subtype-hint`} className="mt-1 text-sm text-gray-600">
                {!activityType
                  ? "Se activa cuando eliges el tipo de actividad."
                  : subtypesLoading
                    ? "Cargando subtipos…"
                    : subtypes.length === 0
                      ? "Esta actividad no tiene subtipos."
                      : "Precisa la actividad si quieres."}
              </p>
            </div>
          </fieldset>

          {/* 4. Fotos */}
          <fieldset>
            <legend className="mb-1 text-base font-semibold text-gray-900">
              4. Fotos {typePost === "moments" ? "(recomendadas)" : "(opcionales)"}
            </legend>
            <p id={`${ids}-files-hint`} className="mb-3 text-sm text-gray-600">
              Hasta {MAX_FILES} fotos JPG, PNG, WebP o GIF de máximo {MAX_FILE_MB} MB cada una.
              Llevas {attachments.length} de {MAX_FILES}.
            </p>

            <label
              className={cn(
                buttonVariants({ variant: "outline", size: "sm", className: "cursor-pointer gap-2" }),
                "has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-(color:--focus-ring) has-[input:focus-visible]:outline-solid",
                attachments.length >= MAX_FILES && "pointer-events-none opacity-50"
              )}
            >
              <ImagePlus className="h-5 w-5" aria-hidden="true" />
              Agregar fotos
              <input
                type="file"
                accept={ALLOWED_TYPES.join(",")}
                multiple
                disabled={attachments.length >= MAX_FILES}
                aria-describedby={`${ids}-files-hint${fileError ? ` ${ids}-files-error` : ""}`}
                onChange={(e) => {
                  handleFiles(e.target.files);
                  e.target.value = "";
                }}
                className="sr-only"
              />
            </label>

            {fileError ? (
              <p id={`${ids}-files-error`} role="alert" className="mt-2 text-sm text-red-700">
                {fileError}
              </p>
            ) : null}

            {attachments.length ? (
              <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4" aria-label="Fotos elegidas">
                {attachments.map((a, index) => (
                  <li key={a.key} className="relative aspect-square overflow-hidden rounded-lg border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.url} alt={`Foto ${index + 1}: ${a.file.name}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeAttachment(a.key)}
                      aria-label={`Quitar foto ${index + 1} (${a.file.name})`}
                      className="absolute top-1 right-1 inline-flex h-11 w-11 items-center justify-center rounded-full bg-jmv-ink/80 text-white hover:bg-red-700"
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </fieldset>
        </form>
      </Modal>

      <AlertDialog.Root open={confirmDiscard} onOpenChange={setConfirmDiscard}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-[70] bg-black/50" />
          <AlertDialog.Content
            data-surface="light"
            className="fixed top-1/2 left-1/2 z-[70] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-jmv-lg"
          >
            <AlertDialog.Title className="text-lg font-bold text-gray-900">
              ¿Descartar la publicación?
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-gray-700">
              Se perderá lo que escribiste y las fotos que elegiste.
            </AlertDialog.Description>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <AlertDialog.Cancel className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Seguir editando
              </AlertDialog.Cancel>
              <AlertDialog.Action
                onClick={discard}
                className={buttonVariants({ variant: "destructive", size: "sm" })}
              >
                Descartar
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
}
