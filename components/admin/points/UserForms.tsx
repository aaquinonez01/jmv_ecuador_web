"use client";

import { useState } from "react";
import { Copy, KeyRound } from "lucide-react";
import { formationErrorMessage } from "@/actions/formation";
import { createMemberAPI, resetMemberPasswordAPI } from "@/actions/points";
import Button from "@/components/admin/ui/Button";
import InputField from "@/components/admin/ui/InputField";
import Modal from "@/components/admin/ui/Modal";
import SelectField from "@/components/admin/ui/SelectField";
import { useToastRef } from "@/components/admin/formation/shared";
import { FORMATION_LEVELS } from "@/types/formation";
import type { Member } from "@/types/points";
import type { ComunidadItem } from "@/types/territory-management";

export interface Credenciales {
  nombre: string;
  email: string;
  password: string;
}

/** Muestra una sola vez el correo y la contraseña para entregarlos al joven */
export function CredencialesModal({ data, onClose }: { data: Credenciales | null; onClose: () => void }) {
  const toast = useToastRef();
  if (!data) return null;
  const texto = `Hola ${data.nombre}, ya tienes tu cuenta en la app de JMV Ecuador.\nCorreo: ${data.email}\nContraseña: ${data.password}\nPuedes cambiarla después desde la app.`;
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      toast.current.success("Copiado. Pégalo en WhatsApp o en un mensaje.");
    } catch {
      toast.current.error("No se pudo copiar. Cópialo a mano.");
    }
  };
  return (
    <Modal isOpen onClose={onClose} title="Datos para entrar a la app" size="md">
      <div className="space-y-4 px-5 pb-5">
        <p className="text-sm text-slate-600">
          Entrégale estos datos a <strong>{data.nombre}</strong>. La contraseña <strong>no se vuelve a mostrar</strong>; si se pierde, puedes generar otra.
        </p>
        <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-4 font-mono text-sm">
          <p><span className="text-slate-500">Correo:</span> {data.email}</p>
          <p><span className="text-slate-500">Contraseña:</span> <span className="text-lg font-bold tracking-wider text-slate-900">{data.password}</span></p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" icon={<Copy className="h-4 w-4" />} onClick={copiar}>Copiar mensaje</Button>
          <Button onClick={onClose}>Listo</Button>
        </div>
      </div>
    </Modal>
  );
}

/** Formulario para que el Consejo cree la cuenta de un joven */
export function NuevoUsuarioModal({
  open,
  comunidades,
  onClose,
  onCreated,
}: {
  open: boolean;
  comunidades: ComunidadItem[];
  onClose: () => void;
  onCreated: (m: Member, cred: Credenciales) => void;
}) {
  const toast = useToastRef();
  const vacio = { fullName: "", displayName: "", email: "", phoneNumber: "", birthDate: "", comunidadId: "", level: "", password: "", verified: true };
  const [f, setF] = useState(vacio);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof typeof vacio>(k: K, v: (typeof vacio)[K]) => setF((x) => ({ ...x, [k]: v }));

  const guardar = async () => {
    if (f.fullName.trim().length < 3) return toast.current.error("Escribe el nombre completo.");
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) return toast.current.error("Escribe un correo válido.");
    if (f.password && f.password.length < 8) return toast.current.error("La contraseña debe tener al menos 8 caracteres (o déjala vacía para generar una).");
    setSaving(true);
    try {
      const r = await createMemberAPI({
        fullName: f.fullName.trim(),
        displayName: f.displayName.trim() || undefined,
        email: f.email.trim(),
        phoneNumber: f.phoneNumber.trim() || undefined,
        birthDate: f.birthDate || undefined,
        comunidadId: f.comunidadId || undefined,
        level: f.level || undefined,
        password: f.password || undefined,
        verified: Boolean(f.comunidadId) && f.verified,
      });
      toast.current.success("Cuenta creada.");
      setF(vacio);
      onCreated(r.member, { nombre: r.member.displayName || r.member.fullName, email: r.member.email, password: r.password });
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudo crear la cuenta."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Nuevo usuario" description="Crea la cuenta de un joven y asígnale su comunidad. Él entra a la app con su correo." size="lg">
      <div className="space-y-4 px-5 pb-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Nombre completo" required value={f.fullName} onChange={(e) => set("fullName", e.target.value)} />
          <InputField label="Apodo (opcional)" value={f.displayName} onChange={(e) => set("displayName", e.target.value)} placeholder="Como lo conocen en el grupo" />
          <InputField label="Correo" type="email" required value={f.email} onChange={(e) => set("email", e.target.value)} />
          <InputField label="Teléfono (opcional)" value={f.phoneNumber} onChange={(e) => set("phoneNumber", e.target.value)} />
          <SelectField label="Comunidad" value={f.comunidadId} placeholder="Sin comunidad" onChange={(e) => set("comunidadId", e.target.value)} options={comunidades.map((c) => ({ id: c.id, name: `${c.nombre} · ${c.ciudad}` }))} />
          <SelectField label="Sección" value={f.level} placeholder="Sin sección" onChange={(e) => set("level", e.target.value)} options={FORMATION_LEVELS.map((l) => ({ id: l.id, name: `${l.name} (${l.ages})` }))} />
          <InputField label="Fecha de nacimiento (opcional)" type="date" value={f.birthDate} onChange={(e) => set("birthDate", e.target.value)} />
          <InputField label="Contraseña (opcional)" value={f.password} onChange={(e) => set("password", e.target.value)} hint="Déjala vacía y se genera una fácil de dictar." />
        </div>
        <label className={`flex items-center gap-2 text-sm font-medium ${f.comunidadId ? "text-slate-800" : "text-slate-400"}`}>
          <input type="checkbox" className="h-4 w-4" disabled={!f.comunidadId} checked={Boolean(f.comunidadId) && f.verified} onChange={(e) => set("verified", e.target.checked)} />
          Ya es miembro verificado de esa comunidad (podrá canjear sus puntos)
        </label>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={guardar} isLoading={saving}>Crear cuenta</Button>
        </div>
      </div>
    </Modal>
  );
}

/** Botón para generar una contraseña nueva (cierra las sesiones abiertas del joven) */
export function RestablecerClave({ member, onDone }: { member: Member; onDone: (cred: Credenciales) => void }) {
  const toast = useToastRef();
  const [busy, setBusy] = useState(false);
  const run = async () => {
    if (!confirm(`¿Generar una contraseña nueva para ${member.fullName}? La anterior dejará de funcionar.`)) return;
    setBusy(true);
    try {
      const r = await resetMemberPasswordAPI(member.id);
      onDone({ nombre: member.displayName || member.fullName, email: member.email, password: r.password });
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudo restablecer."));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Button size="sm" variant="outline" isLoading={busy} icon={<KeyRound className="h-4 w-4" />} onClick={run}>
      Nueva contraseña
    </Button>
  );
}
