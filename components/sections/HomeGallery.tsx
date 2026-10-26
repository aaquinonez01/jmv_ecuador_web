import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PhotoMosaic from "@/components/media/PhotoMosaic";
import PhotoStrip, { type PhotoStripItem } from "@/components/media/PhotoStrip";
import SectionHeading from "@/components/ui/SectionHeading";
import { buttonVariants } from "@/components/ui/button-variants";
import { fetchSlotImages } from "@/lib/api/site-images.server";
import { ssrFetch } from "@/lib/helpers/apiBase";
import { formatDate } from "@/lib/format";
import type { ActivityItem, PaginatedResponse } from "@/types/activity-management";

async function fetchRecentActivities(): Promise<ActivityItem[]> {
  const res = await ssrFetch("/activities/public?limit=6", {
    revalidate: 86400,
    tags: ["activities_public_home"],
  });
  if (!res) return [];
  try {
    const data = (await res.json()) as PaginatedResponse<ActivityItem>;
    return (data.items || []).filter((a) => a.coverImageUrl);
  } catch {
    return [];
  }
}

// "JMV en imágenes": mosaico del espacio de fotos "home.galeria" (administrable,
// con fotos locales de respaldo) y, debajo, una franja con las portadas de los
// últimos álbumes de actividades. Sustituye a las tarjetas de texto de antes.
export default async function HomeGallery() {
  const [galeria, actividades] = await Promise.all([fetchSlotImages("home.galeria"), fetchRecentActivities()]);

  const extra = galeria.slice(5);
  const albums: PhotoStripItem[] = actividades.map((a) => ({
    src: a.coverImageUrl as string,
    // Decorativa: el título del álbum ya va en el pie de la misma tarjeta
    alt: "",
    caption: [a.title, a.startDate ? formatDate(a.startDate, { month: "short", year: "numeric" }) : null]
      .filter(Boolean)
      .join(" · "),
    href: "/actividades#realizadas",
  }));

  return (
    <section aria-labelledby="galeria-inicio-titulo" className="bg-page py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            id="galeria-inicio-titulo"
            align="left"
            eyebrow="JMV en imágenes"
            title="Fe, formación y servicio"
            description="En grupos de todo Ecuador."
            className="mb-6 sm:mb-8"
          />
          <Link
            href="/actividades#realizadas"
            className={buttonVariants({ variant: "outlineAuto", size: "md", className: "mb-8 hidden sm:inline-flex" })}
          >
            Ver los álbumes
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </div>

        <PhotoMosaic images={galeria.slice(0, 5)} label="Fotos de la vida de JMV Ecuador" />

        {extra.length > 0 && <PhotoStrip label="Más fotos de JMV" aspect="3/2" items={extra} className="mt-3" />}

        {albums.length > 0 && (
          <div className="mt-12">
            <h3 className="mb-4 text-xl font-bold text-fg sm:text-2xl">Actividades realizadas</h3>
            <PhotoStrip
              label="Álbumes de actividades realizadas"
              aspect="4/5"
              items={albums}
              itemClassName="w-[62%] sm:w-[34%] lg:w-[22%]"
            />
          </div>
        )}

        <Link
          href="/actividades#realizadas"
          className={buttonVariants({ variant: "outlineAuto", size: "md", className: "mt-8 w-full sm:hidden" })}
        >
          Ver los álbumes de actividades
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
