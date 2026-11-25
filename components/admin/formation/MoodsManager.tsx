"use client";

import { useCallback, useEffect, useState } from "react";
import { HeartPulse, Pencil, Plus, Trash2 } from "lucide-react";
import { createMoodAPI, deleteMoodAPI, formationErrorMessage, getMoodsAPI, updateMoodAPI } from "@/actions/formation";
import Button from "@/components/admin/ui/Button";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import InputField from "@/components/admin/ui/InputField";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import Modal from "@/components/admin/ui/Modal";
import TextareaField from "@/components/admin/ui/TextareaField";
import PageHeader, { PageBody } from "@/components/admin/layout/PageHeader";
import type { Mood, MoodPayload } from "@/types/formation";
import { PublishedBadge, useToastRef } from "./shared";

const empty = (): MoodPayload => ({ name: "", icon: "", word: "", reference: "", prayer: "", displayOrder: 0, published: true });

// "¿Cómo estás hoy?" en la pestaña Orar de la app: una palabra para cada estado de ánimo
export default function MoodsManager() {
  const toast = useToastRef();
  const [items, setItems] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ id?: string; form: MoodPayload } | null>(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Mood | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await getMoodsAPI());
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudo cargar la lista."));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const setF = <K extends keyof MoodPayload>(k: K, v: MoodPayload[K]) => setEditing((e) => (e ? { ...e, form: { ...e.form, [k]: v } } : e));

  const save = async () => {
    if (!editing) return;
    const f = editing.form;
    if (f.name.trim().length < 2) return toast.current.error("Escribe el estado (por ejemplo, Triste).");
    if (f.word.trim().length < 5) return toast.current.error("Escribe la palabra o cita.");
    if (!f.reference.trim()) return toast.current.error("Anota de dónde es la cita.");
    setSaving(true);
    try {
      const payload: MoodPayload = { ...f, icon: f.icon?.trim() || undefined, prayer: f.prayer?.trim() || undefined, displayOrder: Number(f.displayOrder) || 0 };
      if (editing.id) await updateMoodAPI(editing.id, payload);
      else await createMoodAPI(payload);
      toast.current.success("Guardado.");
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
      await deleteMoodAPI(toDelete.id);
      toast.current.success("Eliminado.");
      setToDelete(null);
      await load();
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudo eliminar."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="¿Cómo estás hoy?"
        description="En la pestaña Orar, el joven elige cómo se siente y recibe una palabra de la Biblia para ese momento. No reemplaza el acompañamiento: la app le recuerda hablar con su asesor."
        icon={<HeartPulse className="h-5 w-5" />}
        breadcrumbs={[{ label: "¿Cómo estás hoy?" }]}
        actions={
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setEditing({ form: empty() })}>
            Nuevo estado
          </Button>
        }
      />
      <PageBody>
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">Todavía no hay estados.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <div className="min-w-0 flex-1 max-sm:basis-full">
                  <p className="font-semibold text-slate-900">{m.name}</p>
                  <p className="truncate text-sm text-slate-600">{m.word}</p>
                  <p className="text-xs text-slate-500">
                    {m.reference}
                    {m.prayer ? " · con oración" : ""}
                  </p>
                </div>
                <PublishedBadge published={m.published} />
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Pencil className="h-4 w-4" />}
                  onClick={() => setEditing({ id: m.id, form: { name: m.name, icon: m.icon ?? "", word: m.word, reference: m.reference, prayer: m.prayer ?? "", displayOrder: m.displayOrder, published: m.published } })}
                >
                  Editar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setToDelete(m)} aria-label={`Eliminar ${m.name}`} icon={<Trash2 className="h-4 w-4 text-red-600" />} />
              </li>
            ))}
          </ul>
        )}

        <Modal isOpen={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? "Editar estado" : "Nuevo estado"} size="lg">
          {editing && (
            <div className="space-y-4 px-5 pb-5">
              <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
                <InputField label="Cómo se siente" required value={editing.form.name} onChange={(e) => setF("name", e.target.value)} placeholder="Ej. Triste, Con miedo, Agradecido" />
                <InputField label="Icono" value={editing.form.icon ?? ""} onChange={(e) => setF("icon", e.target.value)} placeholder="Ej. rainy, heart, sunny" hint="Nombre de Ionicons (opcional)." />
              </div>
              <TextareaField label="La palabra" required rows={4} value={editing.form.word} onChange={(e) => setF("word", e.target.value)} hint="Un versículo o cita corta, copiada tal cual." />
              <InputField label="Referencia" required value={editing.form.reference} onChange={(e) => setF("reference", e.target.value)} placeholder="Ej. Salmo 34, 19" />
              <TextareaField label="Oración breve (opcional)" rows={4} value={editing.form.prayer ?? ""} onChange={(e) => setF("prayer", e.target.value)} />
              <div className="grid gap-4 sm:grid-cols-[140px_1fr] sm:items-end">
                <InputField label="Orden" type="number" value={String(editing.form.displayOrder ?? 0)} onChange={(e) => setF("displayOrder", Number(e.target.value))} />
                <label className="flex items-center gap-2 pb-2 text-sm font-medium text-slate-800">
                  <input type="checkbox" className="h-4 w-4" checked={Boolean(editing.form.published)} onChange={(e) => setF("published", e.target.checked)} />
                  Visible en la app
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setEditing(null)}>
                  Cancelar
                </Button>
                <Button onClick={save} isLoading={saving}>
                  Guardar
                </Button>
              </div>
            </div>
          )}
        </Modal>

        <ConfirmDialog
          isOpen={Boolean(toDelete)}
          onClose={() => setToDelete(null)}
          onConfirm={confirmDelete}
          title="Eliminar estado"
          message={`Se eliminará "${toDelete?.name ?? ""}". No se puede deshacer.`}
          confirmText="Eliminar"
          variant="danger"
          isLoading={deleting}
        />
      </PageBody>
    </>
  );
}
