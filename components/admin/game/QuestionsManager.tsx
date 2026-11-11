"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, CircleHelp, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { formationErrorMessage } from "@/actions/formation";
import {
  createGameQuestionAPI,
  deleteGameQuestionAPI,
  getGameQuestionsAPI,
  setGameQuestionStatusAPI,
  updateGameQuestionAPI,
} from "@/actions/game";
import Button from "@/components/admin/ui/Button";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import InputField from "@/components/admin/ui/InputField";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import Modal from "@/components/admin/ui/Modal";
import SelectField from "@/components/admin/ui/SelectField";
import TextareaField from "@/components/admin/ui/TextareaField";
import PageHeader from "@/components/admin/layout/PageHeader";
import { useToastRef } from "@/components/admin/formation/shared";
import { FORMATION_LEVELS } from "@/types/formation";
import {
  DIFFICULTIES,
  GAME_CATEGORIES,
  QUESTION_STATUS,
  type GameCategory,
  type GameQuestion,
  type GameQuestionPayload,
  type GameQuestionsPage,
  type QuestionStatus,
} from "@/types/game";

const GOAL = 50; // preguntas sugeridas por categoría

const empty = (category: GameCategory = "biblia"): GameQuestionPayload => ({
  category,
  levels: ["infancia", "prejuvenil", "juvenil"],
  difficulty: 2,
  prompt: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  explanation: "",
  source: "",
  status: "approved",
});

const catOf = (id: string) => GAME_CATEGORIES.find((c) => c.id === id);

