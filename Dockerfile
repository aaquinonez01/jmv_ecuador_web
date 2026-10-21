FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Con SKIP_REMOTE_FETCH=0 el build pide los datos a la API pública y las páginas
# salen pre-renderizadas con contenido. Si la API no responde, el build no falla:
# esas secciones salen vacías y se regeneran solas al primer revalidate.
ARG SKIP_REMOTE_FETCH=0
ENV SKIP_REMOTE_FETCH=${SKIP_REMOTE_FETCH}
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
# Solo para el build (debe ser alcanzable desde el builder, p. ej. la URL pública).
# En runtime docker-compose lo sobreescribe con la URL interna http://backend:3002/api.
ARG INTERNAL_API_URL
ENV INTERNAL_API_URL=${INTERNAL_API_URL}
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public
# Carpeta de caché de imágenes optimizadas (se monta como volumen para conservarla
# entre despliegues).
RUN mkdir -p .next/cache/images && chown -R nextjs:nodejs .next/cache
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NODE_OPTIONS=--max-old-space-size=1024
CMD ["node", "server.js"]
