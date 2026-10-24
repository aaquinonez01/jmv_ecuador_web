"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { getAxiosClient } from "@/config/axios.config";
import { setToken } from "@/lib/auth/token";
import { safeRedirect, sameOriginReferrerPath } from "@/lib/auth/safe-redirect";
import { signInSchema, type SignInFormData } from "@/lib/signInValidation";
import { useAuthStore } from "@/lib/store/auth";
import { buttonVariants } from "@/components/ui/button-variants";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import FormAlert from "./FormAlert";

function loginErrorMessage(error: unknown): string {
  const err = error as {
    response?: { status?: number; data?: { message?: unknown } };
    request?: unknown;
  };
  const status = err?.response?.status;
  const message = err?.response?.data?.message;

  if (!err?.response && err?.request) {
    return "No pudimos conectar con el servidor. Revisa tu conexión a internet e inténtalo de nuevo.";
  }
  if (status === 429) {
    return "Hiciste muchos intentos seguidos. Espera unos minutos y vuelve a intentarlo.";
  }
  if (typeof message === "string" && /no activo/i.test(message)) {
    return "Tu cuenta está desactivada. Escríbenos y te ayudamos a reactivarla.";
  }
  if (status === 400 || status === 401) {
    return "El correo o la contraseña no coinciden. Revísalos e inténtalo de nuevo.";
  }
  return "Algo salió mal al iniciar sesión. Inténtalo de nuevo en unos minutos.";
}

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState("");
  const { setUser } = useAuthStore();
  const passwordReset = searchParams.get("restablecida") === "1";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: SignInFormData) => {
    setServerError("");
    try {
      const api = getAxiosClient();
      const res = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      const token: string = res.data?.token;
      const user = res.data?.user;

      if (!token) throw new Error("Token no recibido");

      setToken(token);
      await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }).catch(() => null);

      if (user) setUser(user);

      // Prioridad: ?redirect= → página del blog desde la que se llegó → inicio
      const fromReferrer = sameOriginReferrerPath();
      const redirectTo =
        safeRedirect(searchParams.get("redirect")) ||
        (fromReferrer?.startsWith("/blog") ? fromReferrer : null) ||
        "/";
      router.replace(redirectTo);
    } catch (error) {
      setServerError(loginErrorMessage(error));
    }
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-jmv-blue shadow-lg">
          <LogIn className="h-8 w-8 text-white" aria-hidden="true" />
        </div>
        <h1 className="mb-2 font-display text-3xl font-semibold text-gray-900">
          Te damos la bienvenida
        </h1>
        <p className="text-base text-gray-700">
          Inicia sesión para compartir con la comunidad JMV.
        </p>
      </div>

      {passwordReset && !serverError ? (
        <FormAlert tone="success" className="mb-6">
          Tu contraseña se actualizó. Ya puedes iniciar sesión con la nueva.
        </FormAlert>
      ) : null}

      {serverError ? (
        <FormAlert className="mb-6">{serverError}</FormAlert>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <EmailField
          id="email"
          placeholder="tu@ejemplo.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordField
          id="password"
          label="Contraseña"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex justify-end text-sm">
          <Link
            href="/forgot-password"
            className="inline-flex min-h-11 items-center font-semibold text-jmv-blue underline-offset-4 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting || undefined}
          className={buttonVariants({
            variant: "primary",
            size: "md",
            className: "w-full gap-2 font-semibold",
          })}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 motion-safe:animate-spin" aria-hidden="true" />
              Ingresando…
            </>
          ) : (
            <>
              <LogIn className="h-5 w-5" aria-hidden="true" />
              Iniciar sesión
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-700">
        ¿Aún no eres parte?{" "}
        <Link
          href="/unete"
          className="font-semibold text-jmv-blue underline underline-offset-4 hover:text-jmv-blue-dark"
        >
          Únete a JMV
        </Link>
      </p>
    </div>
  );
}
