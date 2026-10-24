import { Suspense } from "react";
import { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Nueva contraseña",
  description:
    "Crea una nueva contraseña para tu cuenta de Juventudes Marianas Vicencianas Ecuador.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
