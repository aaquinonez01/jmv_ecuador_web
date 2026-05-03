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
import PageHeader from "@/components/admin/layout/PageHeader";
import { useToast } from "@/lib/hooks/useToast";
import type { TestimonialItem } from "@/types/activity-management";
import {
  CheckCircle2,
  ChevronDown,
  Download,
  Globe2,
  LayoutGrid,
  List,
  MapPin,
  MessageSquareQuote,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";

type FilterValue = "all" | "active" | "inactive";
type SortValue = "recent" | "name" | "rating";
type ViewMode = "grid" | "list";

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

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(value?: string | Date | null) {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("es-EC", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getCountry(location?: string | null) {
  if (!location) return null;
  const parts = location.split(",").map((s) => s.trim());
  return parts[parts.length - 1] || null;
}

function renderStars(rating: number, size = 12) {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      style={{ width: size, height: size }}
      className={
        index < rating
          ? "fill-amber-500 text-amber-500"
          : "fill-slate-200 text-slate-200"
      }
    />
  ));
}

export default function TestimonialsManager() {
  const toast = useToast();
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");
  const [sort, setSort] = useState<SortValue>("recent");
  const [view, setView] = useState<ViewMode>("grid");
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

  // ── Stats ──────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((i) => i.active).length;
    const ratings = items.map((i) => i.rating || 0).filter((r) => r > 0);
    const avg =
      ratings.length > 0
        ? ratings.reduce((acc, r) => acc + r, 0) / ratings.length
        : 0;
    const countries = new Set(
      items.map((i) => getCountry(i.location)).filter(Boolean) as string[]
    );
    return {
      total,
      active,
      avg,
      countries: countries.size,
    };
  }, [items]);

  // ── Filter + sort ──────────────────────────────────────
  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    let result = items;
    if (term) {
      result = result.filter((item) =>
        [item.name, item.role, item.location, item.quote]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(term))
      );
    }
    if (filter === "active") result = result.filter((i) => i.active);
    if (filter === "inactive") result = result.filter((i) => !i.active);

    const sorted = [...result];
    if (sort === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "rating") {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      sorted.sort((a, b) => {
        const aDate = new Date(
          (a as unknown as { createdAt?: string }).createdAt || 0
        ).getTime();
        const bDate = new Date(
          (b as unknown as { createdAt?: string }).createdAt || 0
        ).getTime();
        return bDate - aDate;
      });
    }
    return sorted;
  }, [items, search, filter, sort]);

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
    return (
      <div className="px-5 py-10 text-sm text-slate-500">
        Cargando testimonios...
      </div>
    );
  }

  const filterOptions: { value: FilterValue; label: string }[] = [
    { value: "all", label: "Todos" },
    { value: "active", label: "Activos" },
    { value: "inactive", label: "Inactivos" },
  ];

  return (
    <>
      <PageHeader
        title="Testimonios del Home"
        description='Bloque "Voces que transforman" del inicio.'
        icon={<MessageSquareQuote className="h-[18px] w-[18px]" strokeWidth={2.1} />}
        breadcrumbs={[{ label: "Contenido" }, { label: "Testimonios" }]}
        actions={
          <>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3.5 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              title="Exportar (próximamente)"
            >
              <Download className="h-3.5 w-3.5" />
              Exportar
            </button>
            <Button
              variant="primary"
              size="md"
              icon={<Plus className="h-3.5 w-3.5" strokeWidth={2.5} />}
              onClick={openCreateModal}
            >
              Nuevo
            </Button>
          </>
        }
      />

      {/* ── Content ── */}
      <div className="flex-1 space-y-4 overflow-auto px-6 py-6">
        {/* Stats strip */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            tone="navy"
            value={String(stats.total)}
            label="Total testimonios"
            icon={<MessageSquareQuote className="h-4 w-4 text-jmv-blue" />}
          />
          <StatCard
            tone="green"
            value={String(stats.active)}
            label="Activos"
            icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          />
          <StatCard
            tone="gold"
            value={stats.avg ? stats.avg.toFixed(1) : "—"}
            label="Puntuación media"
            icon={<Star className="h-4 w-4 fill-amber-500 text-amber-500" />}
          />
          <StatCard
            tone="navy"
            value={String(stats.countries)}
            label="Países representados"
            icon={<Globe2 className="h-4 w-4 text-jmv-blue" />}
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, cargo o ciudad…"
              className="block h-8 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-[13px] text-slate-900 placeholder-slate-400 transition-colors focus:border-jmv-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-jmv-blue/20"
            />
          </div>

          <div className="inline-flex gap-0.5 rounded-md bg-slate-100 p-0.5">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`rounded px-3 py-1 text-[12.5px] font-semibold transition-colors ${
                  filter === opt.value
                    ? "bg-white text-jmv-blue shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortValue)}
              className="h-8 cursor-pointer appearance-none rounded-md border border-slate-200 bg-slate-50 pl-3 pr-8 text-[12.5px] font-semibold text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-jmv-blue focus:bg-white focus:ring-2 focus:ring-jmv-blue/20"
            >
              <option value="recent">Más recientes</option>
              <option value="name">Nombre A–Z</option>
              <option value="rating">Mayor puntuación</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
              strokeWidth={2.2}
            />
          </div>

          <div className="ml-auto inline-flex gap-1">
            <button
              onClick={() => setView("grid")}
              className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
                view === "grid"
                  ? "border-jmv-blue bg-jmv-blue text-white"
                  : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
              title="Vista de cuadrícula"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
                view === "list"
                  ? "border-jmv-blue bg-jmv-blue text-white"
                  : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
              title="Vista de lista"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* List header */}
        <div className="flex items-center justify-between">
          <span className="text-[12.5px] text-slate-500">
            Mostrando{" "}
            <strong className="font-bold text-slate-900">
              {filteredItems.length}
            </strong>{" "}
            testimonio{filteredItems.length === 1 ? "" : "s"} · Bloque{" "}
            <span className="italic">"Voces que transforman"</span> del{" "}
            <a
              href="/"
              className="font-semibold text-jmv-blue hover:underline"
            >
              inicio
            </a>
          </span>
        </div>

        {/* Cards grid / list */}
        {view === "grid" ? (
          <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
            {filteredItems.map((item, index) => (
              <TestimonialCard
                key={item.id}
                item={item}
                index={index}
                onEdit={() => openEditModal(item)}
                onDelete={() => void handleDelete(item)}
              />
            ))}
            <AddCard onClick={openCreateModal} />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="min-w-[720px] divide-y divide-slate-200 text-xs sm:min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-[10.5px] uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-2.5 text-left font-bold">#</th>
                  <th className="px-4 py-2.5 text-left font-bold">Nombre</th>
                  <th className="px-4 py-2.5 text-left font-bold">Cargo</th>
                  <th className="px-4 py-2.5 text-left font-bold">Ubicación</th>
                  <th className="px-4 py-2.5 text-left font-bold">Estado</th>
                  <th className="px-4 py-2.5 text-left font-bold">Rating</th>
                  <th className="px-4 py-2.5 text-right font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      No hay testimonios que coincidan con el filtro.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-slate-50/60"
                    >
                      <td className="px-4 py-2.5 font-mono text-[11px] font-bold text-slate-400">
                        #{String(index + 1).padStart(3, "0")}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar item={item} size={32} fontSize={11} />
                          <span className="text-xs font-bold text-slate-900">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-[12px] font-semibold text-jmv-blue">
                        {item.role}
                      </td>
                      <td className="px-4 py-2.5 text-[11.5px] text-slate-600">
                        {item.location || "—"}
                      </td>
                      <td className="px-4 py-2.5">
                        <ActiveBadge active={item.active} />
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex">{renderStars(item.rating || 0, 11)}</div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEditModal(item)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-jmv-blue/10 hover:text-jmv-blue"
                            title="Editar"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => void handleDelete(item)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-600 transition-colors hover:bg-red-50"
                            title="Eliminar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingItem ? "Editar testimonio" : "Nuevo testimonio"}
        description={
          editingItem
            ? "Actualiza la información mostrada en el bloque del home."
            : "Crea un nuevo testimonio para el bloque \"Voces que transforman\"."
        }
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
              icon={<MessageSquareQuote className="h-3.5 w-3.5" />}
              onClick={handleSubmit}
            >
              {editingItem ? "Guardar cambios" : "Crear testimonio"}
            </Button>
          </>
        }
      >
        <div className="space-y-4 px-5 py-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InputField
              label="Nombre"
              required
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Nombre completo"
            />
            <InputField
              label="Cargo"
              required
              value={form.role}
              onChange={(event) =>
                setForm((current) => ({ ...current, role: event.target.value }))
              }
              placeholder="Ej. Coordinadora Nacional"
            />
            <InputField
              label="Ubicación"
              value={form.location}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  location: event.target.value,
                }))
              }
              placeholder="Ciudad, País"
            />
            <div className="grid grid-cols-2 gap-3">
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
                  setForm((current) => ({
                    ...current,
                    rating: event.target.value,
                  }))
                }
                placeholder="5"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
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
              className="block w-full text-xs text-slate-600 file:mr-3 file:h-9 file:rounded-md file:border-0 file:bg-jmv-blue file:px-3 file:text-xs file:font-semibold file:text-white hover:file:bg-jmv-blue-dark"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              {form.image
                ? form.image.name
                : editingItem?.imageUrl
                  ? "Se mantiene la imagen actual"
                  : "Sin imagen cargada"}
            </p>
          </div>

          <TextareaField
            label="Testimonio"
            required
            value={form.quote}
            onChange={(event) =>
              setForm((current) => ({ ...current, quote: event.target.value }))
            }
            placeholder="Texto del testimonio"
            rows={5}
          />

          <label className="inline-flex h-9 w-full cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  active: event.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-slate-300 text-jmv-blue focus:ring-2 focus:ring-jmv-blue/30"
            />
            Mostrar en el home
          </label>
        </div>
      </Modal>
    </>
  );
}

// ─────────────────────────── Subcomponents ───────────────────────────

function StatCard({
  tone,
  value,
  label,
  icon,
}: {
  tone: "navy" | "green" | "gold" | "red";
  value: string;
  label: string;
  icon: React.ReactNode;
}) {
  const toneBg: Record<string, string> = {
    navy: "bg-jmv-blue/10",
    green: "bg-emerald-50",
    gold: "bg-amber-50",
    red: "bg-red-50",
  };
  return (
    <div className="flex items-center gap-3.5 rounded-lg border border-slate-200 bg-white px-4 py-3.5">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${toneBg[tone]}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[22px] font-extrabold leading-none text-slate-900">
          {value}
        </p>
        <p className="mt-1 text-[11.5px] font-medium text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function ActiveBadge({ active }: { active: boolean }) {
  if (active) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Activo
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-slate-500">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      Inactivo
    </span>
  );
}

function Avatar({
  item,
  size = 56,
  fontSize = 18,
}: {
  item: TestimonialItem;
  size?: number;
  fontSize?: number;
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 font-bold text-jmv-blue"
      style={{ width: size, height: size, fontSize }}
    >
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      ) : (
        getInitials(item.name)
      )}
    </div>
  );
}

function TestimonialCard({
  item,
  index,
  onEdit,
  onDelete,
}: {
  item: TestimonialItem;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const id = `#${String(item.displayOrder || index + 1).padStart(3, "0")}`;
  const createdAt = (item as unknown as { createdAt?: string }).createdAt;

  return (
    <article className="flex flex-col gap-3.5 rounded-xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_6px_20px_rgba(30,55,130,0.08)]">
      {/* Header */}
      <div className="flex items-start gap-3.5">
        <Avatar item={item} />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="text-[15px] font-bold text-slate-900">
              {item.name}
            </span>
            <ActiveBadge active={item.active} />
          </div>
          <p className="text-[12.5px] font-semibold text-jmv-blue">
            {item.role}
          </p>
          {item.location ? (
            <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-slate-400">
              <MapPin className="h-2.5 w-2.5" strokeWidth={2.2} />
              {item.location}
            </p>
          ) : null}
          <div className="mt-1 flex">{renderStars(item.rating || 0, 12)}</div>
        </div>
        <span className="ml-auto shrink-0 self-start rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-500">
          {id}
        </span>
      </div>

      {/* Quote */}
      <blockquote className="rounded-r-md border-l-[3px] border-amber-500 bg-slate-50 px-3.5 py-3 text-[13px] italic leading-relaxed text-slate-600">
        {item.quote}
      </blockquote>

      {/* Footer */}
      <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-md border-[1.5px] border-jmv-blue px-3.5 py-1.5 text-[12.5px] font-semibold text-jmv-blue transition-colors hover:bg-jmv-blue hover:text-white"
        >
          <Pencil className="h-3 w-3" />
          Editar
        </button>
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-1.5 rounded-md border-[1.5px] border-transparent bg-red-50 px-3.5 py-1.5 text-[12.5px] font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white"
        >
          <Trash2 className="h-3 w-3" />
          Eliminar
        </button>
        {createdAt ? (
          <span className="ml-auto text-[11px] font-medium text-slate-400">
            Añadido {formatDate(createdAt)}
          </span>
        ) : null}
      </div>
    </article>
  );
}

function AddCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex min-h-[180px] flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-slate-200 bg-transparent p-5 text-center transition-colors hover:border-jmv-blue"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-jmv-blue/10 transition-colors group-hover:bg-jmv-blue/15">
        <Plus className="h-5 w-5 text-jmv-blue" strokeWidth={2.4} />
      </div>
      <div>
        <p className="text-[13px] font-bold text-jmv-blue">
          Agregar testimonio
        </p>
        <p className="mt-0.5 text-[12px] text-slate-400">
          Haz clic para crear uno nuevo
        </p>
      </div>
    </button>
  );
}
