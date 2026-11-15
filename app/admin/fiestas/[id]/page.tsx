import FiestaEditor from "@/components/admin/fiestas/FiestaEditor";

export const metadata = { title: "Fiesta | Admin JMV Ecuador" };

export default async function AdminFiestaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FiestaEditor id={id} />;
}
