// Mismo esqueleto que la cuadrícula real de álbumes (tarjeta 4:3, 1/2/3 columnas)
export default function GallerySkeleton() {
  return (
    <section aria-hidden="true" className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--page)_0%,var(--section-blue)_50%,var(--page-deep)_100%)] dark:bg-[linear-gradient(180deg,#07132F_0%,#0C2D69_55%,#0F4A8A_100%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-3">
          <div className="h-4 w-40 rounded bg-fg/10 motion-safe:animate-pulse" />
          <div className="h-10 w-72 max-w-full rounded bg-fg/10 motion-safe:animate-pulse" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-card ${
                i === 2 ? "hidden xl:block" : i === 1 ? "hidden md:block" : ""
              }`}
            >
              <div className="aspect-[4/3] bg-fg/10 motion-safe:animate-pulse" />
              <div className="space-y-3 p-6">
                <div className="h-7 w-3/4 rounded bg-fg/10 motion-safe:animate-pulse" />
                <div className="h-4 w-full rounded bg-fg/10 motion-safe:animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-fg/10 motion-safe:animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
