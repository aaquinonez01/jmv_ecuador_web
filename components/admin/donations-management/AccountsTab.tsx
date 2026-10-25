"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Eye, EyeOff, Info, Landmark, Pencil, Plus, Trash2 } from "lucide-react";
import {
  createDonationAccountAPI,
  deleteDonationAccountAPI,
  donationsErrorMessage,
  getDonationAccountsAPI,
  updateDonationAccountAPI,
  type DonationAccountPayload,
} from "@/actions/donations";
import Button from "@/components/admin/ui/Button";
import Modal from "@/components/admin/ui/Modal";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import { useToast } from "@/lib/hooks/useToast";
import { accountTypeLabel, groupDigits } from "@/components/donar/shared";
import type { DonationAccount, DonationAccountType } from "@/types/donations";
import {
  EMAIL_PATTERN,
  Field,
  FormSection,
  ListState,
  OrderButtons,
  ToggleCard,
  iconButton,
  inputClass,
  moveItem,
  toggleButton,
} from "./shared";

interface FormState {
  bankName: string;
  accountType: DonationAccountType;
  accountNumber: string;
  holderName: string;
  holderId: string;
  holderRole: string;
  email: string;
  notes: string;
  active: boolean;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const emptyForm = (): FormState => ({
  bankName: "",
  accountType: "ahorros",
  accountNumber: "",
  holderName: "",
  holderId: "",
  holderRole: "Tesorero/a Nacional",
  email: "",
  notes: "",
  active: true,
});

function toForm(account: DonationAccount): FormState {
  return {
    bankName: account.bankName,
    accountType: account.accountType,
    accountNumber: account.accountNumber,
    holderName: account.holderName,
    holderId: account.holderId ?? "",
    holderRole: account.holderRole ?? "",
    email: account.email ?? "",
    notes: account.notes ?? "",
    active: account.active,
  };
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (form.bankName.trim().length < 2) errors.bankName = "Escribe el nombre del banco o cooperativa.";
  const number = form.accountNumber.replace(/[\s-]/g, "");
  if (!/^\d{5,20}$/.test(number)) errors.accountNumber = "Solo números (entre 5 y 20 dígitos).";
  if (form.holderName.trim().length < 3) errors.holderName = "Escribe el nombre del titular.";
  const holderId = form.holderId.replace(/\s/g, "");
  if (holderId && !/^\d{10}(\d{3})?$/.test(holderId)) errors.holderId = "La cédula tiene 10 dígitos y el RUC 13.";
  if (form.email.trim() && !EMAIL_PATTERN.test(form.email.trim())) errors.email = "Revisa el correo.";
  return errors;
}

const optional = (value: string) => value.trim() || null;

export default function AccountsTab() {
  const toast = useToast();
  const [items, setItems] = useState<DonationAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<DonationAccount | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toDelete, setToDelete] = useState<DonationAccount | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busy, setBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getDonationAccountsAPI();
      setItems([...data].sort((a, b) => a.displayOrder - b.displayOrder));
      setLoadError(false);
    } catch {
      setLoadError(true);
      toast.error("No se pudieron cargar las cuentas.");
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

  const openEdit = (account: DonationAccount) => {
    setEditing(account);
    setForm(toForm(account));
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
    const payload: DonationAccountPayload = {
      bankName: form.bankName.trim(),
      accountType: form.accountType,
      accountNumber: form.accountNumber.replace(/[\s-]/g, ""),
      holderName: form.holderName.trim(),
      holderId: optional(form.holderId.replace(/\s/g, "")),
      holderRole: optional(form.holderRole),
      email: optional(form.email),
      notes: optional(form.notes),
      active: form.active,
    };
    try {
      setSubmitting(true);
      if (editing) {
        await updateDonationAccountAPI(editing.id, payload);
        toast.success(`La cuenta de ${payload.bankName} se actualizó.`);
      } else {
        await createDonationAccountAPI({ ...payload, displayOrder: items.length });
        toast.success(`La cuenta de ${payload.bankName} se agregó.`);
      }
      setIsModalOpen(false);
      await load();
    } catch (error) {
      toast.error(donationsErrorMessage(error, "No se pudo guardar la cuenta."));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (account: DonationAccount) => {
    const active = !account.active;
    setItems((current) => current.map((a) => (a.id === account.id ? { ...a, active } : a)));
    try {
      await updateDonationAccountAPI(account.id, { active });
      toast.success(active ? `La cuenta de ${account.bankName} ya se ve en /donar.` : `La cuenta de ${account.bankName} quedó oculta.`);
    } catch (error) {
      setItems((current) => current.map((a) => (a.id === account.id ? { ...a, active: !active } : a)));
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
      await Promise.all(changed.map((a) => updateDonationAccountAPI(a.id, { displayOrder: a.displayOrder })));
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
      await deleteDonationAccountAPI(toDelete.id);
      toast.success(`La cuenta de ${toDelete.bankName} se eliminó.`);
      setToDelete(null);
      await load();
    } catch (error) {
      toast.error(donationsErrorMessage(error, "No se pudo eliminar la cuenta."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden />
        <p>
          <strong>Al cambiar de período del Consejo, actualiza aquí la cuenta del nuevo Tesorero/a.</strong> Revisa
          cada dígito antes de guardar: los donantes copian estos datos tal cual.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[12.5px] text-slate-600" aria-live="polite">
          {loading ? "Cargando cuentas…" : `${items.filter((a) => a.active).length} activa(s) de ${items.length}`}
        </p>
        <Button
          variant="primary"
          className="min-h-11 sm:min-h-9"
          onClick={openCreate}
          icon={<Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />}
        >
          Nueva cuenta
        </Button>
      </div>

      <ListState
        loading={loading}
        error={loadError}
        empty={items.length === 0}
        emptyText="Todavía no hay cuentas. Agrega la del Tesorero/a Nacional para que aparezca en /donar."
        onRetry={() => void load()}
      />

      {!loading && !loadError && items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((account, index) => (
            <li
              key={account.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-jmv-blue/10 text-jmv-blue">
                  <Landmark className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[14.5px] font-bold leading-tight text-slate-900">{account.bankName}</h3>
                  <p className="mt-0.5 font-mono text-sm tracking-wide text-slate-800">{groupDigits(account.accountNumber)}</p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    {accountTypeLabel(account.accountType)} · {account.holderName}
                    {account.holderRole ? ` · ${account.holderRole}` : ""}
                  </p>
                  {!account.active ? (
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-800">
                      <EyeOff className="h-3 w-3" aria-hidden />
                      Oculta
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1 border-t border-slate-100 pt-2 sm:border-0 sm:pt-0">
                <button
                  type="button"
                  onClick={() => void toggleActive(account)}
                  aria-pressed={account.active}
                  aria-label={`Activa: cuenta de ${account.bankName}`}
                  className={`${toggleButton} ${
                    account.active
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      : "border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {account.active ? <Eye className="h-4 w-4" aria-hidden /> : <EyeOff className="h-4 w-4" aria-hidden />}
                  {account.active ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden /> : null}
                  Activa
                </button>
                <OrderButtons
                  index={index}
                  total={items.length}
                  label={`la cuenta de ${account.bankName}`}
                  disabled={busy}
                  onMove={(direction) => void move(index, direction)}
                />
                <div className="ml-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(account)}
                    className={`${iconButton} text-slate-600 hover:bg-jmv-blue/10 hover:text-jmv-blue`}
                    aria-label={`Editar la cuenta de ${account.bankName}`}
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => setToDelete(account)}
                    className={`${iconButton} text-slate-600 hover:bg-red-50 hover:text-red-700`}
                    aria-label={`Eliminar la cuenta de ${account.bankName}`}
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? "Editar cuenta" : "Nueva cuenta para donaciones"}
        description="Los campos con * son obligatorios."
        size="lg"
      >
        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          <div className="space-y-7 p-5 sm:p-6">
            <FormSection title="Cuenta">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Banco o cooperativa" required error={errors.bankName}>
                  {({ id, describedBy, invalid }) => (
                    <input
                      id={id}
                      value={form.bankName}
                      onChange={(e) => update({ bankName: e.target.value })}
                      maxLength={120}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                      className={inputClass}
                    />
                  )}
                </Field>
                <Field label="Tipo de cuenta" required>
                  {({ id }) => (
                    <select
                      id={id}
                      value={form.accountType}
                      onChange={(e) => update({ accountType: e.target.value as DonationAccountType })}
                      className={inputClass}
                    >
                      <option value="ahorros">Ahorros</option>
                      <option value="corriente">Corriente</option>
                    </select>
                  )}
                </Field>
              </div>
              <Field label="Número de cuenta" required error={errors.accountNumber} hint="Solo números; los espacios se quitan al guardar.">
                {({ id, describedBy, invalid }) => (
                  <input
                    id={id}
                    inputMode="numeric"
                    autoComplete="off"
                    value={form.accountNumber}
                    onChange={(e) => update({ accountNumber: e.target.value })}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                    className={`${inputClass} font-mono tracking-wide`}
                  />
                )}
              </Field>
            </FormSection>

            <FormSection title="Titular">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Nombre del titular" required error={errors.holderName}>
                  {({ id, describedBy, invalid }) => (
                    <input
                      id={id}
                      value={form.holderName}
                      onChange={(e) => update({ holderName: e.target.value })}
                      maxLength={150}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                      className={inputClass}
                    />
                  )}
                </Field>
                <Field label="Cédula o RUC" error={errors.holderId} hint="Muchas apps de banco lo piden.">
                  {({ id, describedBy, invalid }) => (
                    <input
                      id={id}
                      inputMode="numeric"
                      autoComplete="off"
                      value={form.holderId}
                      onChange={(e) => update({ holderId: e.target.value })}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                      className={`${inputClass} font-mono`}
                    />
                  )}
                </Field>
                <Field label="Cargo" hint="Ej. Tesorero/a Nacional.">
                  {({ id, describedBy }) => (
                    <input
                      id={id}
                      value={form.holderRole}
                      onChange={(e) => update({ holderRole: e.target.value })}
                      maxLength={120}
                      aria-describedby={describedBy}
                      className={inputClass}
                    />
                  )}
                </Field>
                <Field label="Correo" error={errors.email} hint="Opcional. Algunas apps lo usan para notificar.">
                  {({ id, describedBy, invalid }) => (
                    <input
                      id={id}
                      type="email"
                      inputMode="email"
                      autoCapitalize="none"
                      value={form.email}
                      onChange={(e) => update({ email: e.target.value })}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                      className={inputClass}
                    />
                  )}
                </Field>
              </div>
              <Field label="Nota" hint="Opcional. Ej. «También puedes depositar en ventanilla».">
                {({ id, describedBy }) => (
                  <textarea
                    id={id}
                    rows={2}
                    value={form.notes}
                    onChange={(e) => update({ notes: e.target.value })}
                    maxLength={500}
                    aria-describedby={describedBy}
                    className={`${inputClass} resize-y py-2`}
                  />
                )}
              </Field>
              <ToggleCard
                checked={form.active}
                onChange={(active) => update({ active })}
                label="Activa"
                description="Se muestra en /donar. Desactívala en lugar de borrarla si es temporal."
              />
            </FormSection>
          </div>
          <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-slate-100 bg-white/95 px-5 py-3 backdrop-blur sm:flex-row sm:justify-end sm:px-6">
            <Button type="button" variant="ghost" className="min-h-11 sm:min-h-9" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="min-h-11 sm:min-h-9" isLoading={submitting}>
              {editing ? "Guardar cambios" : "Crear cuenta"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={() => void confirmDelete()}
        title="¿Eliminar esta cuenta?"
        message={
          toDelete
            ? `La cuenta de ${toDelete.bankName} (${groupDigits(toDelete.accountNumber)}) desaparecerá de /donar. No se puede deshacer; si solo quieres esconderla, desactívala.`
            : ""
        }
        confirmText="Sí, eliminar"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
}
