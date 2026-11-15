"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import PageHeader, { PageBody } from "@/components/admin/layout/PageHeader";
import { PublishedBadge, useToastRef } from "@/components/admin/formation/shared";
import { adminError, listFiestasAPI, type AdminFiestaRow } from "@/lib/fiestas/admin-api";
import { longDate } from "@/lib/fiestas/pieces";

export default function FiestasList() {
  const toast = useToastRef();
  const [rows, setRows] = useState<AdminFiestaRow[] | null>(null);

  useEffect(() => {
    listFiestasAPI()
      .then(setRows)
      .catch((e) => {
        toast.current.error(adminError(e, "No se pudieron cargar las fiestas."));
        setRows([]);
      });
  }, [toast]);

  return (
    <>
      <PageHeader
        title="Fiestas"
        description="Novenas, triduos y fiestas del Año Vicenciano en la web: el tema de cada día, sus preguntas con puntos, el propósito y el mural de fotos de las comunidades."
        icon={<Sparkles className="h-5 w-5" />}
        breadcrumbs={[{ label: "Fiestas" }]}
      />
      <PageBody>
        {!rows ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : rows.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">Aún no hay fiestas.</p>
        ) : (
          <ul className="space-y-3">
            {rows.map((f) => (
              <li key={f.id}>
                <Link
                  href={`/admin/fiestas/${f.id}`}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-400"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-jmv-blue text-white">
                    <Sparkles className="h-6 w-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900">{f.title}</span>
                      <PublishedBadge published={f.published} />
                      {f.pendingPhotos > 0 && (
                        <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-slate-900">
                          {f.pendingPhotos} fotos por revisar
                        </span>
                      )}
                    </span>
                    <span className="block text-sm text-slate-500">
                      Fiesta: {longDate(String(f.feastDate).slice(0, 10))} · {f.dayCount} días · {f.participants} participantes
                    </span>
                  </span>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PageBody>
    </>
  );
}
