"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, CheckCircle2, Plus, Save, Trash2 } from "lucide-react";
import {
  createFormationEncounterAPI,
  formationErrorMessage,
  getFormationEncounterAPI,
  updateFormationEncounterAPI,
} from "@/actions/formation";
import Button from "@/components/admin/ui/Button";
import InputField from "@/components/admin/ui/InputField";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import SelectField from "@/components/admin/ui/SelectField";
import TextareaField from "@/components/admin/ui/TextareaField";
import PageHeader from "@/components/admin/layout/PageHeader";
import { useToast } from "@/lib/hooks/useToast";
import {
  FORMATION_PILLARS,
  FORMATION_STEPS,
  type FormationEncounterPayload,
  type FormationQuizQuestion,
} from "@/types/formation";

const empty = (): FormationEncounterPayload => ({
  title: "",
  summary: "",
  step: "integracion",
  pillar: null,
  displayOrder: 1,
  durationMinutes: 15,
  coverImageUrl: "",
  contemplar: { passageRef: "", passageText: "", prayer: "" },
  vivir: { cards: [{ title: "", body: "" }], videoUrl: "", documentSlug: "" },
  servir: { commitment: "" },
  reflectionQuestions: [""],
  quiz: [],
  source: "",
  published: false,
});

const emptyQuestion = (): FormationQuizQuestion => ({ question: "", options: ["", "", ""], correct: 0, explanation: "" });

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
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

function move<T>(list: T[], i: number, d: -1 | 1): T[] {
  const j = i + d;
  if (j < 0 || j >= list.length) return list;
  const copy = [...list];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
}

function RowTools({ i, total, onMove, onRemove, label }: { i: number; total: number; onMove: (d: -1 | 1) => void; onRemove: () => void; label: string }) {
  return (
    <div className="flex gap-1">
      <Button type="button" size="xs" variant="ghost" disabled={i === 0} onClick={() => onMove(-1)} aria-label={`Subir ${label}`} icon={<ArrowUp className="h-4 w-4" />} />
      <Button type="button" size="xs" variant="ghost" disabled={i === total - 1} onClick={() => onMove(1)} aria-label={`Bajar ${label}`} icon={<ArrowDown className="h-4 w-4" />} />
      <Button type="button" size="xs" variant="ghost" onClick={onRemove} aria-label={`Quitar ${label}`} icon={<Trash2 className="h-4 w-4 text-red-600" />} />
    </div>
  );
}

