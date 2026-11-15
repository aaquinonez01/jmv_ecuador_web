"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Camera,
  Check,
  ChevronDown,
  ExternalLink,
  Eye,
  Plus,
  Save,
  Search,
  Settings,
  Sparkles,
  Trash2,
  UserCheck,
  X,
} from "lucide-react";
import Button from "@/components/admin/ui/Button";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import InputField from "@/components/admin/ui/InputField";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import TextareaField from "@/components/admin/ui/TextareaField";
import PageHeader, { PageBody } from "@/components/admin/layout/PageHeader";
import { PublishedBadge, useToastRef } from "@/components/admin/formation/shared";
import {
  adminError,
  deletePhotoAPI,
  getFiestaAPI,
  listLeadsAPI,
  listPhotosAPI,
  setLeadAPI,
  setPhotoStatusAPI,
  updateDayAPI,
  updateFiestaAPI,
  type AdminDay,
  type AdminFiesta,
  type AdminPhoto,
  type AdminQuestion,
  type LeadRow,
} from "@/lib/fiestas/admin-api";
import { PIECES, pieceInfo, shortDate } from "@/lib/fiestas/pieces";
import type { PhotoStatus } from "@/lib/fiestas/types";

type Tab = "dias" | "fotos" | "responsables" | "general";

export default function FiestaEditor({ id }: { id: string }) {
  const toast = useToastRef();
  const [fiesta, setFiesta] = useState<AdminFiesta | null>(null);
  const [tab, setTab] = useState<Tab>("dias");
  const [pending, setPending] = useState(0);

  const load = useCallback(async () => {
    try {
      setFiesta(await getFiestaAPI(id));
      setPending((await listPhotosAPI(id, "pending")).length);
    } catch (e) {
      toast.current.error(adminError(e, "No se pudo cargar la fiesta."));
    }
  }, [id, toast]);

  useEffect(() => {
    load();
  }, [load]);

  if (!fiesta)
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner />
      </div>
    );

  const ready = fiesta.days.filter((d) => d.published).length;

  return (
    <>
      <PageHeader
        title={fiesta.title}
        description={`${ready} de ${fiesta.days.length} días publicados. Un día sin publicar se ve como "en preparación"; se abre solo en su fecha.`}
        icon={<Sparkles className="h-5 w-5" />}
        breadcrumbs={[{ label: "Fiestas", href: "/admin/fiestas" }, { label: fiesta.title }]}
        actions={
          <Link
            href={`/fiestas/${fiesta.slug}`}
            target="_blank"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ExternalLink className="h-4 w-4" /> Ver página
          </Link>
        }
      />
      <PageBody>
        <div className="flex max-w-full overflow-x-auto rounded-lg border border-slate-200 bg-white p-1">
          {(
            [
              ["dias", "Días", Sparkles],
              ["fotos", "Fotos del mural", Camera],
              ["responsables", "Responsables", UserCheck],
              ["general", "General", Settings],
            ] as const
          ).map(([t, label, Icon]) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition ${tab === t ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {t === "fotos" && pending > 0 && (
                <span className="rounded-full bg-amber-400 px-1.5 text-xs font-bold text-slate-900">{pending}</span>
              )}
            </button>
          ))}
        </div>

        {tab === "dias" && (
          <div className="space-y-3">
            {fiesta.days.map((d) => (
              <DayCard
                key={d.id}
                day={d}
                today={fiesta.today}
                slug={fiesta.slug}
                onSaved={(saved) =>
                  setFiesta((f) => (f ? { ...f, days: f.days.map((x) => (x.id === saved.id ? { ...saved, stats: x.stats } : x)) } : f))
                }
              />
            ))}
          </div>
        )}
        {tab === "fotos" && <PhotosTab id={fiesta.id} onCount={setPending} />}
        {tab === "responsables" && <LeadsTab />}
        {tab === "general" && <GeneralTab fiesta={fiesta} onSaved={setFiesta} />}
      </PageBody>
    </>
  );
}

