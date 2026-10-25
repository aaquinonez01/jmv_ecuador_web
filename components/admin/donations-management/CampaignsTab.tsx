"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, Check, CircleDollarSign, Eye, EyeOff, Pencil, Plus, Target, Trash2 } from "lucide-react";
import {
  createDonationCampaignAPI,
  deleteDonationCampaignAPI,
  donationsErrorMessage,
  getDonationCampaignsAPI,
  updateDonationCampaignAPI,
  type DonationCampaignPayload,
} from "@/actions/donations";
import Button from "@/components/admin/ui/Button";
import Modal from "@/components/admin/ui/Modal";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import { useToast } from "@/lib/hooks/useToast";
import { campaignDates, campaignProgress, formatMoney } from "@/components/donar/shared";
import type { DonationCampaign } from "@/types/donations";
import {
  Field,
  FormSection,
  ImagePicker,
  ListState,
  OrderButtons,
  SLUG_PATTERN,
  ToggleCard,
  iconButton,
  inputClass,
  moveItem,
  toggleButton,
} from "./shared";

interface FormState {
  title: string;
  description: string;
  goalAmount: string;
  raisedAmount: string;
  startsAt: string;
  endsAt: string;
  slug: string;
  active: boolean;
  image: File | null;
  removeImage: boolean;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const emptyForm = (): FormState => ({
  title: "",
  description: "",
  goalAmount: "",
  raisedAmount: "",
  startsAt: "",
  endsAt: "",
  slug: "",
  active: true,
  image: null,
  removeImage: false,
});

const toDateInput = (value?: string | null) => (value ? value.slice(0, 10) : "");
const toAmountInput = (value?: number | string | null) =>
  value === null || value === undefined || value === "" ? "" : String(Number(value));

function toForm(campaign: DonationCampaign): FormState {
  return {
    title: campaign.title,
    description: campaign.description,
    goalAmount: toAmountInput(campaign.goalAmount),
    raisedAmount: toAmountInput(campaign.raisedAmount),
    startsAt: toDateInput(campaign.startsAt),
    endsAt: toDateInput(campaign.endsAt),
    slug: campaign.slug,
    active: campaign.active,
    image: null,
    removeImage: false,
  };
}

/** "1500", "1.500", "1.250,50", "1,250.50" o "1250.50" → número; NaN si no se entiende */
function parseAmount(value: string): number | null {
  const raw = value.trim().replace(/\s|\$/g, "");
  if (!raw) return null;
  let normalized: string;
  if (/^\d+$/.test(raw)) normalized = raw;
  else if (/^\d+[.,]\d{1,2}$/.test(raw)) normalized = raw.replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+(,\d{1,2})?$/.test(raw)) normalized = raw.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(,\d{3})+(\.\d{1,2})?$/.test(raw)) normalized = raw.replace(/,/g, "");
  else return NaN;
  const n = Number(normalized);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : NaN;
}

function amountError(value: string) {
  const n = parseAmount(value);
  if (n === null) return undefined;
  if (Number.isNaN(n) || n < 0) return "Escribe un monto en dólares (ej. 1500, 1.500 o 1500,50).";
  return undefined;
}

/** Vista previa del monto tal como se verá en /donar */
function amountPreview(value: string) {
  const n = parseAmount(value);
  return n === null || Number.isNaN(n) ? null : `Se verá como ${formatMoney(n)}.`;
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (form.title.trim().length < 3) errors.title = "Escribe un título de al menos 3 letras.";
  if (form.description.trim().length < 10) errors.description = "La descripción necesita al menos 10 caracteres.";
  const goal = amountError(form.goalAmount);
  if (goal) errors.goalAmount = goal;
  else if (parseAmount(form.goalAmount) === 0) errors.goalAmount = "La meta debe ser mayor que 0, o déjala vacía.";
  const raised = amountError(form.raisedAmount);
  if (raised) errors.raisedAmount = raised;
  if (form.startsAt && form.endsAt && form.endsAt < form.startsAt) errors.endsAt = "La fecha de cierre es anterior al inicio.";
  if (form.slug.trim() && !SLUG_PATTERN.test(form.slug.trim()))
    errors.slug = "Solo minúsculas sin tildes, números y guiones (ej. navidad-2026).";
  return errors;
}

