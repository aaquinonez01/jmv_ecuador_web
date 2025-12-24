'use client'

import { useState } from 'react'
import { Calendar, MapPin, Users, Camera, ChevronDown } from 'lucide-react'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { motion, AnimatePresence } from 'framer-motion'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'
import 'yet-another-react-lightbox/styles.css'

// Estructura de datos para las 6 actividades principales
const actividades = [
  {
    id: 'retiro-nacional',
    titulo: 'Retiro Nacional',
    descripcion: 'Encuentro espiritual intensivo que fortalece la fe y el carisma vicenciano de jóvenes de todo el país.',
    ubicacion: 'Casa de Retiros San Vicente de Paúl',
    participantes: 350,
    fecha: 'Julio 2024',
    categoria: 'Espiritual',
    color: 'from-blue-600 to-blue-800',
    imagenes: [
      {
        src: '/images/actividades/retiro-nacional/retiro-1.jpg',
        alt: 'Momentos de oración en el Retiro Nacional',
        descripcion: 'Jóvenes en adoración eucarística durante el retiro'
      },
      {
        src: '/images/actividades/retiro-nacional/retiro-2.jpg',
        alt: 'Dinámicas grupales de reflexión',
        descripcion: 'Grupos de reflexión sobre el carisma vicenciano'
      },
      {
        src: '/images/actividades/retiro-nacional/retiro-3.jpg',
        alt: 'Misa de clausura del retiro',
        descripcion: 'Celebración eucarística de envío misionero'
      },
      {
        src: '/images/actividades/retiro-nacional/retiro-4.jpg',
        alt: 'Momentos de hermandad',
        descripcion: 'Compartir fraterno entre jóvenes de diferentes zonas'
      },
      {
        src: '/images/actividades/retiro-nacional/retiro-5.jpg',
        alt: 'Talleres de formación espiritual',
        descripcion: 'Formación en espiritualidad vicenciana y mariana'
      },
      {
        src: '/images/actividades/retiro-nacional/retiro-6.jpg',
        alt: 'Renovación de compromisos',
        descripcion: 'Ceremonia de renovación de compromisos vicencianos'
      }
    ]
  },
  {
    id: 'encuentros-nacionales',
    titulo: 'Encuentros Nacionales',
    descripcion: 'Reunión masiva anual que congrega a miles de jóvenes vicencianos de todo Ecuador.',
    ubicacion: 'Coliseo Nacional, Quito',
    participantes: 2500,
    fecha: 'Noviembre 2024',
    categoria: 'Nacional',
    color: 'from-red-600 to-red-800',
    imagenes: [
      {
        src: '/images/actividades/encuentros-nacionales/encuentro-1.jpg',
        alt: 'Inauguración del Encuentro Nacional',
        descripcion: 'Ceremonia de apertura con miles de jóvenes'
      },
      {
        src: '/images/actividades/encuentros-nacionales/encuentro-2.jpg',
        alt: 'Presentaciones artísticas',
        descripcion: 'Grupos musicales y de danza de diferentes regiones'
      },
      {
        src: '/images/actividades/encuentros-nacionales/encuentro-3.jpg',
        alt: 'Conferencias magistrales',
        descripcion: 'Charlas formativas sobre liderazgo juvenil cristiano'
      },
      {
        src: '/images/actividades/encuentros-nacionales/encuentro-4.jpg',
        alt: 'Talleres formativos',
        descripcion: 'Espacios de aprendizaje y crecimiento personal'
      },
      {
        src: '/images/actividades/encuentros-nacionales/encuentro-5.jpg',
        alt: 'Vigilia de oración',
        descripcion: 'Noche de adoración y reflexión comunitaria'
      },
      {
        src: '/images/actividades/encuentros-nacionales/encuentro-6.jpg',
        alt: 'Envío misionero',
        descripcion: 'Bendición final y envío a las comunidades'
      }
    ]
  },
  {
    id: 'encuentros-zonales',
    titulo: 'Encuentros Zonales',
    descripcion: 'Reuniones regionales que fortalecen los lazos comunitarios entre jóvenes de cada zona pastoral.',
    ubicacion: 'Diferentes ciudades por zona',
    participantes: 400,
    fecha: 'Durante todo el año',
    categoria: 'Regional',
    color: 'from-green-600 to-green-800',
    imagenes: [
      {
        src: '/images/actividades/encuentros-zonales/zonal-1.jpg',
        alt: 'Encuentro Zona Norte',
        descripcion: 'Jóvenes de Carchi, Imbabura y Pichincha'
      },
      {
        src: '/images/actividades/encuentros-zonales/zonal-2.jpg',
        alt: 'Encuentro Zona Centro',
        descripcion: 'Participantes de Tungurahua y Chimborazo'
      },
      {
        src: '/images/actividades/encuentros-zonales/zonal-3.jpg',
        alt: 'Encuentro Zona Sur',
        descripcion: 'Jóvenes de Azuay, Cañar y Loja'
      },
      {
        src: '/images/actividades/encuentros-zonales/zonal-4.jpg',
        alt: 'Encuentro Zona Costa',
        descripcion: 'Participantes de Guayas, Manabí y Los Ríos'
      },
      {
        src: '/images/actividades/encuentros-zonales/zonal-5.jpg',
        alt: 'Encuentro Zona Oriente',
        descripcion: 'Jóvenes de las provincias amazónicas'
      },
      {
        src: '/images/actividades/encuentros-zonales/zonal-6.jpg',
        alt: 'Intercambio cultural zonal',
        descripcion: 'Presentación de tradiciones locales de cada región'
      }
    ]
  },
  {
    id: 'campamentos',
    titulo: 'Campamentos',
    descripcion: 'Experiencias de aventura y hermandad en contacto con la naturaleza, fortaleciendo vínculos comunitarios.',
    ubicacion: 'Diversos destinos naturales',
    participantes: 180,
    fecha: 'Vacaciones escolares',
    categoria: 'Aventura',
    color: 'from-yellow-600 to-orange-700',
    imagenes: [
      {
        src: '/images/actividades/campamentos/campamento-1.jpg',
        alt: 'Campamento en la sierra',
        descripcion: 'Actividades al aire libre en los Andes ecuatorianos'
      },
      {
        src: '/images/actividades/campamentos/campamento-2.jpg',
        alt: 'Fogata nocturna',
        descripcion: 'Compartir de testimonios y cantos alrededor del fuego'
      },
      {
        src: '/images/actividades/campamentos/campamento-3.jpg',
        alt: 'Deportes extremos',
        descripcion: 'Rappel, canopy y actividades de aventura'
      },
      {
        src: '/images/actividades/campamentos/campamento-4.jpg',
        alt: 'Juegos cooperativos',
        descripcion: 'Dinámicas que fortalecen el trabajo en equipo'
      },
      {
        src: '/images/actividades/campamentos/campamento-5.jpg',
        alt: 'Misa al aire libre',
        descripcion: 'Celebración eucarística en medio de la naturaleza'
      },
      {
        src: '/images/actividades/campamentos/campamento-6.jpg',
        alt: 'Reflexión grupal',
        descripcion: 'Momentos de introspección y crecimiento personal'
      }
    ]
  },
  {
    id: 'asamblea-nacional',
    titulo: 'Asamblea Nacional',
    descripcion: 'Máximo órgano de decisión donde se define el rumbo y las políticas de JMV Ecuador.',
    ubicacion: 'Sede Nacional JMV',
    participantes: 120,
    fecha: 'Septiembre 2024',
    categoria: 'Institucional',
    color: 'from-purple-600 to-purple-800',
    imagenes: [
      {
        src: '/images/actividades/asamblea/asamblea-1.jpg',
        alt: 'Sesión plenaria de la Asamblea',
        descripcion: 'Representantes de todas las zonas en sesión formal'
      },
      {
        src: '/images/actividades/asamblea/asamblea-2.jpg',
        alt: 'Presentación de informes',
        descripcion: 'Rendición de cuentas de la gestión nacional'
      },
      {
        src: '/images/actividades/asamblea/asamblea-3.jpg',
        alt: 'Debates y propuestas',
        descripcion: 'Discusión democrática de iniciativas juveniles'
      },
      {
        src: '/images/actividades/asamblea/asamblea-4.jpg',
        alt: 'Elección de directivos',
        descripcion: 'Proceso democrático de elección de líderes'
      },
      {
        src: '/images/actividades/asamblea/asamblea-5.jpg',
        alt: 'Aprobación de estatutos',
        descripcion: 'Votación de modificaciones reglamentarias'
      },
      {
        src: '/images/actividades/asamblea/asamblea-6.jpg',
        alt: 'Clausura solemne',
        descripcion: 'Ceremonia de cierre con nuevos compromisos'
      }
    ]
  },
  {
    id: 'misiones',
    titulo: 'Misiones',
    descripcion: 'Actividades de servicio directo a comunidades vulnerables, llevando el amor de Cristo a los más necesitados.',
    ubicacion: 'Comunidades rurales y urbano-marginales',
    participantes: 250,
    fecha: 'Fines de semana del año',
    categoria: 'Servicio',
    color: 'from-teal-600 to-teal-800',
    imagenes: [
      {
        src: '/images/actividades/misiones/mision-1.jpg',
        alt: 'Brigada médica rural',
        descripcion: 'Atención médica gratuita en comunidades alejadas'
      },
      {
        src: '/images/actividades/misiones/mision-2.jpg',
        alt: 'Construcción solidaria',
        descripcion: 'Mejoramiento de viviendas para familias necesitadas'
      },
      {
        src: '/images/actividades/misiones/mision-3.jpg',
        alt: 'Catequesis infantil',
        descripcion: 'Enseñanza religiosa y acompañamiento a niños'
      },
      {
        src: '/images/actividades/misiones/mision-4.jpg',
        alt: 'Reparto de alimentos',
        descripcion: 'Distribución de víveres en sectores vulnerables'
      },
      {
        src: '/images/actividades/misiones/mision-5.jpg',
        alt: 'Talleres educativos',
        descripcion: 'Refuerzo escolar y alfabetización de adultos'
      },
      {
        src: '/images/actividades/misiones/mision-6.jpg',
        alt: 'Celebración comunitaria',
        descripcion: 'Misa y festividades con las comunidades servidas'
      }
    ]
  }
]

