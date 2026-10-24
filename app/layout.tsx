import type { Metadata } from "next";
import { Poppins, Fraunces } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PublicChrome from "@/components/layout/PublicChrome";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

// Serif editorial cálida para titulares y lemas (utilidad font-display)
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE.fullName,
    // Las páginas sólo ponen su título; el sufijo lo añade esta plantilla
    template: `%s | ${SITE.name}`,
  },
  description: `${SITE.fullName}: ${SITE.shortDescription}`,
  keywords: [
    "JMV",
    "Juventudes Marianas Vicencianas",
    "Ecuador",
    "San Vicente de Paúl",
    "Santa Catalina Labouré",
    "Medalla Milagrosa",
    "Formación juvenil",
    "Servicio social",
    "Pastoral juvenil",
    "Carisma vicenciano",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },
  metadataBase: new URL(SITE.url),
  alternates: {
    canonical: "/",
  },
  // La imagen la generan app/opengraph-image.tsx y app/twitter-image.tsx
  openGraph: {
    title: SITE.fullName,
    description: SITE.shortDescription,
    url: SITE.url,
    siteName: SITE.name,
    locale: SITE.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.fullName,
    description: SITE.shortDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn("scroll-smooth dark font-sans", poppins.variable, fraunces.variable)}
    >
      <body className="antialiased">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-jmv-blue focus:shadow-xl"
          data-surface="light"
        >
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido" tabIndex={-1} className="min-h-screen">
          {children}
        </main>
        <PublicChrome>
          <Footer />
        </PublicChrome>
      </body>
    </html>
  );
}
