import EncounterEditor from "@/components/admin/formation/EncounterEditor";

export const metadata = {
  title: "Encuentro de formación | Admin JMV Ecuador",
};

// /admin/formacion/nuevo crea un encuentro; /admin/formacion/<id> lo edita
export default async function AdminEncounterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EncounterEditor id={id === "nuevo" ? undefined : id} />;
}
