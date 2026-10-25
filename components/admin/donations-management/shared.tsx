"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ImagePlus, X } from "lucide-react";
import Button from "@/components/admin/ui/Button";
import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import { iconButton } from "@/components/admin/library-management/formParts";

export {
  Field,
  FormSection,
  ToggleCard,
  inputClass,
  iconButton,
  toggleButton,
  SLUG_PATTERN,
} from "@/components/admin/library-management/formParts";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const URL_PATTERN = /^https:\/\/\S+$/;

/** Reordena localmente y devuelve los elementos cuyo displayOrder cambió */
export function moveItem<T extends { id: string; displayOrder: number }>(
  list: T[],
  index: number,
  direction: -1 | 1
): { next: T[]; changed: T[] } {
  const target = index + direction;
  if (target < 0 || target >= list.length) return { next: list, changed: [] };
  const swapped = [...list];
  [swapped[index], swapped[target]] = [swapped[target], swapped[index]];
  const next = swapped.map((item, i) => ({ ...item, displayOrder: i }));
  const changed = next.filter((item) => list.find((o) => o.id === item.id)?.displayOrder !== item.displayOrder);
  return { next, changed };
}

/** Botones subir/bajar (alternativa accesible al arrastre) */
export function OrderButtons({
  index,
  total,
  label,
  disabled,
  onMove,
}: {
  index: number;
  total: number;
  label: string;
  disabled?: boolean;
  onMove: (direction: -1 | 1) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onMove(-1)}
        disabled={disabled || index === 0}
        className={`${iconButton} text-slate-600 hover:bg-slate-100 hover:text-jmv-blue`}
        aria-label={`Subir ${label}`}
        title="Subir"
      >
        <ArrowUp className="h-4 w-4" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => onMove(1)}
        disabled={disabled || index === total - 1}
        className={`${iconButton} text-slate-600 hover:bg-slate-100 hover:text-jmv-blue`}
        aria-label={`Bajar ${label}`}
        title="Bajar"
      >
        <ArrowDown className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

/** Selector de imagen con vista previa: archivo nuevo, imagen actual o vacío */
export function ImagePicker({
  label,
  file,
  currentUrl,
  onFile,
  onRemove,
  removed,
  hint,
  square,
}: {
  label: string;
  file: File | null;
  currentUrl?: string | null;
  onFile: (file: File | null) => void;
  onRemove: () => void;
  /** La imagen actual se quitará al guardar */
  removed?: boolean;
  hint?: ReactNode;
  square?: boolean;
}) {
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const shown = preview ?? (!removed && currentUrl ? getOptimizedUrl(currentUrl, { w: 600 }) : null);

  return (
    <div className={`grid grid-cols-1 gap-4 ${square ? "sm:grid-cols-[180px_1fr]" : "sm:grid-cols-[220px_1fr]"}`}>
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 ${
          square ? "mx-auto aspect-square w-44 sm:w-full" : "aspect-[16/10]"
        }`}
      >
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shown} alt="Vista previa" className={`h-full w-full ${square ? "object-contain p-2" : "object-cover"}`} />
        ) : (
          <span className="flex flex-col items-center gap-1 text-xs text-slate-500">
            <ImagePlus className="h-6 w-6" aria-hidden />
            Sin imagen
          </span>
        )}
      </div>
      <div className="space-y-3">
        <div>
          <label htmlFor={id} className="mb-1 block text-[13px] font-semibold text-slate-700">
            {label}
          </label>
          <input
            ref={fileRef}
            id={id}
            type="file"
            accept="image/*"
            aria-describedby={hint ? `${id}-hint` : undefined}
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-slate-600 file:mr-3 file:min-h-11 file:rounded-lg file:border-0 file:bg-jmv-blue file:px-3 file:text-xs file:font-semibold file:text-white hover:file:bg-jmv-blue-dark sm:file:min-h-10"
          />
          {hint ? (
            <p id={`${id}-hint`} className="mt-1 text-xs text-slate-500">
              {hint}
            </p>
          ) : null}
        </div>
        {file || (currentUrl && !removed) ? (
          <Button
            type="button"
            variant="outline"
            className="min-h-11 sm:min-h-9"
            icon={<X className="h-4 w-4" aria-hidden />}
            onClick={() => {
              if (fileRef.current) fileRef.current.value = "";
              if (file) onFile(null);
              else onRemove();
            }}
          >
            {file ? "Descartar archivo" : "Quitar imagen"}
          </Button>
        ) : removed ? (
          <p className="text-xs font-medium text-amber-800">La imagen actual se quitará al guardar.</p>
        ) : null}
      </div>
    </div>
  );
}

/** Estados vacío / error / carga compartidos por las pestañas */
export function ListState({
  loading,
  error,
  empty,
  emptyText,
  onRetry,
  action,
}: {
  loading: boolean;
  error: boolean;
  empty: boolean;
  emptyText: string;
  onRetry: () => void;
  action?: ReactNode;
}) {
  if (loading) {
    return (
      <div className="space-y-3" aria-hidden>
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100 motion-reduce:animate-none" />
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
        No se pudo cargar la información.
        <Button variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      </div>
    );
  }
  if (empty) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
        {emptyText}
        {action}
      </div>
    );
  }
  return null;
}
