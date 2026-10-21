"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 pt-24 text-center">
      <h1 className="text-3xl font-bold text-white">
        No pudimos cargar esta página
      </h1>
      <p className="mt-4 text-white/70">
        Puede ser un problema temporal. Intenta de nuevo en unos segundos.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-xl bg-jmv-blue px-6 py-3 font-medium text-white hover:bg-jmv-blue-dark"
      >
        Reintentar
      </button>
    </section>
  );
}
