"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, CheckCircle2, Instagram, Send } from "lucide-react";
import Button, { buttonVariants } from "@/components/ui/Button";
import { contactSchema, type ContactFormData } from "@/lib/contactValidation";
import { sendContactMessage, type ContactResult } from "@/lib/api/contact.client";
import { SOCIAL_LINKS } from "@/lib/site";
import { FormErrorAlert, FormField, HoneypotField, RequiredNote } from "./FormField";

const instagram = SOCIAL_LINKS.find((s) => s.network === "instagram");

export default function ContactForm() {
  const [result, setResult] = useState<ContactResult | null>(null);
  const [sentName, setSentName] = useState("");
  const successRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { nombre: "", email: "", telefono: "", asunto: "", mensaje: "", website: "" },
  });

  useEffect(() => {
    if (result?.ok) successRef.current?.focus();
  }, [result]);

  const onSubmit = async (data: ContactFormData) => {
    setResult(null);
    const res = await sendContactMessage({ ...data, origen: "contacto" });
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
        className="rounded-2xl bg-white p-6 text-slate-900 shadow-jmv sm:p-8"
        data-surface="light"
      >
        <CheckCircle2 className="h-12 w-12 text-emerald-600" aria-hidden />
        <h2 className="mt-4 text-2xl font-bold text-jmv-blue">
          ¡Gracias{sentName ? `, ${sentName}` : ""}! Tu mensaje ya está con nosotros
        </h2>
        <p className="mt-3 text-slate-700">
          Te responderemos al correo que nos dejaste lo antes posible. Mientras tanto, puedes
          conocer lo que estamos viviendo:
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/actividades#proximas" className={buttonVariants({ variant: "primary" })}>
            <CalendarDays className="mr-2 h-5 w-5" aria-hidden />
            Ver próximas actividades
          </Link>
          {instagram && (
            <a
              href={instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              <Instagram className="mr-2 h-5 w-5" aria-hidden />
              Síguenos en Instagram
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          )}
          <Button type="button" variant="ghost" onClick={() => setResult(null)}>
            Enviar otro mensaje
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby="contacto-form-titulo"
      className="relative rounded-2xl bg-white p-6 text-slate-900 shadow-jmv sm:p-8"
      data-surface="light"
    >
      <h2 id="contacto-form-titulo" className="text-2xl font-bold text-jmv-blue">
        Escríbenos un mensaje
      </h2>
      <div className="mt-2">
        <RequiredNote />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <FormField id="contacto-nombre" label="Nombre" required error={errors.nombre?.message}>
          {(p) => <input type="text" autoComplete="name" {...p} {...register("nombre")} />}
        </FormField>
        <FormField id="contacto-email" label="Correo electrónico" required error={errors.email?.message}>
          {(p) => (
            <input type="email" inputMode="email" autoComplete="email" {...p} {...register("email")} />
          )}
        </FormField>
      </div>

      <FormField
        id="contacto-telefono"
        label="Teléfono o WhatsApp"
        hint="Si prefieres que te respondamos por WhatsApp."
        error={errors.telefono?.message}
        className="mt-6"
      >
        {(p) => <input type="tel" inputMode="tel" autoComplete="tel" {...p} {...register("telefono")} />}
      </FormField>

      <FormField id="contacto-asunto" label="Asunto" required error={errors.asunto?.message} className="mt-6">
        {(p) => <input type="text" {...p} {...register("asunto")} />}
      </FormField>

      <FormField id="contacto-mensaje" label="Mensaje" required error={errors.mensaje?.message} className="mt-6">
        {(p) => <textarea rows={6} {...p} {...register("mensaje")} />}
      </FormField>

      <HoneypotField inputProps={register("website")} />

      {result && !result.ok && (
        <div className="mt-6">
          <FormErrorAlert message={result.message} whatsapp={result.whatsapp} />
        </div>
      )}

      <Button type="submit" size="lg" isLoading={isSubmitting} className="mt-8 w-full">
        <Send className="mr-2 h-5 w-5" aria-hidden />
        Enviar mensaje
      </Button>
    </form>
  );
}