// Editor de un encuentro: los tres momentos del lema + preguntas
export default function EncounterEditor({ id }: { id?: string }) {
  const router = useRouter();
  const toast = useToast();
  const toastRef = useRef(toast);
  toastRef.current = toast;
  const [form, setForm] = useState<FormationEncounterPayload>(empty);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getFormationEncounterAPI(id)
      .then((e) =>
        setForm({
          ...empty(),
          ...e,
          contemplar: { ...empty().contemplar, ...e.contemplar },
          vivir: { ...empty().vivir, ...e.vivir, cards: e.vivir.cards.length ? e.vivir.cards : [{ title: "", body: "" }] },
          reflectionQuestions: e.reflectionQuestions.length ? e.reflectionQuestions : [""],
        }),
      )
      .catch((err) => toastRef.current.error(formationErrorMessage(err, "No se pudo cargar el encuentro.")))
      .finally(() => setLoading(false));
  }, [id]);

  const set = <K extends keyof FormationEncounterPayload>(key: K, value: FormationEncounterPayload[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const save = async () => {
    if (!form.title.trim()) return toast.error("El título es obligatorio.");
    if (!form.vivir.cards.some((c) => c.body.trim())) return toast.error("Agrega al menos una tarjeta en Vivir.");
    if (!form.servir.commitment.trim()) return toast.error("Escribe el compromiso de Servir.");
    const badQuiz = form.quiz.findIndex((q) => !q.question.trim() || q.options.filter((o) => o.trim()).length < 2 || !q.options[q.correct]?.trim());
    if (badQuiz >= 0) return toast.error(`Revisa la pregunta ${badQuiz + 1} del quiz: texto, al menos 2 opciones y la correcta marcada.`);

    const payload: FormationEncounterPayload = {
      ...form,
      displayOrder: Number(form.displayOrder) || 0,
      durationMinutes: Number(form.durationMinutes) || 15,
      coverImageUrl: form.coverImageUrl?.trim() || null,
      vivir: {
        cards: form.vivir.cards.filter((c) => c.body.trim()),
        videoUrl: form.vivir.videoUrl?.trim() || undefined,
        documentSlug: form.vivir.documentSlug?.trim() || undefined,
      },
      reflectionQuestions: form.reflectionQuestions.filter((q) => q.trim()),
      // Quita opciones vacías y reubica la correcta
      quiz: form.quiz.map((q) => {
        const kept = q.options.map((o, i) => ({ o: o.trim(), i })).filter((x) => x.o);
        return {
          question: q.question.trim(),
          options: kept.map((x) => x.o),
          correct: Math.max(0, kept.findIndex((x) => x.i === q.correct)),
          explanation: q.explanation?.trim() || undefined,
        };
      }),
    };

    setSaving(true);
    try {
      if (id) {
        await updateFormationEncounterAPI(id, payload);
        toast.success("Encuentro guardado.");
      } else {
        const created = await createFormationEncounterAPI(payload);
        toast.success("Encuentro creado.");
        router.replace(`/admin/formacion/${created.id}`);
      }
    } catch (err) {
      toast.error(formationErrorMessage(err, "No se pudo guardar el encuentro."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-16"><LoadingSpinner /></div>;

  const cards = form.vivir.cards;
  const setCards = (c: typeof cards) => set("vivir", { ...form.vivir, cards: c });
  const setQuiz = (q: FormationQuizQuestion[]) => set("quiz", q);

  return (
    <div className="space-y-6 pb-24">
      <PageHeader
        title={id ? "Editar encuentro" : "Nuevo encuentro"}
        description="Cada encuentro se recorre en 15 a 20 minutos: Contemplar (Palabra y oración), Vivir (el tema en tarjetas cortas) y Servir (un compromiso), con preguntas al final."
        breadcrumbs={[{ label: "Formación", href: "/admin/formacion" }, { label: id ? "Editar" : "Nuevo" }]}
      />

      <Section title="Datos del encuentro">
        <InputField label="Título" required value={form.title} onChange={(e) => set("title", e.target.value)} />
        <TextareaField label="Resumen" rows={2} value={form.summary ?? ""} onChange={(e) => set("summary", e.target.value)} hint="Una o dos frases que se ven en la lista del camino." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SelectField label="Paso del camino" value={form.step} onChange={(e) => set("step", e.target.value as FormationEncounterPayload["step"])} options={[...FORMATION_STEPS]} />
          <SelectField label="Pilar" value={form.pillar ?? ""} placeholder="Sin pilar" onChange={(e) => set("pillar", (e.target.value || null) as FormationEncounterPayload["pillar"])} options={[...FORMATION_PILLARS]} />
          <InputField label="Orden" type="number" value={String(form.displayOrder ?? "")} onChange={(e) => set("displayOrder", Number(e.target.value))} hint="Posición dentro del paso." />
          <InputField label="Duración (min)" type="number" value={String(form.durationMinutes ?? "")} onChange={(e) => set("durationMinutes", Number(e.target.value))} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Fuente" value={form.source ?? ""} onChange={(e) => set("source", e.target.value)} placeholder="Manual de JMV (2015), pp. 12-14" hint="De dónde sale el contenido." />
          <InputField label="Foto de portada (URL)" value={form.coverImageUrl ?? ""} onChange={(e) => set("coverImageUrl", e.target.value)} placeholder="https://res.cloudinary.com/…" />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
          <input type="checkbox" className="h-4 w-4" checked={Boolean(form.published)} onChange={(e) => set("published", e.target.checked)} />
          Publicado en la app
        </label>
      </Section>

      <Section title="Contemplar" hint="La Palabra y la oración con que abre el encuentro.">
        <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
          <InputField label="Cita bíblica" value={form.contemplar.passageRef ?? ""} onChange={(e) => set("contemplar", { ...form.contemplar, passageRef: e.target.value })} placeholder="Lc 1, 46-55" />
          <TextareaField label="Texto" rows={3} value={form.contemplar.passageText ?? ""} onChange={(e) => set("contemplar", { ...form.contemplar, passageText: e.target.value })} />
        </div>
        <TextareaField label="Oración" rows={5} value={form.contemplar.prayer ?? ""} onChange={(e) => set("contemplar", { ...form.contemplar, prayer: e.target.value })} hint="Por ejemplo, la Plegaria de JMV." />
      </Section>

      <Section title="Vivir" hint="El tema en tarjetas cortas que el joven pasa una a una. Ideal: 3 a 5 tarjetas.">
        <ol className="space-y-4">
          {cards.map((c, i) => (
            <li key={i} className="space-y-2 rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500">Tarjeta {i + 1}</span>
                <RowTools i={i} total={cards.length} label={`tarjeta ${i + 1}`} onMove={(d) => setCards(move(cards, i, d))} onRemove={() => setCards(cards.filter((_, k) => k !== i))} />
              </div>
              <InputField label="Título" value={c.title ?? ""} onChange={(e) => setCards(cards.map((x, k) => (k === i ? { ...x, title: e.target.value } : x)))} />
              <TextareaField label="Texto" rows={4} value={c.body} onChange={(e) => setCards(cards.map((x, k) => (k === i ? { ...x, body: e.target.value } : x)))} />
            </li>
          ))}
        </ol>
        <Button type="button" variant="outline" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setCards([...cards, { title: "", body: "" }])}>
          Agregar tarjeta
        </Button>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Video (URL, opcional)" value={form.vivir.videoUrl ?? ""} onChange={(e) => set("vivir", { ...form.vivir, videoUrl: e.target.value })} placeholder="https://youtube.com/…" />
          <InputField label="Documento de la Biblioteca (slug, opcional)" value={form.vivir.documentSlug ?? ""} onChange={(e) => set("vivir", { ...form.vivir, documentSlug: e.target.value })} placeholder="marialis-cultus-2-de-febrero-de-1974" hint="El final del enlace del documento en /biblioteca." />
        </div>
      </Section>

      <Section title="Servir" hint="Un compromiso concreto y alcanzable para la semana.">
        <TextareaField label="Compromiso" rows={2} required value={form.servir.commitment} onChange={(e) => set("servir", { commitment: e.target.value })} />
      </Section>

      <Section title="Preguntas de reflexión" hint="El joven las responde en un diario que queda solo en su teléfono; nadie más las lee.">
        <ol className="space-y-3">
          {form.reflectionQuestions.map((q, i) => (
            <li key={i} className="flex items-start gap-2">
              <div className="flex-1">
                <InputField label={`Pregunta ${i + 1}`} value={q} onChange={(e) => set("reflectionQuestions", form.reflectionQuestions.map((x, k) => (k === i ? e.target.value : x)))} />
              </div>
              <div className="pt-7">
                <RowTools i={i} total={form.reflectionQuestions.length} label={`pregunta ${i + 1}`} onMove={(d) => set("reflectionQuestions", move(form.reflectionQuestions, i, d))} onRemove={() => set("reflectionQuestions", form.reflectionQuestions.filter((_, k) => k !== i))} />
              </div>
            </li>
          ))}
        </ol>
        <Button type="button" variant="outline" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => set("reflectionQuestions", [...form.reflectionQuestions, ""])}>
          Agregar pregunta
        </Button>
      </Section>

      <Section title="Quiz" hint="Opcional. De 3 a 5 preguntas para afianzar lo aprendido; marca la opción correcta.">
        <ol className="space-y-4">
          {form.quiz.map((q, i) => (
            <li key={i} className="space-y-3 rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500">Pregunta {i + 1}</span>
                <RowTools i={i} total={form.quiz.length} label={`pregunta ${i + 1} del quiz`} onMove={(d) => setQuiz(move(form.quiz, i, d))} onRemove={() => setQuiz(form.quiz.filter((_, k) => k !== i))} />
              </div>
              <InputField label="Pregunta" value={q.question} onChange={(e) => setQuiz(form.quiz.map((x, k) => (k === i ? { ...x, question: e.target.value } : x)))} />
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-slate-700">Opciones (marca la correcta)</legend>
                {q.options.map((o, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${i}`}
                      className="h-4 w-4"
                      checked={q.correct === j}
                      onChange={() => setQuiz(form.quiz.map((x, k) => (k === i ? { ...x, correct: j } : x)))}
                      aria-label={`Opción ${j + 1} es la correcta`}
                    />
                    <div className="flex-1">
                      <InputField value={o} placeholder={`Opción ${j + 1}`} onChange={(e) => setQuiz(form.quiz.map((x, k) => (k === i ? { ...x, options: x.options.map((y, m) => (m === j ? e.target.value : y)) } : x)))} />
                    </div>
                    {q.correct === j && <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />}
                  </div>
                ))}
                {q.options.length < 5 && (
                  <Button type="button" size="xs" variant="ghost" icon={<Plus className="h-4 w-4" />} onClick={() => setQuiz(form.quiz.map((x, k) => (k === i ? { ...x, options: [...x.options, ""] } : x)))}>
                    Opción
                  </Button>
                )}
              </fieldset>
              <InputField label="Explicación (opcional)" value={q.explanation ?? ""} onChange={(e) => setQuiz(form.quiz.map((x, k) => (k === i ? { ...x, explanation: e.target.value } : x)))} hint="Se muestra después de responder." />
            </li>
          ))}
        </ol>
        <Button type="button" variant="outline" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setQuiz([...form.quiz, emptyQuestion()])}>
          Agregar pregunta de quiz
        </Button>
      </Section>

      <div className="sticky bottom-0 z-10 -mx-4 flex justify-end gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/formacion")}>Volver</Button>
        <Button type="button" onClick={save} isLoading={saving} icon={<Save className="h-4 w-4" />}>Guardar</Button>
      </div>
    </div>
  );
}
