"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Coins, Search, UserCheck, UserPlus, X } from "lucide-react";
import { formationErrorMessage } from "@/actions/formation";
import { getComunidadesAPI } from "@/actions/comunidades";
import { adjustPointsAPI, getMembersAPI, getMemberTransactionsAPI, reviewMemberAPI } from "@/actions/points";
import Button from "@/components/admin/ui/Button";
import InputField from "@/components/admin/ui/InputField";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import Modal from "@/components/admin/ui/Modal";
import SelectField from "@/components/admin/ui/SelectField";
import PageHeader, { PageBody } from "@/components/admin/layout/PageHeader";
import { useToastRef } from "@/components/admin/formation/shared";
import { FORMATION_LEVELS } from "@/types/formation";
import { MEMBER_STATUS, type Member, type MembersPage, type MemberStatus, type MemberTransactions } from "@/types/points";
import type { ComunidadItem } from "@/types/territory-management";
import { CredencialesModal, NuevoUsuarioModal, RestablecerClave, type Credenciales } from "./UserForms";

const TABS: { id: MemberStatus | ""; label: string }[] = [
  { id: "pending", label: "Por verificar" },
  { id: "verified", label: "Verificados" },
  { id: "", label: "Todos" },
];

const levelName = (l?: string | null) => FORMATION_LEVELS.find((x) => x.id === l)?.name ?? "—";
const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("es-EC", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Guayaquil" }).format(new Date(iso));

function StatusBadge({ status }: { status: MemberStatus }) {
  const s = MEMBER_STATUS[status] ?? MEMBER_STATUS.none;
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.className}`}>{s.label}</span>;
}

// Miembros de la app: verificación (necesaria para canjear) y Puntos JMV
export default function MembersManager() {
  const toast = useToastRef();
  const [tab, setTab] = useState<MemberStatus | "">("pending");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<MembersPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [comunidades, setComunidades] = useState<ComunidadItem[]>([]);
  const [detail, setDetail] = useState<MemberTransactions | null>(null);
  const [creating, setCreating] = useState(false);
  const [cred, setCred] = useState<Credenciales | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await getMembersAPI({ status: tab, search: query, page }));
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudieron cargar los miembros."));
    } finally {
      setLoading(false);
    }
  }, [tab, query, page, toast]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { getComunidadesAPI().then(setComunidades).catch(() => {}); }, []);

  const review = async (m: Member, status: "verified" | "rejected") => {
    setBusy(m.id);
    try {
      await reviewMemberAPI(m.id, { status });
      toast.current.success(status === "verified" ? `${m.fullName} quedó verificado.` : "Solicitud rechazada.");
      await load();
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudo guardar."));
    } finally {
      setBusy(null);
    }
  };

  const openDetail = async (m: Member) => {
    try {
      setDetail(await getMemberTransactionsAPI(m.id));
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudo abrir."));
    }
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <>
      <PageHeader
        title="Usuarios y puntos"
        description="Quienes usan la app. Crea cuentas y asígnales su comunidad, verifica a los miembros (solo los verificados podrán canjear) y revisa o ajusta sus Puntos JMV."
        icon={<UserCheck className="h-5 w-5" />}
        breadcrumbs={[{ label: "Usuarios y puntos" }]}
        actions={<Button icon={<UserPlus className="h-4 w-4" />} onClick={() => setCreating(true)}>Nuevo usuario</Button>}
      />
      <PageBody>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex max-w-full overflow-x-auto rounded-lg border border-slate-200 bg-white p-1">
          {TABS.map((t) => (
            <button
              key={t.id || "all"}
              type="button"
              onClick={() => { setTab(t.id); setPage(1); }}
              className={`shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition ${tab === t.id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {t.label}
              {t.id === "pending" && data && data.pending > 0 && (
                <span className="ml-2 rounded-full bg-amber-400 px-1.5 text-xs font-bold text-slate-900">{data.pending}</span>
              )}
            </button>
          ))}
        </div>
        <form
          className="flex flex-1 items-center gap-2"
          onSubmit={(e) => { e.preventDefault(); setQuery(search); setPage(1); }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, correo o comunidad"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <Button type="submit" variant="outline" size="sm" icon={<Search className="h-4 w-4" />}>Buscar</Button>
        </form>
      </div>

      {loading && !data ? (
        <div className="flex justify-center py-16"><LoadingSpinner /></div>
      ) : !data || data.items.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">
          {tab === "pending" ? "No hay solicitudes por verificar." : "No hay miembros con este filtro."}
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {data.items.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center gap-3 px-4 sm:px-5 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-600">
                {(m.displayName || m.fullName).charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1 max-sm:basis-[calc(100%-3.25rem)]">
                <p className="font-medium text-slate-900">{m.fullName}{m.displayName && m.displayName !== m.fullName ? <span className="text-slate-500"> · {m.displayName}</span> : null}</p>
                <p className="text-xs text-slate-500">
                  {m.email} · {m.comunidad ? `${m.comunidad.nombre}${m.comunidad.zona ? ` (${m.comunidad.zona})` : ""}` : "Sin comunidad"} · {levelName(m.level)}
                </p>
              </div>
              <StatusBadge status={m.memberStatus} />
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-800">
                <Coins className="h-4 w-4" />{m.pointsBalance}
              </span>
              {m.memberStatus === "pending" && (
                <>
                  <Button size="sm" isLoading={busy === m.id} icon={<Check className="h-4 w-4" />} onClick={() => review(m, "verified")}>Verificar</Button>
                  <Button size="sm" variant="ghost" disabled={busy === m.id} icon={<X className="h-4 w-4 text-red-600" />} onClick={() => review(m, "rejected")} aria-label={`Rechazar a ${m.fullName}`} />
                </>
              )}
              <Button size="sm" variant="outline" onClick={() => openDetail(m)}>Ver</Button>
            </li>
          ))}
        </ul>
      )}

      {data && totalPages > 1 && (
        <div className="flex items-center justify-end gap-3 text-sm text-slate-600">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
          Página {page} de {totalPages}
          <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Siguiente</Button>
        </div>
      )}

      <NuevoUsuarioModal
        open={creating}
        comunidades={comunidades}
        onClose={() => setCreating(false)}
        onCreated={async (_m, c) => { setCreating(false); setCred(c); setTab(""); setPage(1); await load(); }}
      />
      <CredencialesModal data={cred} onClose={() => setCred(null)} />

      <MemberDetail
        detail={detail}
        comunidades={comunidades}
        onCredenciales={(c) => setCred(c)}
        onClose={() => setDetail(null)}
        onChanged={async (d) => { setDetail(d); await load(); }}
      />
      </PageBody>
    </>
  );
}

