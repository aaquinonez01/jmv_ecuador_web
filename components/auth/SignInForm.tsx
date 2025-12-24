"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAxiosClient } from "@/config/axios.config";
import { setToken } from "@/lib/auth/token";
import { useAuthStore } from "@/lib/store/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { signInSchema, SignInFormData } from "@/lib/signInValidation";

export default function SignInForm() {
  const router = useRouter();
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
      if (!token) throw new Error("Token no recibido");
      setToken(token);
      if (user) setUser(user);
      router.replace("/");
    } catch (error) {
      setServerError(
        "Ocurrió un error al iniciar sesión. Por favor intenta de nuevo."
      );
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-jmv-blue to-jmv-blue-dark rounded-2xl shadow-lg mb-4 animate-float">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Bienvenido de nuevo
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Ingresa a tu cuenta para continuar
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Correo electrónico
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail
                className={`w-5 h-5 transition-colors ${
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
              className={`w-full text-gray-900 pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-jmv-blue/20 transition-all duration-200 outline-none text-sm sm:text-base ${
                errors.email
                  ? "border-red-300 focus:border-red-500 bg-red-50/50"
                  : "border-gray-200 focus:border-jmv-blue hover:border-gray-300"
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Contraseña
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock
                className={`w-5 h-5 transition-colors ${
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
              className={`w-full pl-12 text-gray-900 pr-12 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-jmv-blue/20 transition-all duration-200 outline-none text-sm sm:text-base ${
                errors.password
                  ? "border-red-300 focus:border-red-500 bg-red-50/50"
                  : "border-gray-200 focus:border-jmv-blue hover:border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute cursor-pointer inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-jmv-blue transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="w-4 h-4 text-jmv-blue border-gray-300 rounded focus:ring-2 focus:ring-jmv-blue/20 cursor-pointer transition-colors"
            />
            <span className="text-gray-600 group-hover:text-gray-900 transition-colors font-medium">
              Recuérdame
            </span>
          </label>
          <Link
            href="/forgot-password"
            className="text-jmv-blue hover:text-jmv-blue-dark font-semibold transition-colors hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer bg-gradient-to-r from-jmv-blue to-jmv-blue-dark text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Ingresando...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Iniciar Sesión
            </>
          )}
        </button>
      </form>
    </div>
  );
}
