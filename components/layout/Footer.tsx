import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import StarsRing from "@/components/brand/StarsRing";
import { SITE, SOCIAL_LINKS, mailtoHref, telHref, type SocialNetwork } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

// Server Component: se oculta en /admin y /sign-in desde el layout (PublicChrome)

const footerLinks: { title: string; links: { name: string; href: string }[] }[] = [
  {
    title: "Nosotros",
    links: [
      { name: "Quiénes somos", href: "/quienes-somos" },
      { name: "Historia", href: "/quienes-somos/historia" },
      { name: "Estatutos", href: "/quienes-somos/estatutos" },
      { name: "Estructura", href: "/estructura" },
      { name: "Pilares", href: "/pilares" },
      { name: "JMV en el mundo", href: "/jmv-en-el-mundo" },
    ],
  },
  {
    title: "Formación",
    links: [
      { name: "Formación", href: "/formacion" },
      { name: "Biblioteca", href: "/biblioteca" },
      { name: "Ejes formativos", href: "/formacion/ejes" },
      { name: "Santos vicencianos", href: "/formacion/santos" },
      { name: "Año Vicenciano", href: "/calendario" },
    ],
  },
  {
    title: "Participa",
    links: [
      { name: "Únete a JMV", href: "/unete" },
      { name: "Donar", href: "/donar" },
      { name: "Actividades", href: "/actividades" },
      { name: "Comunidad", href: "/blog" },
      { name: "Contacto", href: "/contacto" },
    ],
  },
];

const socialIcons: Partial<Record<SocialNetwork, LucideIcon>> = {
  facebook: Facebook,
  instagram: Instagram,
};

const NEW_TAB = " (se abre en una pestaña nueva)";

export default function Footer() {
  const contactLinkClass =
    "inline-flex min-h-11 items-center gap-3 rounded-md text-blue-100 hover:text-white";

  return (
    <footer className="relative overflow-hidden bg-jmv-blue text-white">
      <StarsRing
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 text-jmv-gold-text/10"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2">
            <Link href="/" className="inline-block rounded-md" aria-label="JMV Ecuador, ir al inicio">
              <Image
                src="/logo.png"
                alt=""
                width={288}
                height={82}
                sizes="240px"
                className="h-auto w-60"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-blue-100">
              {SITE.shortDescription}
            </p>

            <ul className="mt-6 space-y-1 text-sm">
              <li>
                <a href={mailtoHref} className={contactLinkClass}>
                  <Mail className="h-4 w-4 shrink-0 text-jmv-gold-text" aria-hidden />
                  <span>{SITE.email}</span>
                </a>
              </li>
              <li>
                <a href={telHref} className={contactLinkClass}>
                  <Phone className="h-4 w-4 shrink-0 text-jmv-gold-text" aria-hidden />
                  <span>{SITE.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink("Hola, quiero saber más sobre JMV Ecuador.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={contactLinkClass}
                >
                  <MessageCircle className="h-4 w-4 shrink-0 text-jmv-gold-text" aria-hidden />
                  <span>
                    Escríbenos por WhatsApp
                    <span className="sr-only">{NEW_TAB}</span>
                  </span>
                </a>
              </li>
              <li className="flex min-h-11 items-center gap-3 text-blue-100">
                <MapPin className="h-4 w-4 shrink-0 text-jmv-gold-text" aria-hidden />
                <span>{SITE.city}</span>
              </li>
            </ul>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h2 className="mb-3 text-base font-semibold text-jmv-gold-text">{group.title}</h2>
              <ul className="space-y-0.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 items-center rounded-md text-sm text-blue-100 hover:text-white hover:underline hover:underline-offset-4 lg:min-h-9"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="relative bg-[#163a68]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:px-6 md:flex-row lg:px-8">
          <p className="text-center text-sm text-blue-100 md:text-left">
            © {new Date().getFullYear()} {SITE.fullName}. Todos los derechos reservados.
          </p>

          <ul className="flex items-center gap-2" aria-label="Redes sociales">
            {SOCIAL_LINKS.map((social) => {
              const Icon = socialIcons[social.network];
              return (
                <li key={social.network}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.name}${NEW_TAB}`}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full text-blue-100 hover:bg-white/10 hover:text-white"
                  >
                    {Icon ? (
                      <Icon className="h-5 w-5" aria-hidden />
                    ) : (
                      <Image
                        src="/images/tiktok.png"
                        alt=""
                        width={20}
                        height={20}
                        className="h-5 w-5 object-contain opacity-90 invert"
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </footer>
  );
}
