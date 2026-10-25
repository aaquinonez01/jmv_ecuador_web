"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import {
  createDonationPurposeAPI,
  deleteDonationPurposeAPI,
  donationsErrorMessage,
  getDonationPurposesAPI,
  updateDonationPurposeAPI,
  type DonationPurposePayload,
} from "@/actions/donations";
import Button from "@/components/admin/ui/Button";
import Modal from "@/components/admin/ui/Modal";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import { useToast } from "@/lib/hooks/useToast";
import { PURPOSE_ICONS, purposeIcon } from "@/components/donar/purposeIcons";
import { DONATION_PURPOSE_ICONS, type DonationPurpose, type DonationPurposeIcon } from "@/types/donations";
import {
  Field,
  FormSection,
  ImagePicker,
  ListState,
  OrderButtons,
  ToggleCard,
  iconButton,
  inputClass,
  moveItem,
  toggleButton,
} from "./shared";

interface FormState {
  title: string;
  description: string;
  icon: DonationPurposeIcon;
  active: boolean;
  image: File | null;
  removeImage: boolean;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const emptyForm = (): FormState => ({
  title: "",
  description: "",
  icon: "heart-handshake",
  active: true,
  image: null,
  removeImage: false,
});

function toForm(purpose: DonationPurpose): FormState {
  const icon = (DONATION_PURPOSE_ICONS as readonly string[]).includes(purpose.icon)
    ? (purpose.icon as DonationPurposeIcon)
    : "heart-handshake";
  return { title: purpose.title, description: purpose.description, icon, active: purpose.active, image: null, removeImage: false };
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (form.title.trim().length < 3) errors.title = "Escribe un título de al menos 3 letras.";
  if (form.description.trim().length < 10) errors.description = "La descripción necesita al menos 10 caracteres.";
  return errors;
}

export default function PurposesTab() {
  const toast = useToast();
  const [items, setItems] = useState<DonationPurpose[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<DonationPurpose | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toDelete, setToDelete] = useState<DonationPurpose | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busy, setBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getDonationPurposesAPI();
      setItems([...data].sort((a, b) => a.displayOrder - b.displayOrder));
      setLoadError(false);
    } catch {
      setLoadError(true);
      toast.error("No se pudieron cargar los usos de las donaciones.");
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

  const openEdit = (purpose: DonationPurpose) => {
    setEditing(purpose);
    setForm(toForm(purpose));
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
    const payload: DonationPurposePayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      icon: form.icon,
      active: form.active,
      image: form.image,
      removeImage: !form.image && form.removeImage,
    };
    try {
      setSubmitting(true);
      if (editing) {
        await updateDonationPurposeAPI(editing.id, payload);
        toast.success(`«${payload.title}» se actualizó.`);
      } else {
        await createDonationPurposeAPI({ ...payload, displayOrder: items.length });
        toast.success(`«${payload.title}» se agregó.`);
      }
      setIsModalOpen(false);
      await load();
    } catch (error) {
      toast.error(donationsErrorMessage(error, "No se pudo guardar."));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (purpose: DonationPurpose) => {
    const active = !purpose.active;
    setItems((current) => current.map((p) => (p.id === purpose.id ? { ...p, active } : p)));
    try {
      await updateDonationPurposeAPI(purpose.id, { active });
      toast.success(active ? `«${purpose.title}» ya se ve en /donar.` : `«${purpose.title}» quedó oculto.`);
    } catch (error) {
      setItems((current) => current.map((p) => (p.id === purpose.id ? { ...p, active: !active } : p)));
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
      await Promise.all(changed.map((p) => updateDonationPurposeAPI(p.id, { displayOrder: p.displayOrder })));
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
      await deleteDonationPurposeAPI(toDelete.id);
      toast.success(`«${toDelete.title}» se eliminó.`);
      setToDelete(null);
      await load();
    } catch (error) {
      toast.error(donationsErrorMessage(error, "No se pudo eliminar."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-xl text-[12.5px] text-slate-600" aria-live="polite">
          {loading
            ? "Cargando…"
            : `Tarjetas de «En qué se usa tu donación» · ${items.filter((p) => p.active).length} visible(s). Si no hay ninguna, la sección no aparece.`}
        </p>
        <Button
          variant="primary"
          className="min-h-11 sm:min-h-9"
          onClick={openCreate}
          icon={<Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />}
        >
          Nuevo uso
        </Button>
      </div>

      <ListState
        loading={loading}
        error={loadError}
        empty={items.length === 0}
        emptyText="Todavía no hay tarjetas. Por ejemplo: formación de jóvenes, misiones o el Encuentro Nacional."
        onRetry={() => void load()}
      />

      {!loading && !loadError && items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((purpose, index) => {
            const Icon = purposeIcon(purpose.icon);
            return (
              <li
                key={purpose.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-jmv-gold text-jmv-ink">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[14.5px] font-bold leading-tight text-slate-900">{purpose.title}</h3>
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">{purpose.description}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {purpose.imageUrl ? (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">Con imagen</span>
                      ) : null}
                      {!purpose.active ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-800">
                          <EyeOff className="h-3 w-3" aria-hidden />
                          Oculto
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1 border-t border-slate-100 pt-2 sm:border-0 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => void toggleActive(purpose)}
                    aria-pressed={purpose.active}
                    aria-label={`Visible: ${purpose.title}`}
                    className={`${toggleButton} ${
                      purpose.active
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                        : "border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {purpose.active ? <Eye className="h-4 w-4" aria-hidden /> : <EyeOff className="h-4 w-4" aria-hidden />}
                    {purpose.active ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden /> : null}
                    Visible
                  </button>
                  <OrderButtons
                    index={index}
                    total={items.length}
                    label={purpose.title}
                    disabled={busy}
                    onMove={(direction) => void move(index, direction)}
                  />
                  <div className="ml-auto flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(purpose)}
                      className={`${iconButton} text-slate-600 hover:bg-jmv-blue/10 hover:text-jmv-blue`}
                      aria-label={`Editar ${purpose.title}`}
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => setToDelete(purpose)}
                      className={`${iconButton} text-slate-600 hover:bg-red-50 hover:text-red-700`}
                      aria-label={`Eliminar ${purpose.title}`}
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
        title={editing ? "Editar uso" : "Nuevo uso de las donaciones"}
        description="Los campos con * son obligatorios."
        size="lg"
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
                    placeholder="Ej. Misiones y servicio"
                    maxLength={120}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                    className={inputClass}
                  />
                )}
              </Field>
              <Field label="Descripción" required error={errors.description} hint="1 o 2 frases concretas, sin cifras inventadas.">
                {({ id, describedBy, invalid }) => (
                  <textarea
                    id={id}
                    rows={3}
                    value={form.description}
                    onChange={(e) => update({ description: e.target.value })}
                    maxLength={400}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                    className={`${inputClass} resize-y py-2`}
                  />
                )}
              </Field>
              <fieldset>
                <legend className="mb-1.5 text-[13px] font-semibold text-slate-700">
                  Icono<span className="ml-0.5 text-red-600" aria-hidden>*</span>
                </legend>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                  {DONATION_PURPOSE_ICONS.map((name) => {
                    const { icon: Icon, label } = PURPOSE_ICONS[name];
                    const checked = form.icon === name;
                    return (
                      <label
                        key={name}
                        className={`flex min-h-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 px-1 py-2 text-[11px] transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-jmv-blue/40 ${
                          checked
                            ? "border-jmv-blue bg-blue-50 font-semibold text-jmv-blue"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="purpose-icon"
                          value={name}
                          checked={checked}
                          onChange={() => update({ icon: name })}
                          className="sr-only"
                        />
                        <Icon className="h-6 w-6" aria-hidden />
                        {label}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </FormSection>

            <FormSection title="Imagen (opcional)">
              <ImagePicker
                label="Subir imagen"
                file={form.image}
                currentUrl={editing?.imageUrl}
                removed={form.removeImage}
                onFile={(image) => update({ image, removeImage: false })}
                onRemove={() => update({ removeImage: true })}
                hint="Una foto real de JMV. Si no hay, la tarjeta muestra solo el icono."
              />
            </FormSection>

            <ToggleCard
              checked={form.active}
              onChange={(active) => update({ active })}
              label="Visible"
              description="Se muestra en /donar."
            />
          </div>
          <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-slate-100 bg-white/95 px-5 py-3 backdrop-blur sm:flex-row sm:justify-end sm:px-6">
            <Button type="button" variant="ghost" className="min-h-11 sm:min-h-9" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="min-h-11 sm:min-h-9" isLoading={submitting}>
              {editing ? "Guardar cambios" : "Crear"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={() => void confirmDelete()}
        title="¿Eliminar esta tarjeta?"
        message={toDelete ? `«${toDelete.title}» desaparecerá de /donar. No se puede deshacer; si solo quieres esconderla, desmarca «Visible».` : ""}
        confirmText="Sí, eliminar"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
}
