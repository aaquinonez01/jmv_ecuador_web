"use client";

import { useCallback, useEffect, useState } from "react";
import {
  deleteContactMessageAPI,
  getContactMessagesAPI,
  markContactMessageAPI,
} from "@/actions/contact-messages";
import Button from "@/components/admin/ui/Button";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import PageHeader from "@/components/admin/layout/PageHeader";
import { useToast } from "@/lib/hooks/useToast";
import { formatDateTime } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import type { ContactMessageItem, ContactMessageOrigen } from "@/types/contact-message";
import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  Mail,
  MailOpen,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Trash2,
} from "lucide-react";

const PAGE_SIZE = 20;

type LeidoFilter = "all" | "unread" | "read";
type OrigenFilter = "all" | ContactMessageOrigen;

const leidoOptions: { value: LeidoFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "unread", label: "No leídos" },
  { value: "read", label: "Leídos" },
];

const origenOptions: { value: OrigenFilter; label: string }[] = [
  { value: "all", label: "Todos los orígenes" },
  { value: "contacto", label: "Contacto" },
  { value: "unete", label: "Únete" },
];

/** Número ecuatoriano a formato wa.me (solo móviles 09…) */
function toWhatsapp(phone?: string | null) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (/^5939\d{8}$/.test(digits)) return digits;
  if (/^09\d{8}$/.test(digits)) return `593${digits.slice(1)}`;
  return null;
}

