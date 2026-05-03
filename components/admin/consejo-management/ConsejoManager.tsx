"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Crown,
  Pencil,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import {
  createConsejoMemberAPI,
  createConsejoPeriodAPI,
  deleteConsejoMemberAPI,
  deleteConsejoPeriodAPI,
  getConsejoPeriodsAPI,
  updateConsejoMemberAPI,
  updateConsejoPeriodAPI,
} from "@/actions/consejo-nacional";
import Button from "@/components/admin/ui/Button";
import InputField from "@/components/admin/ui/InputField";
import SelectField from "@/components/admin/ui/SelectField";
import Modal from "@/components/admin/ui/Modal";
import TextareaField from "@/components/admin/ui/TextareaField";
import PageHeader from "@/components/admin/layout/PageHeader";
import { useToast } from "@/lib/hooks/useToast";
import type {
  ConsejoMember,
  ConsejoPeriod,
  TipoCargoConsejo,
} from "@/types/consejo";

const TIPO_CARGO_OPTIONS = [
  { id: "coordinador", name: "Coordinador/a Nacional" },
  { id: "vicecoordinador", name: "Vicecoordinador/a Nacional" },
  { id: "secretario", name: "Secretario/a Nacional" },
  { id: "tesorero", name: "Tesorero/a Nacional" },
  { id: "vocal", name: "Vocal" },
];

interface PeriodFormState {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
  active: boolean;
}

interface MemberFormState {
  nombre: string;
  cargo: string;
  tipoCargo: TipoCargoConsejo;
  edad: string;
  comunidad: string;
  santoFavorito: string;
  citaBiblica: string;
  descripcion: string;
  email: string;
  telefono: string;
  fechaPosesion: string;
  fechaFinCargo: string;
  displayOrder: string;
  active: boolean;
  image: File | null;
}

const emptyPeriodForm = (): PeriodFormState => ({
  nombre: "",
  fechaInicio: "",
  fechaFin: "",
  descripcion: "",
  active: false,
});

