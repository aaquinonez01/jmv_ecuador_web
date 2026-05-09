export default function GallerySkeleton() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#081633_0%,#0C275F_50%,#0A1638_100%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 h-10 w-72 animate-pulse rounded-full bg-white/10" />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/6 shadow-xl"
            >
              <div className="h-64 animate-pulse bg-white/8" />
              <div className="space-y-3 p-6">
                <div className="h-6 w-3/4 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-full animate-pulse rounded bg-white/8" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-white/8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
