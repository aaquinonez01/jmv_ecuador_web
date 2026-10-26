"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CheckCircle2, CircleAlert, ImagePlus, Loader2, X } from "lucide-react";
import Modal from "@/components/admin/ui/Modal";
import Button from "@/components/admin/ui/Button";
import { useToast } from "@/lib/hooks/useToast";
import { siteImagesErrorMessage, uploadSiteImageAPI } from "@/actions/site-images";
import type { SiteImageSlot } from "@/lib/site-images";
import { ALT_MAX, ALT_MIN, ASPECT_HINT, MAX_FILE_BYTES, ACCEPTED_TYPES } from "./shared";

interface Entry {
  key: string;
  file: File;
  preview: string;
  alt: string;
  error?: string;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
  uploadError?: string;
}

interface UploadModalProps {
  slotId: string;
  slot: SiteImageSlot;
  /** Cuántas fotos caben todavía */
  remaining: number;
  isOpen: boolean;
  onClose: () => void;
  /** Se llama tras subir al menos una foto */
  onUploaded: () => void;
}

const formatSize = (bytes: number) =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;

export default function UploadModal({ slotId, slot, remaining, isOpen, onClose, onUploaded }: UploadModalProps) {
  const toast = useToast();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Limpia al cerrar y libera las vistas previas
  useEffect(() => {
    if (isOpen) return;
    setEntries((current) => {
      current.forEach((e) => URL.revokeObjectURL(e.preview));
      return [];
    });
    setNotice(null);
    setDragging(false);
  }, [isOpen]);

  const pending = entries.filter((e) => e.status !== "done");
  const free = remaining - pending.length;

  const addFiles = (list: FileList | File[]) => {
    const files = Array.from(list);
    const problems: string[] = [];
    const accepted: Entry[] = [];
    for (const file of files) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        problems.push(`«${file.name}» no es una imagen JPG, PNG, WebP o GIF.`);
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        problems.push(`«${file.name}» pesa ${formatSize(file.size)} (máximo 10 MB).`);
        continue;
      }
      if (accepted.length >= free) {
        problems.push(
          remaining === 1
            ? "Este espacio admite una sola foto."
            : `Solo caben ${remaining} foto(s) más en este espacio; se tomaron las primeras.`,
        );
        break;
      }
      accepted.push({
        key: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        preview: URL.createObjectURL(file),
        alt: "",
        status: "pending",
        progress: 0,
      });
    }
    setNotice(problems.length ? problems.join(" ") : null);
    if (accepted.length) setEntries((current) => [...current, ...accepted]);
  };

  const updateEntry = (key: string, changes: Partial<Entry>) =>
    setEntries((current) => current.map((e) => (e.key === key ? { ...e, ...changes } : e)));

  const removeEntry = (key: string) =>
    setEntries((current) => {
      const found = current.find((e) => e.key === key);
      if (found) URL.revokeObjectURL(found.preview);
      return current.filter((e) => e.key !== key);
    });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const toUpload = entries.filter((e) => e.status !== "done");
    if (toUpload.length === 0) {
      setNotice("Elige al menos una foto.");
      return;
    }
    let invalid = false;
    const checked = entries.map((e) => {
      if (e.status === "done") return e;
      const alt = e.alt.trim();
      const error =
        alt.length < ALT_MIN
          ? "Describe la foto (al menos 3 caracteres)."
          : alt.length > ALT_MAX
            ? `Máximo ${ALT_MAX} caracteres.`
            : undefined;
      if (error) invalid = true;
      return { ...e, error };
    });
    setEntries(checked);
    if (invalid) {
      toast.error("Falta el texto alternativo de alguna foto.");
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }

    setSubmitting(true);
    let ok = 0;
    let failed = 0;
    // Una por una: en datos móviles es más fiable y se ve el progreso de cada foto
    for (const entry of checked) {
      if (entry.status === "done") continue;
      updateEntry(entry.key, { status: "uploading", progress: 0, uploadError: undefined });
      try {
        await uploadSiteImageAPI(slotId, entry.file, entry.alt.trim(), (progress) =>
          updateEntry(entry.key, { progress }),
        );
        updateEntry(entry.key, { status: "done", progress: 1 });
        ok += 1;
      } catch (error) {
        updateEntry(entry.key, {
          status: "error",
          uploadError: siteImagesErrorMessage(error, "No se pudo subir esta foto."),
        });
        failed += 1;
      }
    }
    setSubmitting(false);
    if (ok > 0) onUploaded();
    if (failed === 0) {
      toast.success(ok === 1 ? "Se subió la foto. La página se actualiza en unos segundos." : `Se subieron ${ok} fotos. La página se actualiza en unos segundos.`);
      onClose();
    } else {
      toast.error(ok > 0 ? `Se subieron ${ok}, pero ${failed} fallaron. Revisa el mensaje de cada una.` : "No se pudo subir. Revisa el mensaje de cada foto.");
    }
  };

  const multiple = remaining > 1;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !submitting && onClose()}
      title={`Subir ${multiple ? "fotos" : "foto"} · ${slot.label}`}
      description={`${ASPECT_HINT[slot.aspect]}. ${multiple ? `Puedes subir hasta ${remaining} más.` : "Admite una foto."}`}
      size="lg"
    >
      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        <div className="space-y-4 p-5 sm:p-6">
          {free > 0 && (
            <label
              htmlFor={inputId}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
              }}
              className={`flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-jmv-blue/40 ${
                dragging ? "border-jmv-blue bg-blue-50" : "border-slate-300 bg-slate-50 hover:border-jmv-blue/60"
              }`}
            >
              <ImagePlus className="h-8 w-8 text-jmv-blue" aria-hidden />
              <span className="text-sm font-semibold text-slate-800">
                {multiple ? "Elige fotos o arrástralas aquí" : "Elige una foto o arrástrala aquí"}
              </span>
              <span className="text-xs text-slate-600">JPG, PNG, WebP o GIF · hasta 10 MB cada una</span>
              <input
                id={inputId}
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                multiple={multiple}
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files?.length) addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          )}

          {notice && (
            <p role="alert" className="flex items-start gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
              <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              {notice}
            </p>
          )}

          {entries.length > 0 && (
            <ul className="space-y-3">
              {entries.map((entry, i) => {
                const altId = `${inputId}-alt-${i}`;
                const errId = `${altId}-err`;
                const hintId = `${altId}-hint`;
                return (
                  <li key={entry.key} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-3 sm:flex-row">
                    <div className="relative mx-auto aspect-[4/3] w-full max-w-44 shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:mx-0 sm:w-40">
                      {/* eslint-disable-next-line @next/next/no-img-element -- vista previa local (blob:) */}
                      <img src={entry.preview} alt="" className="h-full w-full object-cover" />
                      {entry.status === "uploading" && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-slate-900/55 text-xs font-semibold text-white">
                          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                          {Math.round(entry.progress * 100)}%
                        </div>
                      )}
                      {entry.status === "done" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-emerald-900/55 text-white">
                          <CheckCircle2 className="h-7 w-7" aria-hidden />
                          <span className="sr-only">Subida</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <label htmlFor={altId} className="text-[13px] font-semibold text-slate-700">
                          Texto alternativo<span className="ml-0.5 text-red-600" aria-hidden>*</span>
                          <span className="sr-only"> (obligatorio) de {entry.file.name}</span>
                        </label>
                        {entry.status !== "done" && !submitting && (
                          <button
                            type="button"
                            onClick={() => removeEntry(entry.key)}
                            className="-mr-1 -mt-1 inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-700 sm:h-8 sm:w-8"
                            aria-label={`Quitar ${entry.file.name}`}
                          >
                            <X className="h-4 w-4" aria-hidden />
                          </button>
                        )}
                      </div>
                      <textarea
                        id={altId}
                        rows={2}
                        value={entry.alt}
                        disabled={entry.status === "done" || submitting}
                        onChange={(e) => updateEntry(entry.key, { alt: e.target.value, error: undefined })}
                        maxLength={ALT_MAX}
                        placeholder="Ej. Jóvenes de JMV Quito rezando el rosario en la gruta"
                        aria-invalid={Boolean(entry.error)}
                        aria-describedby={[entry.error ? errId : null, hintId].filter(Boolean).join(" ")}
                        className="block w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-jmv-blue focus:outline-none focus:ring-2 focus:ring-jmv-blue/30 aria-[invalid=true]:border-red-500 disabled:bg-slate-50"
                      />
                      {entry.error && (
                        <p id={errId} className="mt-1 flex items-center gap-1 text-xs font-medium text-red-700">
                          <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden />
                          {entry.error}
                        </p>
                      )}
                      <p id={hintId} className="mt-1 text-xs text-slate-500">
                        Qué se ve en la foto, para quien no puede verla. {entry.file.name} · {formatSize(entry.file.size)}
                      </p>
                      {entry.uploadError && (
                        <p role="alert" className="mt-1 text-xs font-medium text-red-700">
                          {entry.uploadError}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-slate-100 bg-white/95 px-5 py-3 backdrop-blur sm:flex-row sm:justify-end sm:px-6">
          <Button type="button" variant="ghost" className="min-h-11 sm:min-h-9" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" className="min-h-11 sm:min-h-9" isLoading={submitting} disabled={pending.length === 0}>
            {pending.length > 1 ? `Subir ${pending.length} fotos` : "Subir foto"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
