import Image from "next/image";
import { CalendarDays, Target } from "lucide-react";
import type { DonationCampaign } from "@/types/donations";
import { campaignDates, campaignProgress, isOptimizableImage } from "./shared";

export default function CampaignCard({ campaign }: { campaign: DonationCampaign }) {
  const progress = campaignProgress(campaign);
  const dates = campaignDates(campaign);
  const titleId = `campana-${campaign.id}`;

  return (
    <article
      aria-labelledby={titleId}
      className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface text-fg shadow-card dark:border-white/15 dark:bg-white/[0.07]"
    >
      {campaign.imageUrl ? (
        <div className="relative aspect-[16/9] bg-surface-sunken dark:bg-white/5">
          {isOptimizableImage(campaign.imageUrl) ? (
            <Image
              src={campaign.imageUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={campaign.imageUrl} alt="" className="h-full w-full object-cover" />
          )}
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <h3 id={titleId} className="text-2xl font-bold leading-tight text-balance">
          {campaign.title}
        </h3>
        {dates ? (
          <p className="mt-2 flex items-center gap-2 text-sm text-fg-muted">
            <CalendarDays className="h-4 w-4 shrink-0 text-accent-gold" aria-hidden />
            {dates}
          </p>
        ) : null}
        <p className="mt-4 whitespace-pre-line leading-relaxed text-fg-muted">{campaign.description}</p>

        {progress ? (
          <div className="mt-auto pt-6">
            <p id={`${titleId}-avance`} className="flex items-center gap-2 text-base font-semibold">
              <Target className="h-5 w-5 shrink-0 text-accent-gold" aria-hidden />
              {progress.label}
            </p>
            <div
              role="progressbar"
              aria-labelledby={titleId}
              aria-describedby={`${titleId}-avance`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress.bar}
              aria-valuetext={progress.label}
              className="mt-3 h-3 w-full overflow-hidden rounded-full bg-fg/15"
            >
              <div
                className="h-full rounded-full bg-jmv-gold transition-[width] duration-700 motion-reduce:transition-none"
                style={{ width: `${progress.bar}%` }}
              />
            </div>
            {progress.reached ? (
              <p className="mt-3 text-sm font-semibold text-accent-gold">¡Llegamos a la meta! Gracias por tu generosidad.</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