export default function ContactMessagesManager() {
  const toast = useToast();
  const [items, setItems] = useState<ContactMessageItem[]>([]);
  const [total, setTotal] = useState(0);
  const [noLeidos, setNoLeidos] = useState(0);
  const [page, setPage] = useState(0);
  const [leido, setLeido] = useState<LeidoFilter>("unread");
  const [origen, setOrigen] = useState<OrigenFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toDelete, setToDelete] = useState<ContactMessageItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getContactMessagesAPI({
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
        leido: leido === "all" ? undefined : leido === "read",
        origen: origen === "all" ? undefined : origen,
      });
      setItems(data.items);
      setTotal(data.total);
      setNoLeidos(data.noLeidos);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, leido, origen]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleLeido = async (item: ContactMessageItem) => {
    try {
      await markContactMessageAPI(item.id, !item.leido);
      toast.success(item.leido ? "Marcado como no leído." : "Marcado como leído.");
      await load();
    } catch {
      toast.error("No se pudo actualizar el mensaje.");
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      setDeleting(true);
      await deleteContactMessageAPI(toDelete.id);
      toast.success("Mensaje eliminado.");
      setToDelete(null);
      if (items.length === 1 && page > 0) setPage((p) => p - 1);
      else await load();
    } catch {
      toast.error("No se pudo eliminar el mensaje.");
    } finally {
      setDeleting(false);
    }
  };

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader
        title="Mensajes de contacto"
        description="Mensajes enviados desde los formularios de Contacto y Únete."
        icon={<Inbox className="h-[18px] w-[18px]" strokeWidth={2.1} />}
        breadcrumbs={[{ label: "Comunicación" }, { label: "Mensajes" }]}
        actions={
          <Button
            variant="outline"
            size="md"
            icon={<RefreshCw className="h-3.5 w-3.5" />}
            onClick={() => void load()}
          >
            Actualizar
          </Button>
        }
      />

      <div className="flex-1 space-y-4 overflow-auto px-6 py-6">
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
          <div className="inline-flex gap-0.5 rounded-md bg-slate-100 p-0.5" role="group" aria-label="Estado">
            {leidoOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                aria-pressed={leido === opt.value}
                onClick={() => {
                  setLeido(opt.value);
                  setPage(0);
                }}
                className={`rounded px-3 py-1 text-[12.5px] font-semibold transition-colors ${
                  leido === opt.value
                    ? "bg-white text-jmv-blue shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <label className="sr-only" htmlFor="mensajes-origen">
            Origen
          </label>
          <select
            id="mensajes-origen"
            value={origen}
            onChange={(e) => {
              setOrigen(e.target.value as OrigenFilter);
              setPage(0);
            }}
            className="h-8 cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-3 text-[12.5px] font-semibold text-slate-700 hover:border-slate-300 focus:border-jmv-blue focus:bg-white"
          >
            {origenOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <span className="ml-auto text-[12.5px] text-slate-500" aria-live="polite">
            <strong className="font-bold text-slate-900">{noLeidos}</strong> sin leer ·{" "}
            {total} en esta vista
          </span>
        </div>

        {loading ? (
          <div className="px-1 py-10 text-sm text-slate-500">Cargando mensajes...</div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-800">
            No se pudieron cargar los mensajes. Revisa tu conexión o vuelve a iniciar sesión.
            <button
              type="button"
              onClick={() => void load()}
              className="ml-2 font-semibold underline"
            >
              Reintentar
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-12 text-center text-sm text-slate-500">
            No hay mensajes {leido === "unread" ? "sin leer" : "en esta vista"}.
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => {
              const wa = toWhatsapp(item.telefono);
              return (
                <li
                  key={item.id}
                  className={`rounded-lg border bg-white p-4 shadow-sm ${
                    item.leido ? "border-slate-200" : "border-l-4 border-jmv-blue"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-bold text-slate-900">{item.asunto}</h2>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            item.origen === "unete"
                              ? "bg-amber-100 text-amber-900"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {item.origen === "unete" ? "Únete" : "Contacto"}
                        </span>
                        {!item.leido && (
                          <span className="rounded bg-jmv-blue px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            Nuevo
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[12.5px] text-slate-600">
                        <strong className="font-semibold text-slate-800">{item.nombre}</strong> ·{" "}
                        <a href={`mailto:${item.email}`} className="text-jmv-blue hover:underline">
                          {item.email}
                        </a>
                        {item.telefono && (
                          <>
                            {" "}
                            ·{" "}
                            <a
                              href={`tel:${item.telefono.replace(/\s+/g, "")}`}
                              className="inline-flex items-center gap-1 text-jmv-blue hover:underline"
                            >
                              <Phone className="h-3 w-3" aria-hidden />
                              {item.telefono}
                            </a>
                          </>
                        )}
                        {item.ciudad && (
                          <span className="inline-flex items-center gap-1">
                            {" "}
                            · <MapPin className="h-3 w-3" aria-hidden />
                            {item.ciudad}
                          </span>
                        )}
                      </p>
                    </div>
                    <time dateTime={item.createdAt} className="shrink-0 text-[11.5px] text-slate-500">
                      {formatDateTime(item.createdAt, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>

                  <p className="mt-3 whitespace-pre-line text-[13px] leading-6 text-slate-700">
                    {item.mensaje}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={`mailto:${item.email}?subject=${encodeURIComponent(`Re: ${item.asunto}`)}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Mail className="h-3.5 w-3.5" aria-hidden />
                      Responder por correo
                    </a>
                    {wa && (
                      <a
                        href={whatsappLink(`Hola ${item.nombre.split(" ")[0]}, te escribimos de JMV Ecuador.`, wa)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                        WhatsApp
                      </a>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={item.leido ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
                      onClick={() => void toggleLeido(item)}
                    >
                      {item.leido ? "Marcar como no leído" : "Marcar como leído"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      icon={<Trash2 className="h-3.5 w-3.5" />}
                      onClick={() => setToDelete(item)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {pages > 1 && (
          <nav className="flex items-center justify-between" aria-label="Paginación de mensajes">
            <Button
              variant="outline"
              size="sm"
              icon={<ChevronLeft className="h-3.5 w-3.5" />}
              disabled={page === 0 || loading}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </Button>
            <span className="text-[12.5px] text-slate-500">
              Página {page + 1} de {pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page + 1 >= pages || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </nav>
        )}
      </div>

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={() => void confirmDelete()}
        title="Eliminar mensaje"
        message={`Se eliminará el mensaje de "${toDelete?.nombre ?? ""}". Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
        isLoading={deleting}
      />
    </>
  );
}
