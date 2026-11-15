import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, MessageCircle, Quote } from "lucide-react";
import { ssrFetch } from "@/lib/helpers/apiBase";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { TestimonialItem } from "@/types/activity-management";
import { StarsRing } from "@/components/brand";
import { buttonVariants } from "@/components/ui/button-variants";

// Testimonio largo: una página propia, para leer con calma.
// El backend invalida la etiqueta al editar el testimonio en el admin.
export const revalidate = 86400;

type Props = { params: Promise<{ id: string }> };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function fetchTestimonial(id: string): Promise<TestimonialItem | null> {
  if (!UUID.test(id)) return null;
  const res = await ssrFetch(`/testimonials/${id}`, { revalidate: 86400, tags: ["testimonials_home"] }).catch(() => null);
  if (!res) return null;
  try {
    const item = (await res.json()) as TestimonialItem;
    return item.active && item.story?.trim() ? item : null;
  } catch {
    return null;
  }
}

/** Retrato vertical centrado en la cara (Cloudinary) */
function portrait(url: string, w: number) {
  if (!url.includes("res.cloudinary.com")) return url;
  const [base, rest] = url.split("/upload/");
  return rest ? `${base}/upload/c_fill,g_face,ar_4:5,w_${w},f_auto,q_auto/${rest}` : url;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await fetchTestimonial(id);
  if (!item) return { title: "Testimonio no encontrado" };
  const title = item.title || `Testimonio de ${item.name}`;
  const description = item.quote.replace(/\s+/g, " ").slice(0, 180);
  return {
    title,
    description,
    alternates: { canonical: `/testimonios/${item.id}` },
    openGraph: {
      title,
      description,
      url: `/testimonios/${item.id}`,
      type: "article",
      ...(item.imageUrl ? { images: [{ url: portrait(item.imageUrl, 900) }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** Una línea sola entre «comillas» (las palabras de María) se destaca como frase */
const isPullQuote = (p: string) => /^[«"“].{4,160}[»"”]\.?$/.test(p.trim()) && !p.includes("\n");

export default async function TestimonioPage({ params }: Props) {
  const { id } = await params;
  const item = await fetchTestimonial(id);
  if (!item) notFound();

  const paragraphs = (item.story ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const title = item.title || `Testimonio de ${item.name}`;
  const shareText = `${title} — testimonio de ${item.name} en JMV Ecuador: ${SITE.url}/testimonios/${item.id}`;

  return (
    <article>
      {/* Cabecera */}
      <header className="relative isolate overflow-hidden bg-page-deep pb-14 pt-28 sm:pt-32 lg:pb-20" data-tone="dark">
        <StarsRing aria-hidden className="pointer-events-none absolute -right-24 -top-10 -z-10 h-[420px] w-[420px] text-jmv-gold-text/15" />
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 sm:px-6 md:grid-cols-[minmax(0,320px)_1fr] md:gap-14">
          <div className="relative mx-auto w-[72%] max-w-[320px] md:w-full">
            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] border-4 border-white/15 shadow-2xl">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={portrait(item.imageUrl, 640)}
                  srcSet={`${portrait(item.imageUrl, 400)} 400w, ${portrait(item.imageUrl, 640)} 640w, ${portrait(item.imageUrl, 900)} 900w`}
                  sizes="(min-width: 768px) 320px, 72vw"
                  alt={`Foto de ${item.name}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-jmv-blue to-jmv-ink font-display text-7xl text-white/90">
                  {item.name.charAt(0)}
                </div>
              )}
            </div>
            <span
              aria-hidden
              className="absolute -bottom-5 -right-3 grid h-16 w-16 place-items-center rounded-2xl bg-jmv-gold text-jmv-ink shadow-xl"
            >
              <Quote className="h-8 w-8" />
            </span>
          </div>

          <div className="text-center md:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-jmv-gold-text">Testimonio</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-[3.4rem]">{title}</h1>
            <div className="mt-6">
              <span aria-hidden className="mx-auto mb-4 block h-1 w-12 rounded-full bg-jmv-gold md:mx-0" />
              <p className="text-xl font-bold text-white">{item.name}</p>
              {item.role && <p className="mt-1 font-medium text-jmv-gold-text">{item.role}</p>}
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-slate-300">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {item.location || "JMV Ecuador"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Texto */}
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="space-y-6 text-lg leading-relaxed text-fg-soft sm:text-xl sm:leading-relaxed">
          {paragraphs.map((p, i) =>
            isPullQuote(p) ? (
              <blockquote
                key={i}
                className="my-10 rounded-3xl border-l-4 border-jmv-gold bg-surface-card px-6 py-6 shadow-card sm:px-8"
              >
                <p className="font-display text-2xl font-semibold italic leading-snug text-fg sm:text-3xl">{p}</p>
              </blockquote>
            ) : (
              <p key={i} className={cn("whitespace-pre-line", i === 0 && "text-xl font-medium text-fg sm:text-2xl sm:leading-relaxed")}>
                {p}
              </p>
            ),
          )}
        </div>

        <footer className="mt-14 border-t border-line pt-8">
          <p className="font-display text-2xl font-semibold text-fg">{item.name}</p>
          {item.role && <p className="mt-1 text-accent-gold">{item.role}</p>}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "gold" })}
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Compartir por WhatsApp
            </a>
            <Link href="/#testimonios" className={buttonVariants({ variant: "outlineAuto" })}>
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Más testimonios
            </Link>
          </div>
        </footer>
      </div>
    </article>
  );
}
