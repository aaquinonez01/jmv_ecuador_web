import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { libraryHref } from "@/lib/biblioteca";
import { cn } from "@/lib/utils";

/** Aviso amable para material de solo miembros cuando no hay sesión */
export default function MembersGate({ slug, className }: { slug: string; className?: string }) {
  const redirect = encodeURIComponent(libraryHref(slug));
  return (
    <div
      className={cn(
        "rounded-3xl border border-jmv-gold-text/30 bg-[linear-gradient(135deg,rgba(217,143,6,0.16),rgba(255,255,255,0.03))] p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-jmv-gold text-jmv-ink">
          <LockKeyhole className="h-6 w-6" aria-hidden />
        </span>
        <div>
          <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">Este material es para miembros de JMV</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-200 sm:text-base">
            Inicia sesión con tu cuenta de JMV para leerlo y descargarlo. Te traemos de vuelta aquí mismo.
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href={`/sign-in?redirect=${redirect}`}
          className={buttonVariants({ variant: "gold", size: "md", className: "rounded-full" })}
        >
          Iniciar sesión
        </Link>
        <Link
          href="/unete"
          className="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold text-white underline decoration-jmv-gold-text/60 underline-offset-4 hover:decoration-jmv-gold-text"
        >
          ¿Aún no eres parte? Únete
        </Link>
      </div>
    </div>
  );
}
