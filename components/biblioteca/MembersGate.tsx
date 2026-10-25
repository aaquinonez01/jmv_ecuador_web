import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { libraryHref } from "@/lib/biblioteca";
import { cn } from "@/lib/utils";

/** Aviso amable para material de solo miembros (con cuenta) cuando no hay sesión */
export default function MembersGate({ slug, className }: { slug: string; className?: string }) {
  const redirect = encodeURIComponent(libraryHref(slug));
  return (
    <div
      className={cn(
        "rounded-3xl border border-accent-gold/30 bg-[linear-gradient(135deg,rgba(217,143,6,0.14),#ffffff)] p-5 shadow-card sm:p-6 dark:bg-[linear-gradient(135deg,rgba(217,143,6,0.16),rgba(255,255,255,0.03))]",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-jmv-gold text-jmv-ink">
          <LockKeyhole className="h-6 w-6" aria-hidden />
        </span>
        <div>
          <h2 className="font-display text-xl font-semibold text-fg sm:text-2xl">Inicia sesión para verlo</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-fg-soft sm:text-base">
            Este material está reservado para quienes tienen cuenta en la web de JMV Ecuador. Entra con la tuya y te traemos de vuelta aquí mismo.
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
          className="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold text-fg underline decoration-accent-gold/60 underline-offset-4 hover:decoration-accent-gold"
        >
          ¿Aún no eres parte? Únete
        </Link>
      </div>
    </div>
  );
}
