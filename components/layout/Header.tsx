import Link from "next/link";
import Image from "next/image";
import HeaderClient, { type NavItem } from "./HeaderClient";

const navigation: NavItem[] = [
  { name: "Inicio", href: "/" },
  {
    name: "Nosotros",
    children: [
      { name: "Quiénes somos", href: "/quienes-somos" },
      { name: "Historia", href: "/quienes-somos/historia" },
      { name: "Estatutos", href: "/quienes-somos/estatutos" },
      { name: "Estructura", href: "/estructura" },
      { name: "Pilares", href: "/pilares" },
      { name: "JMV en el mundo", href: "/jmv-en-el-mundo" },
    ],
  },
  {
    name: "Formación",
    children: [
      { name: "Formación", href: "/formacion" },
      { name: "Biblioteca", href: "/biblioteca" },
      { name: "Ejes formativos", href: "/formacion/ejes" },
      { name: "Santos vicencianos", href: "/formacion/santos" },
      { name: "Año Vicenciano", href: "/calendario" },
    ],
  },
  { name: "Actividades", href: "/actividades" },
  { name: "Comunidad", href: "/blog" },
  { name: "Contacto", href: "/contacto" },
];

export default function Header() {
  return (
    <HeaderClient
      navigation={navigation}
      logo={
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-md sm:gap-3"
          aria-label="JMV Ecuador, ir al inicio"
        >
          {/* Escudo oficial de JMV Ecuador */}
          <Image
            src="/images/escudo-jmv.png"
            alt=""
            width={192}
            height={192}
            priority
            sizes="56px"
            className="h-11 w-11 shrink-0 sm:h-14 sm:w-14"
          />
          <Image
            src="/images/logo-juventudes.png"
            alt=""
            width={800}
            height={214}
            priority
            sizes="(max-width: 640px) 150px, (max-width: 1280px) 180px, 240px"
            className="h-auto w-[150px] sm:w-[190px] lg:w-[160px] xl:w-[210px] 2xl:w-[240px]"
          />
        </Link>
      }
    />
  );
}
