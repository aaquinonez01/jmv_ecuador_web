"use client";

import { useEffect, useState } from "react";
import { Sparkles, Pencil, Plus, Trash2, CheckCircle2 } from "lucide-react";
import {
  createAsesorAPI,
  deleteAsesorAPI,
  getAsesoresAPI,
  updateAsesorAPI,
} from "@/actions/asesores";
import Button from "@/components/admin/ui/Button";
import InputField from "@/components/admin/ui/InputField";
import SelectField from "@/components/admin/ui/SelectField";
import Modal from "@/components/admin/ui/Modal";
import TextareaField from "@/components/admin/ui/TextareaField";
import PageHeader from "@/components/admin/layout/PageHeader";
import { useToast } from "@/lib/hooks/useToast";
import type { Asesor, TipoAsesor } from "@/types/consejo";

const TIPO_OPTIONS = [
  { id: "asesor", name: "Asesor Nacional" },
  { id: "asesora", name: "Asesora Nacional" },
];

interface AsesorFormState {
  tipo: TipoAsesor;
  nombre: string;
  cargo: string;
  comunidad: string;
  santoFavorito: string;
  citaBiblica: string;
  descripcion: string;
  email: string;
  telefono: string;
  fechaInicio: string;
  fechaFin: string;
  active: boolean;
  image: File | null;
}

const emptyForm = (): AsesorFormState => ({
  tipo: "asesor",
  nombre: "",
  cargo: "",
  comunidad: "",
  santoFavorito: "",
  citaBiblica: "",
  descripcion: "",
  email: "",
  telefono: "",
  fechaInicio: "",
  fechaFin: "",
  active: true,
  image: null,
});

function formatDate(value?: string | null) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("es-EC", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
}

