"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Tags, Trash2 } from "lucide-react";
import { createThemeAPI, deleteThemeAPI, formationErrorMessage, getThemesAPI, updateThemeAPI } from "@/actions/formation";
import Button from "@/components/admin/ui/Button";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import InputField from "@/components/admin/ui/InputField";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import Modal from "@/components/admin/ui/Modal";
import SelectField from "@/components/admin/ui/SelectField";
import TextareaField from "@/components/admin/ui/TextareaField";
import PageHeader, { PageBody } from "@/components/admin/layout/PageHeader";
import { GAME_CATEGORY_NAMES, QUOTE_KINDS, THEME_AXES, type Theme, type ThemePayload, type ThemeQuote } from "@/types/formation";
import { PublishedBadge, RowTools, move, useToastRef } from "./shared";

const empty = (): ThemePayload => ({ slug: "", name: "", axis: "cristocentrico", gameCategory: "", summary: "", quotes: [], displayOrder: 0, published: true });

const toSlug = (t: string) =>
  t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

// Temas de formación: unen las preguntas de Gira y Aprende, los libros y las citas de "Quiero profundizar en…"
export default function ThemesManager() {
  const toast = useToastRef();
  const [items, setItems] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ id?: string; form: ThemePayload } | null>(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Theme | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await getThemesAPI());
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudieron cargar los temas."));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const setF = <K extends keyof ThemePayload>(k: K, v: ThemePayload[K]) => setEditing((e) => (e ? { ...e, form: { ...e.form, [k]: v } } : e));
  const setQ = (i: number, p: Partial<ThemeQuote>) => setEditing((e) => (e ? { ...e, form: { ...e.form, quotes: e.form.quotes.map((q, j) => (j === i ? { ...q, ...p } : q)) } } : e));

  const save = async () => {
    if (!editing) return;
    const f = editing.form;
    const slug = f.slug || toSlug(f.name);
    if (f.name.trim().length < 2) return toast.current.error("Escribe el nombre del tema.");
    if (slug.length < 2) return toast.current.error("Falta el identificador.");
    const quotes = f.quotes.filter((q) => q.text.trim());
    if (quotes.some((q) => !q.reference.trim())) return toast.current.error("Cada cita necesita su referencia (de dónde es).");
    setSaving(true);
    try {
      const payload: ThemePayload = { ...f, slug, quotes, gameCategory: f.gameCategory || undefined, summary: f.summary?.trim() || undefined, displayOrder: Number(f.displayOrder) || 0 };
      if (editing.id) await updateThemeAPI(editing.id, payload);
      else await createThemeAPI(payload);
      toast.current.success("Tema guardado.");
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
      await deleteThemeAPI(toDelete.id);
      toast.current.success("Tema eliminado.");
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
        title="Temas de formación"
        description='La lista que une todo: los libros se etiquetan con estos temas, las preguntas de Gira y Aprende los sugieren, y sus citas aparecen en "Quiero profundizar en…".'
        icon={<Tags className="h-5 w-5" />}
        breadcrumbs={[{ label: "Temas" }]}
        actions={
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setEditing({ form: empty() })}>
            Nuevo tema
          </Button>
        }
      />
      <PageBody>
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : (
          THEME_AXES.map((a) => {
            const list = items.filter((t) => t.axis === a.id);
            return (
              <section key={a.id} className="rounded-xl border border-slate-200 bg-white">
                <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                  <h2 className="font-semibold text-slate-900">Eje {a.name.toLowerCase()}</h2>
                  <span className="text-sm text-slate-500">{list.length}</span>
                </header>
                {list.length === 0 ? (
                  <p className="px-5 py-4 text-sm text-slate-500">Sin temas en este eje.</p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {list.map((t) => (
                      <li key={t.id} className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5">
                        <div className="min-w-0 flex-1 max-sm:basis-full">
                          <p className="font-medium text-slate-900">{t.name}</p>
                          <p className="truncate text-xs text-slate-500">
                            {t.quotes.length} {t.quotes.length === 1 ? "cita" : "citas"}
                            {t.gameCategory ? ` · Gira y Aprende: ${GAME_CATEGORY_NAMES[t.gameCategory] ?? t.gameCategory}` : ""}
                          </p>
                        </div>
                        {t.quotes.length === 0 && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">Sin citas</span>}
                        <PublishedBadge published={t.published} />
                        <Button
                          size="sm"
                          variant="outline"
                          icon={<Pencil className="h-4 w-4" />}
                          onClick={() =>
                            setEditing({
                              id: t.id,
                              form: { slug: t.slug, name: t.name, axis: t.axis, gameCategory: t.gameCategory ?? "", summary: t.summary ?? "", quotes: t.quotes, displayOrder: t.displayOrder, published: t.published },
                            })
                          }
                        >
                          Editar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setToDelete(t)} aria-label={`Eliminar ${t.name}`} icon={<Trash2 className="h-4 w-4 text-red-600" />} />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })
        )}

        <Modal isOpen={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? "Editar tema" : "Nuevo tema"} size="xl">
          {editing && (
            <div className="space-y-5 px-5 pb-5">
              <InputField
                label="Nombre"
                required
                value={editing.form.name}
                onChange={(e) => setEditing((x) => (x ? { ...x, form: { ...x.form, name: e.target.value, slug: x.id ? x.form.slug : toSlug(e.target.value) } } : x))}
                placeholder="Ej. La Eucaristía"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField label="Eje formativo" value={editing.form.axis} onChange={(e) => setF("axis", e.target.value as ThemePayload["axis"])} options={THEME_AXES.map((a) => ({ id: a.id, name: a.name }))} />
                <SelectField
                  label="Categoría de Gira y Aprende"
                  value={editing.form.gameCategory ?? ""}
                  onChange={(e) => setF("gameCategory", e.target.value)}
                  options={[{ id: "", name: "Ninguna" }, ...Object.entries(GAME_CATEGORY_NAMES).map(([id, name]) => ({ id, name }))]}
                />
              </div>
              <p className="-mt-3 text-xs text-slate-500">
                Si un joven falla preguntas de esa categoría en Gira y Aprende, la app le sugiere los libros de este tema.
              </p>
              <TextareaField label="De qué trata (opcional)" rows={2} value={editing.form.summary ?? ""} onChange={(e) => setF("summary", e.target.value)} hint="Una o dos líneas que el joven lee al abrir el tema." />

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Citas para profundizar ({editing.form.quotes.length})</p>
                    <p className="text-xs text-slate-500">Copia cada cita tal cual de su fuente y anota de dónde es.</p>
                  </div>
                  <Button size="sm" variant="outline" icon={<Plus className="h-4 w-4" />} onClick={() => setF("quotes", [...editing.form.quotes, { kind: "biblia", text: "", reference: "" }])}>
                    Agregar cita
                  </Button>
                </div>
                {editing.form.quotes.map((q, i) => (
                  <div key={i} className="space-y-2 rounded-lg border border-slate-200 p-3">
                    <div className="flex flex-wrap items-end gap-2">
                      <div className="min-w-44 flex-1">
                        <SelectField label="De dónde es" value={q.kind} onChange={(e) => setQ(i, { kind: e.target.value as ThemeQuote["kind"] })} options={QUOTE_KINDS.map((k) => ({ id: k.id, name: k.name }))} />
                      </div>
                      <InputField className="min-w-44 flex-1" label="Referencia" value={q.reference} onChange={(e) => setQ(i, { reference: e.target.value })} placeholder="Ej. Jn 6,35 · Catecismo 1324" />
                      <RowTools
                        i={i}
                        total={editing.form.quotes.length}
                        onMove={(d) => setF("quotes", move(editing.form.quotes, i, d))}
                        onRemove={() => setF("quotes", editing.form.quotes.filter((_, j) => j !== i))}
                        label="cita"
                      />
                    </div>
                    <TextareaField rows={3} value={q.text} onChange={(e) => setQ(i, { text: e.target.value })} placeholder="Texto de la cita" />
                  </div>
                ))}
              </div>

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
          title="Eliminar tema"
          message={`Se eliminará "${toDelete?.name ?? ""}" con sus citas. Los libros que lo tenían marcado dejarán de sugerirse por este tema.`}
          confirmText="Eliminar"
          variant="danger"
          isLoading={deleting}
        />
      </PageBody>
    </>
  );
}
