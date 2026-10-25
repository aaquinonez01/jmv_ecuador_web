"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, CheckCircle2, Heart } from "lucide-react";
import Button, { buttonVariants } from "@/components/ui/Button";
import { buildUnetePayload, uneteSchema, type UneteFormData } from "@/lib/contactValidation";
import { sendContactMessage, type ContactResult } from "@/lib/api/contact.client";
import {
  FormErrorAlert,
  FormField,
  HoneypotField,
  RequiredNote,
} from "@/components/sections/contact/FormField";

// Formulario corto "Quiero unirme": llega a la bandeja de mensajes del admin
// con origen "unete".
export default function UneteForm() {
  const [result, setResult] = useState<ContactResult | null>(null);
  const [sentName, setSentName] = useState("");
  const successRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UneteFormData>({
    resolver: zodResolver(uneteSchema),
    defaultValues: { nombre: "", email: "", ciudad: "", edad: "", whatsapp: "", mensaje: "", website: "" },
  });

  useEffect(() => {
    if (result?.ok) successRef.current?.focus();
  }, [result]);

  const onSubmit = async (data: UneteFormData) => {
    setResult(null);
    const res = await sendContactMessage(buildUnetePayload(data));
    if (res.ok) {
      setSentName(data.nombre.split(" ")[0] ?? "");
      reset();
    }
    setResult(res);
  };

  if (result?.ok) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        data-surface="light"
        className="rounded-2xl bg-white p-6 text-slate-900 shadow-jmv ring-1 ring-line sm:p-8"
      >
        <CheckCircle2 className="h-12 w-12 text-emerald-600" aria-hidden />
        <h3 className="mt-4 text-2xl font-bold text-jmv-blue">
          ¡Qué alegría{sentName ? `, ${sentName}` : ""}! Ya recibimos tus datos
        </h3>
        <p className="mt-3 text-slate-700">
          Alguien del equipo de JMV te escribirá por WhatsApp para ponerte en contacto con la
          comunidad de tu ciudad. Mientras tanto, mira lo que se viene:
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/actividades#proximas" className={buttonVariants({ variant: "primary" })}>
            <CalendarDays className="mr-2 h-5 w-5" aria-hidden />
            Ver próximas actividades
          </Link>
          <Button type="button" variant="ghost" onClick={() => setResult(null)}>
            Enviar otra solicitud
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby="quiero-unirme-titulo"
      data-surface="light"
      className="relative rounded-2xl bg-white p-6 text-slate-900 shadow-jmv ring-1 ring-line sm:p-8"
    >
      <h3 id="quiero-unirme-titulo" className="text-2xl font-bold text-jmv-blue">
        Quiero unirme
      </h3>
      <p className="mt-2 text-slate-700">
        Déjanos tus datos y te escribimos para presentarte a tu comunidad.
      </p>
      <div className="mt-2">
        <RequiredNote />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <FormField id="unete-nombre" label="Nombre" required error={errors.nombre?.message}>
          {(p) => <input type="text" autoComplete="name" {...p} {...register("nombre")} />}
        </FormField>
        <FormField id="unete-ciudad" label="Ciudad" required error={errors.ciudad?.message}>
          {(p) => <input type="text" autoComplete="address-level2" {...p} {...register("ciudad")} />}
        </FormField>
        <FormField
          id="unete-whatsapp"
          label="WhatsApp"
          required
          hint="Te escribiremos a este número."
          error={errors.whatsapp?.message}
        >
          {(p) => (
            <input type="tel" inputMode="tel" autoComplete="tel" placeholder="099 123 4567" {...p} {...register("whatsapp")} />
          )}
        </FormField>
        <FormField id="unete-edad" label="Edad" error={errors.edad?.message}>
          {(p) => <input type="text" inputMode="numeric" maxLength={2} {...p} {...register("edad")} />}
        </FormField>
      </div>

      <FormField
        id="unete-email"
        label="Correo electrónico"
        required
        hint="Por si no logramos comunicarnos por WhatsApp."
        error={errors.email?.message}
        className="mt-6"
      >
        {(p) => <input type="email" inputMode="email" autoComplete="email" {...p} {...register("email")} />}
      </FormField>

      <FormField
        id="unete-mensaje"
        label="¿Algo que quieras contarnos?"
        error={errors.mensaje?.message}
        className="mt-6"
      >
        {(p) => <textarea rows={4} {...p} {...register("mensaje")} />}
      </FormField>

      <HoneypotField inputProps={register("website")} />

      {result && !result.ok && (
        <div className="mt-6">
          <FormErrorAlert message={result.message} whatsapp={result.whatsapp} />
        </div>
      )}

      <Button type="submit" variant="secondary" size="lg" isLoading={isSubmitting} className="mt-8 w-full">
        <Heart className="mr-2 h-5 w-5" aria-hidden />
        Enviar mis datos
      </Button>
    </form>
  );
}
