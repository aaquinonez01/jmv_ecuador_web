# Modo claro: guía para adaptar el sitio público

El sitio público tiene dos temas: **claro** y **oscuro**. El oscuro debe verse
**igual que antes** y el claro debe verse cuidado y cumplir el contraste AA.
Esta guía dice qué clase cambiar por cuál. Si un caso no aparece aquí, aplica
el criterio de la sección 6.

## 1. Cómo funciona (no hay que tocarlo)

- El tema es la clase `dark` (más `data-theme="light|dark"` y
  `data-theme-pref="light|dark|system"`) en `<html>`. La pone un script inline
  en `<head>` (`THEME_INIT_SCRIPT` de `lib/theme.ts`) **antes de pintar**, a
  partir de `localStorage["jmv-tema"]` o del sistema. No usa cookies ni
  `headers()`, así que las páginas siguen siendo estáticas o ISR.
- Los colores son **variables CSS** (`app/globals.css`): los valores claros van
  en `:root` y los oscuros en `.dark`. Cambiar de tema **no re-renderiza React**.
- Selector: `components/theme/ThemeToggle.tsx` (`variant="menu"` en el header
  de escritorio, `variant="segmented"` en el menú móvil).
  `useTheme()` (`components/theme/useTheme.ts`) devuelve
  `{ preference, resolved, setPreference }`. Úsalo **solo** para mostrar el
  estado; para colorear usa tokens o `dark:`.
- Mientras se alterna el tema, la clase `theme-switching` desactiva las
  transiciones, así que no hace falta hacer nada para evitar el parpadeo.
- `color-scheme` sigue al tema, de modo que los controles nativos, el
  autocompletado y las barras de desplazamiento acompañan solos.

**No uses** `useTheme()` para elegir clases (`resolved === "dark" ? ... : ...`).
Eso provoca un salto en la hidratación y un re-render. Usa tokens o `dark:`.

## 2. Tokens y utilidades disponibles

| Utilidad | Claro | Oscuro (aspecto anterior) | Uso |
|---|---|---|---|
| `bg-page` | `#faf7f1` marfil | `#0f172a` (jmv-ink) | fondo de página o sección |
| `bg-page-deep` | `#f3eee4` | `#070d1d` | banda más marcada (heroes de biblioteca, etc.) |
| `bg-section-blue` | `#e8eff8` | `#132f55` | banda azulada |
| `bg-section` (degradado) | marfil → `#eaf1fa` | `#0f172a` → `#163a68` | degradado vertical de sección |
| `from-section-a` / `to-section-b` | igual que arriba | igual que arriba | degradados a medida |
| `bg-hero-plain` (degradado) | marfil → arena → azul claro | ink → `#163a68` → jmv-blue | cabecera **sin** foto |
| `bg-surface` | `#fff` | `white/6%` | tarjeta |
| `bg-surface-card` | blanco | `white/5%` | tarjeta que en oscuro era `bg-white/5` |
| `bg-surface-2` | `#f3f1ec` | `white/10%` | tarjeta secundaria, hover, chip neutro |
| `bg-surface-sunken` | `#efebe3` | `rgb(2 6 23 / .35)` | pozo, pista o input sobre tarjeta |
| `bg-surface-raised` | `#fff` | `#1e293b` | opaco: menú, popover, barra fija |
| `surface-card` (utilidad compuesta) | fondo blanco, borde y sombra | `white/6%` + borde `white/10%` | tarjeta estándar (añade el radio y el padding) |
| `text-fg` | `#0f172a` (17:1) | `#fff` | texto principal y títulos |
| `text-fg-muted` | `#334155` (10:1) | `#cbd5e1` slate-300 | texto secundario |
| `text-fg-soft` | `#334155` (10:1) | `#e2e8f0` slate-200 | texto secundario que en oscuro era slate-200 (descripciones, párrafos largos) |
| `text-fg-subtle` | `#475569` (7:1) | `#94a3b8` slate-400 | metadatos, notas |
| `border-line` | `slate-900/10%` | `white/10%` | borde normal |
| `border-line-card` | `slate-900/10%` | `white/15%` | borde de tarjeta que en oscuro era `border-white/15` |
| `border-line-strong` | `slate-900/20%` | `white/20%` | borde marcado, separador visible |
| `border-line-input` | `#7c8799` (3.6:1) | `white/20%` | borde de inputs, selects y otros controles de formulario |
| `text-accent-gold` | `#8a5a00` (5.5:1) | `#f5b83d` (jmv-gold-text) | eyebrow, cifras, enlaces dorados |
| `text-accent-blue` | `#1d4e8a` | `#93c5fd` blue-300 | enlaces y acentos azules |
| `ring-focus` / `outline-focus` | jmv-blue | `#f5b83d` | foco a medida (el global ya lo pone) |
| `from-hero-veil` / `via-hero-veil/70`… | `#0f172a` | `#0f172a` | velo de foto (igual en ambos) |
| `shadow-card` / `shadow-card-lg` | sombra suave | ninguna / `shadow-2xl` negra | elevación |

