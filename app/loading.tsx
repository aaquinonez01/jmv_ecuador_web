export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-jmv flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-jmv-gold" />
        <p className="text-sm text-white/70">Cargando...</p>
      </div>
    </div>
  );
}