export default function CampaignsTab() {
  const toast = useToast();
  const [items, setItems] = useState<DonationCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<DonationCampaign | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toDelete, setToDelete] = useState<DonationCampaign | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [raisedFor, setRaisedFor] = useState<DonationCampaign | null>(null);
  const [raisedValue, setRaisedValue] = useState("");
  const [raisedError, setRaisedError] = useState<string | undefined>();
  const [savingRaised, setSavingRaised] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getDonationCampaignsAPI();
      setItems([...data].sort((a, b) => a.displayOrder - b.displayOrder));
      setLoadError(false);
    } catch {
      setLoadError(true);
      toast.error("No se pudieron cargar las campañas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setErrors({});
    setIsModalOpen(true);
  };

  const openEdit = (campaign: DonationCampaign) => {
    setEditing(campaign);
    setForm(toForm(campaign));
    setErrors({});
    setIsModalOpen(true);
  };

  const update = (changes: Partial<FormState>) => {
    setForm((current) => ({ ...current, ...changes }));
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
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    const payload: DonationCampaignPayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      goalAmount: parseAmount(form.goalAmount),
      raisedAmount: parseAmount(form.raisedAmount),
      startsAt: form.startsAt || null,
      endsAt: form.endsAt || null,
      active: form.active,
      image: form.image,
      removeImage: !form.image && form.removeImage,
    };
    if (form.slug.trim()) payload.slug = form.slug.trim();
    try {
      setSubmitting(true);
      if (editing) {
        await updateDonationCampaignAPI(editing.id, payload);
        toast.success(`«${payload.title}» se actualizó.`);
      } else {
        await createDonationCampaignAPI({ ...payload, displayOrder: items.length });
        toast.success(`«${payload.title}» se creó.`);
      }
      setIsModalOpen(false);
      await load();
    } catch (error) {
      toast.error(donationsErrorMessage(error, "No se pudo guardar la campaña."));
    } finally {
      setSubmitting(false);
    }
  };

  const openRaised = (campaign: DonationCampaign) => {
    setRaisedFor(campaign);
    setRaisedValue(toAmountInput(campaign.raisedAmount));
    setRaisedError(undefined);
  };

  const saveRaised = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!raisedFor) return;
    const error = amountError(raisedValue);
    if (error) {
      setRaisedError(error);
      return;
    }
    const raisedAmount = parseAmount(raisedValue) ?? 0;
    try {
      setSavingRaised(true);
      await updateDonationCampaignAPI(raisedFor.id, { raisedAmount });
      setItems((current) => current.map((c) => (c.id === raisedFor.id ? { ...c, raisedAmount } : c)));
      toast.success(`Recaudado de «${raisedFor.title}»: ${formatMoney(raisedAmount)}.`);
      setRaisedFor(null);
    } catch (err) {
      toast.error(donationsErrorMessage(err, "No se pudo actualizar el monto."));
    } finally {
      setSavingRaised(false);
    }
  };

  const toggleActive = async (campaign: DonationCampaign) => {
    const active = !campaign.active;
    setItems((current) => current.map((c) => (c.id === campaign.id ? { ...c, active } : c)));
    try {
      await updateDonationCampaignAPI(campaign.id, { active });
      toast.success(active ? `«${campaign.title}» quedó activa.` : `«${campaign.title}» quedó oculta.`);
    } catch (error) {
      setItems((current) => current.map((c) => (c.id === campaign.id ? { ...c, active: !active } : c)));
      toast.error(donationsErrorMessage(error, "No se pudo cambiar el estado."));
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const previous = items;
    const { next, changed } = moveItem(items, index, direction);
    if (!changed.length) return;
    setItems(next);
    setBusy(true);
    try {
      await Promise.all(changed.map((c) => updateDonationCampaignAPI(c.id, { displayOrder: c.displayOrder })));
    } catch (error) {
      setItems(previous);
      toast.error(donationsErrorMessage(error, "No se pudo cambiar el orden."));
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      setDeleting(true);
      await deleteDonationCampaignAPI(toDelete.id);
      toast.success(`«${toDelete.title}» se eliminó.`);
      setToDelete(null);
      await load();
    } catch (error) {
      toast.error(donationsErrorMessage(error, "No se pudo eliminar la campaña."));
    } finally {
      setDeleting(false);
    }
  };

  // "AAAA-MM-DD" en hora de Ecuador
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Guayaquil" }).format(new Date());

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-xl text-[12.5px] text-slate-600" aria-live="polite">
          {loading
            ? "Cargando campañas…"
            : "En /donar solo se ven las campañas activas y dentro de sus fechas. Si no hay ninguna, la sección no aparece."}
        </p>
        <Button
          variant="primary"
          className="min-h-11 sm:min-h-9"
          onClick={openCreate}
          icon={<Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />}
        >
          Nueva campaña
        </Button>
      </div>

      <ListState
        loading={loading}
        error={loadError}
        empty={items.length === 0}
        emptyText="Todavía no hay campañas. Crea una cuando haya una meta concreta (por ejemplo, la misión de Navidad)."
        onRetry={() => void load()}
      />

      {!loading && !loadError && items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((campaign, index) => {
            const progress = campaignProgress(campaign);
            const dates = campaignDates(campaign);
            const ended = Boolean(campaign.endsAt && toDateInput(campaign.endsAt) < today);
            const upcoming = Boolean(campaign.startsAt && toDateInput(campaign.startsAt) > today);
            return (
              <li key={campaign.id} className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[14.5px] font-bold leading-tight text-slate-900">{campaign.title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                      {dates ? (
                        <span className="inline-flex items-center gap-1 text-slate-600">
                          <CalendarDays className="h-3 w-3" aria-hidden />
                          {dates}
                        </span>
                      ) : null}
                      {!campaign.active ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-200 px-2 py-0.5 font-semibold text-slate-800">
                          <EyeOff className="h-3 w-3" aria-hidden />
                          Oculta
                        </span>
                      ) : ended ? (
                        <span className="rounded-md bg-amber-100 px-2 py-0.5 font-semibold text-amber-900">Terminada</span>
                      ) : upcoming ? (
                        <span className="rounded-md bg-blue-100 px-2 py-0.5 font-semibold text-blue-900">Aún no empieza</span>
                      ) : (
                        <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-900">En /donar</span>
                      )}
                    </div>
                    {progress ? (
                      <div className="mt-2 max-w-md">
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                          <Target className="h-3.5 w-3.5 text-jmv-gold-ink" aria-hidden />
                          {progress.label}
                        </p>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200" aria-hidden>
                          <div className="h-full rounded-full bg-jmv-gold" style={{ width: `${progress.bar}%` }} />
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-slate-500">Sin meta: no se muestra barra de progreso.</p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1 border-t border-slate-100 pt-2 sm:border-0 sm:pt-0">
                    <Button
                      variant="secondary"
                      className="min-h-11 sm:min-h-9"
                      onClick={() => openRaised(campaign)}
                      icon={<CircleDollarSign className="h-4 w-4" aria-hidden />}
                      aria-label={`Actualizar recaudado de ${campaign.title}`}
                    >
                      Actualizar recaudado
                    </Button>
                    <button
                      type="button"
                      onClick={() => void toggleActive(campaign)}
                      aria-pressed={campaign.active}
                      aria-label={`Activa: ${campaign.title}`}
                      className={`${toggleButton} ${
                        campaign.active
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          : "border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {campaign.active ? <Eye className="h-4 w-4" aria-hidden /> : <EyeOff className="h-4 w-4" aria-hidden />}
                      {campaign.active ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden /> : null}
                      Activa
                    </button>
                    <OrderButtons
                      index={index}
                      total={items.length}
                      label={campaign.title}
                      disabled={busy}
                      onMove={(direction) => void move(index, direction)}
                    />
                    <button
                      type="button"
                      onClick={() => openEdit(campaign)}
                      className={`${iconButton} text-slate-600 hover:bg-jmv-blue/10 hover:text-jmv-blue`}
                      aria-label={`Editar ${campaign.title}`}
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => setToDelete(campaign)}
                      className={`${iconButton} text-slate-600 hover:bg-red-50 hover:text-red-700`}
                      aria-label={`Eliminar ${campaign.title}`}
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? "Editar campaña" : "Nueva campaña"}
        description="Los campos con * son obligatorios. Los montos van en dólares (USD)."
        size="xl"
      >
        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          <div className="space-y-7 p-5 sm:p-6">
            <FormSection title="Contenido">
              <Field label="Título" required error={errors.title}>
                {({ id, describedBy, invalid }) => (
                  <input
                    id={id}
                    value={form.title}
                    onChange={(e) => update({ title: e.target.value })}
                    placeholder="Ej. Misión de Navidad 2026"
                    maxLength={150}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                    className={inputClass}
                  />
                )}
              </Field>
              <Field label="Descripción" required error={errors.description} hint="Para qué es y a quién ayuda.">
                {({ id, describedBy, invalid }) => (
                  <textarea
                    id={id}
                    rows={4}
                    value={form.description}
                    onChange={(e) => update({ description: e.target.value })}
                    maxLength={1000}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                    className={`${inputClass} resize-y py-2`}
                  />
                )}
              </Field>
            </FormSection>

            <FormSection title="Meta y fechas">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Meta (USD)" error={errors.goalAmount} hint={amountPreview(form.goalAmount) ?? "Opcional. Sin meta no hay barra de progreso."}>
                  {({ id, describedBy, invalid }) => (
                    <input
                      id={id}
                      inputMode="decimal"
                      value={form.goalAmount}
                      onChange={(e) => update({ goalAmount: e.target.value })}
                      placeholder="3000"
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                      className={inputClass}
                    />
                  )}
                </Field>
                <Field label="Recaudado (USD)" error={errors.raisedAmount} hint={amountPreview(form.raisedAmount) ?? "Lo actualiza el Tesorero/a."}>
                  {({ id, describedBy, invalid }) => (
                    <input
                      id={id}
                      inputMode="decimal"
                      value={form.raisedAmount}
                      onChange={(e) => update({ raisedAmount: e.target.value })}
                      placeholder="0"
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                      className={inputClass}
                    />
                  )}
                </Field>
                <Field label="Empieza" hint="Opcional.">
                  {({ id, describedBy }) => (
                    <input
                      id={id}
                      type="date"
                      value={form.startsAt}
                      onChange={(e) => update({ startsAt: e.target.value })}
                      aria-describedby={describedBy}
                      className={inputClass}
                    />
                  )}
                </Field>
                <Field label="Termina" error={errors.endsAt} hint="Opcional. Después de esta fecha deja de verse.">
                  {({ id, describedBy, invalid }) => (
                    <input
                      id={id}
                      type="date"
                      value={form.endsAt}
                      min={form.startsAt || undefined}
                      onChange={(e) => update({ endsAt: e.target.value })}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                      className={inputClass}
                    />
                  )}
                </Field>
              </div>
            </FormSection>

            <FormSection title="Imagen (opcional)">
              <ImagePicker
                label="Subir imagen"
                file={form.image}
                currentUrl={editing?.imageUrl}
                removed={form.removeImage}
                onFile={(image) => update({ image, removeImage: false })}
                onRemove={() => update({ removeImage: true })}
                hint="Una foto real de la actividad, horizontal."
              />
            </FormSection>

            <FormSection title="Publicación">
              <ToggleCard
                checked={form.active}
                onChange={(active) => update({ active })}
                label="Activa"
                description="Se ve en /donar mientras esté dentro de sus fechas."
              />
              <Field label="Dirección (slug)" error={errors.slug} hint="Opcional. Si lo dejas vacío se crea a partir del título.">
                {({ id, describedBy, invalid }) => (
                  <input
                    id={id}
                    value={form.slug}
                    onChange={(e) => update({ slug: e.target.value })}
                    placeholder="mision-navidad-2026"
                    autoCapitalize="none"
                    spellCheck={false}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                    className={inputClass}
                  />
                )}
              </Field>
            </FormSection>
          </div>
          <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-slate-100 bg-white/95 px-5 py-3 backdrop-blur sm:flex-row sm:justify-end sm:px-6">
            <Button type="button" variant="ghost" className="min-h-11 sm:min-h-9" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="min-h-11 sm:min-h-9" isLoading={submitting}>
              {editing ? "Guardar cambios" : "Crear campaña"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(raisedFor)}
        onClose={() => setRaisedFor(null)}
        title="Actualizar recaudado"
        description={raisedFor ? `${raisedFor.title}${raisedFor.goalAmount ? ` · Meta ${formatMoney(raisedFor.goalAmount)}` : ""}` : undefined}
        size="sm"
      >
        <form onSubmit={saveRaised} noValidate className="space-y-4 p-5">
          <Field label="Total recaudado hasta hoy (USD)" required error={raisedError} hint={amountPreview(raisedValue) ?? undefined}>
            {({ id, describedBy, invalid }) => (
              <input
                id={id}
                inputMode="decimal"
                autoFocus
                value={raisedValue}
                onChange={(e) => {
                  setRaisedValue(e.target.value);
                  setRaisedError(undefined);
                }}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                className={`${inputClass} text-lg font-semibold`}
              />
            )}
          </Field>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" className="min-h-11 sm:min-h-9" onClick={() => setRaisedFor(null)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="min-h-11 sm:min-h-9" isLoading={savingRaised}>
              Guardar monto
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={() => void confirmDelete()}
        title="¿Eliminar esta campaña?"
        message={toDelete ? `«${toDelete.title}» desaparecerá de /donar. No se puede deshacer; si terminó, basta con ocultarla.` : ""}
        confirmText="Sí, eliminar"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
}
