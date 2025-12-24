# Plan de Mejora del Apartado de Blog

## Estado Actual (auditoría rápida)
- Rutas y páginas: `/blog` (`app/blog/page.tsx`) y perfiles (`app/blog/profile/[id]/page.tsx`) con clientes `BlogClient` y `ProfilePageClient`.
- Layout y componentes clave: `components/blog/BlogLayout.tsx`, `BlogPost.tsx`, `PostModal.tsx`, `ImageGallery.tsx`, `TrendingPosts.tsx`, `RecentActivity.tsx`, `CreatePostForm.tsx`.
- Datos y hooks: `usePostsData` (paginación `limit/offset`), `usePostCategories` (taxonomías), `useAuth`.
- Hallazgos:
  - Búsqueda visible pero no conectada al feed (`BlogLayout.tsx:141-147`, `BlogClient.tsx:85-97`).
  - Paginación preparada en hook pero sin UI de “Cargar más” (`usePostsData`, `BlogClient.tsx`).
  - Modales sin atributos ARIA/gestión de foco; botones solo-icono sin `aria-label` (`PostModal.tsx`, `ImageGallery.tsx`, `BlogLayout.tsx:82-87`, `BlogPost.tsx:97-99`).
  - Semántica mejorable: muchos `div` en listas y layout; posts no envueltos en `article`.
  - Estados vacíos presentes pero microcopy mejorable y CTA contextual.

## Objetivos
- Accesibilidad (WCAG 2.1 AA): landmarks, semántica, navegación por teclado, roles/ARIA, contraste.
- Usabilidad: búsqueda funcional con debounce, filtros claros, paginación/carga incremental, loaders/skeletons, estados vacíos útiles.
- Amigabilidad: microcopy cálido, tooltips, toasts accesibles, tabs accesibles.

## Cambios de Accesibilidad
- Landmarks y semántica
  - `BlogLayout.tsx`: estructurar con `main` para contenido, `aside` con `aria-label` para perfiles/herramientas, y `section` con `aria-labelledby` para bloques (“Buscar”, “Actividad”, “Tendencias”) (`components/blog/BlogLayout.tsx:134-159`).
  - Listados: usar `<ul>/<li>` o `role="list"/"listitem"` en `TrendingPosts.tsx` y `RecentActivity.tsx` (`TrendingPosts.tsx:46-96`, `RecentActivity.tsx:80-113`).
  - Posts: envolver cada tarjeta en `article` y crear `nav aria-label="Acciones de publicación"` para las acciones (`BlogPost.tsx:63-70`, `BlogPost.tsx:221-240`).
- Controles y etiquetas
  - Añadir `aria-label` a botones solo-icono: filtro (`BlogLayout.tsx:82-87`), menú opciones (`BlogPost.tsx:97-99`, `PostModal.tsx:289-291`), controles de galería (`ImageGallery.tsx:141-185`), cerrar modal (`PostModal.tsx:151-155`, `ImageGallery.tsx:141-147`).
  - `aria-pressed` en “Me gusta” (`BlogPost.tsx:224-238`, `PostModal.tsx:260-272`).
  - Asociar `label htmlFor/id` en el buscador (`BlogLayout.tsx:141-147`) y revisar inputs del formulario de creación (`CreatePostForm.tsx:396-403`, `CreatePostForm.tsx:414-422`, `CreatePostForm.tsx:450-462`).
- Teclado y foco
  - Tarjeta `BlogPost`: hacerla accesible por teclado (`tabIndex=0`, `role="button"`, abrir con Enter/Espacio) (`BlogPost.tsx:63-66`).
  - Modales `PostModal`, `ImageGallery`, `AuthRequiredModal`: `role="dialog"`, `aria-modal="true"`, `aria-labelledby/aria-describedby`; mover foco al abrir, trampa de foco, restaurar foco al cerrar (focalizar contenedor o botón cerrar) (`PostModal.tsx:97-106`, `AuthRequiredModal.tsx:18-33`, `ImageGallery.tsx:135-171`).
  - Limitar listeners de teclado al contenedor del modal (`onKeyDown`) y evitar `document.addEventListener` global.