const emptyMemberForm = (): MemberFormState => ({
  nombre: "",
  cargo: "",
  tipoCargo: "vocal",
  edad: "",
  comunidad: "",
  santoFavorito: "",
  citaBiblica: "",
  descripcion: "",
  email: "",
  telefono: "",
  fechaPosesion: "",
  fechaFinCargo: "",
  displayOrder: "",
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

export default function ConsejoManager() {
  const toast = useToast();
  const [periods, setPeriods] = useState<ConsejoPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);

  const [periodModalOpen, setPeriodModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<ConsejoPeriod | null>(
    null,
  );
  const [periodForm, setPeriodForm] = useState<PeriodFormState>(emptyPeriodForm);

  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ConsejoMember | null>(null);
  const [memberForm, setMemberForm] = useState<MemberFormState>(emptyMemberForm);

  const loadAll = async () => {
    try {
      setLoading(true);
      const data = await getConsejoPeriodsAPI();
      setPeriods(data);
      const activeOne = data.find((p) => p.active) || data[0];
      if (activeOne && !selectedPeriodId) {
        setSelectedPeriodId(activeOne.id);
      }
    } catch {
      toast.error("No se pudieron cargar los períodos del Consejo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const selectedPeriod = useMemo(
    () => periods.find((p) => p.id === selectedPeriodId) || null,
    [periods, selectedPeriodId],
  );

  const openCreatePeriod = () => {
    setEditingPeriod(null);
    setPeriodForm(emptyPeriodForm());
    setPeriodModalOpen(true);
  };

  const openEditPeriod = (period: ConsejoPeriod) => {
    setEditingPeriod(period);
    setPeriodForm({
      nombre: period.nombre,
      fechaInicio: period.fechaInicio?.slice(0, 10) || "",
      fechaFin: period.fechaFin?.slice(0, 10) || "",
      descripcion: period.descripcion || "",
      active: period.active,
    });
    setPeriodModalOpen(true);
  };

  const closePeriodModal = () => {
    setPeriodModalOpen(false);
    setEditingPeriod(null);
    setPeriodForm(emptyPeriodForm());
  };

  const submitPeriod = async () => {
    if (
      !periodForm.nombre.trim() ||
      !periodForm.fechaInicio ||
      !periodForm.fechaFin
    ) {
      toast.error("Nombre, fecha inicio y fecha fin son obligatorios.");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        nombre: periodForm.nombre.trim(),
        fechaInicio: periodForm.fechaInicio,
        fechaFin: periodForm.fechaFin,
        descripcion: periodForm.descripcion.trim() || null,
        active: periodForm.active,
      };
      if (editingPeriod) {
        await updateConsejoPeriodAPI(editingPeriod.id, payload);
        toast.success("Período actualizado.");
      } else {
        const created = await createConsejoPeriodAPI(payload);
        toast.success("Período creado.");
        setSelectedPeriodId(created.id);
      }
      closePeriodModal();
      await loadAll();
    } catch {
      toast.error("No se pudo guardar el período.");
    } finally {
      setSubmitting(false);
    }
  };

  const deletePeriod = async (period: ConsejoPeriod) => {
    if (
      !window.confirm(
        `Se eliminará "${period.nombre}" y todos sus miembros. ¿Continuar?`,
      )
    )
      return;
    try {
      await deleteConsejoPeriodAPI(period.id);
      toast.success("Período eliminado.");
      if (selectedPeriodId === period.id) setSelectedPeriodId(null);
      await loadAll();
    } catch {
      toast.error("No se pudo eliminar el período.");
    }
  };

  const openCreateMember = () => {
    if (!selectedPeriodId) {
      toast.error("Primero selecciona o crea un período.");
      return;
    }
    setEditingMember(null);
    setMemberForm(emptyMemberForm());
    setMemberModalOpen(true);
  };

  const openEditMember = (member: ConsejoMember) => {
    setEditingMember(member);
    setMemberForm({
      nombre: member.nombre,
      cargo: member.cargo,
      tipoCargo: member.tipoCargo,
      edad: member.edad ? String(member.edad) : "",
      comunidad: member.comunidad || "",
      santoFavorito: member.santoFavorito || "",
      citaBiblica: member.citaBiblica || "",
      descripcion: member.descripcion || "",
      email: member.email || "",
      telefono: member.telefono || "",
      fechaPosesion: member.fechaPosesion?.slice(0, 10) || "",
      fechaFinCargo: member.fechaFinCargo?.slice(0, 10) || "",
      displayOrder: String(member.displayOrder ?? ""),
      active: member.active,
      image: null,
    });
    setMemberModalOpen(true);
  };

  const closeMemberModal = () => {
    setMemberModalOpen(false);
    setEditingMember(null);
    setMemberForm(emptyMemberForm());
  };

  const submitMember = async () => {
    if (!memberForm.nombre.trim() || !memberForm.cargo.trim()) {
      toast.error("Nombre y cargo son obligatorios.");
      return;
    }
    if (!selectedPeriodId && !editingMember) {
      toast.error("Selecciona un período antes de agregar miembros.");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        nombre: memberForm.nombre.trim(),
        cargo: memberForm.cargo.trim(),
        tipoCargo: memberForm.tipoCargo,
        edad: memberForm.edad || null,
        comunidad: memberForm.comunidad.trim() || null,
        santoFavorito: memberForm.santoFavorito.trim() || null,
        citaBiblica: memberForm.citaBiblica.trim() || null,
        descripcion: memberForm.descripcion.trim() || null,
        email: memberForm.email.trim() || null,
        telefono: memberForm.telefono.trim() || null,
        fechaPosesion: memberForm.fechaPosesion || null,
        fechaFinCargo: memberForm.fechaFinCargo || null,
        displayOrder: memberForm.displayOrder || null,
        active: memberForm.active,
        image: memberForm.image,
      };
      if (editingMember) {
        await updateConsejoMemberAPI(editingMember.id, payload);
        toast.success("Miembro actualizado.");
      } else {
        await createConsejoMemberAPI(selectedPeriodId!, payload);
        toast.success("Miembro creado.");
      }
      closeMemberModal();
      await loadAll();
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "No se pudo guardar el miembro.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMember = async (member: ConsejoMember) => {
    if (!window.confirm(`Eliminar a "${member.nombre}"?`)) return;
    try {
      await deleteConsejoMemberAPI(member.id);
      toast.success("Miembro eliminado.");
      await loadAll();
    } catch {
      toast.error("No se pudo eliminar el miembro.");
    }
  };

  if (loading) {
    return (
      <div className="px-5 py-10 text-sm text-slate-500">
        Cargando Consejo Nacional...
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Consejo Nacional"
        description="Administra los períodos del Consejo y sus miembros."
        icon={<Crown className="h-[18px] w-[18px]" strokeWidth={2.1} />}
        breadcrumbs={[{ label: "Estructura" }, { label: "Consejo Nacional" }]}
        actions={
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="h-3.5 w-3.5" strokeWidth={2.5} />}
            onClick={openCreatePeriod}
          >
            Nuevo período
          </Button>
        }
      />

      <div className="flex-1 space-y-5 overflow-auto px-6 py-6">
        {periods.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <Crown className="mx-auto mb-3 h-10 w-10 text-jmv-blue" />
            <p className="mb-3 text-sm text-slate-600">
              No hay períodos del Consejo creados.
            </p>
            <Button variant="primary" size="md" onClick={openCreatePeriod}>
              Crear el primer período
            </Button>
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                Períodos
              </p>
              <div className="flex flex-wrap gap-2">
                {periods.map((p) => {
                  const isSelected = selectedPeriodId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPeriodId(p.id)}
                      className={`group flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors ${
                        isSelected
                          ? "border-jmv-blue bg-jmv-blue/5"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-slate-900">
                            {p.nombre}
                          </span>
                          {p.active && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                              <CheckCircle2 className="h-2.5 w-2.5" />
                              Activo
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                          <Calendar className="h-3 w-3" />
                          {formatDate(p.fechaInicio)} —{" "}
                          {formatDate(p.fechaFin)}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedPeriod && (
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {selectedPeriod.nombre}
                    </h2>
                    {selectedPeriod.descripcion && (
                      <p className="mt-1 text-sm text-slate-500">
                        {selectedPeriod.descripcion}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditPeriod(selectedPeriod)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil className="h-3 w-3" />
                      Editar período
                    </button>
                    <button
                      onClick={() => deletePeriod(selectedPeriod)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-red-200 px-3 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                      Eliminar
                    </button>
                  </div>
                </div>

                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-700">
                    Miembros ({selectedPeriod.miembros.length})
                  </h3>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Plus className="h-3 w-3" />}
                    onClick={openCreateMember}
                  >
                    Agregar miembro
                  </Button>
                </div>

                {selectedPeriod.miembros.length === 0 ? (
                  <p className="rounded-md border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                    Aún no hay miembros en este período.
                  </p>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="min-w-[640px] divide-y divide-slate-200 text-xs sm:min-w-full">
                      <thead className="bg-slate-50">
                        <tr className="text-[10.5px] uppercase tracking-wider text-slate-500">
                          <th className="px-4 py-2.5 text-left font-bold">
                            Nombre
                          </th>
                          <th className="px-4 py-2.5 text-left font-bold">
                            Cargo
                          </th>
                          <th className="px-4 py-2.5 text-left font-bold">
                            Tipo
                          </th>
                          <th className="px-4 py-2.5 text-left font-bold">
                            Comunidad
                          </th>
                          <th className="px-4 py-2.5 text-left font-bold">
                            Estado
                          </th>
                          <th className="px-4 py-2.5 text-right font-bold">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {selectedPeriod.miembros.map((m) => (
                          <tr key={m.id}>
                            <td className="px-4 py-2.5">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-xs font-bold text-jmv-blue">
                                  {m.imageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={m.imageUrl}
                                      alt={m.nombre}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    m.nombre.charAt(0).toUpperCase()
                                  )}
                                </div>
                                <span className="font-semibold text-slate-900">
                                  {m.nombre}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-2.5 font-semibold text-jmv-blue">
                              {m.cargo}
                            </td>
                            <td className="px-4 py-2.5 text-slate-500">
                              {m.tipoCargo}
                            </td>
                            <td className="px-4 py-2.5 text-slate-500">
                              {m.comunidad || "—"}
                            </td>
                            <td className="px-4 py-2.5">
                              {m.active ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
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
                                  onClick={() => openEditMember(m)}
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-jmv-blue/10 hover:text-jmv-blue"
                                  title="Editar"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteMember(m)}
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
                                  title="Eliminar"
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
            )}
          </>
        )}
      </div>

      {/* Period Modal */}
      <Modal
        isOpen={periodModalOpen}
        onClose={closePeriodModal}
        title={editingPeriod ? "Editar período" : "Nuevo período del Consejo"}
        description="Cada período del Consejo Nacional dura 3 años (elegido en la Asamblea)."
        size="md"
        footer={
          <>
            <Button size="sm" variant="outline" onClick={closePeriodModal}>
              Cancelar
            </Button>
            <Button
              size="sm"
              variant="primary"
              isLoading={submitting}
              onClick={submitPeriod}
            >
              {editingPeriod ? "Guardar cambios" : "Crear período"}
            </Button>
          </>
        }
      >
        <div className="space-y-3 px-5 py-4">
          <InputField
            label="Nombre"
            required
            value={periodForm.nombre}
            onChange={(e) =>
              setPeriodForm((c) => ({ ...c, nombre: e.target.value }))
            }
            placeholder="Ej. Consejo Nacional 2026-2029"
          />
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Fecha inicio"
              type="date"
              required
              value={periodForm.fechaInicio}
              onChange={(e) =>
                setPeriodForm((c) => ({ ...c, fechaInicio: e.target.value }))
              }
            />
            <InputField
              label="Fecha fin"
              type="date"
              required
              value={periodForm.fechaFin}
              onChange={(e) =>
                setPeriodForm((c) => ({ ...c, fechaFin: e.target.value }))
              }
            />
          </div>
          <TextareaField
            label="Descripción"
            value={periodForm.descripcion}
            onChange={(e) =>
              setPeriodForm((c) => ({ ...c, descripcion: e.target.value }))
            }
            placeholder="Contexto o lema del período (opcional)"
            rows={3}
          />
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={periodForm.active}
              onChange={(e) =>
                setPeriodForm((c) => ({ ...c, active: e.target.checked }))
              }
              className="h-4 w-4 rounded border-slate-300 text-jmv-blue focus:ring-2 focus:ring-jmv-blue/30"
            />
            Marcar como Consejo activo (desactiva al anterior)
          </label>
        </div>
      </Modal>

      {/* Member Modal */}
      <Modal
        isOpen={memberModalOpen}
        onClose={closeMemberModal}
        title={editingMember ? "Editar miembro" : "Agregar miembro al Consejo"}
        size="lg"
        footer={
          <>
            <Button size="sm" variant="outline" onClick={closeMemberModal}>
              Cancelar
            </Button>
            <Button
              size="sm"
              variant="primary"
              isLoading={submitting}
              onClick={submitMember}
            >
              {editingMember ? "Guardar cambios" : "Crear miembro"}
            </Button>
          </>
        }
      >
        <div className="space-y-3 px-5 py-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InputField
              label="Nombre"
              required
              value={memberForm.nombre}
              onChange={(e) =>
                setMemberForm((c) => ({ ...c, nombre: e.target.value }))
              }
            />
            <InputField
              label="Cargo (texto visible)"
              required
              value={memberForm.cargo}
              onChange={(e) =>
                setMemberForm((c) => ({ ...c, cargo: e.target.value }))
              }
              placeholder='Ej. "Vocal de FAVIE"'
            />
            <SelectField
              label="Tipo de cargo"
              required
              value={memberForm.tipoCargo}
              onChange={(e) =>
                setMemberForm((c) => ({
                  ...c,
                  tipoCargo: e.target.value as TipoCargoConsejo,
                }))
              }
              options={TIPO_CARGO_OPTIONS}
            />
            <InputField
              label="Edad"
              type="number"
              value={memberForm.edad}
              onChange={(e) =>
                setMemberForm((c) => ({ ...c, edad: e.target.value }))
              }
            />
            <InputField
              label="Comunidad"
              value={memberForm.comunidad}
              onChange={(e) =>
                setMemberForm((c) => ({ ...c, comunidad: e.target.value }))
              }
              placeholder="Ej. Zona Norte - Quito"
            />
            <InputField
              label="Santo favorito"
              value={memberForm.santoFavorito}
              onChange={(e) =>
                setMemberForm((c) => ({
                  ...c,
                  santoFavorito: e.target.value,
                }))
              }
            />
            <InputField
              label="Email"
              type="email"
              value={memberForm.email}
              onChange={(e) =>
                setMemberForm((c) => ({ ...c, email: e.target.value }))
              }
            />
            <InputField
              label="Teléfono"
              value={memberForm.telefono}
              onChange={(e) =>
                setMemberForm((c) => ({ ...c, telefono: e.target.value }))
              }
            />
            <InputField
              label="Fecha de posesión"
              type="date"
              value={memberForm.fechaPosesion}
              onChange={(e) =>
                setMemberForm((c) => ({
                  ...c,
                  fechaPosesion: e.target.value,
                }))
              }
            />
            <InputField
              label="Fecha fin de cargo"
              type="date"
              value={memberForm.fechaFinCargo}
              onChange={(e) =>
                setMemberForm((c) => ({
                  ...c,
                  fechaFinCargo: e.target.value,
                }))
              }
              hint="Opcional - si cambia antes que el período"
            />
            <InputField
              label="Orden de visualización"
              type="number"
              value={memberForm.displayOrder}
              onChange={(e) =>
                setMemberForm((c) => ({
                  ...c,
                  displayOrder: e.target.value,
                }))
              }
            />
          </div>

          <TextareaField
            label="Cita bíblica"
            value={memberForm.citaBiblica}
            onChange={(e) =>
              setMemberForm((c) => ({ ...c, citaBiblica: e.target.value }))
            }
            rows={2}
          />

          <TextareaField
            label="Descripción / bio"
            value={memberForm.descripcion}
            onChange={(e) =>
              setMemberForm((c) => ({ ...c, descripcion: e.target.value }))
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
                setMemberForm((c) => ({
                  ...c,
                  image: e.target.files?.[0] || null,
                }))
              }
              className="block w-full text-xs text-slate-600 file:mr-3 file:h-9 file:rounded-md file:border-0 file:bg-jmv-blue file:px-3 file:text-xs file:font-semibold file:text-white hover:file:bg-jmv-blue-dark"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              {memberForm.image
                ? memberForm.image.name
                : editingMember?.imageUrl
                  ? "Se mantiene la imagen actual"
                  : "Sin imagen cargada"}
            </p>
          </div>

          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={memberForm.active}
              onChange={(e) =>
                setMemberForm((c) => ({ ...c, active: e.target.checked }))
              }
              className="h-4 w-4 rounded border-slate-300 text-jmv-blue focus:ring-2 focus:ring-jmv-blue/30"
            />
            Activo (visible en la web)
          </label>
        </div>
      </Modal>
    </>
  );
}
