import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Solo WebP: AVIF comprime algo más pero su codificación es varias veces más
    // costosa en CPU, y en un VPS de 2 vCPU eso se nota cuando la caché está fría.
    formats: ["image/webp"],
    // Las imágenes optimizadas se guardan 30 días en .next/cache/images
    // (montado como volumen en docker-compose para sobrevivir a los redeploys).
    minimumCacheTTL: 2592000,
    deviceSizes: [640, 828, 1080, 1280, 1920],
    imageSizes: [64, 128, 256, 384],
    qualities: [75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "radix-ui", "@xyflow/react"],
  },
  async headers() {
    return [
      {
        // Archivos de /public (imágenes, logos, íconos): caché de navegador de 7
        // días. No llevan hash en el nombre, por eso no se marcan immutable.
        source: "/:path*\\.(jpg|jpeg|png|webp|avif|svg|ico|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
