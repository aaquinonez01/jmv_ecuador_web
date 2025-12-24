# JMV Ecuador - Sitio Web Oficial

Sitio web oficial de Juventudes Marianas Vicencianas Ecuador desarrollado con Next.js 15, TypeScript y Tailwind CSS.

## 🎯 Características Principales

### ✨ Diseño Moderno e Interactivo
- **UI/UX Inmersiva**: Interfaz moderna con animaciones fluidas y efectos glassmorphism
- **Paleta de Colores JMV**: 
  - Azul #1D4E8A (fe y devoción mariana)
  - Rojo/Coral #D3302F (amor y transformación)
  - Dorado #D98F06 (esperanza y gloria divina)
- **Tipografías Profesionales**: Poppins, Open Sans y Dancing Script
- **Responsive Design**: Optimizado para todos los dispositivos

### 🏗️ Estructura del Sitio

#### Página de Inicio
- Hero Section con slider animado
- Estadísticas con contadores animados
- Sección "Quiénes Somos" con pilares fundamentales
- Próximos eventos con filtros interactivos
- Testimonios con carousel automático
- Call-to-actions convincentes

#### Secciones Planificadas
1. **Quiénes Somos**
   - Historia con timeline interactivo
   - Organización con organigrama clickeable
   - Espiritualidad vicenciana

2. **Qué Hacemos**
   - Pilares fundamentales
   - Áreas de acción
   - Proyectos en curso

3. **Formación**
   - Ejes formativos
   - Santos y beatos vicencianos
   - Biblioteca digital

4. **Actividades**
   - Calendario interactivo
   - Galería de eventos
   - Sistema de registro

5. **Dónde Encontrarnos**
   - Mapa interactivo
   - Directorio de contactos
   - Información por zonas

### 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4
- **Componentes UI**: Componentes personalizados
- **Iconos**: Lucide React
- **Animaciones**: CSS Animations + Intersection Observer
- **Formularios**: React Hook Form + Zod
- **Estado**: Zustand (preparado para uso futuro)

### 🎨 Componentes Principales

#### UI Components
- `Button`: Botones con múltiples variantes y estados
- `Card`: Tarjetas con efectos hover y glassmorphism
- `Modal`: Modales accesibles con portal
- `AnimatedCounter`: Contadores con animaciones fluidas
- `ScrollReveal`: Animaciones al hacer scroll

#### Layout Components
- `Header`: Navegación responsive con menús desplegables
- `Footer`: Footer completo con enlaces y newsletter
- Secciones modulares y reutilizables

### 🌟 Características Técnicas

- **Performance**: Optimizado con lazy loading y code splitting
- **SEO**: Metadata completa y Open Graph
- **Accesibilidad**: Componentes accesibles (WCAG)
- **TypeScript**: Tipado estricto en todos los componentes
- **Responsive**: Mobile-first design

## 🚀 Desarrollo

### Requisitos Previos
- Node.js 18+
- pnpm (preferido)

### Instalación
```bash
# Clonar el repositório
git clone [repository-url]

# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev

# Construir para producción
pnpm build

# Iniciar servidor de producción
pnpm start
```

### Scripts Disponibles
- `pnpm dev`: Servidor de desarrollo con Turbopack
- `pnpm build`: Build de producción
- `pnpm start`: Servidor de producción

## 📁 Estructura del Proyecto

```
app/
├── (sections)/           # Páginas por secciones
│   ├── inicio/
│   ├── quienes-somos/
│   ├── que-hacemos/
│   ├── formacion/
│   ├── actividades/
│   ├── donde-encontrarnos/
│   ├── noticias/
│   └── unete/
├── components/
│   ├── ui/              # Componentes UI base
│   ├── sections/        # Secciones de páginas
│   └── layout/          # Componentes de layout
├── lib/                 # Utilidades y hooks
└── globals.css          # Estilos globales
```

## 🎨 Guía de Estilos

### Colores
```css
/* Colores principales JMV */
--jmv-blue: #1D4E8A        /* Azul principal */
--jmv-red: #D3302F         /* Rojo/Coral */
--jmv-gold: #D98F06        /* Dorado */
```

### Tipografías
- **Títulos**: Poppins (600-800)
- **Cuerpo**: Open Sans (400-600)
- **Decorativa**: Dancing Script (500-700)

### Efectos
- **Glassmorphism**: `.glass` y `.glass-dark`
- **Gradientes**: `.gradient-jmv` y `.gradient-jmv-soft`
- **Animaciones**: `.animate-float`, `.animate-fade-in`
- **Sombras**: `.shadow-jmv` y `.shadow-jmv-lg`

## 📝 Próximos Pasos

1. **Contenido**: Agregar contenido real e imágenes
2. **Páginas Internas**: Desarrollar secciones restantes
3. **Funcionalidades**:
   - Sistema de calendario interactivo
   - Mapa con marcadores
   - Formularios de contacto
   - CMS para administración
4. **Integraciones**:
   - Google Analytics
   - Redes sociales
   - Newsletter
   - Base de datos

## 🤝 Contribución

Para contribuir al proyecto:
1. Fork el repositorio
2. Crear una rama feature
3. Commit los cambios
4. Push a la rama
5. Crear Pull Request

## 📄 Licencia

© 2024 Juventudes Marianas Vicencianas Ecuador. Todos los derechos reservados.

---

**Desarrollado con ❤️ para la comunidad JMV Ecuador**
