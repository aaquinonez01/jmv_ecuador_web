import { Metadata } from "next";
import AdminGuard from "@/components/admin/layout/AdminGuard";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
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
      <div className="flex h-screen bg-slate-50">
        <AdminSidebar />
        <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
        <ToastContainer />
      </div>
    </AdminGuard>
  );
}
