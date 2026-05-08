export default function TestimonialsSkeleton() {
  return (
    <section className="py-16 sm:py-20 bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 h-10 w-64 animate-pulse rounded-full bg-white/10" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 animate-pulse rounded-full bg-white/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
                  <div className="h-3 w-1/3 animate-pulse rounded bg-white/8" />
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-white/8" />
                <div className="h-3 w-11/12 animate-pulse rounded bg-white/8" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-white/8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
