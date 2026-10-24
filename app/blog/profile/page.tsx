import { redirect } from "next/navigation";

// /blog/profile (enlace del panel admin) lleva al perfil propio
export default function ProfileIndexPage() {
  redirect("/blog/profile/me");
}