- Imágenes y medios
  - Alt text contextual: “Avatar de [nombre]”, “Foto del evento [título]” (`BlogPost.tsx:167-171`, `ImageGallery.tsx:193-201`).
  - `loading="lazy"` y `decoding="async"` en miniaturas y grids.
- Contraste y tamaño objetivo
  - Revisar combinaciones pálidas (`text-gray-500` sobre `white`, botones `bg-white/30`); elevar contraste y asegurar targets de 44×44 donde aplique.

## Mejoras de Usabilidad
- Búsqueda
  - Conectar input del sidebar con el hook: elevar `searchQuery` a `BlogClient`, pasar `searchValue/onSearchChange` a `BlogLayout` y llamar `setSearch` con debounce 300–500 ms (`BlogClient.tsx:183-191`, `BlogLayout.tsx:141-147`).
  - Añadir botón “Limpiar” y mostrar conteo de resultados.
- Filtros
  - Corregir mapeo de `BlogCategories`: usar `typePost` en lugar de `scope` para “Momentos/Documentos”; definir “Formación” como `scope` o `activityType` según negocio (`BlogClient.tsx:103-121`).
  - Añadir selects/chips para `scope`, `activityType`, `subtype` usando `usePostCategories` en el sidebar; mostrar filtros activos y botón “Limpiar filtros”.
- Paginación/Carga incremental
  - Añadir “Cargar más” que incremente `offset` y concatene resultados, o UI de paginación numerada usando `changePage(page)` del hook (`usePostsData.ts`).
- Estados de carga y vacíos
  - Reutilizar `components/admin/ui/LoadingSpinner.tsx` para coherencia; crear skeletons de tarjeta `BlogPost`.
  - Estados vacíos con microcopy y CTA: si autenticado, botón “Crear publicación”; si no, “Inicia sesión” o “Únete” (ya existe `AuthRequiredModal`).
- Rendimiento
  - Cancelación de consultas en vuelo, limitar `limit` inicial (10–12), lazy load de imágenes.

## Mejoras de Amigabilidad
- Microcopy
  - Ajustar textos: “No hay publicaciones” → “Todavía no hay publicaciones aquí. ¿Quieres compartir la tuya?” (`BlogClient.tsx:241-249`).
  - Mensajes de éxito/fracaso: toasts accesibles con `role="status"` tras crear publicación/errores.
- Tooltips
  - Añadir tooltips a iconos (filtro, más opciones, zoom/rotar/descargar/compartir) con `aria-label` y `title`.
- Tabs accesibles
  - `ProfileClient`: convertir tabs a `role="tablist"`, `role="tab"`, `aria-selected` y `aria-controls` (`ProfileClient.tsx:74-123`).

## Validación
- Ejecutar auditoría Lighthouse/axe: objetivo A11y ≥ 95.
- Navegación completa por teclado: abrir/usar/cerrar modales, recorrer posts, accionar controles.
- Screen readers: verificar jerarquía de encabezados, landmarks, labels y roles dialog.
- Contrast check AA en paleta JMV.

## Archivos a Editar
- `components/blog/BlogLayout.tsx`, `components/blog/BlogPost.tsx`, `components/blog/PostModal.tsx`, `components/blog/ImageGallery.tsx`, `components/blog/TrendingPosts.tsx`, `components/blog/RecentActivity.tsx`, `components/blog/CreatePostForm.tsx`, `app/blog/BlogClient.tsx`, `app/blog/profile/[id]/ProfileClient.tsx`.

## Entregables
- Implementaciones descritas arriba, con pruebas básicas (teclado/lector de pantalla) y captura de métricas Lighthouse.

¿Confirmas que avance con estos cambios? Si sí, procedo a implementarlos en lotes pequeños y verifico cada uno antes de continuar.