"use client";

import { useRef, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import Button from "@/components/admin/ui/Button";
import { useToast } from "@/lib/hooks/useToast";

/** useToast devuelve un objeto nuevo en cada render: esta ref evita recargas en bucle en los efectos */
export function useToastRef() {
  const toast = useToast();
  const ref = useRef(toast);
  ref.current = toast;
  return ref;
}

export function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {hint && <p className="text-sm text-slate-500">{hint}</p>}
      </header>
      {children}
    </section>
  );
}

export function move<T>(list: T[], i: number, d: -1 | 1): T[] {
  const j = i + d;
  if (j < 0 || j >= list.length) return list;
  const copy = [...list];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
}

export function RowTools({ i, total, onMove, onRemove, label }: {
  i: number; total: number; onMove: (d: -1 | 1) => void; onRemove: () => void; label: string;
}) {
  return (
    <div className="flex gap-1">
      <Button type="button" size="xs" variant="ghost" disabled={i === 0} onClick={() => onMove(-1)} aria-label={`Subir ${label}`} icon={<ArrowUp className="h-4 w-4" />} />
      <Button type="button" size="xs" variant="ghost" disabled={i === total - 1} onClick={() => onMove(1)} aria-label={`Bajar ${label}`} icon={<ArrowDown className="h-4 w-4" />} />
      <Button type="button" size="xs" variant="ghost" onClick={onRemove} aria-label={`Quitar ${label}`} icon={<Trash2 className="h-4 w-4 text-red-600" />} />
    </div>
  );
}

export function PublishedBadge({ published }: { published: boolean }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${published ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
      {published ? "Publicado" : "Borrador"}
    </span>
  );
}
