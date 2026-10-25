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
          className="flex max-w-48 shrink-0 items-center justify-center rounded-md sm:max-w-60 xl:max-w-72"
          aria-label="JMV Ecuador, ir al inicio"
        >
          <Image
            src="/logo.png"
            alt=""
            width={288}
            height={82}
            priority
            sizes="(max-width: 640px) 192px, 288px"
            className="h-auto w-full"
          />
        </Link>
      }
    />
  );
}
