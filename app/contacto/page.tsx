import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import ContactSection from "@/components/sections/ContactSection";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escríbenos por WhatsApp, correo o el formulario. Te ayudamos a unirte, colaborar o resolver tus dudas sobre JMV Ecuador.",
  alternates: {
    canonical: "/contacto",
  },
};

export default function ContactoPage() {
  return (
    <>
      <PageHero
        eyebrow="Contacto"
        title="Conversemos"
        description="¿Quieres unirte, colaborar o tienes alguna pregunta sobre JMV Ecuador? Escríbenos por el canal que prefieras: te respondemos con gusto."
        breadcrumbs={[{ label: "Contacto" }]}
        motif="hearts"
        actions={[
          {
            label: "Escribir por WhatsApp",
            href: whatsappLink("Hola, vi la web de JMV Ecuador y quiero más información."),
            icon: MessageCircle,
            external: true,
          },
          { label: "Usar el formulario", href: "#formulario" },
        ]}
        className="min-h-[45svh] lg:min-h-[45vh]"
      />
      <ContactSection />
    </>
  );
}
