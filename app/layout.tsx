import type { Metadata } from "next";
import { Poppins, Open_Sans, Dancing_Script } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const openSans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const dancingScript = Dancing_Script({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dancing",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Juventudes Marianas Vicencianas Ecuador",
    template: "%s | JMV Ecuador",
  },
  description:
    "Juventudes Marianas Vicencianas Ecuador - Formando jóvenes comprometidos con el servicio, la fe y la transformación social bajo el carisma vicenciano.",
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
  authors: [{ name: "JMV Ecuador" }],
  creator: "JMV Ecuador",
  publisher: "JMV Ecuador",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://jmvecuador.org"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Juventudes Marianas Vicencianas Ecuador",
    description:
      "Formando jóvenes comprometidos con el servicio, la fe y la transformación social bajo el carisma vicenciano.",
    url: "https://jmvecuador.org",
    siteName: "JMV Ecuador",
    locale: "es_EC",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "JMV Ecuador - Juventudes Marianas Vicencianas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Juventudes Marianas Vicencianas Ecuador",
    description:
      "Formando jóvenes comprometidos con el servicio, la fe y la transformación social bajo el carisma vicenciano.",
    images: ["/images/twitter-image.jpg"],
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
    <html lang="es" className="scroll-smooth dark">
      <body
        className={`${poppins.variable} ${openSans.variable} ${dancingScript.variable} antialiased bg-slate-900 text-slate-100`}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
