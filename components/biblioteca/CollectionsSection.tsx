import CollectionCard, { type CollectionCardData } from "./CollectionCard";

// "Rutas de formación": colecciones para leer en orden.
export default function CollectionsSection({ collections }: { collections: CollectionCardData[] }) {
  if (collections.length === 0) return null;
  return (
    <section aria-labelledby="rutas-title" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent-gold">Paso a paso</p>
        <h2 id="rutas-title" className="font-display text-3xl font-semibold text-fg sm:text-4xl">
          Rutas de formación
        </h2>
        <p className="mt-2 text-base leading-relaxed text-fg-muted sm:text-lg">
          Lecturas elegidas para recorrerlas en orden, a tu ritmo o con tu grupo.
        </p>
      </div>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c, i) => (
          <li key={c.id}>
            <CollectionCard collection={c} index={i} />
          </li>
        ))}
      </ul>
    </section>
  );
}
