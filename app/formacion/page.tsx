import type { Metadata } from "next";
import { BookOpen, Library, Star } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import FormacionPilar from "@/components/sections/FormacionPilar";
import SigueExplorando from "@/components/sections/institucional/SigueExplorando";
import BibliotecaCta from "@/components/sections/formacion/BibliotecaCta";

export const metadata: Metadata = {
  title: "Formación",
  description:
    "La formación en JMV Ecuador: ejes formativos, santos vicencianos, la biblioteca y el pilar de formación para crecer como persona, cristiano y vicenciano.",
  alternates: { canonical: "/formacion" },
};

export default function FormacionPage() {
  return (
    <>
      <PageHero
        eyebrow="Uno de los cuatro pilares"
        title="Formación"
        motto="Hasta que Cristo sea formado en ti."
        description="Como el barro en manos del alfarero, cada joven crece en su fe, en su humanidad y en su compromiso con los pobres. Así es el camino formativo de JMV."
        image={{ src: "/images/gallery/asamblea_2024.jpg", position: "center 40%" }}
        motif="monogram"
        breadcrumbs={[{ label: "Formación" }]}
        actions={[
          { label: "Ejes formativos", href: "/formacion/ejes", icon: BookOpen },
          { label: "Santos vicencianos", href: "/formacion/santos", icon: Star },
          { label: "Biblioteca", href: "/biblioteca", icon: Library },
        ]}
      />
      <FormacionPilar />
      <BibliotecaCta className="bg-section-blue pb-16 sm:pb-20" />
      <SigueExplorando items={["ejes", "santos", "unete"]} />
    </>
  );
}
