"use client";

import { useEffect, useState } from "react";
import { Coins, Save } from "lucide-react";
import { formationErrorMessage } from "@/actions/formation";
import { getPointsRulesAPI, updatePointsRulesAPI } from "@/actions/points";
import Button from "@/components/admin/ui/Button";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import PageHeader, { PageBody } from "@/components/admin/layout/PageHeader";
import { Section, useToastRef } from "@/components/admin/formation/shared";
import type { PointsRule } from "@/types/points";

// Cuántos Puntos JMV da cada cosa en la app
export default function PointsRulesManager() {
  const toast = useToastRef();
  const [rules, setRules] = useState<PointsRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPointsRulesAPI()
      .then(setRules)
      .catch((e) => toast.current.error(formationErrorMessage(e, "No se pudieron cargar las reglas.")))
      .finally(() => setLoading(false));
  }, [toast]);

  const save = async () => {
    if (rules.some((r) => !Number.isInteger(r.points) || r.points < 0)) return toast.current.error("Los puntos deben ser números enteros desde 0.");
    setSaving(true);
    try {
      setRules(await updatePointsRulesAPI(rules.map(({ key, points }) => ({ key, points }))));
      toast.current.success("Reglas guardadas. Se aplican desde ahora.");
    } catch (e) {
      toast.current.error(formationErrorMessage(e, "No se pudo guardar."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Reglas de puntos"
        description="Cuántos Puntos JMV gana un joven en la app. Los cambios valen desde ahora; lo ya ganado no cambia."
        icon={<Coins className="h-5 w-5" />}
        breadcrumbs={[{ label: "Reglas de puntos" }]}
      />
      <PageBody>
      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner /></div>
      ) : (
        <Section title="Quiz en vivo" hint="Se reparten solos al terminar cada quiz en vivo.">
          <ul className="divide-y divide-slate-100">
            {rules.map((r, i) => (
              <li key={r.key} className="flex flex-wrap items-center gap-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">{r.label}</p>
                  {r.hint && <p className="text-xs text-slate-500">{r.hint}</p>}
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="number"
                    min={0}
                    value={String(r.points)}
                    onChange={(e) => setRules(rules.map((x, k) => (k === i ? { ...x, points: Math.trunc(Number(e.target.value)) } : x)))}
                    className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-right text-sm font-semibold"
                    aria-label={r.label}
                  />
                  puntos
                </label>
              </li>
            ))}
          </ul>
          <div className="flex justify-end">
            <Button onClick={save} isLoading={saving} icon={<Save className="h-4 w-4" />}>Guardar</Button>
          </div>
        </Section>
      )}
      </PageBody>
    </>
  );
}
