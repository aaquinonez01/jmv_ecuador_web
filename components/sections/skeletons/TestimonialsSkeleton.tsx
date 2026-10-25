// Reproduce la forma del carrusel de testimonios para evitar saltos de diseño
export default function TestimonialsSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="bg-gradient-to-b from-page via-section-blue to-page py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-4">
          <div className="h-4 w-28 animate-pulse rounded bg-fg/10" />
          <div className="h-10 w-72 animate-pulse rounded-lg bg-fg/10" />
          <div className="h-5 w-full max-w-xl animate-pulse rounded bg-fg/[0.08]" />
        </div>
        <div className="mx-auto max-w-4xl rounded-3xl border border-line bg-surface-card p-6 sm:p-10 md:p-12">
          <div className="mx-auto mb-6 h-10 w-10 animate-pulse rounded-full bg-fg/10" />
          <div className="mx-auto space-y-3">
            <div className="h-5 w-full animate-pulse rounded bg-fg/[0.08]" />
            <div className="h-5 w-11/12 animate-pulse rounded bg-fg/[0.08]" />
            <div className="mx-auto h-5 w-2/3 animate-pulse rounded bg-fg/[0.08]" />
          </div>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-14 w-14 animate-pulse rounded-full bg-fg/10" />
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-fg/10" />
              <div className="h-3 w-24 animate-pulse rounded bg-fg/[0.08]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
