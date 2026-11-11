"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save } from "lucide-react";
import { createTopicAPI, formationErrorMessage, getTopicAPI, updateTopicAPI } from "@/actions/formation";
import Button from "@/components/admin/ui/Button";
import InputField from "@/components/admin/ui/InputField";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import SelectField from "@/components/admin/ui/SelectField";
import TextareaField from "@/components/admin/ui/TextareaField";
import PageHeader from "@/components/admin/layout/PageHeader";
import {
  FORMATION_AXES,
  FORMATION_LEVELS,
  REFERENCE_TYPES,
  type FormationTopicPayload,
  type TopicReference,
} from "@/types/formation";
import { RowTools, Section, move, useToastRef } from "./shared";

const empty = (): FormationTopicPayload => ({
  title: "",
  summary: "",
  axis: "mariano",
  levels: ["juvenil"],
  subtopics: [""],
  references: [{ type: "biblica", title: "", detail: "", url: "" }],
  displayOrder: 0,
  published: false,
});

const REF_HINT: Record<TopicReference["type"], string> = {
  biblica: "Ej.: Lc 1, 46-55",
  libro: "Título del libro",
  documento: "Ej.: Evangelii Gaudium",
  otro: "Ej.: San Vicente de Paúl",
};

export default function TopicEditor({ id }: { id?: string }) {
  const router = useRouter();
  const toast = useToastRef();
  const [form, setForm] = useState<FormationTopicPayload>(empty);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getTopicAPI(id)
      .then((t) =>
        setForm({
          ...t,
          summary: t.summary ?? "",
          subtopics: t.subtopics.length ? t.subtopics : [""],
          references: t.references.length ? t.references : empty().references,
        }),
      )
      .catch((e) => toast.current.error(formationErrorMessage(e, "No se pudo cargar el itinerario.")))
      .finally(() => setLoading(false));
  }, [id, toast]);

  const set = <K extends keyof FormationTopicPayload>(k: K, v: FormationTopicPayload[K]) => setForm((f) => ({ ...f, [k]: v }));

  const toggleLevel = (l: FormationTopicPayload["levels"][number]) =>
    set("levels", form.levels.includes(l) ? form.levels.filter((x) => x !== l) : [...form.levels, l]);

  const save = async () => {
    if (!form.title.trim()) return toast.current.error("Escribe el tema.");
    if (form.levels.length === 0) return toast.current.error("Elige al menos un nivel.");
    const payload: FormationTopicPayload = {
      ...form,
      displayOrder: Number(form.displayOrder) || 0,
      subtopics: form.subtopics.filter((s) => s.trim()),
      references: form.references
        .filter((r) => r.title.trim())
        .map((r) => ({ ...r, detail: r.detail?.trim() || undefined, url: r.url?.trim() || undefined })),
    };
    setSaving(true);
    try {
      if (id) {
        await updateTopicAPI(id, payload);
        toast.current.success("Itinerario guardado.");
      } else {
        const created = await createTopicAPI(payload);
        toast.current.success("Itinerario creado.");
        router.replace(`/admin/itinerarios/${created.id}`);
      }
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudo guardar."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-16"><LoadingSpinner /></div>;

  const refs = form.references;
  const setRefs = (r: TopicReference[]) => set("references", r);

  return (
    <div className="space-y-6 pb-24">
      <PageHeader
        title={id ? "Editar itinerario" : "Nuevo itinerario"}
        description="Un tema para que los grupos lo trabajen: a qué eje apunta, para qué nivel, qué subtemas conversar y dónde buscar citas y referencias."
        breadcrumbs={[{ label: "Itinerarios", href: "/admin/itinerarios" }, { label: id ? "Editar" : "Nuevo" }]}
      />

      <Section title="Tema">
        <InputField label="Tema" required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Ej.: La espiritualidad del Magníficat" />
        <TextareaField label="Descripción" rows={3} value={form.summary ?? ""} onChange={(e) => set("summary", e.target.value)} hint="Para qué sirve este tema; lo que el grupo debería llevarse." />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Eje formativo" value={form.axis} onChange={(e) => set("axis", e.target.value as FormationTopicPayload["axis"])} options={FORMATION_AXES.map((a) => ({ id: a.id, name: a.name }))} />
          <InputField label="Orden" type="number" value={String(form.displayOrder ?? 0)} onChange={(e) => set("displayOrder", Number(e.target.value))} hint="Los de menor número aparecen primero." />
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-slate-700">Para quiénes (nivel)</legend>
          <div className="flex flex-wrap gap-2">
            {FORMATION_LEVELS.map((l) => {
              const on = form.levels.includes(l.id);
              return (
                <label key={l.id} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${on ? "border-jmv-blue bg-jmv-blue/5 text-jmv-blue" : "border-slate-200 text-slate-700"}`}>
                  <input type="checkbox" className="h-4 w-4" checked={on} onChange={() => toggleLevel(l.id)} />
                  <span className="font-medium">{l.name}</span>
                  <span className="text-xs text-slate-500">{l.ages}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
          <input type="checkbox" className="h-4 w-4" checked={Boolean(form.published)} onChange={(e) => set("published", e.target.checked)} />
          Publicado en la app
        </label>
      </Section>

      <Section title="Subtemas" hint="Los puntos que los grupos pueden conversar en su reunión.">
        <ol className="space-y-3">
          {form.subtopics.map((s, i) => (
            <li key={i} className="flex items-start gap-2">
              <div className="flex-1">
                <InputField label={`Subtema ${i + 1}`} value={s} onChange={(e) => set("subtopics", form.subtopics.map((x, k) => (k === i ? e.target.value : x)))} />
              </div>
              <div className="pt-7">
                <RowTools i={i} total={form.subtopics.length} label={`subtema ${i + 1}`} onMove={(d) => set("subtopics", move(form.subtopics, i, d))} onRemove={() => set("subtopics", form.subtopics.filter((_, k) => k !== i))} />
              </div>
            </li>
          ))}
        </ol>
        <Button type="button" variant="outline" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => set("subtopics", [...form.subtopics, ""])}>Agregar subtema</Button>
      </Section>

      <Section title="Referencias" hint="Dónde sacar citas y material: Biblia, libros, encíclicas, documentos de la Iglesia o de JMV.">
        <ol className="space-y-4">
          {refs.map((r, i) => (
            <li key={i} className="space-y-3 rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500">Referencia {i + 1}</span>
                <RowTools i={i} total={refs.length} label={`referencia ${i + 1}`} onMove={(d) => setRefs(move(refs, i, d))} onRemove={() => setRefs(refs.filter((_, k) => k !== i))} />
              </div>
              <div className="grid gap-3 sm:grid-cols-[220px_1fr]">
                <SelectField label="Tipo" value={r.type} onChange={(e) => setRefs(refs.map((x, k) => (k === i ? { ...x, type: e.target.value as TopicReference["type"] } : x)))} options={REFERENCE_TYPES.map((t) => ({ id: t.id, name: t.name }))} />
                <InputField label="Cita o título" value={r.title} placeholder={REF_HINT[r.type]} onChange={(e) => setRefs(refs.map((x, k) => (k === i ? { ...x, title: e.target.value } : x)))} />
              </div>
              <InputField label="Detalle (opcional)" value={r.detail ?? ""} placeholder="Autor, número, capítulo, páginas…" onChange={(e) => setRefs(refs.map((x, k) => (k === i ? { ...x, detail: e.target.value } : x)))} />
              <InputField label="Enlace (opcional)" value={r.url ?? ""} placeholder="https://…" onChange={(e) => setRefs(refs.map((x, k) => (k === i ? { ...x, url: e.target.value } : x)))} />
            </li>
          ))}
        </ol>
        <Button type="button" variant="outline" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setRefs([...refs, { type: "biblica", title: "", detail: "", url: "" }])}>Agregar referencia</Button>
      </Section>

      <div className="sticky bottom-0 z-10 -mx-4 flex justify-end gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/itinerarios")}>Volver</Button>
        <Button type="button" onClick={save} isLoading={saving} icon={<Save className="h-4 w-4" />}>Guardar</Button>
      </div>
    </div>
  );
}
