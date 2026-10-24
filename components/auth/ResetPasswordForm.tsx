"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { KeyRound, Loader2 } from "lucide-react";
import { getAxiosClient } from "@/config/axios.config";
import { buttonVariants } from "@/components/ui/button-variants";
import PasswordField from "./PasswordField";
import FormAlert from "./FormAlert";

// Misma política que el registro del backend (RegisterUserDto):
// 6 a 50 caracteres, una mayúscula, una minúscula y un número o símbolo.
const passwordSchema = z
  .string()
  .min(6, "Usa al menos 6 caracteres")
  .max(50, "Usa como máximo 50 caracteres")
  .regex(/[A-Z]/, "Incluye al menos una letra mayúscula")
  .regex(/[a-z]/, "Incluye al menos una letra minúscula")
  .regex(/[\d\W]/, "Incluye al menos un número o un símbolo")
  .regex(/^[^.]/, "No empieces la contraseña con un punto");

const resetSchema = z
  .object({
    password: passwordSchema,
    confirm: z.string().min(1, "Vuelve a escribir la contraseña"),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Las contraseñas no coinciden",
  });

type ResetFormData = z.infer<typeof resetSchema>;

const VALID_TOKEN = /^[0-9a-f]{64}$/i;

type ResetError = {
  response?: { status?: number; data?: { message?: string | string[] } };
  request?: unknown;
};

/** El backend responde 400 con message string si el token no sirve, y con un array si falla la validación */
function isExpiredLink(error: unknown): boolean {
  const res = (error as ResetError)?.response;
  return res?.status === 400 && !Array.isArray(res.data?.message);
}

function resetErrorMessage(error: unknown): string {
  const err = error as ResetError;
  if (!err?.response && err?.request) {
    return "No pudimos conectar con el servidor. Revisa tu conexión a internet e inténtalo de nuevo.";
  }
  if (isExpiredLink(error)) {
    return "Este enlace ya no es válido: puede que haya caducado o que ya se haya usado. Pide uno nuevo.";
  }
  const message = err?.response?.data?.message;
  if (err?.response?.status === 400 && Array.isArray(message)) {
    // Si el token no pasa la validación del backend, también es un enlace que no sirve
    if (message.includes("El enlace no es válido")) {
      return "Este enlace no es válido. Abre el enlace completo del correo o pide uno nuevo.";
    }
    return "Revisa tu nueva contraseña: debe tener de 6 a 50 caracteres, una mayúscula, una minúscula y un número o símbolo.";
  }
  if (err?.response?.status === 429) {
    return "Hiciste muchos intentos seguidos. Espera unos minutos y vuelve a intentarlo.";
  }
  return "No pudimos cambiar tu contraseña en este momento. Inténtalo de nuevo en unos minutos.";
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const tokenLooksValid = VALID_TOKEN.test(token);
  const [serverError, setServerError] = useState("");
  const [linkExpired, setLinkExpired] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirm: "" },
  });

  const onSubmit = async (data: ResetFormData) => {
    setServerError("");
    try {
      await getAxiosClient().post("/auth/reset-password", {
        token,
        password: data.password,
      });
      router.replace("/sign-in?restablecida=1");
    } catch (error) {
      const message = (error as ResetError)?.response?.data?.message;
      setLinkExpired(
        isExpiredLink(error) ||
          (Array.isArray(message) && message.includes("El enlace no es válido")),
      );
      setServerError(resetErrorMessage(error));
    }
  };

  if (!tokenLooksValid) {
    return (
      <div className="text-center">
        <h1 className="mb-3 font-display text-3xl font-semibold text-gray-900">
          Este enlace no funciona
        </h1>
        <p className="mx-auto mb-8 max-w-sm text-base text-gray-700">
          Abre el enlace completo que te llegó al correo o pide uno nuevo.
        </p>
        <Link
          href="/forgot-password"
          className={buttonVariants({ variant: "primary", className: "w-full" })}
        >
          Pedir un enlace nuevo
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-jmv-blue shadow-lg">
          <KeyRound className="h-8 w-8 text-white" aria-hidden="true" />
        </div>
        <h1 className="mb-2 font-display text-3xl font-semibold text-gray-900">
          Crea tu nueva contraseña
        </h1>
        <p className="mx-auto max-w-sm text-base text-gray-700">
          Elige una que no uses en otros sitios.
        </p>
      </div>

      {serverError ? (
        <FormAlert className="mb-6">
          <p>{serverError}</p>
          {linkExpired ? (
            <Link
              href="/forgot-password"
              className="mt-2 inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
            >
              Pedir un enlace nuevo
            </Link>
          ) : null}
        </FormAlert>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <PasswordField
          id="password"
          label="Nueva contraseña"
          autoComplete="new-password"
          hint="De 6 a 50 caracteres, con una mayúscula, una minúscula y un número o símbolo."
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordField
          id="confirm"
          label="Confirma la nueva contraseña"
          autoComplete="new-password"
          error={errors.confirm?.message}
          {...register("confirm")}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting || undefined}
          className={buttonVariants({
            variant: "primary",
            className: "w-full gap-2 font-semibold",
          })}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 motion-safe:animate-spin" aria-hidden="true" />
              Guardando…
            </>
          ) : (
            "Guardar contraseña"
          )}
        </button>
      </form>
    </div>
  );
}
