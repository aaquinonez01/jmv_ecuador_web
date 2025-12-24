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
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        {/* ml-72 para dejar espacio al sidebar, mt-16 para el navbar */}
        <main className="ml-72 pt-16 min-h-screen">{children}</main>
        <ToastContainer />
      </div>
    </AdminGuard>
  );
}
