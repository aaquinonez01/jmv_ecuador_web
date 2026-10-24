import { fetchCalendarDates } from "@/lib/api/calendar.server";
import ProximaFiestaClient from "./ProximaFiestaClient";
import { pickProximaFiesta, type FiestaCandidate } from "./proxima-fiesta";

// Aviso en la home: solo aparece cuando una fecha del Año Vicenciano está cerca.
export default async function ProximaFiesta() {
  let items;
  try {
    items = await fetchCalendarDates();
  } catch {
    return null;
  }

  // Solo viajan al cliente las fechas que podrían tocar en los próximos días
  const soon = new Date(Date.now() + 2 * 86_400_000);
  const candidates: FiestaCandidate[] = items
    .filter((item) => item.published)
    .map(({ slug, title, month, day, category }) => ({ slug, title, month, day, category }))
    .filter((item) => pickProximaFiesta([item]) || pickProximaFiesta([item], soon));

  const initial = pickProximaFiesta(candidates);
  if (!candidates.length) return null;

  return <ProximaFiestaClient initial={initial} candidates={candidates} />;
}
