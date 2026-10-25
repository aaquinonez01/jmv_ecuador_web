import StatuteEditor from "@/components/admin/statutes-management/StatuteEditor";

export const metadata = {
  title: "Editar estatutos | Admin JMV Ecuador",
};

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditStatutePage({ params }: Props) {
  const { id } = await params;
  return <StatuteEditor key={id} id={id} />;
}
