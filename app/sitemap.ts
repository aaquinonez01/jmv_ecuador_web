import type { MetadataRoute } from "next";

const BASE = "https://jmvecuador.org";

const routes = [
  "",
  "/actividades",
  "/blog",
  "/contacto",
  "/estructura",
  "/formacion",
  "/formacion/ejes",
  "/formacion/santos",
  "/jmv-en-el-mundo",
  "/pilares",
  "/quienes-somos",
  "/quienes-somos/historia",
  "/unete",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({ url: `${BASE}${path}` }));
}
