"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail,
  ArrowLeft,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Por favor ingresa un correo electrónico válido"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setServerError("");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmittedEmail(data.email);
      setIsSuccess(true);
      console.log("Recovery email sent to:", data.email);
    } catch (error) {
      setServerError(
        "No pudimos enviar el correo. Por favor intenta de nuevo."
      );
    }
  };

  if (isSuccess) {
    return (
      <div className="animate-fade-in text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg mb-6 animate-float">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          ¡Correo enviado!
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-sm mx-auto">
          Hemos enviado las instrucciones para restablecer tu contraseña a{" "}
          <span className="font-semibold text-jmv-blue break-all">
            {submittedEmail}
          </span>
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-left">
          <h3 className="font-semibold text-blue-900 mb-2 text-sm">
            Próximos pasos:
          </h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-bold min-w-[20px]">1.</span>
              <span>Revisa tu bandeja de entrada y carpeta de spam</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold min-w-[20px]">2.</span>
              <span>
                Haz clic en el enlace del correo (válido por 24 horas)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold min-w-[20px]">3.</span>
              <span>Crea tu nueva contraseña segura</span>
            </li>
          </ol>
        </div>
        <p className="text-xs text-gray-500 mb-6">
          Si no recibes el correo en 5 minutos, verifica que la dirección sea
          correcta
        </p>
        <div className="space-y-3">
          <Link
            href="/sign-in"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-jmv-blue to-jmv-blue-dark text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al inicio de sesión
          </Link>
          <button
            onClick={() => setIsSuccess(false)}
            className="w-full text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors py-2"
          >
            Usar otra dirección de correo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Link
        href="/sign-in"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-jmv-blue transition-colors mb-6 group font-medium"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Volver al inicio de sesión
      </Link>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-jmv-gold to-jmv-gold-dark rounded-2xl shadow-lg mb-4 animate-float">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          ¿Olvidaste tu contraseña?
        </h2>
        <p className="text-gray-600 text-sm sm:text-base max-w-sm mx-auto">
          No te preocupes, te enviaremos un enlace para restablecerla
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    : "text-gray-400 group-focus-within:text-jmv-gold"
                }`}
              />
            </div>
            <input
              type="email"
              id="email"
              {...register("email")}
              placeholder="tu@ejemplo.com"
              className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-jmv-gold/20 transition-all duration-200 outline-none text-sm sm:text-base ${
                errors.email
                  ? "border-red-300 focus:border-red-500 bg-red-50/50"
                  : "border-gray-200 focus:border-jmv-gold hover:border-gray-300"
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              {errors.email.message}
            </p>
          )}
          {!errors.email && (
            <p className="mt-2 text-xs text-gray-500">
              Ingresa el correo electrónico asociado a tu cuenta
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer bg-gradient-to-r from-jmv-gold to-jmv-gold-dark text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Enviar instrucciones
            </>
          )}
        </button>
      </form>
    </div>
  );
}
