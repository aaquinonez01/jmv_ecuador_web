import { type Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Panel Administrativo | JMV Ecuador",
  description: "Panel de administración de Juventudes Marianas Vicencianas Ecuador",
};

export default function AdminDashboard() {
  redirect("/admin/proximas-actividades");
}
