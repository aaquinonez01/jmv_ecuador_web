import { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import BlogClient from "./BlogClient";
import { fetchInitialPosts, fetchPostCategories } from "@/lib/api/posts.server";
import { fetchSlotImages } from "@/lib/api/site-images.server";
import "./blog.css";

export const revalidate = 60;

// La Comunidad todavía no está activa: se ve de fondo, desenfocada, con el aviso encima.
// Para abrirla, cambia esto a false.
const PROXIMAMENTE = true;

export const metadata: Metadata = {
  title: "Comunidad JMV",
  description:
    "Momentos, testimonios y recursos que comparten jóvenes de Juventudes Marianas Vicencianas en todo el Ecuador.",
  keywords: ["JMV Ecuador", "blog", "comunidad", "jóvenes", "formación", "documentos"],
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  // Primera página y categorías en el servidor (ISR); el cliente sigue paginando
  const [initialPage, { scopes, activityTypes }, heroImages] = await Promise.all([
    fetchInitialPosts(),
    fetchPostCategories(),
    fetchSlotImages("blog.hero"),
  ]);

  const blog = (
    <BlogClient
      initialPage={initialPage}
      initialScopes={scopes}
      initialActivityTypes={activityTypes}
      heroImages={heroImages}
    />
  );
  if (!PROXIMAMENTE) return blog;

  return (
    <div className="relative h-[100svh] min-h-[640px] overflow-hidden">
      {/* La página real, de fondo: no se puede tocar ni leer con lector de pantalla */}
      <div inert aria-hidden className="pointer-events-none select-none blur-[6px]">
        {blog}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-jmv-ink/55 px-4 pt-20 backdrop-blur-[2px]">
        <section
          aria-labelledby="proximamente-titulo"
          className="w-full max-w-md rounded-[2rem] border border-white/20 bg-white p-8 dark:bg-slate-900 text-center shadow-2xl sm:p-10"
        >
          <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-jmv-gold text-jmv-ink shadow-lg">
            <Sparkles className="h-8 w-8" aria-hidden />
          </span>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">Comunidad JMV</p>
          <h1 id="proximamente-titulo" className="mt-2 font-display text-4xl font-semibold text-fg sm:text-5xl">
            Próximamente
          </h1>
          <p className="mt-4 text-fg-soft">
            Estamos preparando este espacio para que las comunidades de todo el Ecuador compartan sus momentos. Muy pronto
            estará activo.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/actividades" className={buttonVariants({ variant: "gold" })}>
              Ver actividades
            </Link>
            <Link href="/" className={buttonVariants({ variant: "outlineAuto" })}>
              Volver al inicio
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
