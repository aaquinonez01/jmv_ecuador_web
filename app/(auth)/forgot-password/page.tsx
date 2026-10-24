import { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  description:
    "Recupera el acceso a tu cuenta de Juventudes Marianas Vicencianas Ecuador. Te enviamos un enlace para crear una nueva contraseña.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
