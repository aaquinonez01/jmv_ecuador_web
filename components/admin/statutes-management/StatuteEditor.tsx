"use client";

import { useCallback, useDeferredValue, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CircleAlert,
  CircleCheck,
  Copy,
  Eye,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Pencil,
  Save,
  ScrollText,
  TriangleAlert,
} from "lucide-react";
import {
  createStatuteVersionAPI,
  getStatuteVersionAPI,
  makeCurrentStatuteVersionAPI,
  statutesErrorMessage,
  updateStatuteVersionAPI,
  type StatuteVersionPayload,
} from "@/actions/statutes";
import Button from "@/components/admin/ui/Button";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import PageHeader from "@/components/admin/layout/PageHeader";
import { useToast } from "@/lib/hooks/useToast";
import { allArticles, countLabel, parseStatutes, validateStatutes } from "@/lib/estatutos";
import { STATUTES_PATH, statuteVersionHref } from "@/components/estatutos/content";
import type { StatuteVersion } from "@/types/statutes";
import FormatGuide from "./FormatGuide";
import StatutePreview from "./StatutePreview";

interface FormState {
  title: string;
  versionLabel: string;
  approvedAt: string;
  approvedBy: string;
  summary: string;
  pdfUrl: string;
  slug: string;
  published: boolean;
  content: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const SUMMARY_MAX = 300;
const LEAVE_MESSAGE = "Tienes cambios sin guardar. ¿Quieres salir sin guardarlos?";

const emptyForm = (): FormState => ({
  title: "Estatutos Nacionales de JMV Ecuador",
  versionLabel: "",
  approvedAt: "",
  approvedBy: "",
  summary: "",
  pdfUrl: "",
  slug: "",
  published: false,
  content: "",
});

function toForm(item: StatuteVersion): FormState {
  return {
    title: item.title,
    versionLabel: item.versionLabel,
    approvedAt: (item.approvedAt ?? "").slice(0, 10),
    approvedBy: item.approvedBy ?? "",
    summary: item.summary ?? "",
    pdfUrl: item.pdfUrl ?? "",
    slug: item.slug,
    published: item.published,
    content: item.content ?? "",
  };
}

function validate(form: FormState, articles: number): FormErrors {
  const errors: FormErrors = {};
  const title = form.title.trim();
  if (title.length < 3) errors.title = "Escribe un título de al menos 3 letras.";
  else if (title.length > 200) errors.title = "El título puede tener hasta 200 caracteres.";
  if (!form.versionLabel.trim()) errors.versionLabel = "Pon una etiqueta corta, p. ej. el año: 2027.";
  else if (form.versionLabel.trim().length > 40) errors.versionLabel = "Máximo 40 caracteres.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.approvedAt)) errors.approvedAt = "Elige la fecha de aprobación.";
  if (form.approvedBy.trim().length < 3) errors.approvedBy = "Escribe quién aprobó estos estatutos.";
  if (form.summary.trim().length > SUMMARY_MAX) errors.summary = `El resumen puede tener hasta ${SUMMARY_MAX} caracteres.`;
  if (form.pdfUrl.trim() && !/^(\/|https?:\/\/)\S+$/.test(form.pdfUrl.trim())) {
    errors.pdfUrl = "Usa una ruta /documentos/… o una dirección https://";
  }
  if (form.slug.trim() && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim())) {
    errors.slug = "Solo minúsculas sin tildes, números y guiones (ej. estatutos-2027).";
  }
  if (!form.content.trim()) errors.content = "Pega o escribe el texto de los estatutos.";
  else if (form.published && articles === 0) errors.content = "Para publicar, el texto necesita al menos un artículo.";
  return errors;
}

const inputClass =
  "block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-jmv-blue focus:outline-none focus:ring-2 focus:ring-jmv-blue/30 aria-[invalid=true]:border-red-500 sm:min-h-10";

