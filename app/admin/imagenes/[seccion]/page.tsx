import { Metadata } from "next";
import { notFound } from "next/navigation";
import SeccionClient from "./SeccionClient";
import { mockSections } from "@/data/admin/mockSections";
import { getImagesBySectionAPI } from "@/actions/admin-images/get-by-section";

interface PageProps {
  params: Promise<{
    seccion: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { seccion } = await params;
  const section = mockSections.find((s) => s.id === seccion);

  if (!section) {
    return {
      title: "Sección no encontrada | Admin JMV Ecuador",
    };
  }

  return {
    title: `${section.name} | Gestión de Imágenes | Admin JMV Ecuador`,
    description: `Administra las imágenes de la sección ${section.name}: ${section.description}`,
  };
}

export default async function SeccionPage({ params }: PageProps) {
  const { seccion } = await params;
  const section = mockSections.find((s) => s.id === seccion);

  if (!section) {
    notFound();
  }

  const initialImages = await getImagesBySectionAPI(seccion);

  return (
    <SeccionClient
      section={section}
      sectionId={seccion}
      initialImages={initialImages}
    />
  );
}
