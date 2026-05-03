import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import { fetchActiveAnnouncements } from '@/lib/api/consejo.server'
import type { HomeAnnouncement } from '@/types/consejo'

function pickPrimary(items: HomeAnnouncement[]): HomeAnnouncement | null {
  if (!items.length) return null
  return items[0]
}

export default async function HomeAnnouncementBanner() {
  const announcements = await fetchActiveAnnouncements()
  const primary = pickPrimary(announcements)

  if (!primary) return null

  return (
    <section className="py-12 bg-gradient-to-br from-jmv-blue-dark via-jmv-blue to-blue-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,143,6,0.18),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_55%)]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid md:grid-cols-[280px_1fr]">
            {primary.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={primary.imageUrl}
                alt={primary.titulo}
                className="w-full h-56 md:h-full object-cover"
              />
            ) : (
              <div className="w-full h-56 md:h-full bg-gradient-to-br from-jmv-gold via-jmv-gold-dark to-jmv-red flex items-center justify-center">
                <Sparkles className="w-24 h-24 text-white/90" />
              </div>
            )}

            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="inline-flex items-center self-start px-4 py-1.5 bg-jmv-gold/20 border border-jmv-gold/30 rounded-full text-jmv-gold text-xs font-semibold uppercase tracking-wide mb-4">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Anuncio destacado
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {primary.titulo}
              </h2>

              {primary.subtitulo && (
                <p className="text-jmv-gold font-medium mb-3">
                  {primary.subtitulo}
                </p>
              )}

              <p className="text-white/85 leading-relaxed mb-5">
                {primary.mensaje}
              </p>

              {primary.ctaUrl && primary.ctaLabel && (
                <Link
                  href={primary.ctaUrl}
                  className="inline-flex items-center self-start px-5 py-2.5 bg-jmv-gold hover:bg-jmv-gold-dark text-white font-semibold rounded-full transition-colors group"
                >
                  {primary.ctaLabel}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
