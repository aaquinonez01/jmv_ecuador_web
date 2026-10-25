import Link from 'next/link'
import { ArrowRight, Megaphone } from 'lucide-react'
import { fetchActiveAnnouncements } from '@/lib/api/consejo.server'
import type { HomeAnnouncement } from '@/types/consejo'
import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import { buttonVariants } from "@/components/ui/button-variants";
import StarsRing from "@/components/brand/StarsRing";
import MarianMonogram from "@/components/brand/MarianMonogram";

function pickPrimary(items: HomeAnnouncement[]): HomeAnnouncement | null {
  if (!items.length) return null
  return items[0]
}

const isExternal = (url: string) => /^https?:\/\//i.test(url)

export default async function HomeAnnouncementBanner() {
  const announcements = await fetchActiveAnnouncements()
  const primary = pickPrimary(announcements)

  if (!primary) return null

  return (
    <section
      aria-labelledby="anuncio-destacado"
      className="relative overflow-hidden bg-hero-plain py-12 sm:py-16"
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-card-lg dark:border-white/15 dark:bg-white/5 dark:shadow-2xl">
          <div className="grid md:grid-cols-[minmax(0,320px)_1fr]">
            {primary.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getOptimizedUrl(primary.imageUrl, { w: 800 })}
                loading="lazy"
                decoding="async"
                sizes="(min-width: 768px) 320px, 100vw"
                alt=""
                className="h-56 w-full object-cover md:h-full"
              />
            ) : (
              <div className="relative flex h-48 w-full items-center justify-center bg-jmv-blue text-jmv-gold-text md:h-full">
                <StarsRing aria-hidden className="absolute h-44 w-44 opacity-60" />
                <MarianMonogram aria-hidden className="h-20 w-16" strokeWidth={5} />
              </div>
            )}

            <div className="flex flex-col justify-center p-6 md:p-8">
              <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-accent-gold">
                <Megaphone className="h-4 w-4" aria-hidden />
                Anuncio destacado
              </p>

              <h2 id="anuncio-destacado" className="mb-2 text-2xl font-bold text-fg md:text-3xl">
                {primary.titulo}
              </h2>

              {primary.subtitulo && (
                <p className="mb-3 font-medium text-accent-gold">
                  {primary.subtitulo}
                </p>
              )}

              <p className="mb-6 leading-relaxed text-fg-muted">
                {primary.mensaje}
              </p>

              {primary.ctaUrl && primary.ctaLabel && (
                isExternal(primary.ctaUrl) ? (
                  <a
                    href={primary.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: "gold", className: "self-start" })}
                  >
                    {primary.ctaLabel}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                    <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                ) : (
                  <Link
                    href={primary.ctaUrl}
                    className={buttonVariants({ variant: "gold", className: "self-start" })}
                  >
                    {primary.ctaLabel}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
