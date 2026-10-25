"use client";

import { useEffect, useRef, useState } from "react";
import { Save } from "lucide-react";
import {
  donationsErrorMessage,
  getDonationSettingsAPI,
  updateDonationSettingsAPI,
  type DonationSettingsPayload,
} from "@/actions/donations";
import Button from "@/components/admin/ui/Button";
import { useToast } from "@/lib/hooks/useToast";
import { SITE } from "@/lib/site";
import { DEFAULT_CONTACT_NOTE, DEFAULT_HEADLINE, DEFAULT_INTRO } from "@/components/donar/shared";
import type { DonationSettings } from "@/types/donations";
import { EMAIL_PATTERN, Field, FormSection, ImagePicker, ListState, URL_PATTERN, inputClass } from "./shared";

interface FormState {
  headline: string;
  intro: string;
  contactNote: string;
  whatsapp: string;
  email: string;
  paypalUrl: string;
  qrLabel: string;
  inKindNote: string;
  transparencyNote: string;
  qrImage: File | null;
  removeQr: boolean;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

function toForm(settings: DonationSettings | null): FormState {
  return {
    headline: settings?.headline ?? DEFAULT_HEADLINE,
    intro: settings?.intro ?? DEFAULT_INTRO,
    contactNote: settings?.contactNote ?? DEFAULT_CONTACT_NOTE,
    whatsapp: settings?.whatsapp ?? "",
    email: settings?.email ?? "",
    paypalUrl: settings?.paypalUrl ?? "",
    qrLabel: settings?.qrLabel ?? "",
    inKindNote: settings?.inKindNote ?? "",
    transparencyNote: settings?.transparencyNote ?? "",
    qrImage: null,
    removeQr: false,
  };
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (form.headline.trim().length < 3) errors.headline = "Escribe un título de al menos 3 letras.";
  if (form.intro.trim().length < 10) errors.intro = "La introducción necesita al menos 10 caracteres.";
  if (form.contactNote.trim().length < 3) errors.contactNote = "Escribe una nota de contacto.";
  const phone = form.whatsapp.replace(/[\s()+-]/g, "");
  if (phone && !/^\d{9,15}$/.test(phone)) errors.whatsapp = "Usa solo números, con código de país (ej. 593991234567).";
  if (form.email.trim() && !EMAIL_PATTERN.test(form.email.trim())) errors.email = "Revisa el correo.";
  if (form.paypalUrl.trim() && !URL_PATTERN.test(form.paypalUrl.trim()))
    errors.paypalUrl = "Pega el enlace completo, empieza con https://";
  return errors;
}

const optional = (value: string) => value.trim() || null;

export default function SettingsTab() {
  const toast = useToast();
  const [settings, setSettings] = useState<DonationSettings | null>(null);
  const [form, setForm] = useState<FormState>(() => toForm(null));
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getDonationSettingsAPI();
      setSettings(data);
      setForm(toForm(data));
      setLoadError(false);
    } catch {
      setLoadError(true);
      toast.error("No se pudieron cargar los datos generales.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    const payload: DonationSettingsPayload = {
      headline: form.headline.trim(),
      intro: form.intro.trim(),
      contactNote: form.contactNote.trim(),
      whatsapp: optional(form.whatsapp.replace(/[\s()+-]/g, "")),
      email: optional(form.email),
      paypalUrl: optional(form.paypalUrl),
      qrLabel: optional(form.qrLabel),
      inKindNote: optional(form.inKindNote),
      transparencyNote: optional(form.transparencyNote),
      qrImage: form.qrImage,
      removeQr: !form.qrImage && form.removeQr,
    };
    try {
      setSaving(true);
      const saved = await updateDonationSettingsAPI(payload);
      setSettings(saved);
      setForm(toForm(saved));
      toast.success("Datos generales guardados. La página /donar se actualiza en unos segundos.");
    } catch (error) {
      toast.error(donationsErrorMessage(error, "No se pudieron guardar los datos."));
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadError) {
    return <ListState loading={loading} error={loadError} empty={false} emptyText="" onRetry={() => void load()} />;
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="rounded-xl border border-slate-200 bg-white">
      <div className="space-y-8 p-4 sm:p-6">
        <FormSection title="Textos de la página" step={1}>
          <Field label="Título principal" required error={errors.headline}>
            {({ id, describedBy, invalid }) => (
              <input
                id={id}
                value={form.headline}
                onChange={(e) => update({ headline: e.target.value })}
                maxLength={120}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                className={inputClass}
              />
            )}
          </Field>
          <Field label="Introducción" required error={errors.intro} hint="2 o 3 frases. Sin cifras que no puedas respaldar.">
            {({ id, describedBy, invalid }) => (
              <textarea
                id={id}
                rows={3}
                value={form.intro}
                onChange={(e) => update({ intro: e.target.value })}
                maxLength={600}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                className={`${inputClass} resize-y py-2`}
              />
            )}
          </Field>
          <Field label="Nota de contacto" required error={errors.contactNote} hint="Se muestra en el bloque «¿Tienes dudas?».">
            {({ id, describedBy, invalid }) => (
              <input
                id={id}
                value={form.contactNote}
                onChange={(e) => update({ contactNote: e.target.value })}
                maxLength={200}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                className={inputClass}
              />
            )}
          </Field>
        </FormSection>

        <FormSection title="Contacto" step={2}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="WhatsApp para donaciones"
              error={errors.whatsapp}
              hint={`Con código de país. Si lo dejas vacío se usa el general (${SITE.phone}).`}
            >
              {({ id, describedBy, invalid }) => (
                <input
                  id={id}
                  type="tel"
                  inputMode="tel"
                  value={form.whatsapp}
                  onChange={(e) => update({ whatsapp: e.target.value })}
                  placeholder="593991234567"
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                  className={inputClass}
                />
              )}
            </Field>
            <Field
              label="Correo para donaciones"
              error={errors.email}
              hint={`Si lo dejas vacío se usa ${SITE.email}.`}
            >
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
        </FormSection>

        <FormSection title="Formas de donar" step={3}>
          <Field
            label="Enlace de PayPal"
            error={errors.paypalUrl}
            hint="Opcional. Ideal para quienes donan desde fuera del Ecuador. Vacío = no se muestra."
          >
            {({ id, describedBy, invalid }) => (
              <input
                id={id}
                type="url"
                inputMode="url"
                autoCapitalize="none"
                spellCheck={false}
                value={form.paypalUrl}
                onChange={(e) => update({ paypalUrl: e.target.value })}
                placeholder="https://www.paypal.com/donate/?hosted_button_id=…"
                aria-invalid={invalid}
                aria-describedby={describedBy}
                className={inputClass}
              />
            )}
          </Field>

          <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="mb-3 text-[13px] font-semibold text-slate-700">Código QR de pago</p>
            <ImagePicker
              label="Subir QR"
              square
              file={form.qrImage}
              currentUrl={settings?.qrImageUrl}
              removed={form.removeQr}
              onFile={(qrImage) => update({ qrImage, removeQr: false })}
              onRemove={() => update({ removeQr: true })}
              hint="Imagen nítida y cuadrada (PNG). Descárgala desde la app del banco o de Deuna."
            />
            <div className="mt-4">
              <Field label="Etiqueta del QR" hint="Ej. Deuna / app de tu banco.">
                {({ id, describedBy }) => (
                  <input
                    id={id}
                    value={form.qrLabel}
                    onChange={(e) => update({ qrLabel: e.target.value })}
                    maxLength={120}
                    aria-describedby={describedBy}
                    className={inputClass}
                  />
                )}
              </Field>
            </div>
          </div>

          <Field
            label="Donaciones en especie"
            hint="Qué reciben (víveres, ropa, útiles) y cómo coordinar. Vacío = no se muestra."
          >
            {({ id, describedBy }) => (
              <textarea
                id={id}
                rows={3}
                value={form.inKindNote}
                onChange={(e) => update({ inKindNote: e.target.value })}
                maxLength={800}
                aria-describedby={describedBy}
                className={`${inputClass} resize-y py-2`}
              />
            )}
          </Field>
        </FormSection>

        <FormSection title="Transparencia" step={4}>
          <Field
            label="Nota de transparencia"
            hint="Ej. cómo y cuándo rinde cuentas el Consejo Nacional. Siempre se añade la mención a los Estatutos."
          >
            {({ id, describedBy }) => (
              <textarea
                id={id}
                rows={3}
                value={form.transparencyNote}
                onChange={(e) => update({ transparencyNote: e.target.value })}
                maxLength={800}
                aria-describedby={describedBy}
                className={`${inputClass} resize-y py-2`}
              />
            )}
          </Field>
        </FormSection>
      </div>

      <div className="sticky bottom-0 flex flex-col gap-2 rounded-b-xl border-t border-slate-100 bg-white/95 px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-xs text-slate-500">
          {settings?.updatedAt
            ? `Última actualización: ${new Date(settings.updatedAt).toLocaleString("es-EC", { dateStyle: "long", timeStyle: "short" })}`
            : "Aún no se ha guardado la configuración."}
        </p>
        <Button
          type="submit"
          variant="primary"
          className="min-h-11 sm:min-h-9"
          isLoading={saving}
          icon={<Save className="h-4 w-4" aria-hidden />}
        >
          Guardar datos generales
        </Button>
      </div>
    </form>
  );
}
