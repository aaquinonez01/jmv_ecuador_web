import Link from "next/link";
import { FileQuestion } from "lucide-react";
import Button from "@/components/admin/ui/Button";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Sección no encontrada
        </h2>
        <p className="text-gray-600 mb-6">
          La sección que buscas no existe
        </p>
        <Link href="/admin/imagenes">
          <Button variant="primary">Volver a Secciones</Button>
        </Link>
      </div>
    </div>
  );
}
