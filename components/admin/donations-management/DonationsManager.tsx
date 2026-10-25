"use client";

import { useEffect, useState } from "react";
import { Tabs } from "radix-ui";
import { ExternalLink, HandHeart, Landmark, Megaphone, Settings2, Sparkles } from "lucide-react";
import PageHeader from "@/components/admin/layout/PageHeader";
import SettingsTab from "./SettingsTab";
import AccountsTab from "./AccountsTab";
import PurposesTab from "./PurposesTab";
import CampaignsTab from "./CampaignsTab";

const TABS = [
  { value: "datos", label: "Datos generales", icon: Settings2 },
  { value: "cuentas", label: "Cuentas", icon: Landmark },
  { value: "usos", label: "En qué se usa", icon: Sparkles },
  { value: "campanas", label: "Campañas", icon: Megaphone },
] as const;

type TabValue = (typeof TABS)[number]["value"];

const isTab = (value: string): value is TabValue => TABS.some((t) => t.value === value);

export default function DonationsManager() {
  const [tab, setTab] = useState<TabValue>("datos");

  // La pestaña vive en el hash (#cuentas) para poder recargar o compartir el enlace
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (isTab(hash)) setTab(hash);
  }, []);

  const changeTab = (value: string) => {
    if (!isTab(value)) return;
    setTab(value);
    window.history.replaceState(null, "", `#${value}`);
  };

  return (
    <>
      <PageHeader
        title="Donaciones"
        description="Datos para donar en /donar. Las donaciones son anónimas: no se guardan datos de donantes."
        icon={<HandHeart className="h-[18px] w-[18px]" strokeWidth={2.1} />}
        breadcrumbs={[{ label: "Contenido" }, { label: "Donaciones" }]}
        actions={
          <a
            href="/donar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jmv-blue/40 sm:min-h-9"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            Ver página
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        }
      />

      <div className="flex flex-1 flex-col overflow-auto px-4 py-5 sm:px-6">
        <Tabs.Root value={tab} onValueChange={changeTab} className="mx-auto w-full max-w-5xl">
          <Tabs.List
            aria-label="Secciones de donaciones"
            className="mb-4 grid grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-white p-1 sm:flex"
          >
            {TABS.map(({ value, label, icon: Icon }) => (
              <Tabs.Trigger
                key={value}
                value={value}
                className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jmv-blue/40 data-[state=active]:bg-jmv-blue data-[state=active]:text-white sm:min-h-10"
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Tabs.Content value="datos" className="focus-visible:outline-none">
            <SettingsTab />
          </Tabs.Content>
          <Tabs.Content value="cuentas" className="focus-visible:outline-none">
            <AccountsTab />
          </Tabs.Content>
          <Tabs.Content value="usos" className="focus-visible:outline-none">
            <PurposesTab />
          </Tabs.Content>
          <Tabs.Content value="campanas" className="focus-visible:outline-none">
            <CampaignsTab />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </>
  );
}