- Todas admiten opacidad: `bg-surface/80`, `border-fg/15`, `text-fg/70`,
  `bg-accent-gold/10`, `border-accent-gold/40`.
- `fg` con opacidad sirve para reemplazar `white/X` cuando se trata de **texto
  o líneas**: `text-white/80` → `text-fg/80`, `divide-white/10` → `divide-line`.
- **No uses `text-accent` ni `bg-accent`**: son tokens de shadcn (azul claro), no
  el dorado. El dorado de texto es `text-accent-gold`.
- `--jmv-*` no cambian con el tema: `bg-jmv-blue`, `bg-jmv-gold`,
  `text-jmv-gold-text` (dorado claro **fijo**) y `text-jmv-gold-ink` (dorado
  oscuro **fijo**). Úsalos solo cuando el fondo es fijo (el header, el footer,
  una foto o un botón dorado).

### Variantes

- `dark:` aplica con `html.dark` **y** dentro de cualquier `data-tone="dark"`.
  Deja de aplicar dentro de `data-tone="light"`.
- `theme-dark:` y `theme-light:` siguen el tema **global** e ignoran las islas.
  Casi nunca hacen falta; se usan, por ejemplo, para el icono sol/luna dentro del
  header azul.

### Islas de tono fijo: `data-tone`

- `data-tone="dark"` en un contenedor fija **los tokens oscuros** en todo su
  subárbol: `text-fg` es blanco, `bg-surface` es `white/6%`, el foco es dorado y
  `dark:` aplica. Se usa en el header, el footer, el **PageHero con foto** y
  cualquier zona que deba ser oscura en ambos modos.
- `data-tone="light"` hace lo mismo con los tokens claros: Modal, submenús
  blancos y el panel del selector.
- `data-surface="light"` (antiguo) solo cambia el foco a azul y `color-scheme`.
  En el código nuevo usa `data-tone="light"`.

> Ojo: `bg-background` y `text-foreground` (shadcn) se resuelven en `<html>` y
> **no** cambian dentro de una isla. Dentro de una isla usa `bg-page` y `text-fg`.

### Componentes compartidos (ya adaptados)

- `PageHero`: **con `image`** es una isla oscura (velo oscuro y texto blanco en
  ambos modos). **Sin imagen** sigue el tema (`bg-hero-plain`), y la acción
  `outlineLight` se cambia sola por `outlineAuto`. Los `children` que pases
  deben usar tokens (`text-fg`, `bg-surface`, `border-line`…). Dentro del hero con
  foto los tokens ya salen oscuros, así que funcionan en los dos casos.
- `SectionHeading`: `tone` es **`"auto"` por defecto** y usa tokens. `tone="light"`
  y `tone="dark"` fijan los colores y solo se usan en islas sin `data-tone`.
- `Breadcrumbs`: `tone="auto"` por defecto. `"dark"` da blanco fijo y `"light"`
  da oscuro fijo.
- `buttonVariants`:
  - `gold`, `primary`, `secondary`, `destructive` y `light`: valen en ambos modos.
  - `outline` y `ghost` (azul JMV): solo sobre fondo **claro fijo**.
  - `outlineLight` (contorno blanco): solo sobre **foto u oscuro fijo**.
  - **`outlineAuto`** (azul en claro, blanco en oscuro) y **`ghostAuto`**
    (`text-accent-blue`): para secciones que cambian con el tema. Donde antes
    había `outlineLight` sobre un fondo que ahora cambia de tema, pon
    `outlineAuto`.
- `Modal`: panel blanco en ambos modos (`data-tone="light"`). Su contenido ya
  puede usar tokens claros.
- Marca (`StarsRing`, `MarianMonogram`, `TwoHearts`): usan `currentColor`. Dales
  `text-accent-gold/15` en lugar de `text-jmv-gold-text/15`. `StarDivider` ya
  usa `text-accent-gold`.

## 3. Tabla de reemplazo: clase oscura antigua → token

