import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ExternalLink,
  Globe2,
  HandHeart,
  Mail,
  MessageCircle,
  Package,
  ShieldCheck,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { buttonVariants } from "@/components/ui/button-variants";
import { StarDivider } from "@/components/brand";
import AccountCard from "@/components/donar/AccountCard";
import CampaignCard from "@/components/donar/CampaignCard";
import PurposeCard from "@/components/donar/PurposeCard";
import QrCard from "@/components/donar/QrCard";
import {
  DEFAULT_CONTACT_NOTE,
  DEFAULT_HEADLINE,
  DEFAULT_INTRO,
  donationContact,
} from "@/components/donar/shared";
import { fetchDonationsPublic } from "@/lib/api/donations.server";

const DESCRIPTION =
  "Apoya la misión de JMV Ecuador con una donación anónima por transferencia, QR o PayPal. Tu ayuda se vuelve formación, encuentros y servicio a los más pobres.";

export const metadata: Metadata = {
  title: "Donar",
  description: DESCRIPTION,
  keywords: "donar JMV, donaciones Ecuador, Juventudes Marianas Vicencianas, apoyar jóvenes, caridad vicenciana",
  alternates: { canonical: "/donar" },
  // Evita que iOS convierta los números de cuenta en enlaces de llamada
  formatDetection: { telephone: false },
  openGraph: {
    title: "Donar a JMV Ecuador",
    description: DESCRIPTION,
    url: "/donar",
    type: "website",
    images: [{ url: "/images/gallery/encuentro_nacional_2025.jpg", alt: "Jóvenes de JMV Ecuador en el Encuentro Nacional" }],
  },
};

// ISR: el backend invalida el tag "donations" al guardar en el admin.
export const revalidate = 3600;

const NEW_TAB = " (se abre en una pestaña nueva)";

