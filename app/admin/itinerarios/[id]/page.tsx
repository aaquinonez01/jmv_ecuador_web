import TopicEditor from "@/components/admin/formation/TopicEditor";

export const metadata = { title: "Itinerario | Admin JMV Ecuador" };

// /admin/itinerarios/nuevo crea; /admin/itinerarios/<id> edita
export default async function AdminTopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TopicEditor id={id === "nuevo" ? undefined : id} />;
}