// ── Días ──────────────────────────────────────────────────────────────

const emptyQ = (): AdminQuestion => ({ prompt: "", options: ["", "", ""], correctIndex: 0, explanation: "" });

function DayCard({
  day,
  today,
  slug,
  onSaved,
}: {
  day: AdminDay;
  today: string;
  slug: string;
  onSaved: (d: AdminDay) => void;
}) {
  const toast = useToastRef();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(day);
  const [saving, setSaving] = useState(false);

  useEffect(() => setF(day), [day]);

  const set = <K extends keyof AdminDay>(k: K, v: AdminDay[K]) => setF((x) => ({ ...x, [k]: v }));
  const setQ = (i: number, q: Partial<AdminQuestion>) =>
    setF((x) => ({ ...x, questions: x.questions.map((old, j) => (j === i ? { ...old, ...q } : old)) }));

  const status =
    day.date > today ? "Se abre el " + shortDate(day.date) : day.date === today ? "Abierto hoy" : "Ya pasó (sigue abierto)";

  const save = async (publish?: boolean) => {
    const questions = f.questions
      .map((q) => ({ ...q, prompt: q.prompt.trim(), options: q.options.map((o) => o.trim()) }))
      .filter((q) => q.prompt || q.options.some(Boolean));
    for (const [i, q] of questions.entries()) {
      const filled = q.options.filter(Boolean);
      if (!q.prompt) return toast.current.error(`Escribe la pregunta ${i + 1}.`);
      if (filled.length < 2) return toast.current.error(`La pregunta ${i + 1} necesita al menos 2 opciones.`);
      if (!q.options[q.correctIndex]) return toast.current.error(`Marca la respuesta correcta de la pregunta ${i + 1}.`);
    }
    const clean = questions.map((q) => {
      const correctText = q.options[q.correctIndex];
      const options = q.options.filter(Boolean);
      return { ...q, options, correctIndex: options.indexOf(correctText), explanation: q.explanation?.trim() || null };
    });
    const published = publish ?? f.published;
    if (published && !f.title.trim()) return toast.current.error("Ponle un título al día antes de publicarlo.");
    if (day.stats.answered > 0 && JSON.stringify(clean.map((q) => [q.options, q.correctIndex])) !== JSON.stringify(day.questions.map((q) => [q.options, q.correctIndex]))) {
      if (!window.confirm(`${day.stats.answered} personas ya respondieron este día. Cambiar opciones o respuestas no recalcula sus puntos. ¿Guardar igual?`)) return;
    }
    setSaving(true);
    try {
      const saved = await updateDayAPI(day.id, {
        date: f.date,
        label: f.label.trim(),
        title: f.title.trim(),
        piece: f.piece,
        theme: f.theme ?? "",
        prayer: f.prayer ?? "",
        purpose: f.purpose ?? "",
        source: f.source ?? "",
        questions: clean,
        published,
      });
      onSaved({ ...saved, stats: day.stats });
      toast.current.success(published && !day.published ? `${day.label} publicado.` : "Guardado.");
    } catch (e) {
      toast.current.error(adminError(e, "No se pudo guardar."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 p-4 text-left"
        aria-expanded={open}
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-900 text-sm font-bold text-white">
          {day.piece === "medalla" ? "★" : day.dayNumber}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-900">{day.label}</span>
            <span className="text-sm text-slate-500">{shortDate(day.date)}</span>
            <PublishedBadge published={day.published} />
            {!day.theme && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">Falta el tema</span>}
          </span>
          <span className="block truncate text-sm text-slate-600">
            {day.title || "Sin título"} · {pieceInfo(day.piece).name} · {day.questions.length} preguntas
          </span>
          <span className="block text-xs text-slate-400">
            {status} · {day.stats.answered} respondieron · {day.stats.purposes} propósitos · {day.stats.photos} fotos
          </span>
        </span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="space-y-5 border-t border-slate-100 p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-4">
            <InputField label="Etiqueta" value={f.label} onChange={(e) => set("label", e.target.value)} hint="Ej. Día 1, Fiesta" />
            <InputField label="Se abre el" type="date" value={f.date} onChange={(e) => set("date", e.target.value)} />
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-700">Pieza que se gana</label>
              <select
                value={f.piece}
                onChange={(e) => set("piece", e.target.value)}
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
              >
                {PIECES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <InputField label="Título del día" value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="Tal como aparece en la novena" />
          <TextareaField
            label="Tema del día"
            rows={12}
            value={f.theme ?? ""}
            onChange={(e) => set("theme", e.target.value)}
            hint="Pega el texto tal cual de la novena. Los saltos de línea se respetan."
          />
          <TextareaField label="Oración" rows={6} value={f.prayer ?? ""} onChange={(e) => set("prayer", e.target.value)} />
          <TextareaField
            label="Propósito del día"
            rows={3}
            value={f.purpose ?? ""}
            onChange={(e) => set("purpose", e.target.value)}
            hint='Un compromiso concreto. Los jóvenes marcan "Lo cumplí" y ganan puntos.'
          />
          <InputField label="Fuente" value={f.source ?? ""} onChange={(e) => set("source", e.target.value)} placeholder="Ej. Novena a la Medalla Milagrosa, p. 4" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Preguntas ({f.questions.length})</h3>
              <Button
                size="sm"
                variant="outline"
                icon={<Plus className="h-4 w-4" />}
                onClick={() => set("questions", [...f.questions, emptyQ()])}
                disabled={f.questions.length >= 10}
              >
                Agregar pregunta
              </Button>
            </div>
            {f.questions.length === 0 && (
              <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                Sin preguntas el día solo muestra el tema, la oración y el propósito.
              </p>
            )}
            {f.questions.map((q, i) => (
              <div key={q.id ?? `new-${i}`} className="space-y-3 rounded-lg border border-slate-200 p-4">
                <div className="flex items-start gap-2">
                  <span className="mt-2 text-sm font-bold text-slate-400">{i + 1}.</span>
                  <InputField className="flex-1" value={q.prompt} onChange={(e) => setQ(i, { prompt: e.target.value })} placeholder="Pregunta" />
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label="Quitar pregunta"
                    icon={<Trash2 className="h-4 w-4 text-red-600" />}
                    onClick={() => set("questions", f.questions.filter((_, j) => j !== i))}
                  />
                </div>
                <div className="space-y-2 pl-6">
                  {q.options.map((o, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQ(i, { correctIndex: oi })}
                        aria-label={`Marcar opción ${oi + 1} como correcta`}
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 ${q.correctIndex === oi ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300 text-transparent hover:border-emerald-400"}`}
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <input
                        value={o}
                        onChange={(e) => setQ(i, { options: q.options.map((x, j) => (j === oi ? e.target.value : x)) })}
                        placeholder={`Opción ${oi + 1}`}
                        className="h-9 min-w-0 flex-1 rounded-md border border-slate-300 px-3 text-sm"
                      />
                      {q.options.length > 2 && (
                        <button
                          type="button"
                          aria-label="Quitar opción"
                          onClick={() =>
                            setQ(i, {
                              options: q.options.filter((_, j) => j !== oi),
                              correctIndex: q.correctIndex === oi ? 0 : q.correctIndex > oi ? q.correctIndex - 1 : q.correctIndex,
                            })
                          }
                          className="text-slate-400 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {q.options.length < 6 && (
                    <button type="button" onClick={() => setQ(i, { options: [...q.options, ""] })} className="text-sm font-semibold text-jmv-blue">
                      + Opción
                    </button>
                  )}
                  <InputField
                    value={q.explanation ?? ""}
                    onChange={(e) => setQ(i, { explanation: e.target.value })}
                    placeholder="Explicación que ven después de responder (opcional)"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <Link
              href={`/fiestas/${slug}/dia/${day.dayNumber}`}
              target="_blank"
              className="mr-auto inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              <Eye className="h-4 w-4" /> Ver en la web
            </Link>
            {day.published ? (
              <Button variant="outline" onClick={() => save(false)} disabled={saving}>
                Pasar a borrador
              </Button>
            ) : (
              <Button variant="outline" onClick={() => save(false)} isLoading={saving} icon={<Save className="h-4 w-4" />}>
                Guardar borrador
              </Button>
            )}
            <Button onClick={() => save(true)} isLoading={saving} icon={<Check className="h-4 w-4" />}>
              {day.published ? "Guardar" : "Guardar y publicar"}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

// ── Fotos ─────────────────────────────────────────────────────────────

function PhotosTab({ id, onCount }: { id: string; onCount: (n: number) => void }) {
  const toast = useToastRef();
  const [status, setStatus] = useState<PhotoStatus | "">("pending");
  const [photos, setPhotos] = useState<AdminPhoto[] | null>(null);
  const [toDelete, setToDelete] = useState<AdminPhoto | null>(null);

  const load = useCallback(async () => {
    try {
      const list = await listPhotosAPI(id, status || undefined);
      setPhotos(list);
      if (status === "pending") onCount(list.length);
    } catch (e) {
      toast.current.error(adminError(e, "No se pudieron cargar las fotos."));
    }
  }, [id, status, onCount, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const review = async (p: AdminPhoto, st: PhotoStatus) => {
    try {
      await setPhotoStatusAPI(p.id, st);
      setPhotos((l) => (status ? l?.filter((x) => x.id !== p.id) : l?.map((x) => (x.id === p.id ? { ...x, status: st } : x))) ?? null);
      if (status === "pending") onCount(Math.max(0, (photos?.length ?? 1) - 1));
    } catch (e) {
      toast.current.error(adminError(e, "No se pudo guardar."));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex w-fit rounded-lg border border-slate-200 bg-white p-1">
        {(
          [
            ["pending", "Por revisar"],
            ["approved", "En el mural"],
            ["rejected", "Rechazadas"],
            ["", "Todas"],
          ] as [PhotoStatus | "", string][]
        ).map(([s, label]) => (
          <button
            key={s || "all"}
            type="button"
            onClick={() => setStatus(s)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${status === s ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {!photos ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : photos.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">No hay fotos aquí.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {photos.map((p) => (
            <figure key={p.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <a href={p.url} target="_blank" rel="noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url.replace("/upload/", "/upload/w_500,q_auto,f_auto/")} alt={p.caption ?? ""} className="aspect-square w-full object-cover" />
              </a>
              <figcaption className="space-y-2 p-3">
                <p className="text-sm font-semibold text-slate-900">{p.comunidad}</p>
                <p className="text-xs text-slate-500">
                  {p.label} · {p.uploadedBy ?? "—"}
                </p>
                {p.caption && <p className="text-xs text-slate-700">“{p.caption}”</p>}
                <div className="flex flex-wrap gap-1.5">
                  {p.status !== "approved" && (
                    <Button size="xs" onClick={() => review(p, "approved")} icon={<Check className="h-3.5 w-3.5" />}>
                      Aprobar
                    </Button>
                  )}
                  {p.status !== "rejected" && (
                    <Button size="xs" variant="outline" onClick={() => review(p, "rejected")}>
                      Rechazar
                    </Button>
                  )}
                  <Button size="xs" variant="ghost" aria-label="Eliminar" onClick={() => setToDelete(p)} icon={<Trash2 className="h-3.5 w-3.5 text-red-600" />} />
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      <ConfirmDialog
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete) return;
          try {
            await deletePhotoAPI(toDelete.id);
            setToDelete(null);
            await load();
          } catch (e) {
            toast.current.error(adminError(e, "No se pudo eliminar."));
          }
        }}
        title="Eliminar foto"
        message="La foto se borra para siempre."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}

// ── Responsables ──────────────────────────────────────────────────────

function LeadsTab() {
  const toast = useToastRef();
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<LeadRow[] | null>(null);
  const [onlyLeads, setOnlyLeads] = useState(true);

  const load = useCallback(
    async (q = "") => {
      try {
        setRows(await listLeadsAPI({ search: q, onlyLeads: q ? false : onlyLeads }));
      } catch (e) {
        toast.current.error(adminError(e, "No se pudo cargar."));
      }
    },
    [onlyLeads, toast],
  );

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (r: LeadRow) => {
    try {
      await setLeadAPI(r.id, !r.isCommunityLead);
      setRows((l) => l?.map((x) => (x.id === r.id ? { ...x, isCommunityLead: !r.isCommunityLead } : x)) ?? null);
      toast.current.success(!r.isCommunityLead ? `${r.fullName} ahora es responsable.` : "Ya no es responsable.");
    } catch (e) {
      toast.current.error(adminError(e, "No se pudo guardar."));
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        El responsable sube las fotos de su comunidad y elige si viven novena, triduo o solo el día. Usa su propia cuenta (no se
        comparten contraseñas). Busca a la persona por nombre o correo; debe tener una comunidad asignada.
      </p>
      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          load(search);
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nombre o correo"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <Button type="submit" variant="outline" size="sm" icon={<Search className="h-4 w-4" />}>
          Buscar
        </Button>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={onlyLeads} onChange={(e) => setOnlyLeads(e.target.checked)} /> Solo responsables
        </label>
      </form>
      {!rows ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : rows.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">
          {onlyLeads && !search ? "Aún no hay responsables. Busca a una persona para marcarla." : "Sin resultados."}
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center gap-3 p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-900">{r.fullName}</p>
                <p className="truncate text-xs text-slate-500">
                  {r.email} · {r.comunidad ?? "Sin comunidad"}
                </p>
              </div>
              <Button
                size="sm"
                variant={r.isCommunityLead ? "primary" : "outline"}
                onClick={() => toggle(r)}
                disabled={!r.comunidadId && !r.isCommunityLead}
                icon={r.isCommunityLead ? <UserCheck className="h-4 w-4" /> : undefined}
              >
                {r.isCommunityLead ? "Responsable" : "Hacer responsable"}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── General ───────────────────────────────────────────────────────────

function GeneralTab({ fiesta, onSaved }: { fiesta: AdminFiesta; onSaved: (f: AdminFiesta) => void }) {
  const toast = useToastRef();
  const [f, setF] = useState({
    title: fiesta.title,
    subtitle: fiesta.subtitle ?? "",
    intro: fiesta.intro ?? "",
    feastDate: fiesta.feastDate,
    published: fiesta.published,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      onSaved(await updateFiestaAPI(fiesta.id, f));
      toast.current.success("Guardado.");
    } catch (e) {
      toast.current.error(adminError(e, "No se pudo guardar."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="max-w-2xl space-y-4 rounded-xl border border-slate-200 bg-white p-5">
      <InputField label="Título" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
      <InputField label="Subtítulo" value={f.subtitle} onChange={(e) => setF({ ...f, subtitle: e.target.value })} />
      <TextareaField
        label="Presentación (opcional)"
        rows={4}
        value={f.intro}
        onChange={(e) => setF({ ...f, intro: e.target.value })}
        hint="Un párrafo corto bajo el título."
      />
      <InputField label="Día de la fiesta" type="date" value={f.feastDate} onChange={(e) => setF({ ...f, feastDate: e.target.value })} />
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={f.published} onChange={(e) => setF({ ...f, published: e.target.checked })} />
        Página visible en la web (<code>/fiestas/{fiesta.slug}</code>)
      </label>
      <div className="flex justify-end">
        <Button onClick={save} isLoading={saving} icon={<Save className="h-4 w-4" />}>
          Guardar
        </Button>
      </div>
    </section>
  );
}
