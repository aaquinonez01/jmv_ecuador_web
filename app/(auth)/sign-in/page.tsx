import { Suspense } from "react";
import { Metadata } from "next";
import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description:
    "Ingresa a tu cuenta de Juventudes Marianas Vicencianas Ecuador para compartir momentos y recursos con la comunidad.",
};

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