interface Props {
  heroUrl?: string;
}

export default function ActividadesClient({ heroUrl = "/images/actividades/actividades-hero.jpg" }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [selectedActivity, setSelectedActivity] = useState<typeof actividades[0] | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('Todas')

  const categories = ['Todas', 'Espiritual', 'Nacional', 'Regional', 'Aventura', 'Institucional', 'Servicio']

  const filteredActividades = filterCategory === 'Todas' 
    ? actividades 
    : actividades.filter(act => act.categoria === filterCategory)

  const openLightbox = (activity: typeof actividades[0], imageIndex: number = 0) => {
    setSelectedActivity(activity)
    setLightboxIndex(imageIndex)
    setLightboxOpen(true)
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Background with Gradient Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-jmv z-10" />
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ backgroundImage: `url('${heroUrl}')` }}
          />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-20">
          <div className="absolute top-32 left-16 w-40 h-40 bg-white/10 rounded-full blur-xl animate-float" />
          <div
            className="absolute bottom-40 right-20 w-56 h-56 bg-jmv-gold/20 rounded-full blur-2xl animate-float"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-2/3 left-1/3 w-32 h-32 bg-jmv-red/20 rounded-full blur-lg animate-float"
            style={{ animationDelay: "4s" }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <ScrollReveal direction="fade" delay={50}>
            <div className="mb-8">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-8">
                <Camera className="w-4 h-4 mr-2 text-jmv-gold" />
                Nuestras Experiencias
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-jmv-gold to-white bg-clip-text text-transparent">
                Actividades
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl lg:text-4xl font-light">
                JMV Ecuador
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={150}>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-8 text-white/90 font-dancing max-w-5xl mx-auto">
              "Momentos únicos que transforman vidas y construyen comunidad 
              en el corazón de cada joven vicenciano"
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <p className="text-lg md:text-xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
              Descubre a través de imágenes las experiencias más significativas 
              que viven nuestros jóvenes a lo largo del año, desde retiros espirituales 
              hasta misiones de servicio social.
            </p>
          </ScrollReveal>

          {/* Activities Preview Stats */}
          <ScrollReveal direction="up" delay={250}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-jmv-gold mb-2">
                  6
                </div>
                <div className="text-white/70 text-sm">Tipos de Actividades</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-jmv-gold mb-2">
                  3,000+
                </div>
                <div className="text-white/70 text-sm">Participantes Anuales</div>
              </div>
              <div className="text-center sm:col-span-1 col-span-2">
                <div className="text-3xl md:text-4xl font-bold text-jmv-gold mb-2">
                  36
                </div>
                <div className="text-white/70 text-sm">Imágenes Destacadas</div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <div className="text-center">
              <p className="text-white/70 text-sm mb-4">
                Explora nuestra galería visual interactiva
              </p>
              <div className="inline-flex items-center text-jmv-gold hover:text-white transition-colors cursor-pointer">
                <span className="mr-2">Comenzar el recorrido visual</span>
                <ChevronDown className="w-5 h-5 animate-bounce" />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="relative py-12 bg-gradient-to-br from-jmv-blue-dark via-blue-800 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={50}>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">Filtrar por Categoría</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`px-4 py-2 rounded-full transition-all duration-300 ${
                      filterCategory === category
                        ? 'bg-jmv-gold text-white shadow-lg'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Activities Gallery Grid */}
      <section className="relative py-16 bg-gradient-to-br from-jmv-blue-dark via-blue-800 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dynamic Masonry Gallery */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filteredActividades.map((actividad, activityIndex) => (
              actividad.imagenes.map((imagen, imageIndex) => {
                const globalIndex = activityIndex * actividad.imagenes.length + imageIndex;
                
                // Dynamic sizing patterns for more natural gallery look
                const sizeVariations = [
                  { height: 'h-72', width: 'w-full' }, // Portrait medium
                  { height: 'h-96', width: 'w-full' }, // Portrait tall
                  { height: 'h-64', width: 'w-full' }, // Portrait short
                  { height: 'h-80', width: 'w-full' }, // Portrait standard
                  { height: 'h-60', width: 'w-full' }, // Square-ish
                  { height: 'h-[28rem]', width: 'w-full' }, // Very tall
                  { height: 'h-56', width: 'w-full' }, // Small
                  { height: 'h-[22rem]', width: 'w-full' }, // Medium-tall
                ];
                
                const currentSize = sizeVariations[globalIndex % sizeVariations.length];
                
                return (
                  <ScrollReveal key={`${actividad.id}-${imageIndex}`} direction="up" delay={50 + globalIndex * 25}>
                    <motion.div
                      className={`group relative overflow-hidden rounded-2xl cursor-pointer ${currentSize.height} ${currentSize.width} mb-4 break-inside-avoid`}
                      whileHover={{ scale: 1.02, zIndex: 10 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      onClick={() => openLightbox(actividad, imageIndex)}
                    >
                      {/* Background Image Placeholder */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-br opacity-90"
                        style={{
                          backgroundImage: `linear-gradient(135deg, 
                            ${actividad.color.includes('blue') ? '#3b82f6, #1e40af' : ''}
                            ${actividad.color.includes('red') ? '#ef4444, #dc2626' : ''}
                            ${actividad.color.includes('green') ? '#10b981, #059669' : ''}
                            ${actividad.color.includes('yellow') ? '#f59e0b, #d97706' : ''}
                            ${actividad.color.includes('purple') ? '#8b5cf6, #7c3aed' : ''}
                            ${actividad.color.includes('teal') ? '#14b8a6, #0d9488' : ''}
                          ), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ffffff" opacity="0.1" width="100" height="100"/></svg>')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />

                      {/* Realistic Image Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                      
                      {/* Activity Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r ${actividad.color} rounded-full shadow-lg`}>
                          {actividad.categoria}
                        </span>
                      </div>

                      {/* Image Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <h4 className="text-white font-bold text-sm mb-1 line-clamp-1">
                          {imagen.alt}
                        </h4>
                        <p className="text-white/80 text-xs mb-2 line-clamp-2">
                          {imagen.descripcion}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-jmv-gold text-xs font-medium">
                            {actividad.titulo}
                          </span>
                          <div className="flex items-center text-white/60 text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            {actividad.participantes}
                          </div>
                        </div>
                      </div>

                      {/* Hover Effects */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                            <Camera className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Photo Count for First Image */}
                      {imageIndex === 0 && (
                        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                          <span className="text-white text-xs font-medium">
                            +{actividad.imagenes.length - 1}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  </ScrollReveal>
                );
              })
            ))}
          </div>

          {/* Activity Cards for Context */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white text-center mb-8">
              Explora por Actividades
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActividades.map((actividad, index) => (
                <ScrollReveal key={`card-${actividad.id}`} direction="up" delay={100 + index * 50}>
                  <motion.div
                    className="group relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 cursor-pointer h-80"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => openLightbox(actividad, 0)}
                  >
                    {/* Card Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${actividad.color} opacity-80`} />
                    
                    {/* Card Content */}
                    <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-white/90 text-sm font-medium">
                            {actividad.categoria}
                          </span>
                          <span className="text-white/70 text-sm">
                            {actividad.imagenes.length} fotos
                          </span>
                        </div>
                        
                        <h4 className="text-xl font-bold text-white mb-2">
                          {actividad.titulo}
                        </h4>
                        <p className="text-white/80 text-sm line-clamp-3 mb-4">
                          {actividad.descripcion}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-white/70 text-sm">
                          <MapPin className="w-4 h-4 mr-2" />
                          {actividad.ubicacion}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-white/70">
                            <Users className="w-4 h-4 mr-1" />
                            {actividad.participantes} participantes
                          </div>
                          <div className="flex items-center text-white/70">
                            <Calendar className="w-4 h-4 mr-1" />
                            {actividad.fecha}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && selectedActivity && (
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={lightboxIndex}
            slides={selectedActivity.imagenes.map(img => ({
              src: img.src,
              alt: img.alt,
              description: img.descripcion
            }))}
            plugins={[Zoom, Fullscreen, Slideshow]}
            animation={{ fade: 300 }}
            zoom={{
              maxZoomPixelRatio: 3,
              scrollToZoom: true
            }}
            slideshow={{
              autoplay: false,
              delay: 3000
            }}
            controller={{ closeOnBackdropClick: true }}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