| Antes (solo oscuro) | Después |
|---|---|
| `bg-slate-900`, `bg-jmv-ink`, `bg-[#0f172a]` (fondo de sección) | `bg-page` |
| `bg-[#070d1d]`, `bg-[#0b1224]`, `bg-slate-950` | `bg-page-deep` |
| `bg-[#132f55]`, `bg-[#163a68]` (banda) | `bg-section-blue` |
| `bg-gradient-to-b from-jmv-ink to-[#163a68]` | `bg-section` |
| `from-jmv-ink via-[#163a68] to-jmv-blue` (hero sin foto) | `bg-hero-plain` |
| `from-jmv-ink …` como **velo sobre foto** | `from-hero-veil …` + `data-tone="dark"` en el contenedor |
| `bg-white/5`, `bg-white/[0.04–0.07]`, `bg-white/8` (tarjeta) | `bg-surface` (o `surface-card`) |
| `bg-white/10`, `bg-white/15` (tarjeta secundaria, hover) | `bg-surface-2` (hover: `hover:bg-surface-2`) |
| `bg-black/20`, `bg-black/30` (pozo, pista) | `bg-surface-sunken` |
| `bg-slate-800`, `bg-[#1e293b]` (menú o barra opaca) | `bg-surface-raised` |
| `border-white/10`, `border-white/15` | `border-line` |
| `border-white/20` a `/30` | `border-line-strong` |
| `divide-white/10`, `ring-white/10` | `divide-line`, `ring-line` |
| `text-white` (en contenido, no sobre foto ni botón) | `text-fg` |
| `text-slate-200` | `text-fg-soft` (conserva el slate-200 en oscuro) |
| `text-slate-100`, `text-slate-300` | `text-fg-muted` (slate-100: añade `dark:text-slate-100`) |
| `text-slate-400`, `text-slate-500` (sobre oscuro) | `text-fg-subtle` |
| `text-white/80`, `text-white/70` | `text-fg/80`, `text-fg-muted` |
| `text-jmv-gold-text` (sobre fondo que ahora cambia) | `text-accent-gold` |
| `border-jmv-gold-text/40`, `bg-jmv-gold-text/10` | `border-accent-gold/40`, `bg-accent-gold/10` |
| `text-blue-200`, `text-blue-300`, `text-sky-300` (enlaces) | `text-accent-blue` |
| `placeholder:text-slate-400` (input sobre oscuro) | `placeholder:text-fg-subtle` |
| `shadow-2xl shadow-black/40` (tarjeta sobre oscuro) | `shadow-card-lg` |
| `variant: "outlineLight"` (sobre fondo que cambia) | `variant: "outlineAuto"` |

**No se cambian:**

- El texto sobre `bg-jmv-gold` sigue siendo `text-jmv-ink`.
- El texto sobre `bg-jmv-blue`, `bg-jmv-red` o una foto sigue en `text-white`.
- Las islas claras ya existentes (`bg-white`, `bg-slate-50` con
  `data-surface="light"`) se quedan claras en ambos modos. Si quieres que sigan
  el tema, cámbialas a `bg-surface` o `bg-page` y quita `data-surface`.

## 4. Casos concretos

### Cabeceras con foto
El contenedor lleva `data-tone="dark"`. Encima de la foto va un velo con
`from-hero-veil via-hero-veil/70 to-hero-veil/10`, y dentro el texto es blanco
fijo o con tokens, que ahí salen oscuros. Es lo que hace `PageHero` con `image`.
**El resto de la página debe ser claro** en modo claro.

### Heroes propios sin foto (biblioteca, calendario, estatutos…)
Pásalos a `bg-hero-plain` o `bg-page-deep` y usa tokens. Si un hero depende de
un fondo oscuro para funcionar (un campo de estrellas animado o un efecto
luminoso), puedes dejarlo oscuro en ambos modos con `data-tone="dark"`. Es un
caso puntual y debe estar justificado en un comentario.

### Chips y medallas de categoría con color
- Claro: fondo suave del color y texto oscuro del mismo tono.
- Oscuro: el aspecto que ya tenían.

```tsx
"bg-sky-100 text-sky-800 ring-1 ring-sky-700/20 dark:bg-sky-400/15 dark:text-sky-200 dark:ring-sky-300/30"
```

Si el color viene de datos (hex dinámico), usa `color-mix` con estilos inline:

```tsx
style={{
  backgroundColor: `color-mix(in oklab, ${hex} 14%, var(--surface))`,
  color: `color-mix(in oklab, ${hex} 70%, var(--fg))`,
}}
```

