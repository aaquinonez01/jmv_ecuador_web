import { ArrowRight } from "lucide-react";
import HeroMedia from "@/components/media/HeroMedia";
import { fetchSlotImages } from "@/lib/api/site-images.server";
import { SITE, yearsSinceFoundation } from "@/lib/site";

// Portada del inicio (Server Component): la foto es la protagonista. Con 2 o más
// fotos en el espacio "home.hero" pasan solas por fundido. Encima solo van la
// etiqueta, el título, una línea y los dos botones; el resto baja a las secciones.
export default async function HeroSection() {
  const images = await fetchSlotImages("home.hero");

  return (
    <HeroMedia
      size="home"
      titleId="home-hero-title"
      images={images}
      carouselLabel="Fotos de la portada"
      eyebrow={
        // Pastilla con velo: se lee aunque la foto sea clara detrás
        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-hero-veil/55 px-3 py-1 backdrop-blur-sm">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-jmv-gold-text" />
          {`Desde ${SITE.foundedYear} en Ecuador · ${yearsSinceFoundation()} años`}
        </span>
      }
      title="Juventudes Marianas Vicencianas"
      lead="Jóvenes de 15 a 30 años que viven la fe, se forman y sirven a los más pobres."
      actions={[
        { label: "Encuentra tu grupo", href: "/unete", icon: ArrowRight },
        { label: "Conoce JMV", href: "/quienes-somos" },
      ]}
    >
      <p className="mt-6 hidden font-display text-xl italic text-jmv-gold-text [text-shadow:0_1px_10px_rgb(15_23_42/0.6)] sm:block">
        “{SITE.tagline}”
      </p>
    </HeroMedia>
  );
}
