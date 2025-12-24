import { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Recuperar Contraseña | JMV Ecuador",
  description: "Recupera el acceso a tu cuenta de Juventudes Marianas Vicencianas Ecuador. Te ayudaremos a restablecer tu contraseña.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
