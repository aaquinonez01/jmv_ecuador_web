import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 pt-24 text-center">
      <h1 className="text-4xl font-bold text-white">Página no encontrada</h1>
      <p className="mt-4 text-white/70">
        La página que buscas no existe o fue movida.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-jmv-blue px-6 py-3 font-medium text-white hover:bg-jmv-blue-dark"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
