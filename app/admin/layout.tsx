import { Metadata } from "next";
import AdminGuard from "@/components/admin/layout/AdminGuard";
import AdminShell from "@/components/admin/layout/AdminShell";
import ToastContainer from "@/components/admin/ui/ToastContainer";

export const metadata: Metadata = {
  title: "Panel Administrativo | JMV Ecuador",
  description: "Panel administrativo de Juventudes Marianas Vicencianas Ecuador",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
      <ToastContainer />
    </AdminGuard>
  );
}