Verifica que el texto llegue a 4.5:1. Un punto o borde de color puro (`bg-[hex]`)
sirve en ambos modos.

### Sombras en claro
En claro las tarjetas se separan del marfil con **borde + sombra suave**: usa
`surface-card` o `bg-surface border border-line shadow-card`. En oscuro
`shadow-card` no dibuja nada, así que el aspecto se mantiene. Los realces
grandes (modales, tarjetas destacadas) usan `shadow-card-lg`. No uses sombras
negras fuertes en claro.

### Dorado
- **Texto** dorado: siempre `text-accent-gold`. En claro es `#8a5a00`; nunca
  pongas `#F5B83D` sobre blanco.
- **Botones** dorados: `bg-jmv-gold text-jmv-ink` (variante `gold`) en ambos modos.
- **Decoración** (estrellas, líneas): `text-accent-gold/15` a `/30`.

### Cuándo usar `dark:` en vez de un token
Usa `dark:` solo en casos puntuales: chips de color, una imagen o ilustración que
necesita otro tratamiento (`dark:opacity-80`), mapas, gráficos, o un valor de
Tailwind que no tiene token (`bg-amber-50 dark:bg-amber-400/10`). Para fondos,
textos y bordes generales, **usa siempre tokens**: así el oscuro queda idéntico
y no se duplican clases.

### Rendimiento
- No añadas JS por el tema. Nada de `useTheme` para colorear ni de `matchMedia`
  en componentes.
- Los degradados y velos son CSS. No anides `backdrop-blur` nuevos en claro:
  allí basta un fondo opaco.
- No uses `transition-all` para colores. El cambio de tema ya desactiva las
  transiciones.

## 5. Reparto de áreas (otros agentes)

Todos parten de la rama `feat/modo-claro-base`:

1. **Inicio**: `app/page.tsx`, `components/sections/{HeroSection, CarismaVicenciano, MisionVision, ProximasActividades, CountdownClient, EventActions, TestimonialsSection*, CTASection, HomeAnnouncementBanner}`, `components/estatutos/EstatutosTeaser`.
2. **Institucional**: `quienes-somos/*`, `estructura`, `pilares`, `jmv-en-el-mundo`, `components/sections/{ConsejoNacionalSection, Organigrama, organigrama/*, HistoriaTimeline, TestimoniosQuienesSomos, PilaresInteractivo, institucional/*, jmv-mundo/*}`, `components/estatutos/*`, `components/ui/{MapaInteractivo, map}` (mapa).
3. **Formación y biblioteca**: `formacion/*`, `components/sections/{FormacionPilar, formacion/*}`, `biblioteca/*`, `components/biblioteca/*`. El lector de PDF conserva sus temas internos.
4. **Calendario**: `calendario/*`, `components/calendario/*` (anillo, chips de categoría, tarjetas). La imagen de historia para compartir no se toca.
5. **Actividades, Únete, Contacto, Donar, Comunidad y acceso**: `actividades/*`, `unete`, `contacto`, `donar`, `components/sections/{ActividadesAlbums*, ActivitiesGallery*, ActivityGalleryModal, ActivityLightbox, ContactSection, contact/*, unete/*, skeletons/*}`, `components/donar/*`, `blog/*`, `components/blog/*`, `(auth)/*`, `components/auth/*`, `components/ui/{Card, Skeleton, input, textarea, select, checkbox, label}`.

**No se tocan:** `app/opengraph-image.tsx`, `app/twitter-image.tsx`, las
imágenes de historia y para compartir del calendario, `/admin` y
`components/admin/*` (ya son claros), y los temas internos del lector de PDF.

## 6. Comprobación antes de terminar

1. `pnpm exec tsc --noEmit`.
2. Captura de cada página en claro y en oscuro (1440×900 y 390×844 móvil).
   Para forzar un modo antes de cargar, usa
   `localStorage.setItem("jmv-tema", "light" | "dark")`.
3. El **oscuro debe verse igual** que en producción (https://jmvecuador.org).
4. En claro:
   - no queda texto blanco sobre fondo claro, ni bloques `slate-900` sueltos
     (salvo las islas `data-tone="dark"` justificadas);
   - el dorado de texto es `#8a5a00`;
   - el foco es visible (azul en claro, dorado en las islas oscuras).
5. Busca restos con
   `rg "text-white|bg-white/|border-white/|text-slate-[1-4]00|bg-jmv-ink|from-jmv-ink|jmv-gold-text" <tu área>`
   y justifica cada uno que quede (foto, botón, isla oscura).
