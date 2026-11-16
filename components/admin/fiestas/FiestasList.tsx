"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Plus, Sparkles } from "lucide-react";
import Button from "@/components/admin/ui/Button";
import InputField from "@/components/admin/ui/InputField";
import Modal from "@/components/admin/ui/Modal";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import PageHeader, { PageBody } from "@/components/admin/layout/PageHeader";
import { PublishedBadge, useToastRef } from "@/components/admin/formation/shared";
import { adminError, createFiestaAPI, listFiestasAPI, type AdminFiestaRow } from "@/lib/fiestas/admin-api";
import type { SymbolKind } from "@/lib/fiestas/symbol";

/** "Adviento 2026" → "adviento-2026" */
const toSlug = (t: string) =>
  t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
import { longDate } from "@/lib/fiestas/pieces";

export default function FiestasList() {
  const toast = useToastRef();
  const router = useRouter();
  const [rows, setRows] = useState<AdminFiestaRow[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", slugTouched: false, feastDate: "", symbolKind: "layers" as SymbolKind });

  const create = async () => {
    const slug = form.slug || toSlug(form.title);
    if (form.title.trim().length < 3) return toast.current.error("Escribe el nombre de la fiesta.");
    if (slug.length < 3) return toast.current.error("Escribe la dirección de la página.");
    if (!form.feastDate) return toast.current.error("Elige el día de la fiesta.");
    setSaving(true);
    try {
      const f = await createFiestaAPI({ title: form.title.trim(), slug, feastDate: form.feastDate, symbolKind: form.symbolKind });
      router.push(`/admin/fiestas/${f.id}`);
    } catch (e) {
      toast.current.error(adminError(e, "No se pudo crear la fiesta."));
      setSaving(false);
    }
  };

  useEffect(() => {
    listFiestasAPI()
      .then(setRows)
      .catch((e) => {
        toast.current.error(adminError(e, "No se pudieron cargar las fiestas."));
        setRows([]);
      });
  }, [toast]);

  return (
    <>
      <PageHeader
        title="Fiestas"
        description="Novenas, triduos y fiestas del Año Vicenciano en la web: el tema de cada día, sus preguntas con puntos, el propósito y el mural de fotos de las comunidades."
        icon={<Sparkles className="h-5 w-5" />}
        breadcrumbs={[{ label: "Fiestas" }]}
        actions={
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setCreating(true)}>
            Nueva fiesta
          </Button>
        }
      />
      <PageBody>
        {!rows ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : rows.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">Aún no hay fiestas.</p>
        ) : (
          <ul className="space-y-3">
            {rows.map((f) => (
              <li key={f.id}>
                <Link
                  href={`/admin/fiestas/${f.id}`}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-400"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-jmv-blue text-white">
                    <Sparkles className="h-6 w-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900">{f.title}</span>
                      <PublishedBadge published={f.published} />
                      {f.pendingPhotos > 0 && (
                        <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-slate-900">
                          {f.pendingPhotos} fotos por revisar
                        </span>
                      )}
                    </span>
                    <span className="block text-sm text-slate-500">
                      Fiesta: {longDate(String(f.feastDate).slice(0, 10))} · {f.dayCount} días · {f.participants} participantes
                    </span>
                  </span>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Modal isOpen={creating} onClose={() => setCreating(false)} title="Nueva fiesta" size="md">
          <div className="space-y-4 px-5 pb-5">
            <InputField
              label="Nombre"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: f.slugTouched ? f.slug : toSlug(e.target.value) }))}
              placeholder="Ej. Adviento"
            />
            <InputField
              label="Dirección de la página"
              required
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: toSlug(e.target.value), slugTouched: true }))}
              hint={`Quedará en /fiestas/${form.slug || "nombre"}. Después no se puede cambiar.`}
            />
            <InputField
              label="Día de la fiesta"
              type="date"
              required
              value={form.feastDate}
              onChange={(e) => setForm((f) => ({ ...f, feastDate: e.target.value }))}
              hint="El gran día al que lleva el camino. La página cuenta los días que faltan."
            />
            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-slate-800">Qué se va armando</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {(
                  [
                    ["layers", "Una imagen por capas", "Subes una imagen base y una capa por cada día (velas, figuras…)."],
                    ["medal", "La Medalla Milagrosa", "El dibujo de la Medalla con sus piezas."],
                  ] as const
                ).map(([id, label, hint]) => (
                  <label
                    key={id}
                    className={`cursor-pointer rounded-lg border p-3 text-sm ${form.symbolKind === id ? "border-jmv-blue bg-blue-50" : "border-slate-300 bg-white"}`}
                  >
                    <input
                      type="radio"
                      name="symbolKind"
                      className="sr-only"
                      checked={form.symbolKind === id}
                      onChange={() => setForm((f) => ({ ...f, symbolKind: id }))}
                    />
                    <span className="block font-semibold text-slate-900">{label}</span>
                    <span className="block text-xs text-slate-500">{hint}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <p className="text-xs text-slate-500">La fiesta se crea oculta. Agrega sus días y publícala cuando esté lista.</p>
            <div className="flex justify-end gap-3 pt-1">
              <Button variant="outline" onClick={() => setCreating(false)}>
                Cancelar
              </Button>
              <Button onClick={create} isLoading={saving}>
                Crear fiesta
              </Button>
            </div>
          </div>
        </Modal>
      </PageBody>
    </>
  );
}
