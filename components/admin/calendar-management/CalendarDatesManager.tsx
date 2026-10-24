"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import {
  calendarErrorMessage,
  createCalendarDateAPI,
  deleteCalendarDateAPI,
  getCalendarDatesAPI,
  updateCalendarDateAPI,
  type CalendarDatePayload,
} from "@/actions/calendar-dates";
import Button from "@/components/admin/ui/Button";
import Modal from "@/components/admin/ui/Modal";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import PageHeader from "@/components/admin/layout/PageHeader";
import { useToast } from "@/lib/hooks/useToast";
import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import {
  CATEGORY_META,
  MONTHS,
  calendarHref,
  dayLabel,
  daysUntil,
  nextOccurrence,
} from "@/lib/calendario";
import type { CalendarCategory, CalendarDateItem } from "@/types/calendar";
import {
  BadgeCheck,
  Check,
  CircleAlert,
  ExternalLink,
  Eye,
  EyeOff,
  ImagePlus,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

const CATEGORIES = Object.keys(CATEGORY_META).filter(
  (key) => key !== "actividad"
) as CalendarCategory[];

// Febrero admite el 29 (la fecha se celebra los años bisiestos)
const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const SUMMARY_MIN = 10;
const SUMMARY_MAX = 600;

type StatusFilter = "todas" | "por-confirmar" | "ocultas" | "publicadas";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "por-confirmar", label: "Por confirmar" },
  { value: "ocultas", label: "Ocultas" },
  { value: "publicadas", label: "Publicadas" },
];

interface FormState {
  title: string;
  subtitle: string;
  month: number;
  day: number;
  year: string;
  category: CalendarCategory;
  summary: string;
  story: string;
  quote: string;
  quoteAuthor: string;
  challenge: string;
  imageUrl: string;
  image: File | null;
  source: string;
  verified: boolean;
  published: boolean;
  displayOrder: string;
  slug: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const emptyForm = (): FormState => ({
  title: "",
  subtitle: "",
  month: 1,
  day: 1,
  year: "",
  category: "maria",
  summary: "",
  story: "",
  quote: "",
  quoteAuthor: "",
  challenge: "",
  imageUrl: "",
  image: null,
  source: "",
  verified: false,
  published: true,
  displayOrder: "0",
  slug: "",
});

function toForm(item: CalendarDateItem): FormState {
  return {
    title: item.title,
    subtitle: item.subtitle ?? "",
    month: item.month,
    day: item.day,
    year: item.year ? String(item.year) : "",
    category: item.category,
    summary: item.summary,
    story: item.story ?? "",
    quote: item.quote ?? "",
    quoteAuthor: item.quoteAuthor ?? "",
    challenge: item.challenge ?? "",
    imageUrl: item.imageUrl ?? "",
    image: null,
    source: item.source ?? "",
    verified: item.verified,
    published: item.published,
    displayOrder: String(item.displayOrder ?? 0),
    slug: item.slug,
  };
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  const title = form.title.trim();
  if (title.length < 3) errors.title = "Escribe un título de al menos 3 letras.";
  else if (title.length > 150) errors.title = "El título puede tener hasta 150 caracteres.";

  if (form.day > DAYS_IN_MONTH[form.month - 1]) {
    errors.day = `${MONTHS[form.month - 1]} no tiene ${form.day} días.`;
  }

  if (form.year.trim()) {
    const year = Number(form.year);
    if (!Number.isInteger(year) || year < 1000 || year > 2100) {
      errors.year = "Escribe un año entre 1000 y 2100, o déjalo vacío.";
    }
  }

  const summary = form.summary.trim().length;
  if (summary < SUMMARY_MIN) errors.summary = `El resumen necesita al menos ${SUMMARY_MIN} caracteres.`;
  else if (summary > SUMMARY_MAX) errors.summary = `El resumen puede tener hasta ${SUMMARY_MAX} caracteres.`;

  if (form.imageUrl.trim() && !form.image && !/^(\/images\/|https:\/\/)\S+$/.test(form.imageUrl.trim())) {
    errors.imageUrl = "Usa una ruta /images/... o una dirección https://";
  }

  if (form.slug.trim() && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim())) {
    errors.slug = "Solo minúsculas sin tildes, números y guiones (ej. medalla-milagrosa).";
  }

