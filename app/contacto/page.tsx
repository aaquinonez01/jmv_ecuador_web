import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import HeroMedia from "@/components/media/HeroMedia";
import ContactSection from "@/components/sections/ContactSection";
import { fetchSlotImages } from "@/lib/api/site-images.server";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escríbenos por WhatsApp, correo o el formulario. Te ayudamos a unirte, colaborar o resolver tus dudas sobre JMV Ecuador.",
  alternates: {
    canonical: "/contacto",
  },
};

export default async function ContactoPage() {
  const heroImages = await fetchSlotImages("contacto.hero");

  return (
    <>
      <HeroMedia
        images={heroImages}
        eyebrow="Contacto"
        title="Conversemos"
        lead="¿Quieres unirte, colaborar o tienes alguna pregunta sobre JMV Ecuador?"
        breadcrumbs={[{ label: "Contacto" }]}
        className="min-h-[60svh] lg:min-h-[56vh]"
        actions={[
          {
            label: "Escribir por WhatsApp",
            href: whatsappLink("Hola, vi la web de JMV Ecuador y quiero más información."),
            icon: MessageCircle,
            external: true,
          },
          { label: "Usar el formulario", href: "#formulario" },
        ]}
      />
      <ContactSection />
    </>
  );
}
