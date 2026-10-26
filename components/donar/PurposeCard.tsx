import Image from "next/image";
import type { DonationPurpose } from "@/types/donations";
import type { SlotPhoto } from "@/lib/site-images";
import SiteImage from "@/components/media/SiteImage";
import ReadMore from "@/components/media/ReadMore";
import { purposeIcon } from "./purposeIcons";
import { isOptimizableImage } from "./shared";

const SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

/**
 * Tarjeta de "En qué se usa tu donación". Si el admin no subió imagen para el
 * destino, usa una foto del espacio "donar.usos" (`fallbackImage`).
 * Sigue el tema (surface-card).
 */
export default function PurposeCard({
  purpose,
  fallbackImage,
}: {
  purpose: DonationPurpose;
  fallbackImage?: SlotPhoto;
}) {
  const Icon = purposeIcon(purpose.icon);
  const own = purpose.imageUrl?.trim() || null;
  const hasPhoto = Boolean(own || fallbackImage);
  return (
    <li className="surface-card flex h-full flex-col overflow-hidden rounded-3xl">
      {hasPhoto ? (
        <div className="relative aspect-[3/2] bg-surface-2">
          {own ? (
            isOptimizableImage(own) ? (
              <Image src={own} alt="" fill loading="lazy" sizes={SIZES} className="object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={own} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
            )
          ) : fallbackImage ? (
            <SiteImage
              src={fallbackImage.src}
              alt=""
              fill
              loading="lazy"
              sizes={SIZES}
              className="object-cover"
              style={{ objectPosition: fallbackImage.position ?? "center" }}
            />
          ) : null}
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-jmv-gold text-jmv-ink ${
            hasPhoto ? "relative -mt-11 ring-4 ring-[var(--surface-raised)]" : ""
          }`}
        >
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <h3 className="mt-3 text-xl font-bold leading-tight text-fg">{purpose.title}</h3>
        {purpose.description ? (
          <ReadMore lines={3} className="mt-2">
            <p className="leading-relaxed text-fg-muted">{purpose.description}</p>
          </ReadMore>
        ) : null}
      </div>
    </li>
  );
}
