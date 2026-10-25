import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Quote } from "lucide-react";
import { fetchCalendarDate, fetchCalendarDates } from "@/lib/api/calendar.server";
import { MONTHS, anniversary, calendarHref, datesToEntries, dayLabel, sortByMonthDay } from "@/lib/calendario";
import { SITE } from "@/lib/site";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { StarsRing } from "@/components/brand";
import CategoryChip, { UnverifiedTag } from "@/components/calendario/CategoryChip";
import ChallengeCard from "@/components/calendario/ChallengeCard";
import DateNav from "@/components/calendario/DateNav";
import DateVisual from "@/components/calendario/DateVisual";
import DetailActions from "@/components/calendario/DetailActions";
import DetailCountdown from "@/components/calendario/DetailCountdown";
import SourceList from "@/components/calendario/SourceList";
import StarField from "@/components/calendario/StarField";
import { SkyBackdrop } from "@/components/calendario/SkyBackdrop";
import { CAT_VARS, categoryStyle, entryToEvent, slugifyFile, storyFilename } from "@/components/calendario/shared";

// ISR: ver app/calendario/page.tsx
export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const items = await fetchCalendarDates().catch(() => []);
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await fetchCalendarDate(slug).catch(() => null);
  if (!item) return { title: "Fecha no encontrada" };
  const title = `${item.title} · ${dayLabel(item.month, item.day)}`;
  return {
    title,
    description: item.summary,
    alternates: { canonical: calendarHref(item.slug) },
    openGraph: { title, description: item.summary, url: calendarHref(item.slug), type: "article" },
    twitter: { card: "summary_large_image", title, description: item.summary },
  };
}

export default async function CalendarDatePage({ params }: Props) {
  const { slug } = await params;
  const [item, all] = await Promise.all([fetchCalendarDate(slug), fetchCalendarDates().catch(() => [])]);
  if (!item) notFound();

  const now = new Date();
  const [entry] = datesToEntries([item], now);
  const years = anniversary(item, now);
  // Cambia el enlace de la imagen de historia cuando se edita la fecha en el admin
  const updated = item.updatedAt ? Date.parse(item.updatedAt) : NaN;
  const storyVersion = Number.isNaN(updated) ? "" : `?v=${updated}`;
  const paragraphs = (item.story ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Anterior y siguiente en el orden del año (diciembre enlaza con enero)
  const ordered = sortByMonthDay(datesToEntries(all.some((d) => d.id === item.id) ? all : [...all, item], now));
  const index = ordered.findIndex((e) => e.item?.id === item.id);
  const prev = ordered.length > 1 ? (ordered[(index - 1 + ordered.length) % ordered.length].item ?? null) : null;
  const next = ordered.length > 2 ? (ordered[(index + 1) % ordered.length].item ?? null) : null;

  const url = new URL(calendarHref(item.slug), SITE.url).toString();
  const shareText = `${dayLabel(item.month, item.day)}: ${item.title}. ${item.summary}`;

  return (
    <div className={`${CAT_VARS} bg-page pb-20`} style={categoryStyle(item.category)}>
      <section
        aria-labelledby="fecha-title"
        className="relative isolate overflow-hidden bg-page-deep pb-16 pt-28 sm:pt-32 lg:pb-24"
      >
        <SkyBackdrop glow />
        <StarField seed={item.month * 31 + item.day} count={70} className="-z-10" />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-page"
        />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:px-8">
          <div>
            <Breadcrumbs
              items={[{ label: "Año Vicenciano", href: "/calendario" }, { label: item.title }]}
              jsonLd
              className="mb-8"
            />
            <p className="flex items-end gap-4 leading-none" aria-hidden="true">
              <span className="font-display text-8xl font-semibold text-fg tabular-nums sm:text-9xl">{item.day}</span>
              <span className="pb-3 sm:pb-5">
                <span className="block text-sm font-semibold uppercase tracking-[0.2em] text-(--cat)">de</span>
                <span className="block font-display text-3xl font-semibold text-(--cat) sm:text-4xl">
                  {MONTHS[item.month - 1].toLowerCase()}
                </span>
              </span>
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {/* Sobre el cielo de la cabecera, en claro el chip va opaco para llegar a AA */}
              <CategoryChip category={item.category} className="bg-white/85 dark:bg-(--cat-soft)" />
              {!item.verified && <UnverifiedTag />}
            </div>
            <h1
              id="fecha-title"
              className="mt-4 font-display text-4xl font-semibold leading-[1.08] text-fg text-balance sm:text-5xl lg:text-6xl"
            >
              <span className="sr-only">{dayLabel(item.month, item.day)}: </span>
              {item.title}
            </h1>
            {item.subtitle && <p className="mt-3 text-xl text-fg-soft">{item.subtitle}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
              <DetailCountdown month={item.month} day={item.day} renderedAt={now.toISOString()} />
              {years && item.year && (
                <p className="text-base text-fg-soft">
                  Este {dayLabel(item.month, item.day)} se cumplen{" "}
                  <strong className="font-semibold text-fg">{years} años</strong> ({item.year})
                </p>
              )}
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[16rem] sm:max-w-sm lg:max-w-md">
            <StarsRing
              withCircle
              className="pointer-events-none absolute inset-0 h-full w-full text-accent-gold/55 dark:text-accent-gold/40"
            />
            <DateVisual
              imageUrl={item.imageUrl}
              category={item.category}
              priority
              sizes="(min-width: 1024px) 448px, 80vw"
              className="absolute inset-[17%] rounded-full border border-line-card shadow-card-lg dark:shadow-2xl dark:shadow-black/50"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <article className="min-w-0 max-w-3xl">
          <p className="font-display text-2xl leading-snug text-fg sm:text-3xl">{item.summary}</p>

          {paragraphs.length > 0 && (
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-fg-soft">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          {item.quote && (
            <figure className="relative mt-12 rounded-3xl border-l-4 border-(--cat) bg-surface px-6 shadow-card dark:bg-white/[0.04] py-8 sm:px-10">
              <Quote className="absolute right-6 top-6 h-10 w-10 text-(--cat) opacity-30" aria-hidden />
              <blockquote className="font-display text-2xl italic leading-snug text-fg sm:text-3xl">
                «{item.quote}»
              </blockquote>
              {item.quoteAuthor && (
                <figcaption className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-(--cat)">
                  {item.quoteAuthor}
                </figcaption>
              )}
            </figure>
          )}

          {item.challenge && (
            <div className="mt-12">
              <ChallengeCard slug={item.slug} challenge={item.challenge} />
            </div>
          )}

          {(item.source || !item.verified) && (
            <div className="mt-12 space-y-2 border-t border-line pt-5 text-sm text-fg-muted">
              {item.source && <SourceList source={item.source} />}
              {!item.verified && <p>Estamos confirmando algunos datos de esta fecha con nuestros asesores.</p>}
            </div>
          )}
        </article>

        <aside aria-labelledby="acciones-title" className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-line bg-surface p-5 shadow-card dark:bg-white/[0.04]">
            <h2 id="acciones-title" className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-accent-gold">
              Vívelo y compártelo
            </h2>
            <DetailActions
              event={entryToEvent(entry)}
              filename={`${slugifyFile(item.title)}.ics`}
              shareText={shareText}
              shareUrl={url}
              storyHref={`${calendarHref(item.slug)}/historia${storyVersion}`}
              storyFilename={storyFilename(item.slug)}
            />
          </div>
        </aside>
      </div>

      <div className="mt-20">
        <DateNav prev={prev} next={next} />
      </div>
    </div>
  );
}
