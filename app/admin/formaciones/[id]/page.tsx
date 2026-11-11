import TrainingEditor from "@/components/admin/formation/TrainingEditor";

export const metadata = { title: "Formación nacional | Admin JMV Ecuador" };

// /admin/formaciones/nueva crea; /admin/formaciones/<id> edita
export default async function AdminTrainingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TrainingEditor id={id === "nueva" ? undefined : id} />;
}
