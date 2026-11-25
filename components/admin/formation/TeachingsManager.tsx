"use client";

import { useCallback, useEffect, useState } from "react";
import { Lightbulb, Pencil, Plus, Trash2 } from "lucide-react";
import { createTeachingAPI, deleteTeachingAPI, formationErrorMessage, getTeachingsAPI, updateTeachingAPI } from "@/actions/formation";
import Button from "@/components/admin/ui/Button";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import InputField from "@/components/admin/ui/InputField";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import Modal from "@/components/admin/ui/Modal";
import SelectField from "@/components/admin/ui/SelectField";
import TextareaField from "@/components/admin/ui/TextareaField";
import PageHeader, { PageBody } from "@/components/admin/layout/PageHeader";
import { TEACHING_GUIDES, type Teaching, type TeachingPayload, type TeachingStep } from "@/types/formation";
import { PublishedBadge, RowTools, move, useToastRef } from "./shared";

const empty = (): TeachingPayload => ({ title: "", summary: "", needs: [], steps: [], groupSteps: [], source: "", guide: "pasos", icon: "", displayOrder: 0, published: true });

/** Lista de pasos (título y texto) que se puede ordenar */
function StepsEditor({ label, hint, steps, onChange }: { label: string; hint: string; steps: TeachingStep[]; onChange: (s: TeachingStep[]) => void }) {
  const set = (i: number, p: Partial<TeachingStep>) => onChange(steps.map((s, j) => (j === i ? { ...s, ...p } : s)));
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">
            {label} ({steps.length})
          </p>
          <p className="text-xs text-slate-500">{hint}</p>
        </div>
        <Button size="sm" variant="outline" icon={<Plus className="h-4 w-4" />} onClick={() => onChange([...steps, { title: "", text: "" }])} disabled={steps.length >= 40}>
          Agregar paso
        </Button>
      </div>
      {steps.map((s, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-slate-200 p-3">
          <div className="flex items-start gap-2">
            <span className="mt-2 w-5 text-sm font-bold text-slate-400">{i + 1}.</span>
            <InputField className="flex-1" value={s.title} onChange={(e) => set(i, { title: e.target.value })} placeholder="Título del paso" />
            <RowTools i={i} total={steps.length} onMove={(d) => onChange(move(steps, i, d))} onRemove={() => onChange(steps.filter((_, j) => j !== i))} label="paso" />
          </div>
          <div className="pl-7">
            <TextareaField rows={4} value={s.text} onChange={(e) => set(i, { text: e.target.value })} placeholder="Explicación (opcional). Deja una línea en blanco entre párrafos." />
          </div>
        </div>
      ))}
    </div>
  );
}

