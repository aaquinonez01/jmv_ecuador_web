"use client";

import { useCallback, useEffect, useState } from "react";
import { Flame, Pencil, Plus, Trash2 } from "lucide-react";
import { createPrayerAPI, deletePrayerAPI, formationErrorMessage, getPrayersAPI, updatePrayerAPI } from "@/actions/formation";
import Button from "@/components/admin/ui/Button";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import InputField from "@/components/admin/ui/InputField";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import Modal from "@/components/admin/ui/Modal";
import SelectField from "@/components/admin/ui/SelectField";
import TextareaField from "@/components/admin/ui/TextareaField";
import PageHeader, { PageBody } from "@/components/admin/layout/PageHeader";
import { PRAYER_CATEGORIES, type Prayer, type PrayerPayload } from "@/types/formation";
import { PublishedBadge, useToastRef } from "./shared";

const empty = (): PrayerPayload => ({ title: "", category: "JMV", text: "", source: "", displayOrder: 0, published: true });

// Oraciones de la pestaña "Orar" de la app
export default function PrayersManager() {
  const toast = useToastRef();
  const [items, setItems] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ id?: string; form: PrayerPayload } | null>(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Prayer | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await getPrayersAPI());
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudieron cargar las oraciones."));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    const f = editing.form;
    if (!f.title.trim() || !f.text.trim()) return toast.current.error("El título y el texto son obligatorios.");
    setSaving(true);
    try {
      const payload = { ...f, displayOrder: Number(f.displayOrder) || 0, source: f.source?.trim() || undefined };
      if (editing.id) await updatePrayerAPI(editing.id, payload);
      else await createPrayerAPI(payload);
      toast.current.success("Oración guardada.");
      setEditing(null);
      await load();
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudo guardar."));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deletePrayerAPI(toDelete.id);
      toast.current.success("Oración eliminada.");
      setToDelete(null);
      await load();
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudo eliminar."));
    } finally {
      setDeleting(false);
    }
  };

  const setF = <K extends keyof PrayerPayload>(k: K, v: PrayerPayload[K]) =>
    setEditing((e) => (e ? { ...e, form: { ...e.form, [k]: v } } : e));

  return (
    <>
      <PageHeader
        title="Oraciones"
        description="Las oraciones de la pestaña Orar de la app. Cada día la app destaca una distinta."
        icon={<Flame className="h-5 w-5" />}
        breadcrumbs={[{ label: "Oraciones" }]}
        actions={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setEditing({ form: empty() })}>Nueva oración</Button>}
      />
      <PageBody>

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner /></div>
      ) : (
        PRAYER_CATEGORIES.map((c) => {
          const list = items.filter((p) => p.category === c);
          return (
            <section key={c} className="rounded-xl border border-slate-200 bg-white">
              <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                <h2 className="font-semibold text-slate-900">{c === "JMV" ? "De JMV" : c}</h2>
                <span className="text-sm text-slate-500">{list.length}</span>
              </header>
              {list.length === 0 ? (
                <p className="px-5 py-4 text-sm text-slate-500">Sin oraciones en esta categoría.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {list.map((p) => (
                    <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 sm:px-5 py-3">
                      <div className="min-w-0 flex-1 max-sm:basis-full">
                        <p className="font-medium text-slate-900">{p.title}</p>
                        <p className="truncate text-xs text-slate-500">{p.source || p.text.slice(0, 90)}</p>
                      </div>
                      <PublishedBadge published={p.published} />
                      <Button size="sm" variant="outline" icon={<Pencil className="h-4 w-4" />} onClick={() => setEditing({ id: p.id, form: { title: p.title, category: p.category, text: p.text, source: p.source ?? "", displayOrder: p.displayOrder, published: p.published } })}>
                        Editar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setToDelete(p)} aria-label={`Eliminar ${p.title}`} icon={<Trash2 className="h-4 w-4 text-red-600" />} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })
      )}

      <Modal isOpen={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? "Editar oración" : "Nueva oración"} size="lg">
        {editing && (
          <div className="space-y-4 px-5 pb-5">
            <InputField label="Título" required value={editing.form.title} onChange={(e) => setF("title", e.target.value)} />
            <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
              <SelectField label="Categoría" value={editing.form.category} onChange={(e) => setF("category", e.target.value as PrayerPayload["category"])} options={PRAYER_CATEGORIES.map((c) => ({ id: c, name: c === "JMV" ? "De JMV" : c }))} />
              <InputField label="Orden" type="number" value={String(editing.form.displayOrder ?? 0)} onChange={(e) => setF("displayOrder", Number(e.target.value))} />
            </div>
            <TextareaField label="Texto" rows={12} required value={editing.form.text} onChange={(e) => setF("text", e.target.value)} hint="Deja una línea en blanco entre párrafos." />
            <InputField label="Fuente" value={editing.form.source ?? ""} onChange={(e) => setF("source", e.target.value)} placeholder="Ej.: Manual de JMV, p. 146" />
            <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
              <input type="checkbox" className="h-4 w-4" checked={Boolean(editing.form.published)} onChange={(e) => setF("published", e.target.checked)} />
              Publicada en la app
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button onClick={save} isLoading={saving}>Guardar</Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        title="Eliminar oración"
        message={`Se eliminará "${toDelete?.title ?? ""}". No se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
        isLoading={deleting}
      />
      </PageBody>
    </>
  );
}