  if (form.displayOrder.trim()) {
    const order = Number(form.displayOrder);
    if (!Number.isInteger(order) || order < 0 || order > 9999) {
      errors.displayOrder = "Usa un número entero entre 0 y 9999.";
    }
  }
  return errors;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function countdownLabel(month: number, day: number) {
  const days = daysUntil(nextOccurrence(month, day));
  if (days === 0) return "Es hoy";
  if (days === 1) return "Es mañana";
  return `Faltan ${days} días`;
}

// --- Piezas del formulario ---------------------------------------------------

const inputClass =
  "block min-h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-jmv-blue/30 aria-[invalid=true]:border-red-500 sm:min-h-10 border-slate-300 focus:border-jmv-blue";

function Field({
  label,
  required,
  hint,
  error,
  counter,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  counter?: ReactNode;
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-semibold text-slate-700">
          {label}
          {required && (
            <span className="ml-0.5 text-red-600" aria-hidden>
              *
            </span>
          )}
          {required && <span className="sr-only"> (obligatorio)</span>}
        </label>
        {counter}
      </div>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {error ? (
        <p id={errorId} className="mt-1 flex items-center gap-1 text-xs font-medium text-red-700">
          <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}
      {hint ? (
        <p id={hintId} className="mt-1 text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-1 flex w-full items-center gap-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{title}</span>
        <span className="h-px flex-1 bg-slate-200" aria-hidden />
      </legend>
      {children}
    </fieldset>
  );
}

function ToggleCard({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <label
      className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border-2 p-3.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-jmv-blue/40 ${
        checked ? "border-jmv-blue bg-blue-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 accent-jmv-blue"
      />
      <span>
        <span className="block text-sm font-semibold text-slate-800">{label}</span>
        <span className="mt-0.5 block text-xs text-slate-500">{description}</span>
      </span>
    </label>
  );
}

function CalendarDateForm({
  form,
  errors,
  onChange,
  existingImageUrl,
}: {
  form: FormState;
  errors: FormErrors;
  onChange: (changes: Partial<FormState>) => void;
  existingImageUrl?: string | null;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!form.image) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(form.image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [form.image]);

  const maxDay = DAYS_IN_MONTH[form.month - 1];
  const summaryLength = form.summary.trim().length;
  const shownImage = preview ?? (form.imageUrl.trim() ? getOptimizedUrl(form.imageUrl.trim(), { w: 600 }) : null);

  const changeMonth = (month: number) => {
    // Si el día ya no existe en el nuevo mes, se ajusta al último
    onChange({ month, day: Math.min(form.day, DAYS_IN_MONTH[month - 1]) });
  };

  return (
    <div className="space-y-7">
      <FormSection title="Fecha">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Mes" required>
            {({ id }) => (
              <select
                id={id}
                value={form.month}
                onChange={(e) => changeMonth(Number(e.target.value))}
                className={inputClass}
              >
                {MONTHS.map((name, i) => (
                  <option key={name} value={i + 1}>
                    {name}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Día" required error={errors.day}>
            {({ id, describedBy, invalid }) => (
              <select
                id={id}
                value={form.day}
                onChange={(e) => onChange({ day: Number(e.target.value) })}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                className={inputClass}
              >
                {Array.from({ length: maxDay }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field
            label="Año del hecho"
            error={errors.year}
            hint="Opcional. Sirve para mostrar «hace N años»."
          >
            {({ id, describedBy, invalid }) => (
              <input
                id={id}
                type="number"
                inputMode="numeric"
                min={1000}
                max={2100}
                value={form.year}
                onChange={(e) => onChange({ year: e.target.value })}
                placeholder="Ej. 1830"
                aria-invalid={invalid}
                aria-describedby={describedBy}
                className={inputClass}
              />
            )}
          </Field>
        </div>
        <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600" aria-live="polite">
          Se celebra el <strong className="text-slate-900">{dayLabel(form.month, form.day)}</strong>
          {" · "}
          {countdownLabel(form.month, form.day)}
          {form.month === 2 && form.day === 29 ? " · Solo en años bisiestos" : ""}
        </p>
      </FormSection>

      <FormSection title="Contenido">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Título" required error={errors.title}>
            {({ id, describedBy, invalid }) => (
              <input
                id={id}
                value={form.title}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder="Ej. Nuestra Señora de la Medalla Milagrosa"
                maxLength={150}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                className={inputClass}
              />
            )}
          </Field>
          <Field label="Subtítulo">
            {({ id }) => (
              <input
                id={id}
                value={form.subtitle}
                onChange={(e) => onChange({ subtitle: e.target.value })}
                placeholder="Ej. Aparición a santa Catalina Labouré"
                maxLength={200}
                className={inputClass}
              />
            )}
          </Field>
        </div>

        <fieldset>
          <legend className="mb-1.5 text-[13px] font-semibold text-slate-700">
            Categoría<span className="ml-0.5 text-red-600" aria-hidden>*</span>
          </legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((key) => {
              const meta = CATEGORY_META[key];
              const checked = form.category === key;
              return (
                <label
                  key={key}
                  className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border-2 px-3 py-2 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-jmv-blue/40 ${
                    checked ? "border-slate-800 bg-slate-50 font-semibold text-slate-900" : "border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="calendar-category"
                    value={key}
                    checked={checked}
                    onChange={() => onChange({ category: key })}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className="h-4 w-4 shrink-0 rounded-full ring-1 ring-black/20"
                    style={{ background: meta.color }}
                  />
                  {meta.label}
                </label>
              );
            })}
          </div>
        </fieldset>

        <Field
          label="Resumen"
          required
          error={errors.summary}
          hint="1 o 2 frases. Es lo que se ve en la tarjeta y al compartir."
          counter={
            <span
              className={`text-xs tabular-nums ${
                summaryLength > SUMMARY_MAX || (summaryLength > 0 && summaryLength < SUMMARY_MIN)
                  ? "font-semibold text-red-700"
                  : "text-slate-500"
              }`}
            >
              {summaryLength}/{SUMMARY_MAX}
            </span>
          }
        >
          {({ id, describedBy, invalid }) => (
            <textarea
              id={id}
              rows={3}
              value={form.summary}
              onChange={(e) => onChange({ summary: e.target.value })}
              aria-invalid={invalid}
              aria-describedby={describedBy}
              className={`${inputClass} resize-y py-2`}
            />
          )}
        </Field>

        <Field label="Historia" hint="Cuéntala para jóvenes. Separa los párrafos con una línea en blanco.">
          {({ id, describedBy }) => (
            <textarea
              id={id}
              rows={7}
              value={form.story}
              onChange={(e) => onChange({ story: e.target.value })}
              aria-describedby={describedBy}
              className={`${inputClass} resize-y py-2`}
            />
          )}
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_minmax(0,220px)]">
          <Field label="Frase o cita">
            {({ id }) => (
              <textarea
                id={id}
                rows={2}
                value={form.quote}
                onChange={(e) => onChange({ quote: e.target.value })}
                maxLength={600}
                className={`${inputClass} resize-y py-2`}
              />
            )}
          </Field>
          <Field label="Autor de la cita">
            {({ id }) => (
              <input
                id={id}
                value={form.quoteAuthor}
                onChange={(e) => onChange({ quoteAuthor: e.target.value })}
                placeholder="Ej. San Vicente de Paúl"
                maxLength={120}
                className={inputClass}
              />
            )}
          </Field>
        </div>

        <Field label="Reto: ¿cómo vivirlo hoy?" hint="Un gesto pequeño de oración o de servicio.">
          {({ id, describedBy }) => (
            <textarea
              id={id}
              rows={2}
              value={form.challenge}
              onChange={(e) => onChange({ challenge: e.target.value })}
              maxLength={600}
              aria-describedby={describedBy}
              className={`${inputClass} resize-y py-2`}
            />
          )}
        </Field>
      </FormSection>

      <FormSection title="Imagen">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[200px_1fr]">
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
            {shownImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={shownImage} alt="Vista previa de la imagen" className="h-full w-full object-cover" />
            ) : (
              <span className="flex flex-col items-center gap-1 text-xs text-slate-500">
                <ImagePlus className="h-6 w-6" aria-hidden />
                Sin imagen
              </span>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <label htmlFor="calendar-image-file" className="mb-1 block text-[13px] font-semibold text-slate-700">
                Subir imagen
              </label>
              <input
                ref={fileRef}
                id="calendar-image-file"
                type="file"
                accept="image/*"
                onChange={(e) => onChange({ image: e.target.files?.[0] ?? null })}
                className="block w-full text-sm text-slate-600 file:mr-3 file:min-h-10 file:rounded-lg file:border-0 file:bg-jmv-blue file:px-3 file:text-xs file:font-semibold file:text-white hover:file:bg-jmv-blue-dark"
              />
            </div>
            {!form.image ? (
              <Field
                label="O usa una ruta o URL"
                error={errors.imageUrl}
                hint="Ej. /images/santos/catalina.webp o una URL https de Cloudinary."
              >
                {({ id, describedBy, invalid }) => (
                  <input
                    id={id}
                    value={form.imageUrl}
                    onChange={(e) => onChange({ imageUrl: e.target.value })}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                    className={inputClass}
                  />
                )}
              </Field>
            ) : null}
            {form.image || form.imageUrl ? (
              <Button
                type="button"
                variant="outline"
                size="md"
                className="min-h-11 sm:min-h-9"
                icon={<X className="h-4 w-4" aria-hidden />}
                onClick={() => {
                  onChange({ image: null, imageUrl: "" });
                  if (fileRef.current) fileRef.current.value = "";
                }}
              >
                Quitar imagen
              </Button>
            ) : existingImageUrl ? (
              <p className="text-xs font-medium text-amber-800">La imagen actual se quitará al guardar.</p>
            ) : null}
          </div>
        </div>
      </FormSection>

      <FormSection title="Fuente y publicación">
        <Field
          label="Fuente"
          hint="De dónde sale el dato (libro, sitio oficial, asesor). Ayuda a confirmarlo."
        >
          {({ id, describedBy }) => (
            <textarea
              id={id}
              rows={2}
              value={form.source}
              onChange={(e) => onChange({ source: e.target.value })}
              maxLength={1000}
              aria-describedby={describedBy}
              className={`${inputClass} resize-y py-2`}
            />
          )}
        </Field>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ToggleCard
            checked={form.published}
            onChange={(published) => onChange({ published })}
            label="Publicada"
            description="Se ve en el sitio, en el feed y en la home."
          />
          <ToggleCard
            checked={form.verified}
            onChange={(verified) => onChange({ verified })}
            label="Verificada"
            description="Un asesor la confirmó. Si no, se muestra «por confirmar»."
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Orden en el mismo día"
            error={errors.displayOrder}
            hint="Si hay varias fechas el mismo día, va primero el número menor."
          >
            {({ id, describedBy, invalid }) => (
              <input
                id={id}
                type="number"
                inputMode="numeric"
                min={0}
                max={9999}
                value={form.displayOrder}
                onChange={(e) => onChange({ displayOrder: e.target.value })}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                className={inputClass}
              />
            )}
          </Field>
          <Field
            label="Dirección (slug)"
            error={errors.slug}
            hint="Opcional. Si lo dejas vacío se crea a partir del título."
          >
            {({ id, describedBy, invalid }) => (
              <input
                id={id}
                value={form.slug}
                onChange={(e) => onChange({ slug: e.target.value })}
                placeholder="medalla-milagrosa"
                autoCapitalize="none"
                spellCheck={false}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                className={inputClass}
              />
            )}
          </Field>
        </div>
      </FormSection>
    </div>
  );
}

// --- Gestor --------------------------------------------------------------------

export default function CalendarDatesManager() {
  const toast = useToast();
  const [items, setItems] = useState<CalendarDateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CalendarCategory | "todas">("todas");
  const [status, setStatus] = useState<StatusFilter>("todas");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarDateItem | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [toDelete, setToDelete] = useState<CalendarDateItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyToggle, setBusyToggle] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const loadAll = async () => {
    try {
      setLoading(true);
      const data = await getCalendarDatesAPI();
      setItems(data.items ?? []);
      setLoadError(false);
    } catch {
      setLoadError(true);
      toast.error("No se pudieron cargar las fechas del Año Vicenciano.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pendingCount = items.filter((i) => !i.verified).length;
  const hiddenCount = items.filter((i) => !i.published).length;

  const filtered = useMemo(() => {
    const term = normalizeText(search.trim());
    return items
      .filter((item) => category === "todas" || item.category === category)
      .filter((item) => {
        if (status === "por-confirmar") return !item.verified;
        if (status === "ocultas") return !item.published;
        if (status === "publicadas") return item.published;
        return true;
      })
      .filter((item) => {
        if (!term) return true;
        return [item.title, item.subtitle, item.summary, item.quoteAuthor, item.slug]
          .filter(Boolean)
          .some((value) => normalizeText(value!).includes(term));
      })
      .sort((a, b) => a.month - b.month || a.day - b.day || a.displayOrder - b.displayOrder);
  }, [items, search, category, status]);

  const byMonth = useMemo(() => {
    const groups = new Map<number, CalendarDateItem[]>();
    for (const item of filtered) {
      const list = groups.get(item.month) ?? [];
      list.push(item);
      groups.set(item.month, list);
    }
    return [...groups.entries()];
  }, [filtered]);

  const hasFilters = Boolean(search.trim()) || category !== "todas" || status !== "todas";

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setErrors({});
    setIsModalOpen(true);
  };

  const openEdit = (item: CalendarDateItem) => {
    setEditing(item);
    setForm(toForm(item));
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const updateForm = (changes: Partial<FormState>) => {
    setForm((current) => ({ ...current, ...changes }));
    // El error de un campo desaparece en cuanto se corrige
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(changes) as (keyof FormState)[]) delete next[key];
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      toast.error("Revisa los campos marcados.");
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      });
      return;
    }

    const imageUrl = form.imageUrl.trim();
    const payload: CalendarDatePayload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      month: form.month,
      day: form.day,
      year: form.year.trim() ? Number(form.year) : null,
      category: form.category,
      summary: form.summary.trim(),
      story: form.story.trim(),
      quote: form.quote.trim(),
      quoteAuthor: form.quoteAuthor.trim(),
      challenge: form.challenge.trim(),
      source: form.source.trim(),
      verified: form.verified,
      published: form.published,
      displayOrder: form.displayOrder.trim() ? Number(form.displayOrder) : 0,
      image: form.image,
    };
    if (form.slug.trim()) payload.slug = form.slug.trim();

    if (!form.image) {
      if (editing) {
        const previous = editing.imageUrl ?? "";
        if (!imageUrl && previous) payload.removeImage = true;
        else if (imageUrl !== previous) payload.imageUrl = imageUrl;
      } else if (imageUrl) {
        payload.imageUrl = imageUrl;
      }
    }

    try {
      setSubmitting(true);
      if (editing) {
        await updateCalendarDateAPI(editing.id, payload);
        toast.success(`«${payload.title}» se actualizó.`);
      } else {
        await createCalendarDateAPI(payload);
        toast.success(`«${payload.title}» se agregó al Año Vicenciano.`);
      }
      closeModal();
      await loadAll();
    } catch (error) {
      toast.error(calendarErrorMessage(error, "No se pudo guardar la fecha."));
    } finally {
      setSubmitting(false);
    }
  };

  const toggle = async (item: CalendarDateItem, field: "published" | "verified") => {
    const value = !item[field];
    setBusyToggle(`${item.id}-${field}`);
    setItems((current) => current.map((i) => (i.id === item.id ? { ...i, [field]: value } : i)));
    try {
      await updateCalendarDateAPI(item.id, { [field]: value });
      toast.success(
        field === "published"
          ? value
            ? `«${item.title}» ya se ve en el sitio.`
            : `«${item.title}» quedó oculta.`
          : value
            ? `«${item.title}» quedó verificada.`
            : `«${item.title}» volvió a «por confirmar».`
      );
    } catch (error) {
      setItems((current) => current.map((i) => (i.id === item.id ? { ...i, [field]: !value } : i)));
      toast.error(calendarErrorMessage(error, "No se pudo cambiar el estado."));
    } finally {
      setBusyToggle(null);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      setDeleting(true);
      await deleteCalendarDateAPI(toDelete.id);
      toast.success(`«${toDelete.title}» se eliminó.`);
      setToDelete(null);
      await loadAll();
    } catch (error) {
      toast.error(calendarErrorMessage(error, "No se pudo eliminar la fecha."));
    } finally {
      setDeleting(false);
    }
  };

  const selectClass =
    "min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] text-slate-900 focus:border-jmv-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-jmv-blue/15 sm:min-h-9";

  return (
    <>
      <PageHeader
        title="Año Vicenciano"
        description="Fechas de María, los fundadores, los santos y JMV que se muestran en /calendario."
        icon={<Sparkles className="h-[18px] w-[18px]" strokeWidth={2.1} />}
        breadcrumbs={[{ label: "Contenido" }, { label: "Año Vicenciano" }]}
        actions={
          <Button
            variant="primary"
            size="md"
            className="min-h-11 sm:min-h-9"
            onClick={openCreate}
            icon={<Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />}
          >
            Nueva fecha
          </Button>
        }
      />

      <div className="flex flex-1 flex-col overflow-auto px-4 py-5 sm:px-6">
        <div
          role="search"
          aria-label="Filtrar fechas"
          className="mb-4 flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:flex-wrap sm:items-center"
        >
          <div className="relative flex-1 sm:min-w-56">
            <label htmlFor="calendar-search" className="sr-only">
              Buscar fechas
            </label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              id="calendar-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título, resumen o autor…"
              className={`${selectClass} w-full pl-9`}
            />
          </div>
          <label htmlFor="calendar-category-filter" className="sr-only">
            Categoría
          </label>
          <select
            id="calendar-category-filter"
            value={category}
            onChange={(e) => setCategory(e.target.value as CalendarCategory | "todas")}
            className={selectClass}
          >
            <option value="todas">Todas las categorías</option>
            {CATEGORIES.map((key) => (
              <option key={key} value={key}>
                {CATEGORY_META[key].label}
              </option>
            ))}
          </select>
          <label htmlFor="calendar-status-filter" className="sr-only">
            Estado
          </label>
          <select
            id="calendar-status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className={selectClass}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value === "por-confirmar"
                  ? `Por confirmar (${pendingCount})`
                  : option.value === "ocultas"
                    ? `Ocultas (${hiddenCount})`
                    : option.label}
              </option>
            ))}
          </select>
          {hasFilters ? (
            <Button
              variant="ghost"
              size="md"
              className="min-h-11 sm:min-h-9"
              onClick={() => {
                setSearch("");
                setCategory("todas");
                setStatus("todas");
              }}
            >
              Limpiar filtros
            </Button>
          ) : null}
        </div>

        <p className="mb-4 text-[12.5px] text-slate-600" aria-live="polite">
          {loading ? (
            "Cargando fechas…"
          ) : (
            <>
              Mostrando <strong className="font-bold text-slate-900">{filtered.length}</strong> de {items.length}{" "}
              fecha{items.length === 1 ? "" : "s"}
              {pendingCount ? ` · ${pendingCount} por confirmar` : ""}
              {hiddenCount ? ` · ${hiddenCount} oculta${hiddenCount === 1 ? "" : "s"}` : ""}
            </>
          )}
        </p>

        {loading ? (
          <div className="space-y-3" aria-hidden>
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
            No se pudieron cargar las fechas.
            <Button variant="outline" onClick={() => void loadAll()}>
              Reintentar
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
            {items.length === 0
              ? "Todavía no hay fechas. Agrega la primera: por ejemplo, la Medalla Milagrosa el 27 de noviembre."
              : "Ninguna fecha coincide con los filtros."}
            {items.length === 0 ? (
              <Button variant="primary" onClick={openCreate} icon={<Plus className="h-4 w-4" aria-hidden />}>
                Nueva fecha
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="space-y-6">
            {byMonth.map(([month, list]) => (
              <section key={month} aria-labelledby={`mes-${month}`}>
                <h2
                  id={`mes-${month}`}
                  className="mb-2 flex items-baseline gap-2 text-[15px] font-bold text-slate-900"
                >
                  {MONTHS[month - 1]}
                  <span className="text-xs font-medium text-slate-500">
                    {list.length} fecha{list.length === 1 ? "" : "s"}
                  </span>
                </h2>
                <ul className="space-y-2">
                  {list.map((item) => (
                    <CalendarDateRow
                      key={item.id}
                      item={item}
                      busyToggle={busyToggle}
                      onEdit={() => openEdit(item)}
                      onDelete={() => setToDelete(item)}
                      onToggle={(field) => void toggle(item, field)}
                    />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editing ? "Editar fecha" : "Nueva fecha del Año Vicenciano"}
        description="Los campos con * son obligatorios."
        size="xl"
      >
        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          <div className="p-5 sm:p-6">
            <CalendarDateForm
              form={form}
              errors={errors}
              onChange={updateForm}
              existingImageUrl={editing?.imageUrl}
            />
          </div>
          <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-slate-100 bg-white/95 px-5 py-3 backdrop-blur sm:flex-row sm:justify-end sm:px-6">
            <Button type="button" variant="ghost" className="min-h-11 sm:min-h-9" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="min-h-11 sm:min-h-9"
              isLoading={submitting}
              icon={<Sparkles className="h-4 w-4" aria-hidden />}
            >
              {editing ? "Guardar cambios" : "Crear fecha"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={() => void confirmDelete()}
        title="¿Eliminar esta fecha?"
        message={
          toDelete
            ? `«${toDelete.title}» (${dayLabel(toDelete.month, toDelete.day)}) desaparecerá del calendario, del feed y de la home. No se puede deshacer; si solo quieres esconderla, desmarca «Publicada».`
            : ""
        }
        confirmText="Sí, eliminar"
        variant="danger"
        isLoading={deleting}
      />
    </>
  );
}

function CalendarDateRow({
  item,
  busyToggle,
  onEdit,
  onDelete,
  onToggle,
}: {
  item: CalendarDateItem;
  busyToggle: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (field: "published" | "verified") => void;
}) {
  const meta = CATEGORY_META[item.category];
  const iconButton =
    "inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jmv-blue/40 sm:h-9 sm:w-9";
  const toggleButton =
    "inline-flex min-h-11 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jmv-blue/40 disabled:opacity-60 sm:min-h-9";

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-slate-300 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div
          className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border-l-4 bg-slate-50"
          style={{ borderLeftColor: meta.color }}
          aria-hidden
        >
          <span className="text-xl font-bold leading-none text-slate-900">{item.day}</span>
          <span className="mt-0.5 text-[10px] font-semibold uppercase text-slate-500">
            {MONTHS[item.month - 1].slice(0, 3)}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[14.5px] font-bold leading-tight text-slate-900">
            <span className="sr-only">{dayLabel(item.month, item.day)}: </span>
            {item.title}
          </h3>
          {item.subtitle ? <p className="mt-0.5 line-clamp-1 text-xs text-slate-600">{item.subtitle}</p> : null}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold text-slate-800"
              style={{ background: meta.soft.replace("0.16", "0.28") }}
            >
              <span className="h-2 w-2 rounded-full ring-1 ring-black/20" style={{ background: meta.color }} aria-hidden />
              {meta.label}
            </span>
            {!item.verified ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900">
                <CircleAlert className="h-3 w-3" aria-hidden />
                Por confirmar
              </span>
            ) : null}
            {!item.published ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-800">
                <EyeOff className="h-3 w-3" aria-hidden />
                Oculta
              </span>
            ) : null}
            {item.year ? <span className="text-[11px] text-slate-500">Desde {item.year}</span> : null}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1 border-t border-slate-100 pt-2 sm:border-0 sm:pt-0">
        <button
          type="button"
          onClick={() => onToggle("published")}
          disabled={busyToggle === `${item.id}-published`}
          aria-pressed={item.published}
          aria-label={`Publicada: ${item.title}`}
          title={item.published ? "Publicada (clic para ocultar)" : "Oculta (clic para publicar)"}
          className={`${toggleButton} ${item.published ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100" : "border-slate-200 text-slate-600 hover:bg-slate-100"}`}
        >
          {item.published ? <Eye className="hidden h-4 w-4 sm:block" aria-hidden /> : <EyeOff className="hidden h-4 w-4 sm:block" aria-hidden />}
          {item.published ? <Check className="h-3.5 w-3.5 sm:hidden" strokeWidth={3} aria-hidden /> : null}
          Publicada
        </button>
        <button
          type="button"
          onClick={() => onToggle("verified")}
          disabled={busyToggle === `${item.id}-verified`}
          aria-pressed={item.verified}
          aria-label={`Verificada: ${item.title}`}
          title={item.verified ? "Verificada (clic para marcar por confirmar)" : "Por confirmar (clic para verificar)"}
          className={`${toggleButton} ${item.verified ? "border-blue-200 bg-blue-50 text-jmv-blue hover:bg-blue-100" : "border-slate-200 text-slate-600 hover:bg-slate-100"}`}
        >
          {item.verified ? <BadgeCheck className="hidden h-4 w-4 sm:block" aria-hidden /> : <CircleAlert className="hidden h-4 w-4 sm:block" aria-hidden />}
          {item.verified ? <Check className="h-3.5 w-3.5 sm:hidden" strokeWidth={3} aria-hidden /> : null}
          Verificada
        </button>
        {item.published ? (
          <a
            href={calendarHref(item.slug)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${iconButton} text-slate-600 hover:bg-slate-100 hover:text-jmv-blue`}
            title="Ver en el sitio"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            <span className="sr-only">Ver «{item.title}» en el sitio (se abre en una pestaña nueva)</span>
          </a>
        ) : (
          <span
            className={`${iconButton} cursor-not-allowed text-slate-300`}
            title="Publícala para verla en el sitio"
            aria-hidden
          >
            <ExternalLink className="h-4 w-4" />
          </span>
        )}
        <button
          type="button"
          onClick={onEdit}
          className={`${iconButton} text-slate-600 hover:bg-jmv-blue/10 hover:text-jmv-blue`}
          aria-label={`Editar ${item.title}`}
          title="Editar"
        >
          <Pencil className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className={`${iconButton} text-slate-600 hover:bg-red-50 hover:text-red-700`}
          aria-label={`Eliminar ${item.title}`}
          title="Eliminar"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </li>
  );
}