function MemberDetail({ detail, comunidades, onClose, onChanged, onCredenciales }: {
  detail: MemberTransactions | null;
  comunidades: ComunidadItem[];
  onCredenciales: (c: Credenciales) => void;
  onClose: () => void;
  onChanged: (d: MemberTransactions) => Promise<void>;
}) {
  const toast = useToastRef();
  const m = detail?.member;
  const [status, setStatus] = useState<MemberStatus>("none");
  const [level, setLevel] = useState("");
  const [comunidadId, setComunidadId] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState<"member" | "points" | null>(null);

  useEffect(() => {
    if (!m) return;
    setStatus(m.memberStatus);
    setLevel(m.level ?? "");
    setComunidadId(m.comunidad?.id ?? "");
    setAmount("");
    setReason("");
  }, [m]);

  if (!detail || !m) return null;

  const refresh = async () => onChanged(await getMemberTransactionsAPI(m.id));

  const saveMember = async () => {
    setSaving("member");
    try {
      await reviewMemberAPI(m.id, {
        status: status === "pending" ? "none" : status,
        level: level || undefined,
        comunidadId: comunidadId || undefined,
      });
      toast.current.success("Datos del miembro guardados.");
      await refresh();
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudo guardar."));
    } finally {
      setSaving(null);
    }
  };

  const adjust = async () => {
    const n = Number(amount);
    if (!Number.isInteger(n) || n === 0) return toast.current.error("Escribe una cantidad entera, positiva o negativa.");
    if (reason.trim().length < 3) return toast.current.error("Escribe el motivo (lo verá el joven en su historial).");
    setSaving("points");
    try {
      const r = await adjustPointsAPI(m.id, n, reason);
      toast.current.success(`${r.applied > 0 ? "+" : ""}${r.applied} puntos aplicados.`);
      await refresh();
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudo ajustar."));
    } finally {
      setSaving(null);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title={m.fullName} description={m.email} size="xl">
      <div className="space-y-6 px-5 pb-5">
        <section className="space-y-3">
          <h3 className="font-semibold text-slate-900">Miembro de JMV</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <SelectField
              label="Estado"
              value={status}
              onChange={(e) => setStatus(e.target.value as MemberStatus)}
              options={[
                ...(m.memberStatus === "pending" ? [{ id: "pending", name: "Pendiente (sin cambios)" }] : []),
                { id: "verified", name: "Verificado" },
                { id: "rejected", name: "Rechazado" },
                { id: "none", name: "Sin solicitud" },
              ]}
            />
            <SelectField label="Sección" value={level} placeholder="Sin sección" onChange={(e) => setLevel(e.target.value)} options={FORMATION_LEVELS.map((l) => ({ id: l.id, name: `${l.name} (${l.ages})` }))} />
            <SelectField label="Comunidad" value={comunidadId} placeholder="Sin comunidad" onChange={(e) => setComunidadId(e.target.value)} options={comunidades.map((c) => ({ id: c.id, name: `${c.nombre} · ${c.ciudad}` }))} />
          </div>
          <div className="flex justify-end gap-2">
            <RestablecerClave member={m} onDone={(c) => { onClose(); onCredenciales(c); }} />
            <Button size="sm" onClick={saveMember} isLoading={saving === "member"}>Guardar datos</Button>
          </div>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Puntos JMV</h3>
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1 text-lg font-bold text-amber-800">
              <Coins className="h-5 w-5" />{m.pointsBalance}
            </span>
          </div>
          <div className="grid items-end gap-3 sm:grid-cols-[140px_1fr_auto]">
            <InputField label="Cantidad" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="+50 o -20" />
            <InputField label="Motivo" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ej.: Ayudó en la misión de Semana Santa" />
            <Button onClick={adjust} isLoading={saving === "points"}>Aplicar</Button>
          </div>
          {detail.transactions.length === 0 ? (
            <p className="text-sm text-slate-500">Aún no tiene movimientos.</p>
          ) : (
            <ul className="max-h-72 divide-y divide-slate-100 overflow-y-auto rounded-lg border border-slate-200">
              {detail.transactions.map((t) => (
                <li key={t.id} className="flex items-center gap-3 px-4 py-2 text-sm">
                  <span className={`w-14 text-right font-semibold ${t.amount > 0 ? "text-emerald-700" : "text-red-600"}`}>{t.amount > 0 ? `+${t.amount}` : t.amount}</span>
                  <span className="min-w-0 flex-1 text-slate-800">{t.description}</span>
                  <span className="text-xs text-slate-500">{fmtDate(t.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Modal>
  );
}
