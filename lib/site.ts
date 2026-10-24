// Datos generales del sitio. Fuente única para header, footer, metadatos y contacto.
// El teléfono/WhatsApp debe confirmarlo el equipo de JMV Ecuador antes de publicar.

export const SITE = {
  name: "JMV Ecuador",
  fullName: "Juventudes Marianas Vicencianas Ecuador",
  shortDescription:
    "Comunidad católica de jóvenes de 15 a 30 años que viven la fe, la formación y el servicio a los más pobres en todo Ecuador.",
  tagline: "Formando jóvenes comprometidos con el servicio, la fe y la transformación social",
  url: "https://jmvecuador.org",
  locale: "es_EC",
  /** Año de fundación de JMV en Ecuador (18 de julio de 1995, ver HistoriaTimeline) */
  foundedYear: 1995,
  email: "jmvecuador@gmail.com",
  /** Formato legible para mostrar */
  phone: "+593 99 230 3481",
  /** Formato E.164 sin "+" para wa.me y tel: */
  whatsapp: "593992303481",
  city: "Quito, Ecuador",
} as const;

export type SocialNetwork = "facebook" | "instagram" | "tiktok";

export const SOCIAL_LINKS: { network: SocialNetwork; name: string; href: string }[] = [
  {
    network: "facebook",
    name: "Facebook",
    href: "https://www.facebook.com/JMV.Ec2020",
  },
  {
    network: "instagram",
    name: "Instagram",
    href: "https://www.instagram.com/jmv_ecuador",
  },
  {
    network: "tiktok",
    name: "TikTok",
    href: "https://www.tiktok.com/@jmv.ecuador",
  },
];

/** Enlace tel: a partir del número E.164 */
export const telHref = `tel:+${SITE.whatsapp}`;
export const mailtoHref = `mailto:${SITE.email}`;

/** Rutas donde no se muestran header ni footer públicos */
export const CHROMELESS_PREFIXES = ["/admin", "/sign-in"] as const;

export function isChromelessPath(pathname: string | null | undefined) {
  if (!pathname) return false;
  return CHROMELESS_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Años de JMV en Ecuador calculados desde la fundación */
export function yearsSinceFoundation(now: Date = new Date()) {
  return now.getFullYear() - SITE.foundedYear;
}
