import { Suspense } from "react";
import { Metadata } from "next";
import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Iniciar Sesión | JMV Ecuador",
  description: "Ingresa a tu cuenta de Juventudes Marianas Vicencianas Ecuador para acceder a la comunidad y compartir experiencias.",
};

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
