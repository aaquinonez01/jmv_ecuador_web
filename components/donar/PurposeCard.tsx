import Image from "next/image";
import type { DonationPurpose } from "@/types/donations";
import { purposeIcon } from "./purposeIcons";
import { isOptimizableImage } from "./shared";

export default function PurposeCard({ purpose }: { purpose: DonationPurpose }) {
  const Icon = purposeIcon(purpose.icon);
  return (
    <li className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
      {purpose.imageUrl ? (
        <div className="relative aspect-[16/10] bg-slate-100">
          {isOptimizableImage(purpose.imageUrl) ? (
            <Image
              src={purpose.imageUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={purpose.imageUrl} alt="" className="h-full w-full object-cover" />
          )}
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-jmv-gold text-jmv-ink ${
            purpose.imageUrl ? "relative -mt-12 ring-4 ring-white" : ""
          }`}
        >
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <h3 className="mt-4 text-xl font-bold leading-tight text-slate-900">{purpose.title}</h3>
        <p className="mt-2 leading-relaxed text-slate-700">{purpose.description}</p>
      </div>
    </li>
  );
}
