// Indicador discreto: barra superior bajo el header, sin tapar el contenido previo
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-16 z-40 h-1 overflow-hidden bg-white/10 sm:top-20"
    >
      <div className="h-full w-1/3 animate-loading-bar rounded-full bg-jmv-gold-text motion-reduce:w-full motion-reduce:animate-none motion-reduce:opacity-70" />
      <span className="sr-only">Cargando…</span>
    </div>
  );
}
