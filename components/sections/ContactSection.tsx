import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Users } from "lucide-react";
import ContactForm from "@/components/sections/contact/ContactForm";
import { SITE, SOCIAL_LINKS, mailtoHref, telHref, type SocialNetwork } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

const SOCIAL_ICONS: Partial<Record<SocialNetwork, LucideIcon>> = {
  facebook: Facebook,
  instagram: Instagram,
};

const channels: {
  icon: LucideIcon;
  title: string;
  description: string;
  value: string;
  href: string;
  external?: boolean;
}[] = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "La forma más rápida de hablar con nosotros",
    value: SITE.phone,
    href: whatsappLink("Hola, vi la web de JMV Ecuador y quiero más información."),
    external: true,
  },
  {
    icon: Mail,
    title: "Correo",
    description: "Para consultas, colaboración o información",
    value: SITE.email,
    href: mailtoHref,
  },
  {
    icon: Phone,
    title: "Llamada",
    description: "Si prefieres conversar por teléfono",
    value: SITE.phone,
    href: telHref,
  },
];

// Canales directos siempre visibles junto al formulario de contacto
export default function ContactSection() {
  return (
    <section aria-labelledby="contacto-canales" className="relative bg-page py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <div className="text-fg">
          <h2 id="contacto-canales" className="text-2xl font-bold sm:text-3xl">
            Escríbenos directamente
          </h2>
          <p className="mt-3 text-fg-muted">
            Elige el canal que te quede más cómodo. Te responde una persona del equipo de JMV
            Ecuador.
          </p>

          <ul className="mt-8 space-y-4">
            {channels.map(({ icon: Icon, title, description, value, href, external }) => (
              <li key={title}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex min-h-11 items-start gap-4 rounded-2xl border border-line-card bg-surface-card p-5 shadow-card transition-colors hover:border-line-strong hover:bg-surface-2 dark:hover:border-white/30 dark:hover:bg-white/10"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-jmv-gold text-jmv-ink">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-lg font-semibold">{title}</span>
                    <span className="block text-sm text-fg-muted">{description}</span>
                    <span className="mt-1 block break-all font-semibold text-accent-gold underline-offset-4 group-hover:underline">
                      {value}
                    </span>
                    {external && <span className="sr-only"> (se abre en una pestaña nueva)</span>}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl border border-line-card bg-surface-card p-5 shadow-card">
            <p className="flex items-center gap-2 font-semibold">
              <MapPin className="h-5 w-5 text-accent-gold" aria-hidden />
              Sede nacional
            </p>
            <p className="mt-1 text-fg-muted">Quito – La Recoleta</p>
            <Link
              href="/unete#encuentra"
              className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-accent-gold underline underline-offset-4 hover:text-fg"
            >
              <Users className="h-5 w-5" aria-hidden />
              Encuentra la comunidad más cercana a ti
            </Link>
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-fg-muted">
              Síguenos
            </p>
            <ul className="mt-3 flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = SOCIAL_ICONS[social.network];
                return (
                  <li key={social.network}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm font-semibold text-fg transition-colors hover:border-jmv-blue hover:bg-jmv-blue hover:text-white dark:hover:border-line-strong dark:hover:bg-white dark:hover:text-jmv-blue"
                    >
                      {Icon && <Icon className="h-4 w-4" aria-hidden />}
                      {social.name}
                      <span className="sr-only"> (se abre en una pestaña nueva)</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div id="formulario" className="scroll-mt-24">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
