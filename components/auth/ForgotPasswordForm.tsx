"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2, Mail, MailCheck, Send } from "lucide-react";
import { getAxiosClient } from "@/config/axios.config";
import { buttonVariants } from "@/components/ui/button-variants";
import EmailField from "./EmailField";
import FormAlert from "./FormAlert";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Escribe el correo de tu cuenta")
    .email("Revisa tu correo: debe tener el formato nombre@ejemplo.com"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

function requestErrorMessage(error: unknown): string {
  const err = error as { response?: { status?: number }; request?: unknown };
  if (!err?.response && err?.request) {
    return "No pudimos conectar con el servidor. Revisa tu conexión a internet e inténtalo de nuevo.";
  }
  if (err?.response?.status === 400) {
    return "Revisa tu correo: debe tener el formato nombre@ejemplo.com";
  }
  if (err?.response?.status === 429) {
    return "Ya pediste varios enlaces seguidos. Espera unos minutos antes de volver a intentarlo.";
  }
  return "No pudimos enviar el correo en este momento. Inténtalo de nuevo en unos minutos.";
}

export default function ForgotPasswordForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [serverError, setServerError] = useState("");
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    if (submittedEmail) successHeadingRef.current?.focus();
  }, [submittedEmail]);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError("");
    try {
      await getAxiosClient().post("/auth/forgot-password", {
        email: data.email,
      });
      setSubmittedEmail(data.email);
    } catch (error) {
      setServerError(requestErrorMessage(error));
    }
  };

  if (submittedEmail) {
    return (
      <div className="text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-700 shadow-lg">
          <MailCheck className="h-10 w-10 text-white" aria-hidden="true" />
        </div>
        <h1
          ref={successHeadingRef}
          tabIndex={-1}
          className="mb-3 font-display text-3xl font-semibold text-gray-900"
        >
          Revisa tu correo
        </h1>
        <p className="mx-auto mb-6 max-w-sm text-base text-gray-700">
          Si hay una cuenta con{" "}
          <span className="font-semibold break-all text-jmv-blue">
            {submittedEmail}
          </span>
          , te enviamos un enlace para crear una nueva contraseña.
        </p>
        <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-4 text-left">
          <h2 className="mb-2 text-sm font-semibold text-blue-950">
            Próximos pasos
          </h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-blue-900">
            <li>Abre el correo de JMV Ecuador. Si no lo ves, busca en spam o promociones.</li>
            <li>Toca el enlace del correo. Vale por 1 hora y solo se puede usar una vez.</li>
            <li>Crea tu nueva contraseña.</li>
          </ol>
        </div>
        <div className="space-y-3">
          <Link
            href="/sign-in"
            className={buttonVariants({
              variant: "primary",
              className: "w-full gap-2 font-semibold",
            })}
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Volver al inicio de sesión
          </Link>
          <button
            type="button"
            onClick={() => setSubmittedEmail(null)}
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "w-full",
            })}
          >
            Usar otro correo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/sign-in"
        className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-gray-700 hover:text-jmv-blue"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Volver al inicio de sesión
      </Link>
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-jmv-gold shadow-lg">
          <Mail className="h-8 w-8 text-jmv-ink" aria-hidden="true" />
        </div>
        <h1 className="mb-2 font-display text-3xl font-semibold text-gray-900">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="mx-auto max-w-sm text-base text-gray-700">
          No te preocupes: te enviamos un enlace a tu correo para que crees una nueva.
        </p>
      </div>

      {serverError ? <FormAlert className="mb-6">{serverError}</FormAlert> : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <EmailField
          id="email"
          placeholder="tu@ejemplo.com"
          hint="Usa el mismo correo con el que te registraste."
          error={errors.email?.message}
          {...register("email")}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting || undefined}
          className={buttonVariants({
            variant: "gold",
            size: "md",
            className: "w-full gap-2 font-semibold",
          })}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 motion-safe:animate-spin" aria-hidden="true" />
              Enviando…
            </>
          ) : (
            <>
              <Send className="h-5 w-5" aria-hidden="true" />
              Enviarme el enlace
            </>
          )}
        </button>
      </form>
    </div>
  );
}
