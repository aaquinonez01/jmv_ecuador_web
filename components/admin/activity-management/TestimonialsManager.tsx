"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createTestimonialAPI,
  deleteTestimonialAPI,
  getTestimonialsAPI,
  updateTestimonialAPI,
} from "@/actions/testimonials";
import Button from "@/components/admin/ui/Button";
import InputField from "@/components/admin/ui/InputField";
import Modal from "@/components/admin/ui/Modal";
import TextareaField from "@/components/admin/ui/TextareaField";
import { useToast } from "@/lib/hooks/useToast";
import type { TestimonialItem } from "@/types/activity-management";
import { MessageSquareQuote, Pencil, Plus, Star, Trash2 } from "lucide-react";

interface TestimonialFormState {
  name: string;
  role: string;
  location: string;
  quote: string;
  rating: string;
  active: boolean;
  displayOrder: string;
  image: File | null;
}

const emptyForm = (): TestimonialFormState => ({
  name: "",
  role: "",
  location: "",
  quote: "",
  rating: "5",
  active: true,
  displayOrder: "",
  image: null,
});

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      className={`h-4 w-4 ${
        index < rating ? "fill-current text-amber-500" : "text-gray-300"
      }`}
    />
  ));
}

export default function TestimonialsManager() {
  const toast = useToast();
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [form, setForm] = useState<TestimonialFormState>(emptyForm);

  const loadAll = async () => {
    try {
      setLoading(true);
      const response = await getTestimonialsAPI();
      setItems(response.items);
    } catch {
      toast.error("No se pudieron cargar los testimonios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) =>
      [item.name, item.role, item.location, item.quote]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term))
    );
  }, [items, search]);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm(emptyForm());
    setIsModalOpen(true);
  };

  const openEditModal = (item: TestimonialItem) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      role: item.role,
      location: item.location || "",
      quote: item.quote,
      rating: String(item.rating || 5),
      active: item.active,
      displayOrder: String(item.displayOrder || ""),
      image: null,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setForm(emptyForm());
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.role.trim() || !form.quote.trim()) {
      toast.error("Nombre, cargo y testimonio son obligatorios.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        location: form.location.trim() || undefined,
        quote: form.quote.trim(),
        rating: Number(form.rating || "5"),
        active: form.active,
        displayOrder: form.displayOrder ? Number(form.displayOrder) : undefined,
        image: form.image,
      };

      if (editingItem) {
        await updateTestimonialAPI(editingItem.id, payload);
        toast.success("Testimonio actualizado.");
      } else {
        await createTestimonialAPI(payload);
        toast.success("Testimonio creado.");
      }

      closeModal();
      await loadAll();
    } catch {
      toast.error("No se pudo guardar el testimonio.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item: TestimonialItem) => {
    const ok = window.confirm(`Se eliminará el testimonio de "${item.name}".`);
    if (!ok) return;

    try {
      await deleteTestimonialAPI(item.id);
      toast.success("Testimonio eliminado.");
      await loadAll();
    } catch {
      toast.error("No se pudo eliminar el testimonio.");
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Cargando testimonios...</div>;
  }

  return (
    <>
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Testimonios del home
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestiona el bloque “Voces que transforman” del inicio.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="min-w-[280px]">
              <InputField
                label="Buscar"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre, cargo o ciudad"
              />
            </div>
            <Button
              variant="primary"
              onClick={openCreateModal}
              icon={<Plus className="h-4 w-4" />}
              className="h-fit"
            >
              Nuevo testimonio
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500 xl:col-span-2">
              No hay testimonios cargados.
            </div>
          ) : (
            filteredItems.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-4 p-6 lg:flex-row">
                  <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-jmv-blue to-jmv-blue-dark text-2xl font-bold text-white">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      item.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <div className="mb-3 flex flex-wrap gap-2">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            item.active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.active ? "Activo" : "Inactivo"}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          {renderStars(item.rating)}
                        </span>
                      </div>

                      <h2 className="text-xl font-semibold text-gray-900">
                        {item.name}
                      </h2>
                      <p className="text-sm font-medium text-[#0066CC]">
                        {item.role}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.location || "Sin ubicación"}
                      </p>
                      <p className="mt-4 line-clamp-4 text-sm leading-6 text-gray-600">
                        {item.quote}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => openEditModal(item)}
                        icon={<Pencil className="h-4 w-4" />}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(item)}
                        icon={<Trash2 className="h-4 w-4" />}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingItem ? "Editar testimonio" : "Nuevo testimonio"}
        size="lg"
      >
        <div className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <InputField
              label="Nombre"
              required
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Nombre completo"
            />
            <InputField
              label="Cargo"
              required
              value={form.role}
              onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
              placeholder="Ej. Coordinadora Nacional"
            />
            <InputField
              label="Ubicación"
              value={form.location}
              onChange={(event) =>
                setForm((current) => ({ ...current, location: event.target.value }))
              }
              placeholder="Ciudad, provincia"
            />
            <InputField
              label="Orden"
              type="number"
              value={form.displayOrder}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  displayOrder: event.target.value,
                }))
              }
              placeholder="1"
            />
            <InputField
              label="Rating"
              type="number"
              value={form.rating}
              onChange={(event) =>
                setForm((current) => ({ ...current, rating: event.target.value }))
              }
              placeholder="5"
            />
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Imagen
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    image: event.target.files?.[0] || null,
                  }))
                }
                className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-jmv-blue file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-jmv-blue-dark"
              />
              <p className="mt-2 text-xs text-gray-500">
                {form.image
                  ? form.image.name
                  : editingItem?.imageUrl
                    ? "Se mantiene la imagen actual"
                    : "Sin imagen cargada"}
              </p>
            </div>
          </div>

          <TextareaField
            label="Testimonio"
            value={form.quote}
            onChange={(event) =>
              setForm((current) => ({ ...current, quote: event.target.value }))
            }
            placeholder="Texto del testimonio"
            rows={6}
          />

          <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) =>
                setForm((current) => ({ ...current, active: event.target.checked }))
              }
              className="h-4 w-4 rounded border-gray-300 text-jmv-blue focus:ring-jmv-blue"
            />
            Mostrar en el home
          </label>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={submitting}
              icon={<MessageSquareQuote className="h-4 w-4" />}
            >
              {editingItem ? "Guardar cambios" : "Crear testimonio"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