function Field({
  label,
  required,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
}) {
  const id = useId();
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-[13px] font-semibold text-slate-700">
        {label}
        {required ? (
          <>
            <span className="ml-0.5 text-red-600" aria-hidden>
              *
            </span>
            <span className="sr-only"> (obligatorio)</span>
          </>
        ) : null}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {error ? (
        <p id={`${id}-error`} className="mt-1 flex items-center gap-1 text-xs font-medium text-red-700">
          <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default function StatuteEditor({ id, sourceId }: { id?: string; sourceId?: string }) {
  const toast = useToast();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saved, setSaved] = useState<string>(() => JSON.stringify(emptyForm()));
  const [item, setItem] = useState<StatuteVersion | null>(null);
  const [source, setSource] = useState<StatuteVersion | null>(null);
  const [loading, setLoading] = useState(Boolean(id || sourceId));
  const [loadError, setLoadError] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [pane, setPane] = useState<"editar" | "vista">("editar");
  const [promoteOpen, setPromoteOpen] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (id) {
          const data = await getStatuteVersionAPI(id);
          if (!alive) return;
          const next = toForm(data);
          setItem(data);
          setForm(next);
          setSaved(JSON.stringify(next));
        } else if (sourceId) {
          // Duplicar: se parte del texto de otra versión, sin fecha ni firmante
          const data = await getStatuteVersionAPI(sourceId);
          if (!alive) return;
          const next: FormState = {
            ...emptyForm(),
            title: data.title,
            summary: data.summary ?? "",
            content: data.content ?? "",
          };
          setSource(data);
          setForm(next);
          setSaved(JSON.stringify(emptyForm()));
        }
      } catch {
        if (alive) setLoadError(true);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, sourceId]);

  const dirty = !loading && JSON.stringify(form) !== saved;

  // Aviso antes de salir con cambios sin guardar (recarga, cierre o enlace interno)
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a");
      if (!link || link.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (!window.confirm(LEAVE_MESSAGE)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [dirty]);

  const deferredContent = useDeferredValue(form.content);
  const doc = useMemo(() => parseStatutes(deferredContent), [deferredContent]);
  const issues = useMemo(() => validateStatutes(deferredContent), [deferredContent]);
  const stats = useMemo(() => {
    const articles = allArticles(doc);
    return {
      chapters: doc.chapters.filter((c) => c.numeral).length,
      articles: articles.filter((a) => a.number).length,
      numerals: articles.reduce((s, a) => s + a.blocks.filter((b) => b.type === "numeral").length, 0),
    };
  }, [doc]);

  const update = (changes: Partial<FormState>) => {
    setForm((current) => ({ ...current, ...changes }));
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(changes) as (keyof FormState)[]) delete next[key];
      return next;
    });
  };

  const save = useCallback(async () => {
    const articles = allArticles(parseStatutes(form.content)).filter((a) => a.number).length;
    const found = validate(form, articles);
    setErrors(found);
    if (Object.keys(found).length) {
      toast.error("Revisa los campos marcados.");
      if (found.content) setPane("editar");
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    const payload: StatuteVersionPayload = {
      title: form.title.trim(),
      versionLabel: form.versionLabel.trim(),
      approvedAt: form.approvedAt,
      approvedBy: form.approvedBy.trim(),
      summary: form.summary.trim() || null,
      pdfUrl: form.pdfUrl.trim() || null,
      published: form.published,
      content: form.content.replace(/\r\n?/g, "\n").replace(/[ \t]+$/gm, "").trim() + "\n",
    };
    if (form.slug.trim()) payload.slug = form.slug.trim();
    try {
      setSubmitting(true);
      if (item) {
        const data = await updateStatuteVersionAPI(item.id, payload);
        const next = toForm({ ...item, ...data });
        setItem({ ...item, ...data });
        setForm(next);
        setSaved(JSON.stringify(next));
        toast.success(`Se guardaron los estatutos ${payload.versionLabel}.`);
      } else {
        const data = await createStatuteVersionAPI(payload);
        setSaved(JSON.stringify(form));
        toast.success(`Se creó la versión ${payload.versionLabel}.`);
        router.replace(`/admin/estatutos/${data.id}`);
      }
    } catch (error) {
      toast.error(statutesErrorMessage(error, "No se pudo guardar la versión."));
    } finally {
      setSubmitting(false);
    }
  }, [form, item, router, toast]);

  // Ctrl/Cmd + S guarda
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (!submitting) void save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save, submitting]);

  const promote = async () => {
    if (!item) return;
    try {
      setPromoting(true);
      if (!item.published) await updateStatuteVersionAPI(item.id, { published: true });
      const data = await makeCurrentStatuteVersionAPI(item.id);
      const next = { ...item, ...data, isCurrent: true, published: true };
      setItem(next);
      setForm((f) => ({ ...f, published: true }));
      setSaved((s) => JSON.stringify({ ...JSON.parse(s), published: true }));
      toast.success(`Los estatutos ${item.versionLabel} ya son los vigentes.`);
      setPromoteOpen(false);
    } catch (error) {
      toast.error(statutesErrorMessage(error, "No se pudo marcar como vigente."));
    } finally {
      setPromoting(false);
    }
  };

  // Inserta una plantilla donde está el cursor (o envuelve la selección)
  const insert = (before: string, after = "", placeholder = "") => {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end, value } = el;
    const selected = value.slice(start, end) || placeholder;
    const needsBreak = before.startsWith("\n") || start === 0 || value[start - 1] === "\n" ? "" : "\n";
    const text = `${needsBreak}${before}${selected}${after}`;
    const next = value.slice(0, start) + text + value.slice(end);
    update({ content: next });
    requestAnimationFrame(() => {
      el.focus();
      const from = start + needsBreak.length + before.length;
      el.setSelectionRange(from, from + selected.length);
    });
  };

  const nextArticle = (() => {
    const numbers = allArticles(doc).map((a) => Number.parseInt(a.number, 10)).filter(Number.isFinite);
    return numbers.length ? Math.max(...numbers) + 1 : 1;
  })();

  const goToLine = (line?: number) => {
    const el = textareaRef.current;
    if (!el || !line) return;
    setPane("editar");
    const lines = el.value.split("\n");
    const start = lines.slice(0, line - 1).reduce((s, l) => s + l.length + 1, 0);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start, start + (lines[line - 1]?.length ?? 0));
      const lineHeight = Number.parseFloat(getComputedStyle(el).lineHeight) || 20;
      el.scrollTop = Math.max(0, (line - 4) * lineHeight);
    });
  };

  const goBack = () => {
    if (dirty && !window.confirm(LEAVE_MESSAGE)) return;
    setSaved(JSON.stringify(form));
    router.push("/admin/estatutos");
  };

  const heading = item ? `Estatutos ${item.versionLabel}` : source ? "Nueva versión (copia)" : "Nueva versión";
  const publicHref = item ? (item.isCurrent ? STATUTES_PATH : statuteVersionHref(item.slug)) : null;
  const toolbarButton =
    "inline-flex min-h-11 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jmv-blue/40 sm:min-h-9";

  if (loading) {
    return (
      <>
        <PageHeader title="Estatutos" breadcrumbs={[{ label: "Contenido" }, { label: "Estatutos", href: "/admin/estatutos" }]} />
        <div className="space-y-3 p-6" aria-hidden>
          <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-96 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </>
    );
  }

  if (loadError) {
    return (
      <>
        <PageHeader title="Estatutos" breadcrumbs={[{ label: "Contenido" }, { label: "Estatutos", href: "/admin/estatutos" }]} />
        <div className="m-6 flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
          No se pudo cargar la versión. Puede que se haya eliminado.
          <Link href="/admin/estatutos" className="font-semibold text-jmv-blue underline">
            Volver a las versiones
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={heading}
        description={item?.isCurrent ? "Esta es la versión vigente: los cambios se verán en el sitio al guardar." : "Los campos con * son obligatorios."}
        icon={<ScrollText className="h-[18px] w-[18px]" strokeWidth={2.1} />}
        breadcrumbs={[{ label: "Contenido" }, { label: "Estatutos", href: "/admin/estatutos" }, { label: item ? item.versionLabel : "Nueva" }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" className="min-h-11 sm:min-h-9" onClick={goBack} icon={<ArrowLeft className="h-4 w-4" aria-hidden />}>
              Volver
            </Button>
            {item && !item.isCurrent ? (
              <Button
                variant="outline"
                className="min-h-11 sm:min-h-9"
                onClick={() => (dirty ? toast.warning("Guarda los cambios antes de marcarla como vigente.") : setPromoteOpen(true))}
                icon={<BadgeCheck className="h-4 w-4" aria-hidden />}
              >
                Marcar como vigente
              </Button>
            ) : null}
            <Button
              variant="primary"
              className="min-h-11 sm:min-h-9"
              onClick={() => void save()}
              isLoading={submitting}
              icon={<Save className="h-4 w-4" aria-hidden />}
            >
              {item ? "Guardar cambios" : "Crear versión"}
            </Button>
          </div>
        }
      />

      <form
        ref={formRef}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
        className="flex flex-1 flex-col gap-6 overflow-auto px-4 py-5 sm:px-6"
      >
        {item?.isCurrent ? (
          <p className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
            <BadgeCheck className="h-5 w-5 shrink-0" aria-hidden />
            Vigente. Si vas a preparar una reforma, mejor
            <Link href={`/admin/estatutos/nueva?desde=${item.id}`} className="inline-flex items-center gap-1 font-semibold underline underline-offset-2">
              <Copy className="h-3.5 w-3.5" aria-hidden />
              duplícala
            </Link>
            y edita la copia.
          </p>
        ) : null}
        {source ? (
          <p className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-950">
            <Copy className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>
              Copia de los estatutos <strong>{source.versionLabel}</strong>. Cambia lo que reforme la Asamblea y completa la
              etiqueta, la fecha y quién la aprobó. Queda como borrador hasta que la publiques.
            </span>
          </p>
        ) : null}

        <fieldset className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
          <legend className="px-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">Datos de la versión</legend>
          <Field label="Título" required error={errors.title} className="sm:col-span-2">
            {({ id: fid, describedBy, invalid }) => (
              <input id={fid} value={form.title} onChange={(e) => update({ title: e.target.value })} maxLength={200} aria-invalid={invalid} aria-describedby={describedBy} className={inputClass} />
            )}
          </Field>
          <Field label="Etiqueta de la versión" required error={errors.versionLabel} hint="Corta, normalmente el año: 2010, 2027.">
            {({ id: fid, describedBy, invalid }) => (
              <input id={fid} value={form.versionLabel} onChange={(e) => update({ versionLabel: e.target.value })} maxLength={40} placeholder="Ej. 2027" aria-invalid={invalid} aria-describedby={describedBy} className={inputClass} />
            )}
          </Field>
          <Field label="Fecha de aprobación" required error={errors.approvedAt} hint="Si aún es borrador, pon la prevista.">
            {({ id: fid, describedBy, invalid }) => (
              <input id={fid} type="date" value={form.approvedAt} onChange={(e) => update({ approvedAt: e.target.value })} aria-invalid={invalid} aria-describedby={describedBy} className={inputClass} />
            )}
          </Field>
          <Field label="Aprobado por" required error={errors.approvedBy} className="sm:col-span-2">
            {({ id: fid, describedBy, invalid }) => (
              <input id={fid} value={form.approvedBy} onChange={(e) => update({ approvedBy: e.target.value })} maxLength={200} placeholder="Ej. P. G. Gregory Gay, C.M., Director General" aria-invalid={invalid} aria-describedby={describedBy} className={inputClass} />
            )}
          </Field>
          <Field label="PDF del original firmado" error={errors.pdfUrl} hint="Ruta /documentos/… o URL https. Opcional." className="sm:col-span-2">
            {({ id: fid, describedBy, invalid }) => (
              <input id={fid} value={form.pdfUrl} onChange={(e) => update({ pdfUrl: e.target.value })} placeholder="/documentos/estatutos-jmv-ecuador-2010.pdf" aria-invalid={invalid} aria-describedby={describedBy} className={inputClass} />
            )}
          </Field>
          <Field
            label="Resumen"
            error={errors.summary}
            hint={`Opcional. Aparece bajo el título de la página. ${form.summary.trim().length}/${SUMMARY_MAX}`}
            className="sm:col-span-2 lg:col-span-3"
          >
            {({ id: fid, describedBy, invalid }) => (
              <textarea id={fid} rows={2} value={form.summary} onChange={(e) => update({ summary: e.target.value })} aria-invalid={invalid} aria-describedby={describedBy} className={`${inputClass} resize-y py-2`} />
            )}
          </Field>
          <Field label="Dirección (slug)" error={errors.slug} hint="Opcional. Se genera sola.">
            {({ id: fid, describedBy, invalid }) => (
              <input id={fid} value={form.slug} onChange={(e) => update({ slug: e.target.value })} placeholder="estatutos-2027" aria-invalid={invalid} aria-describedby={describedBy} className={inputClass} />
            )}
          </Field>
          <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border-2 border-slate-200 bg-slate-50 p-3.5 has-[:checked]:border-jmv-blue has-[:checked]:bg-blue-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-jmv-blue/40 sm:col-span-2 lg:col-span-4">
            <input type="checkbox" checked={form.published} onChange={(e) => update({ published: e.target.checked })} className="mt-0.5 h-5 w-5 shrink-0 accent-jmv-blue" />
            <span>
              <span className="block text-sm font-semibold text-slate-800">Publicada</span>
              <span className="mt-0.5 block text-xs text-slate-500">
                Se puede ver en el sitio. Un borrador de reforma debe quedar sin publicar hasta que se apruebe.
                {item?.isCurrent && !form.published ? " Ojo: es la vigente; si la ocultas, la página quedará en «en preparación»." : ""}
              </span>
            </span>
          </label>
          {publicHref && item?.published ? (
            <a href={publicHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-jmv-blue underline-offset-4 hover:underline sm:col-span-2">
              <Eye className="h-4 w-4" aria-hidden />
              Ver en el sitio
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          ) : null}
        </fieldset>

        <section aria-labelledby="estatutos-editor-texto" className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="estatutos-editor-texto" className="text-[15px] font-bold text-slate-900">
              Texto de los estatutos<span className="ml-0.5 text-red-600" aria-hidden>*</span>
            </h2>
            <p className="text-xs text-slate-600" aria-live="polite">
              {countLabel(stats.chapters, "capítulo", "capítulos")} · {countLabel(stats.articles, "artículo", "artículos")} ·{" "}
              {countLabel(stats.numerals, "numeral", "numerales")}
              {dirty ? <span className="ml-2 font-semibold text-amber-700">· Sin guardar</span> : null}
            </p>
          </div>

          <FormatGuide />

          {errors.content ? (
            <p className="flex items-center gap-1.5 text-sm font-medium text-red-700">
              <CircleAlert className="h-4 w-4" aria-hidden />
              {errors.content}
            </p>
          ) : null}

          {form.content.trim() ? (
            issues.length ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3" role="status">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-amber-950">
                  <TriangleAlert className="h-4 w-4" aria-hidden />
                  {issues.length === 1 ? "1 aviso" : `${issues.length} avisos`} sobre el formato
                  <span className="font-normal text-amber-900">(puedes guardar igual; revisa si es una errata del original)</span>
                </p>
                <ul className="mt-2 max-h-32 space-y-0.5 overflow-auto text-xs text-amber-950">
                  {issues.map((issue, i) => (
                    <li key={i}>
                      {issue.line ? (
                        <button type="button" onClick={() => goToLine(issue.line)} className="min-h-8 text-left underline-offset-2 hover:underline">
                          <strong>Línea {issue.line}:</strong> {issue.message}
                        </button>
                      ) : (
                        issue.message
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-800" role="status">
                <CircleCheck className="h-4 w-4" aria-hidden />
                El formato se ve bien: sin numerales repetidos ni encabezados raros.
              </p>
            )
          ) : null}

          <div role="tablist" aria-label="Editor" className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 lg:hidden">
            {(["editar", "vista"] as const).map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                id={`tab-${value}`}
                aria-selected={pane === value}
                aria-controls={`panel-${value}`}
                onClick={() => setPane(value)}
                className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  pane === value ? "bg-white text-jmv-blue shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {value === "editar" ? <Pencil className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                {value === "editar" ? "Editar" : "Vista previa"}
              </button>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div id="panel-editar" role="tabpanel" aria-labelledby="tab-editar" className={`${pane === "editar" ? "flex" : "hidden"} min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-300 bg-white lg:flex`}>
              <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1" role="toolbar" aria-label="Insertar formato">
                <button type="button" className={toolbarButton} onClick={() => insert("\n## Capítulo ", " · Título del capítulo\n", "VI")}>
                  <Heading2 className="h-4 w-4" aria-hidden />
                  Capítulo
                </button>
                <button type="button" className={toolbarButton} onClick={() => insert(`\n### Artículo ${nextArticle} · `, "\n", "Título")}>
                  <Heading3 className="h-4 w-4" aria-hidden />
                  Artículo
                </button>
                <button type="button" className={toolbarButton} onClick={() => insert(`${nextArticle - 1 || 1}.1 `, "", "Texto del numeral")}>
                  <ListOrdered className="h-4 w-4" aria-hidden />
                  Numeral
                </button>
                <button type="button" className={toolbarButton} onClick={() => insert("- ", "", "Viñeta")}>
                  <List className="h-4 w-4" aria-hidden />
                  Viñeta
                </button>
                <button type="button" className={toolbarButton} onClick={() => insert("*", "*", "cursiva")} aria-label="Cursiva">
                  <Italic className="h-4 w-4" aria-hidden />
                  <span aria-hidden>Cursiva</span>
                </button>
              </div>
              <label htmlFor="estatutos-contenido" className="sr-only">
                Texto de los estatutos en formato de la guía
              </label>
              <textarea
                id="estatutos-contenido"
                ref={textareaRef}
                value={form.content}
                onChange={(e) => update({ content: e.target.value })}
                spellCheck={false}
                aria-invalid={Boolean(errors.content)}
                placeholder={"# Estatutos Nacionales…\n> Carta de aprobación…\n\n## Capítulo I · Identidad\n\n### Artículo 1 · Constitución\n1.1 …"}
                className="h-[65vh] min-h-80 w-full resize-y border-0 px-4 py-3 font-mono text-[13px] leading-5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-jmv-blue/30"
              />
            </div>
            <div id="panel-vista" role="tabpanel" aria-labelledby="tab-vista" aria-label="Vista previa" className={`${pane === "vista" ? "block" : "hidden"} h-[65vh] min-h-80 min-w-0 overflow-auto rounded-2xl border border-slate-200 bg-white lg:block`}>
              <p className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 backdrop-blur">
                Vista previa · así se verá en el sitio
              </p>
              <StatutePreview doc={doc} />
            </div>
          </div>
          <p className="text-xs text-slate-500">Atajo: Ctrl + S guarda.</p>
        </section>
      </form>

      <ConfirmDialog
        isOpen={promoteOpen}
        onClose={() => setPromoteOpen(false)}
        onConfirm={() => void promote()}
        title="¿Marcar como vigente?"
        message={
          item
            ? `Los estatutos ${item.versionLabel} pasarán a ser los oficiales en el sitio y la versión vigente actual quedará como anterior.${item.published ? "" : " También se publicará."}`
            : ""
        }
        confirmText="Sí, marcar como vigente"
        isLoading={promoting}
      />
    </>
  );
}
