import Link from "next/link";
import Image from "next/image";
import HeaderClient, { type NavItem } from "./HeaderClient";

const navigation: NavItem[] = [
  {
    name: "Inicio",
    href: "/",
  },
  {
    name: "Nosotros",
    children: [
      { name: "Historia", href: "/quienes-somos/historia" },
      { name: "Estructura", href: "/estructura" },
      { name: "Nuestros Pilares", href: "/pilares" },
      { name: "JMV en el Mundo", href: "/jmv-en-el-mundo" },
    ],
  },
  {
    name: "Formación",
    children: [
      { name: "Ejes Formativos", href: "/formacion/ejes" },
      { name: "Santos Vicencianos", href: "/formacion/santos" },
    ],
  },
  {
    name: "Actividades",
    href: "/actividades",
  },
  {
    name: "Contacto",
    href: "/contacto",
  },
];

export default function Header() {
  return (
    <HeaderClient
      navigation={navigation}
      logo={
        <Link
          href="/"
          className="flex items-center flex-shrink-0 justify-center max-w-72"
          aria-label="JMV Ecuador - Inicio"
        >
          <Image
            src="/logo.png"
            alt="JMV Ecuador"
            width={288}
            height={82}
            priority
            sizes="(max-width: 640px) 200px, 288px"
            className="h-auto w-full"
          />
        </Link>
      }
    />
  );
}
