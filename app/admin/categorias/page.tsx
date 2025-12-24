"use client";

import { useEffect, useState } from "react";
import { ActivityCategory, getActivityCategoriesAPI } from "@/actions/activity-categories/get";
import { createActivityCategoryAPI } from "@/actions/activity-categories/create";
import { updateActivityCategoryAPI } from "@/actions/activity-categories/update";
import { deleteActivityCategoryAPI } from "@/actions/activity-categories/delete";
import Button from "@/components/admin/ui/Button";
import { Tag, Hash, Palette, FileText, CheckCircle } from "lucide-react";

export default function AdminCategoriasPage() {
  const [cats, setCats] = useState<ActivityCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<ActivityCategory>>({
    name: "",
    slug: "",
    description: "",
    color: "",
    icon: "",
    active: true,
  });
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const list = await getActivityCategoriesAPI();
      setCats(list);
    } catch (e) {
      setError("No se pudo cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    setError(null);
    if (!form.name || !form.slug) {
      setError("Nombre y slug son requeridos");
      return;
    }
    await createActivityCategoryAPI(form);
    setForm({ name: "", slug: "", description: "", color: "", icon: "", active: true });
    await load();
  };

  const update = async (id: string, changes: Partial<ActivityCategory>) => {
    await updateActivityCategoryAPI(id, changes);
    await load();
  };

  const remove = async (id: string) => {
    await deleteActivityCategoryAPI(id);
    await load();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categorías de Actividades</h1>
        <p className="text-sm text-gray-500">Administra las categorías que clasifican tus álbumes</p>
      </div>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="rounded-2xl overflow-hidden border border-gray-200 mb-8">
        <div className="px-6 py-4 bg-gradient-to-r from-[#0066CC]/10 to-[#004C99]/10 border-b border-gray-200 flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#0066CC]" />
          <h2 className="font-semibold text-gray-900">Nueva Categoría</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Nombre</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  placeholder="Ej. Campamentos"
                  value={form.name || ""}
                  onChange={(e) => {
                    const name = e.target.value;
                    const autSlug = name
                      .toLowerCase()
                      .trim()
                      .replace(/[\s_]+/g, "-")
                      .replace(/[^a-z0-9-]/g, "");
                    setForm({ ...form, name, slug: form.slug ? form.slug : autSlug });
                  }}
                />
                <div className="absolute right-2 top-2.5 text-xs text-gray-400">
                  <CheckCircle className="w-4 h-4 inline align-middle mr-1" />
                  Requerido
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Slug</label>
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-400" />
                <input
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  placeholder="campamentos"
                  value={form.slug || ""}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Usado como identificador (sin espacios ni acentos)</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Descripción</label>
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-gray-400 mt-2" />
                <textarea
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Descripción opcional"
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Color</label>
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-gray-400" />
                <input
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  placeholder="from-green-600 to-green-800 (opcional)"
                  value={form.color || ""}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Usado como gradiente en tarjetas (opcional)</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-3">
              <span className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${form.active ? "bg-[#0066CC]" : "bg-gray-300"}`}>
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${form.active ? "translate-x-6" : "translate-x-1"}`} />
              </span>
              <span className={`text-sm font-medium ${form.active ? "text-green-600" : "text-gray-500"}`}>
                {form.active ? "Activa" : "Inactiva"}
              </span>
              <input
                type="checkbox"
                checked={form.active ?? true}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="hidden"
              />
            </label>
            <Button variant="primary" onClick={create}>Crear</Button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden border border-gray-200">
        <div className="px-6 py-4 bg-gradient-to-r from-[#0066CC]/10 to-[#004C99]/10 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Listado</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-gray-600">Cargando...</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 text-gray-600">Nombre</th>
                  <th className="py-2 text-gray-600">Slug</th>
                  <th className="py-2 text-gray-600">Estado</th>
                  <th className="py-2 text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cats.map((c) => (
                  <tr key={c.id} className="border-b">
                    <td className="py-2 text-gray-900">{c.name}</td>
                    <td className="py-2 text-gray-700">{c.slug}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${c.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {c.active ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="py-2 flex gap-2">
                      <Button variant="secondary" onClick={() => update(c.id, { active: !c.active })}>
                        {c.active ? "Desactivar" : "Activar"}
                      </Button>
                      <Button variant="danger" onClick={() => remove(c.id)}>Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
