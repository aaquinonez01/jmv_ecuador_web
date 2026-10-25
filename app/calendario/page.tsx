import type { Metadata } from "next";
import { fetchCalendarDates } from "@/lib/api/calendar.server";
import {
  fetchPublicUpcomingActivities,
  onlyPublicUpcoming,
} from "@/lib/api/upcoming-activities.server";
import { activitiesToEntries } from "@/lib/calendario";
import CalendarioHero from "@/components/calendario/CalendarioHero";
import CalendarioExplorer from "@/components/calendario/CalendarioExplorer";
import EmptyState from "@/components/calendario/EmptyState";
import SubscribeBlock from "@/components/calendario/SubscribeBlock";

export const metadata: Metadata = {
  title: "Año Vicenciano",
  description:
    "Las fechas que nos unen como JMV y Familia Vicenciana: fiestas de María y la Medalla Milagrosa, San Vicente, Santa Luisa, santos, beatos y aniversarios de JMV Ecuador. Agrégalas a tu calendario.",
  keywords:
    "Año Vicenciano, calendario vicenciano, Medalla Milagrosa, San Vicente de Paúl, Santa Luisa de Marillac, JMV Ecuador, fiestas marianas",
  alternates: { canonical: "/calendario" },
};

// ISR: las fechas del admin cambian poco; el backend además invalida el tag al editarlas.
export const revalidate = 3600;

export default async function CalendarioPage() {
  const [items, activities] = await Promise.all([
    fetchCalendarDates(),
    fetchPublicUpcomingActivities().catch(() => []),
  ]);
  const activityEntries = activitiesToEntries(onlyPublicUpcoming(activities));
  // Al cliente solo viaja lo que muestra el explorador (la historia completa vive en cada página)
  const lightItems = items.map((item) => ({
    ...item,
    story: null,
    quote: null,
    quoteAuthor: null,
    challenge: null,
    source: null,
  }));
  const empty = items.length === 0 && activityEntries.length === 0;

  return (
    <div className="bg-page pb-4">
      <CalendarioHero />
      {empty ? (
        <EmptyState />
      ) : (
        <CalendarioExplorer items={lightItems} activities={activityEntries} renderedAt={new Date().toISOString()} />
      )}
      <SubscribeBlock />
    </div>
  );
}