export default function AsesoresManager() {
  const toast = useToast();
  const [items, setItems] = useState<Asesor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Asesor | null>(null);
  const [form, setForm] = useState<AsesorFormState>(emptyForm);

  const loadAll = async () => {
    try {
      setLoading(true);
      const data = await getAsesoresAPI();
      setItems(data);
    } catch {
      toast.error("No se pudieron cargar los asesores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setIsModalOpen(true);
  };

  const openEdit = (a: Asesor) => {
    setEditing(a);
    setForm({
      tipo: a.tipo,
      nombre: a.nombre,
      cargo: a.cargo,
      comunidad: a.comunidad || "",
      santoFavorito: a.santoFavorito || "",
      citaBiblica: a.citaBiblica || "",
      descripcion: a.descripcion || "",
      email: a.email || "",
      telefono: a.telefono || "",
      fechaInicio: a.fechaInicio?.slice(0, 10) || "",
      fechaFin: a.fechaFin?.slice(0, 10) || "",
      active: a.active,
      image: null,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setForm(emptyForm());
  };

  const submit = async () => {
    if (
      !form.nombre.trim() ||
      !form.cargo.trim() ||
      !form.fechaInicio ||
      !form.fechaFin
    ) {
      toast.error("Nombre, cargo, fecha inicio y fecha fin son obligatorios.");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        tipo: form.tipo,
        nombre: form.nombre.trim(),
        cargo: form.cargo.trim(),
        comunidad: form.comunidad.trim() || null,
        santoFavorito: form.santoFavorito.trim() || null,
        citaBiblica: form.citaBiblica.trim() || null,
        descripcion: form.descripcion.trim() || null,
        email: form.email.trim() || null,
        telefono: form.telefono.trim() || null,
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin,
        active: form.active,
        image: form.image,
      };
      if (editing) {
        await updateAsesorAPI(editing.id, payload);
        toast.success("Asesor actualizado.");
      } else {
        await createAsesorAPI(payload);
        toast.success("Asesor creado.");
      }
      closeModal();
      await loadAll();
    } catch {
      toast.error("No se pudo guardar el asesor.");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (a: Asesor) => {
    if (!window.confirm(`Eliminar a "${a.nombre}"?`)) return;
    try {
      await deleteAsesorAPI(a.id);
      toast.success("Asesor eliminado.");
      await loadAll();
    } catch {
      toast.error("No se pudo eliminar el asesor.");
    }
  };

  if (loading) {
    return (
      <div className="px-5 py-10 text-sm text-slate-500">
        Cargando asesores...
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Asesores Nacionales"
        description="Asesor y Asesora con períodos independientes del Consejo."
        icon={<Sparkles className="h-[18px] w-[18px]" strokeWidth={2.1} />}
        breadcrumbs={[{ label: "Estructura" }, { label: "Asesores" }]}
        actions={
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="h-3.5 w-3.5" strokeWidth={2.5} />}
            onClick={openCreate}
          >
            Nuevo asesor
          </Button>
        }
      />

      <div className="flex-1 overflow-auto px-6 py-6">
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <Sparkles className="mx-auto mb-3 h-10 w-10 text-jmv-blue" />
            <p className="mb-3 text-sm text-slate-600">
              No hay asesores registrados.
            </p>
            <Button variant="primary" size="md" onClick={openCreate}>
              Agregar primer asesor
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50">
                <tr className="text-[10.5px] uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-2.5 text-left font-bold">Nombre</th>
                  <th className="px-4 py-2.5 text-left font-bold">Tipo</th>
                  <th className="px-4 py-2.5 text-left font-bold">Cargo</th>
                  <th className="px-4 py-2.5 text-left font-bold">Período</th>
                  <th className="px-4 py-2.5 text-left font-bold">Estado</th>
                  <th className="px-4 py-2.5 text-right font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {items.map((a) => (
                  <tr key={a.id}>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-xs font-bold text-jmv-blue">
                          {a.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={a.imageUrl}
                              alt={a.nombre}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            a.nombre.charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className="font-semibold text-slate-900">
                          {a.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 capitalize text-slate-600">
                      {a.tipo}
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-jmv-blue">
                      {a.cargo}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">
                      {formatDate(a.fechaInicio)} — {formatDate(a.fechaFin)}
                    </td>
                    <td className="px-4 py-2.5">
                      {a.active ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEdit(a)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-jmv-blue/10 hover:text-jmv-blue"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => remove(a)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editing ? "Editar asesor" : "Nuevo asesor"}
        size="lg"
        footer={
          <>
            <Button size="sm" variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              size="sm"
              variant="primary"
              isLoading={submitting}
              onClick={submit}
            >
              {editing ? "Guardar cambios" : "Crear"}
            </Button>
          </>
        }
      >
        <div className="space-y-3 px-5 py-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SelectField
              label="Tipo"
              required
              value={form.tipo}
              onChange={(e) =>
                setForm((c) => ({ ...c, tipo: e.target.value as TipoAsesor }))
              }
              options={TIPO_OPTIONS}
            />
            <InputField
              label="Nombre"
              required
              value={form.nombre}
              onChange={(e) =>
                setForm((c) => ({ ...c, nombre: e.target.value }))
              }
            />
            <InputField
              label="Cargo"
              required
              value={form.cargo}
              onChange={(e) =>
                setForm((c) => ({ ...c, cargo: e.target.value }))
              }
              placeholder="Asesor Nacional / Asesora Nacional"
            />
            <InputField
              label="Comunidad"
              value={form.comunidad}
              onChange={(e) =>
                setForm((c) => ({ ...c, comunidad: e.target.value }))
              }
            />
            <InputField
              label="Fecha inicio"
              type="date"
              required
              value={form.fechaInicio}
              onChange={(e) =>
                setForm((c) => ({ ...c, fechaInicio: e.target.value }))
              }
            />
            <InputField
              label="Fecha fin"
              type="date"
              required
              value={form.fechaFin}
              onChange={(e) =>
                setForm((c) => ({ ...c, fechaFin: e.target.value }))
              }
            />
            <InputField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((c) => ({ ...c, email: e.target.value }))
              }
            />
            <InputField
              label="Teléfono"
              value={form.telefono}
              onChange={(e) =>
                setForm((c) => ({ ...c, telefono: e.target.value }))
              }
            />
            <InputField
              label="Santo favorito"
              value={form.santoFavorito}
              onChange={(e) =>
                setForm((c) => ({ ...c, santoFavorito: e.target.value }))
              }
            />
          </div>

          <TextareaField
            label="Cita bíblica"
            value={form.citaBiblica}
            onChange={(e) =>
              setForm((c) => ({ ...c, citaBiblica: e.target.value }))
            }
            rows={2}
          />

          <TextareaField
            label="Descripción"
            value={form.descripcion}
            onChange={(e) =>
              setForm((c) => ({ ...c, descripcion: e.target.value }))
            }
            rows={3}
          />

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Foto
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm((c) => ({
                  ...c,
                  image: e.target.files?.[0] || null,
                }))
              }
              className="block w-full text-xs text-slate-600 file:mr-3 file:h-9 file:rounded-md file:border-0 file:bg-jmv-blue file:px-3 file:text-xs file:font-semibold file:text-white hover:file:bg-jmv-blue-dark"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              {form.image
                ? form.image.name
                : editing?.imageUrl
                  ? "Se mantiene la imagen actual"
                  : "Sin imagen cargada"}
            </p>
          </div>

          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm((c) => ({ ...c, active: e.target.checked }))
              }
              className="h-4 w-4 rounded border-slate-300 text-jmv-blue focus:ring-2 focus:ring-jmv-blue/30"
            />
            Activo (desactiva al anterior del mismo tipo)
          </label>
        </div>
      </Modal>
    </>
  );
}
