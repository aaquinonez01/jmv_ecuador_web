import type { Metadata } from "next";
import ContactSection from "@/components/sections/ContactSection";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Ponte en contacto con JMV Ecuador para información, colaboración o participación.",
  alternates: {
    canonical: "/contacto",
  },
};

export default function ContactoPage() {
  return (
    <>
      <ContactSection />
      <CTASection />
    </>
  );
}

