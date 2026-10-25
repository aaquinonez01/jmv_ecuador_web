import StatuteEditor from "@/components/admin/statutes-management/StatuteEditor";

export const metadata = {
  title: "Nueva versión de los estatutos | Admin JMV Ecuador",
};

type Props = { searchParams: Promise<{ desde?: string }> };

// ?desde=<id> duplica otra versión (para preparar una reforma)
export default async function AdminNewStatutePage({ searchParams }: Props) {
  const { desde } = await searchParams;
  return <StatuteEditor key={desde ?? "nueva"} sourceId={desde} />;
}
