import { Metadata } from "next";
import ImagenesClient from "./ImagenesClient";
import { mockSections } from "@/data/admin/mockSections";

export const metadata: Metadata = {
  title: "Gestión de Imágenes | Panel Administrativo | JMV Ecuador",
  description: "Administra todas las imágenes del sitio web de Juventudes Marianas Vicencianas Ecuador organizadas por secciones",
};

export default function ImagenesPage() {
  return <ImagenesClient sections={mockSections} />;
}
