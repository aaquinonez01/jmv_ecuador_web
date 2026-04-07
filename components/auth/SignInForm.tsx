"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { getAxiosClient } from "@/config/axios.config";
import { setToken } from "@/lib/auth/token";
import { signInSchema, type SignInFormData } from "@/lib/signInValidation";
import { useAuthStore } from "@/lib/store/auth";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const { setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setServerError("");
      const api = getAxiosClient();
      const res = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      const token: string = res.data?.token;
      const user = res.data?.user;

      if (!token) {
        throw new Error("Token no recibido");
      }

      setToken(token);
      await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }).catch(() => null);

      if (user) {
        setUser(user);
      }

      const redirectTo = searchParams.get("redirect") || "/";
      router.replace(redirectTo);
    } catch {
      setServerError(
        "Ocurrió un error al iniciar sesión. Por favor intenta de nuevo."
      );
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-jmv-blue to-jmv-blue-dark shadow-lg animate-float">
          <LogIn className="h-8 w-8 text-white" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          Bienvenido de nuevo
        </h2>
        <p className="text-sm text-gray-600 sm:text-base">
          Ingresa a tu cuenta para continuar
        </p>
      </div>

      {serverError ? (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 animate-fade-in">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{serverError}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Correo electrónico
          </label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Mail
                className={`h-5 w-5 transition-colors ${
                  errors.email
                    ? "text-red-400"
                    : "text-gray-400 group-focus-within:text-jmv-blue"
                }`}
              />
            </div>
            <input
              type="email"
              id="email"
              {...register("email")}
              placeholder="tu@ejemplo.com"
              className={`w-full rounded-xl border-2 py-3.5 pr-4 pl-12 text-sm text-gray-900 outline-none transition-all duration-200 focus:ring-2 focus:ring-jmv-blue/20 sm:text-base ${
                errors.email
                  ? "border-red-300 bg-red-50/50 focus:border-red-500"
                  : "border-gray-200 hover:border-gray-300 focus:border-jmv-blue"
              }`}
            />
          </div>
          {errors.email ? (
            <p className="mt-2 flex items-center gap-1 text-sm text-red-600 animate-fade-in">
              <AlertCircle className="h-4 w-4" />
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Contraseña
          </label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Lock
                className={`h-5 w-5 transition-colors ${
                  errors.password
                    ? "text-red-400"
                    : "text-gray-400 group-focus-within:text-jmv-blue"
                }`}
              />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password")}
              placeholder="••••••••"
              className={`w-full rounded-xl border-2 py-3.5 pr-12 pl-12 text-sm text-gray-900 outline-none transition-all duration-200 focus:ring-2 focus:ring-jmv-blue/20 sm:text-base ${
                errors.password
                  ? "border-red-300 bg-red-50/50 focus:border-red-500"
                  : "border-gray-200 hover:border-gray-300 focus:border-jmv-blue"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4 text-gray-400 transition-colors hover:text-jmv-blue"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password ? (
            <p className="mt-2 flex items-center gap-1 text-sm text-red-600 animate-fade-in">
              <AlertCircle className="h-4 w-4" />
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="group flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="h-4 w-4 cursor-pointer rounded border-gray-300 text-jmv-blue focus:ring-2 focus:ring-jmv-blue/20"
            />
            <span className="font-medium text-gray-600 transition-colors group-hover:text-gray-900">
              Recuérdame
            </span>
          </label>
          <Link
            href="/forgot-password"
            className="font-semibold text-jmv-blue transition-colors hover:text-jmv-blue-dark hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-jmv-blue to-jmv-blue-dark py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 sm:text-base"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Ingresando...
            </>
          ) : (
            <>
              <LogIn className="h-5 w-5" />
              Iniciar sesión
            </>
          )}
        </button>
      </form>
    </div>
  );
}
