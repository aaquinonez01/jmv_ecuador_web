"use client";

import Link from "next/link";
import { ImagePlus, FolderOpen } from "lucide-react";
import Button from "@/components/admin/ui/Button";

export default function QuickActions() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        🚀 Acciones Rápidas
      </h2>
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/imagenes">
          <Button variant="primary" icon={<FolderOpen className="w-5 h-5" />}>
            Ver Secciones
          </Button>
        </Link>
        <Link href="/admin/imagenes">
          <Button
            variant="secondary"
            icon={<ImagePlus className="w-5 h-5" />}
          >
            Subir Imagen
          </Button>
        </Link>
      </div>
    </div>
  );
}