// Enseñanzas de "¿Qué quieres aprender hoy?" en la app
export default function TeachingsManager() {
  const toast = useToastRef();
  const [items, setItems] = useState<Teaching[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ id?: string; form: TeachingPayload } | null>(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Teaching | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await getTeachingsAPI());
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudieron cargar las enseñanzas."));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!editing) return;
    const f = editing.form;
    if (f.title.trim().length < 3) return toast.current.error("Escribe el título.");
    if (f.summary.trim().length < 10) return toast.current.error("Explica en pocas líneas qué es.");
    const clean = (list: TeachingStep[]) => list.filter((s) => s.title.trim());
    setSaving(true);
    try {
      const payload: TeachingPayload = {
        ...f,
        needs: f.needs.map((n) => n.trim()).filter(Boolean),
        steps: clean(f.steps),
        groupSteps: clean(f.groupSteps),
        source: f.source?.trim() || undefined,
        icon: f.icon?.trim() || undefined,
        displayOrder: Number(f.displayOrder) || 0,
      };
      if (editing.id) await updateTeachingAPI(editing.id, payload);
      else await createTeachingAPI(payload);
      toast.current.success("Enseñanza guardada.");
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
      await deleteTeachingAPI(toDelete.id);
      toast.current.success("Enseñanza eliminada.");
      setToDelete(null);
      await load();
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudo eliminar."));
    } finally {
      setDeleting(false);
    }
  };

  const setF = <K extends keyof TeachingPayload>(k: K, v: TeachingPayload[K]) => setEditing((e) => (e ? { ...e, form: { ...e.form, [k]: v } } : e));

  return (
    <>
      <PageHeader
        title="Enseñanzas"
        description='"¿Qué quieres aprender hoy?" en la app: guías paso a paso, como rezar el rosario o hacer lectio divina.'
        icon={<Lightbulb className="h-5 w-5" />}
        breadcrumbs={[{ label: "Enseñanzas" }]}
        actions={
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setEditing({ form: empty() })}>
            Nueva enseñanza
          </Button>
        }
      />
      <PageBody>
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
            <Lightbulb className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
            <p className="mt-3 font-semibold text-slate-900">Todavía no hay enseñanzas</p>
            <p className="mt-1 text-sm text-slate-500">Agrega la primera con el botón Nueva enseñanza.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <div className="min-w-0 flex-1 max-sm:basis-full">
                  <p className="font-semibold text-slate-900">{t.title}</p>
                  <p className="truncate text-xs text-slate-500">
                    {t.steps.length} pasos · {t.groupSteps.length} en grupo · {TEACHING_GUIDES.find((g) => g.id === t.guide)?.name}
                  </p>
                </div>
                <PublishedBadge published={t.published} />
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Pencil className="h-4 w-4" />}
                  onClick={() =>
                    setEditing({
                      id: t.id,
                      form: { title: t.title, summary: t.summary, needs: t.needs, steps: t.steps, groupSteps: t.groupSteps, source: t.source ?? "", guide: t.guide, icon: t.icon ?? "", displayOrder: t.displayOrder, published: t.published },
                    })
                  }
                >
                  Editar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setToDelete(t)} aria-label={`Eliminar ${t.title}`} icon={<Trash2 className="h-4 w-4 text-red-600" />} />
              </li>
            ))}
          </ul>
        )}

        <Modal isOpen={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? "Editar enseñanza" : "Nueva enseñanza"} size="xl">
          {editing && (
            <div className="space-y-5 px-5 pb-5">
              <InputField label="Título" required value={editing.form.title} onChange={(e) => setF("title", e.target.value)} placeholder="Ej. Cómo rezar el Santo Rosario" />
              <TextareaField label="Qué es" required rows={4} value={editing.form.summary} onChange={(e) => setF("summary", e.target.value)} hint="Pocas líneas. Es lo primero que lee el joven." />
              <TextareaField
                label="Qué se necesita"
                rows={3}
                value={editing.form.needs.join("\n")}
                onChange={(e) => setF("needs", e.target.value.split("\n"))}
                hint="Una cosa por línea. Ej.: Un rosario / Una Biblia / Diez minutos."
              />
              <StepsEditor label="Los pasos" hint="Con «Paso a paso», cada uno sale en una pantalla al tocar Hazlo ahora." steps={editing.form.steps} onChange={(s) => setF("steps", s)} />
              <StepsEditor label="Para hacerlo en grupo" hint="Sugerencias para el animador (opcional)." steps={editing.form.groupSteps} onChange={(s) => setF("groupSteps", s)} />
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Hazlo ahora"
                  value={editing.form.guide}
                  onChange={(e) => setF("guide", e.target.value as TeachingPayload["guide"])}
                  options={TEACHING_GUIDES.map((g) => ({ id: g.id, name: g.name }))}
                />
                <InputField label="Fuente" value={editing.form.source ?? ""} onChange={(e) => setF("source", e.target.value)} placeholder="Ej. Manual de JMV, pp. 83-84" />
                <InputField label="Icono" value={editing.form.icon ?? ""} onChange={(e) => setF("icon", e.target.value)} placeholder="Ej. rose, book, flame" hint="Nombre de un icono de Ionicons (opcional)." />
                <InputField label="Orden" type="number" value={String(editing.form.displayOrder ?? 0)} onChange={(e) => setF("displayOrder", Number(e.target.value))} />
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <input type="checkbox" className="h-4 w-4" checked={Boolean(editing.form.published)} onChange={(e) => setF("published", e.target.checked)} />
                Publicada en la app
              </label>
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
          title="Eliminar enseñanza"
          message={`Se eliminará "${toDelete?.title ?? ""}". No se puede deshacer.`}
          confirmText="Eliminar"
          variant="danger"
          isLoading={deleting}
        />
      </PageBody>
    </>
  );
}