export default async function DonarPage() {
  const { settings, accounts, purposes, campaigns } = await fetchDonationsPublic();
  const contact = donationContact(settings);
  const paypalUrl = settings?.paypalUrl?.trim() || null;
  const qrImageUrl = settings?.qrImageUrl?.trim() || null;
  const inKindNote = settings?.inKindNote?.trim() || null;
  const hasOnlineMethod = accounts.length > 0 || Boolean(qrImageUrl) || Boolean(paypalUrl);
  const hasAnyMethod = hasOnlineMethod || Boolean(inKindNote);

  return (
    <>
      <PageHero
        eyebrow="Donar"
        title={settings?.headline?.trim() || DEFAULT_HEADLINE}
        description={settings?.intro?.trim() || DEFAULT_INTRO}
        breadcrumbs={[{ label: "Donar" }]}
        image={{
          src: "/images/gallery/encuentro_nacional_2025.jpg",
          alt: "",
          position: "center 35%",
        }}
        motif="hearts"
        actions={[
          { label: "Cómo donar", href: "#como-donar", icon: ArrowDown },
          { label: "¿Dudas? Escríbenos", href: contact.whatsappHref, icon: MessageCircle, external: true },
        ]}
      >
        <p className="mt-6 flex items-center gap-2 text-sm text-fg-soft">
          <ShieldCheck className="h-5 w-5 shrink-0 text-accent-gold" aria-hidden />
          Tu donación es anónima: no te pedimos datos ni registro.
        </p>
      </PageHero>

      {purposes.length > 0 ? (
        <section aria-labelledby="usos-titulo" className="bg-slate-50 py-16 sm:py-20" data-surface="light">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              id="usos-titulo"
              tone="light"
              eyebrow="Tu aporte en acción"
              title="En qué se usa tu donación"
            />
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {purposes.map((purpose) => (
                <PurposeCard key={purpose.id} purpose={purpose} />
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {campaigns.length > 0 ? (
        <section aria-labelledby="campanas-titulo" className="bg-page py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              id="campanas-titulo"
              eyebrow="Campañas"
              title={campaigns.length === 1 ? "Campaña en curso" : "Campañas en curso"}
              description="Metas concretas que estamos reuniendo entre todos. El Tesorero/a Nacional actualiza el avance."
            />
            <ul className={`grid grid-cols-1 gap-6 ${campaigns.length > 1 ? "lg:grid-cols-2" : "mx-auto max-w-3xl"}`}>
              {campaigns.map((campaign) => (
                <li key={campaign.id}>
                  <CampaignCard campaign={campaign} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section
        id="como-donar"
        aria-labelledby="como-donar-titulo"
        className="scroll-mt-24 bg-white py-16 sm:py-20"
        data-surface="light"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="como-donar-titulo"
            tone="light"
            eyebrow="Cómo donar"
            title={hasAnyMethod ? "Elige la forma que te quede más fácil" : "Formas de donar"}
            description={
              hasAnyMethod
                ? "No necesitas registrarte ni dejarnos tus datos. Copia la información, haz tu aporte desde tu banco y listo."
                : undefined
            }
          />

          {!hasAnyMethod ? (
            <div className="mx-auto max-w-2xl rounded-3xl bg-slate-50 p-8 text-center ring-1 ring-slate-200 sm:p-10">
              <HandHeart className="mx-auto h-12 w-12 text-jmv-gold-ink" aria-hidden />
              <p className="mt-4 text-xl font-semibold text-slate-900">
                Pronto publicaremos los datos para donar.
              </p>
              <p className="mt-2 text-slate-700">Mientras tanto, escríbenos y te contamos cómo puedes ayudar.</p>
              <ContactButtons contact={contact} className="mt-6 justify-center" />
            </div>
          ) : (
            <div className="space-y-10">
              {hasOnlineMethod ? (
                <div
                  className={`grid grid-cols-1 gap-6 ${
                    accounts.length > 0 && (qrImageUrl || paypalUrl) ? "lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]" : ""
                  }`}
                >
                  {accounts.length > 0 ? (
                    <div>
                      <h3 className="mb-4 text-2xl font-bold text-slate-900">Transferencia o depósito</h3>
                      <ul className={`grid grid-cols-1 gap-6 ${accounts.length > 1 && !(qrImageUrl || paypalUrl) ? "lg:grid-cols-2" : ""}`}>
                        {accounts.map((account) => (
                          <li key={account.id}>
                            <AccountCard account={account} headingLevel="h4" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {qrImageUrl || paypalUrl ? (
                    <div className="space-y-6">
                      {accounts.length > 0 ? (
                        <p className="mb-4 hidden text-2xl font-bold text-slate-900 lg:block" aria-hidden>
                          Otras formas
                        </p>
                      ) : null}
                      {qrImageUrl ? <QrCard src={qrImageUrl} label={settings?.qrLabel} /> : null}
                      {paypalUrl ? (
                        <article
                          aria-labelledby="donar-paypal-titulo"
                          className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200 sm:p-6"
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-jmv-blue/10 text-jmv-blue">
                              <Globe2 className="h-6 w-6" aria-hidden />
                            </span>
                            <div className="min-w-0">
                              <h3 id="donar-paypal-titulo" className="text-xl font-bold leading-tight text-slate-900">
                                PayPal o tarjeta
                              </h3>
                              <p className="mt-1 text-sm text-slate-700">Ideal si estás fuera del Ecuador.</p>
                            </div>
                          </div>
                          <a
                            href={paypalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={buttonVariants({ variant: "primary", size: "lg", className: "mt-5 w-full" })}
                          >
                            Donar con PayPal
                            <ExternalLink className="ml-2 h-5 w-5" aria-hidden />
                            <span className="sr-only">{NEW_TAB}</span>
                          </a>
                        </article>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {inKindNote ? (
                <div className="flex flex-col gap-5 rounded-3xl bg-jmv-blue p-6 text-white sm:p-8 md:flex-row md:items-center">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-jmv-gold text-jmv-ink">
                    <Package className="h-7 w-7" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-2xl font-bold">Donaciones en especie</h3>
                    <p className="mt-2 whitespace-pre-line leading-relaxed text-slate-100">{inKindNote}</p>
                  </div>
                  <a
                    href={contact.inKindHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: "gold", size: "lg", className: "w-full px-5 sm:px-8 md:w-auto" })}
                  >
                    <MessageCircle className="mr-2 h-5 w-5" aria-hidden />
                    Coordinar por WhatsApp
                    <span className="sr-only">{NEW_TAB}</span>
                  </a>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="dudas-titulo" className="bg-section py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-3xl border border-line-card bg-surface shadow-card dark:bg-white/[0.07] p-6 text-fg sm:p-8">
            <MessageCircle className="h-8 w-8 text-accent-gold" aria-hidden />
            <h2 id="dudas-titulo" className="mt-4 text-3xl font-bold">
              ¿Tienes dudas?
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-fg-soft">
              {settings?.contactNote?.trim() || DEFAULT_CONTACT_NOTE}
            </p>
            <ContactButtons contact={contact} dark className="mt-6" />
          </div>

          <div className="rounded-3xl border border-line-card bg-surface shadow-card dark:bg-white/[0.07] p-6 text-fg sm:p-8">
            <ShieldCheck className="h-8 w-8 text-accent-gold" aria-hidden />
            <h2 className="mt-4 text-3xl font-bold">Transparencia</h2>
            {settings?.transparencyNote?.trim() ? (
              <p className="mt-3 whitespace-pre-line text-lg leading-relaxed text-fg-soft">
                {settings.transparencyNote.trim()}
              </p>
            ) : null}
            <p className="mt-3 leading-relaxed text-fg-soft">
              Somos una asociación sin fines de lucro (
              <Link
                href="/quienes-somos/estatutos#articulo-2"
                className="font-semibold text-accent-gold underline underline-offset-4 hover:text-fg"
              >
                Art. 2.2 de nuestros Estatutos Nacionales
              </Link>
              ).
            </p>
          </div>

          <figure className="rounded-3xl px-2 py-6 text-center lg:col-span-2">
            <StarDivider className="mx-auto mb-6 text-accent-gold" />
            <blockquote className="mx-auto max-w-3xl font-display text-2xl italic leading-snug text-fg md:text-3xl">
              “El amor es inventivo hasta el infinito”
            </blockquote>
            <figcaption className="mt-4 text-lg font-semibold text-fg-soft">— San Vicente de Paúl</figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}

function ContactButtons({
  contact,
  dark,
  className = "",
}: {
  contact: ReturnType<typeof donationContact>;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${className}`}>
      <a
        href={contact.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: dark ? "gold" : "primary", size: "md" })}
      >
        <MessageCircle className="mr-2 h-5 w-5" aria-hidden />
        Escríbenos por WhatsApp
        <span className="sr-only">{NEW_TAB}</span>
      </a>
      <a
        href={contact.mailHref}
        className={buttonVariants({ variant: dark ? "outlineAuto" : "outline", size: "md", className: "min-w-0" })}
      >
        <Mail className="mr-2 h-5 w-5 shrink-0" aria-hidden />
        <span className="break-all">{contact.email}</span>
      </a>
    </div>
  );
}