// Banco de preguntas del juego Gira y Aprende
export default function QuestionsManager() {
  const toast = useToastRef();
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<QuestionStatus | "">("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<GameQuestionsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ id?: string; form: GameQuestionPayload } | null>(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<GameQuestion | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await getGameQuestionsAPI({ category, status, search: query, page }));
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudieron cargar las preguntas."));
    } finally {
      setLoading(false);
    }
  }, [category, status, query, page, toast]);

  useEffect(() => { load(); }, [load]);

  const count = (cat: string, st: QuestionStatus) => data?.counts.find((c) => c.category === cat && c.status === st)?.n ?? 0;
  const pendingTotal = data?.counts.filter((c) => c.status === "pending").reduce((a, c) => a + c.n, 0) ?? 0;

  const save = async () => {
    if (!editing) return;
    const f = editing.form;
    const options = f.options.map((o) => o.trim()).filter(Boolean);
    if (f.prompt.trim().length < 5) return toast.current.error("Escribe la pregunta.");
    if (options.length < 2) return toast.current.error("Pon al menos 2 opciones.");
    if (f.levels.length === 0) return toast.current.error("Elige al menos una sección.");
    const correctText = f.options[f.correctIndex]?.trim();
    if (!correctText) return toast.current.error("Marca una respuesta correcta que tenga texto.");
    const payload: GameQuestionPayload = {
      ...f,
      options,
      correctIndex: options.indexOf(correctText),
      explanation: f.explanation?.trim() || undefined,
      source: f.source?.trim() || undefined,
    };
    setSaving(true);
    try {
      if (editing.id) await updateGameQuestionAPI(editing.id, payload);
      else await createGameQuestionAPI(payload);
      toast.current.success(editing.id ? "Pregunta guardada." : "Pregunta creada.");
      setEditing(editing.id ? null : { form: { ...empty(f.category), levels: f.levels, difficulty: f.difficulty, source: f.source } });
      await load();
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudo guardar."));
    } finally {
      setSaving(false);
    }
  };

  const review = async (q: GameQuestion, st: QuestionStatus) => {
    setBusy(q.id);
    try {
      await setGameQuestionStatusAPI(q.id, st);
      toast.current.success(st === "approved" ? "Pregunta aprobada: ya sale en el juego." : "Pregunta rechazada.");
      await load();
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudo guardar."));
    } finally {
      setBusy(null);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteGameQuestionAPI(toDelete.id);
      toast.current.success("Pregunta eliminada.");
      setToDelete(null);
      await load();
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudo eliminar."));
    }
  };

  const setF = <K extends keyof GameQuestionPayload>(k: K, v: GameQuestionPayload[K]) =>
    setEditing((e) => (e ? { ...e, form: { ...e.form, [k]: v } } : e));

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banco de preguntas"
        description="Las preguntas del juego Gira y Aprende de la app. Cada una lleva su fuente: el joven la ve después de responder. Los miembros verificados pueden proponer preguntas; aquí se aprueban."
        icon={<CircleHelp className="h-5 w-5" />}
        breadcrumbs={[{ label: "Banco de preguntas" }]}
        actions={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setEditing({ form: empty((category as GameCategory) || "biblia") })}>Nueva pregunta</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {GAME_CATEGORIES.map((c) => {
          const n = count(c.id, "approved");
          const on = category === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => { setCategory(on ? "" : c.id); setPage(1); }}
              className={`rounded-xl border bg-white p-3 text-left transition ${on ? "border-slate-900 ring-2 ring-slate-900" : "border-slate-200 hover:border-slate-400"}`}
            >
              <span className="block h-1.5 w-8 rounded-full" style={{ backgroundColor: c.color }} />
              <span className="mt-2 block text-sm font-semibold text-slate-900">{c.name}</span>
              <span className="text-xs text-slate-500">{n} de {GOAL} sugeridas</span>
              <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-slate-100">
                <span className="block h-full rounded-full" style={{ width: `${Math.min(100, (n / GOAL) * 100)}%`, backgroundColor: c.color }} />
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-slate-200 bg-white p-1">
          {([["", "Todas"], ["pending", "Por revisar"], ["approved", "Aprobadas"], ["rejected", "Rechazadas"]] as [QuestionStatus | "", string][]).map(([id, label]) => (
            <button
              key={id || "all"}
              type="button"
              onClick={() => { setStatus(id); setPage(1); }}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${status === id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {label}
              {id === "pending" && pendingTotal > 0 && <span className="ml-2 rounded-full bg-amber-400 px-1.5 text-xs font-bold text-slate-900">{pendingTotal}</span>}
            </button>
          ))}
        </div>
        <form className="flex flex-1 items-center gap-2" onSubmit={(e) => { e.preventDefault(); setQuery(search); setPage(1); }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar en preguntas y opciones" className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <Button type="submit" variant="outline" size="sm" icon={<Search className="h-4 w-4" />}>Buscar</Button>
        </form>
      </div>

      {loading && !data ? (
        <div className="flex justify-center py-16"><LoadingSpinner /></div>
      ) : !data || data.items.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">No hay preguntas con este filtro.</p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {data.items.map((q) => {
            const cat = catOf(q.category);
            const st = QUESTION_STATUS[q.status];
            return (
              <li key={q.id} className="flex flex-wrap items-start gap-3 px-5 py-4">
                <span className="mt-1 h-10 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: cat?.color }} aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">{q.prompt}</p>
                  <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
                    {q.options.map((o, i) => (
                      <span key={i} className={i === q.correctIndex ? "font-semibold text-emerald-700" : ""}>
                        {i === q.correctIndex ? "✓ " : ""}{o}
                      </span>
                    ))}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {cat?.name} · {DIFFICULTIES.find((d) => d.id === String(q.difficulty))?.name} · {q.levels.map((l) => FORMATION_LEVELS.find((x) => x.id === l)?.name).join(", ")}
                    {q.source ? ` · Fuente: ${q.source}` : " · Sin fuente"}
                    {q.proposedBy ? ` · Propuesta por ${q.proposedBy}` : ""}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${st.className}`}>{st.label}</span>
                {q.status === "pending" && (
                  <>
                    <Button size="sm" isLoading={busy === q.id} icon={<Check className="h-4 w-4" />} onClick={() => review(q, "approved")}>Aprobar</Button>
                    <Button size="sm" variant="ghost" disabled={busy === q.id} icon={<X className="h-4 w-4 text-red-600" />} onClick={() => review(q, "rejected")} aria-label="Rechazar" />
                  </>
                )}
                <Button size="sm" variant="outline" icon={<Pencil className="h-4 w-4" />} onClick={() => setEditing({ id: q.id, form: { category: q.category, levels: q.levels, difficulty: q.difficulty, prompt: q.prompt, options: [...q.options, "", "", ""].slice(0, 4), correctIndex: q.correctIndex, explanation: q.explanation ?? "", source: q.source ?? "", status: q.status } })}>
                  Editar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setToDelete(q)} aria-label="Eliminar pregunta" icon={<Trash2 className="h-4 w-4 text-red-600" />} />
              </li>
            );
          })}
        </ul>
      )}

      {data && totalPages > 1 && (
        <div className="flex items-center justify-end gap-3 text-sm text-slate-600">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
          Página {page} de {totalPages}
          <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Siguiente</Button>
        </div>
      )}

      <Modal isOpen={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? "Editar pregunta" : "Nueva pregunta"} size="xl">
        {editing && (
          <div className="space-y-4 px-5 pb-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <SelectField label="Categoría" value={editing.form.category} onChange={(e) => setF("category", e.target.value as GameCategory)} options={GAME_CATEGORIES.map((c) => ({ id: c.id, name: c.name }))} />
              <SelectField label="Dificultad" value={String(editing.form.difficulty)} onChange={(e) => setF("difficulty", Number(e.target.value))} options={DIFFICULTIES} />
              <SelectField label="Estado" value={editing.form.status ?? "approved"} onChange={(e) => setF("status", e.target.value as QuestionStatus)} options={Object.entries(QUESTION_STATUS).map(([id, s]) => ({ id, name: s.label }))} />
            </div>
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-slate-800">Para qué secciones</legend>
              <div className="flex flex-wrap gap-4">
                {FORMATION_LEVELS.map((l) => (
                  <label key={l.id} className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={editing.form.levels.includes(l.id)}
                      onChange={(e) => setF("levels", e.target.checked ? [...editing.form.levels, l.id] : editing.form.levels.filter((x) => x !== l.id))}
                    />
                    {l.name} <span className="text-slate-400">({l.ages})</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <TextareaField label="Pregunta" rows={2} required value={editing.form.prompt} onChange={(e) => setF("prompt", e.target.value)} />
            <fieldset className="space-y-2">
              <legend className="mb-1 text-sm font-medium text-slate-800">Opciones (marca la correcta; mínimo 2)</legend>
              {editing.form.options.map((o, i) => (
                <label key={i} className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${editing.form.correctIndex === i ? "border-emerald-500 bg-emerald-50" : "border-slate-200"}`}>
                  <input type="radio" name="correct" className="h-4 w-4" checked={editing.form.correctIndex === i} onChange={() => setF("correctIndex", i)} aria-label={`Opción ${i + 1} es la correcta`} />
                  <input
                    value={o}
                    onChange={(e) => setF("options", editing.form.options.map((x, k) => (k === i ? e.target.value : x)))}
                    placeholder={`Opción ${i + 1}${i >= 2 ? " (opcional)" : ""}`}
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                    maxLength={120}
                  />
                </label>
              ))}
            </fieldset>
            <TextareaField label="Para aprender más" rows={2} value={editing.form.explanation ?? ""} onChange={(e) => setF("explanation", e.target.value)} hint="Se muestra después de responder. Opcional." />
            <InputField label="Fuente" value={editing.form.source ?? ""} onChange={(e) => setF("source", e.target.value)} placeholder="Ej.: Lc 1,46-55 · Estatutos, art. 8 · Catecismo 2447" hint="Cita bíblica, documento o libro de donde sale la respuesta." />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setEditing(null)}>Cerrar</Button>
              <Button onClick={save} isLoading={saving}>{editing.id ? "Guardar" : "Crear y escribir otra"}</Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        title="Eliminar pregunta"
        message="La pregunta deja de salir en el juego y se quita de los teléfonos la próxima vez que se conecten."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
