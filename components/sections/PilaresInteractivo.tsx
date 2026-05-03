'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BookOpen,
  GraduationCap,
  HandHeart,
  Quote,
  Users,
  type LucideIcon,
} from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'

interface Pilar {
  id: string
  nombre: string
  subtitulo: string
  icono: LucideIcon
  imagen: string
  cita: { texto: string; fuente: string }
  descripcion: string[]
  puntos: { titulo: string; desc: string }[]
  destacados: { titulo: string; chips: string[] }
}

const pilares: Pilar[] = [
  {
    id: 'comunidad',
    nombre: 'Comunidad Juvenil',
    subtitulo: 'La pedagogía del encuentro',
    icono: Users,
    imagen:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80',
    cita: {
      texto:
        '"La multitud de los creyentes no tenía sino un solo corazón y una sola alma. No había entre ellos ningún necesitado."',
      fuente: 'Hechos 4, 32-35',
    },
    descripcion: [
      'JMV es un puente entre tú y tus compañeros. Un hogar donde te sientes acogido, caminas con otros y compartes la vida.',
      'Frente a una sociedad que despersonaliza, JMV nos invita a hacer la experiencia del grupo-comunidad: lugar para crecer, comprometernos con la causa de Jesús y servir a los pobres.',
    ],
    puntos: [
      {
        titulo: 'Pedagogía del encuentro',
        desc: 'Crece la confianza hasta que surge la pregunta: "¿qué hago para ser uno de ustedes?".',
      },
      {
        titulo: 'Etapas del grupo',
        desc: 'Nacimiento, infancia, adolescencia, juventud y adultez. Cada una con sus crisis y dones.',
      },
      {
        titulo: 'Ideal de comunidad',
        desc: 'Aceptar y valorar, dialogar, servir y proyectarse al entorno.',
      },
      {
        titulo: '"Morir para dar vida"',
        desc: 'Cuando un grupo termina, sus miembros siguen comprometidos en otros espacios de la Iglesia.',
      },
    ],
    destacados: {
      titulo: 'Las 5 etapas de un grupo',
      chips: ['Nacimiento', 'Infancia', 'Adolescencia', 'Juventud', 'Adultez'],
    },
  },
  {
    id: 'espiritualidad',
    nombre: 'Espiritualidad',
    subtitulo: 'Encuentro con Cristo vivo',
    icono: BookOpen,
    imagen:
      'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200&q=80',
    cita: {
      texto:
        '"Donde están dos o tres reunidos en mi nombre, allí estoy yo en medio de ellos."',
      fuente: 'Mateo 18, 20',
    },
    descripcion: [
      'Dentro del grupo no solo te encuentras con los otros, sino con el Otro. Como los discípulos de Emaús, descubres que alguien te ha estado acompañando desde el principio.',
      'Aprendemos a contemplar a Cristo "con María y desde María", y a contemplar "a Cristo en los pobres y a los pobres en Cristo".',
    ],
    puntos: [
      {
        titulo: 'Tiempos de oración',
        desc: 'Sagrada Escritura, lectio divina, meditación diaria del Evangelio y rezo del rosario.',
      },
      {
        titulo: 'Eucaristía',
        desc: 'Cumbre y fuente de toda la actividad de JMV: festiva, profunda y participativa.',
      },
      {
        titulo: 'Espiritualidad del Magníficat',
        desc: 'Alegría, agradecimiento y opción por los pobres y los débiles.',
      },
      {
        titulo: 'Herramientas para crecer',
        desc: 'Tu Proyecto Personal de Vida y un acompañante espiritual.',
      },
    ],
    destacados: {
      titulo: 'Las 4 virtudes',
      chips: ['Humildad', 'Obediencia', 'Caridad', 'Pureza'],
    },
  },
  {
    id: 'apostolado',
    nombre: 'Apostolado',
    subtitulo: 'Servir como el Buen Samaritano',
    icono: HandHeart,
    imagen:
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=80',
    cita: {
      texto:
        '"Servir a los pobres es servir a Jesucristo. El amor es infinitamente inventivo."',
      fuente: 'San Vicente de Paúl',
    },
    descripcion: [
      'Cuando descubres a Cristo vivo, buscas compartir ese tesoro con quienes te rodean: te haces apóstol y servidor.',
      'Con San Pablo: "¡Ay de mí si no anunciara el Evangelio!". Con San Vicente: "No me basta con amar a Dios, si mi prójimo no le ama".',
    ],
    puntos: [
      {
        titulo: 'Educa tu mirada',
        desc: '"Llegó junto a él y lo vio". Conocer la realidad de los pobres y mirarla a la cara.',
      },
      {
        titulo: 'Educa tu corazón',
        desc: '"Se llenó de compasión". Dejarte afectar por el sufrimiento, tener corazón de carne.',
      },
      {
        titulo: 'Educa tus manos',
        desc: '"Le vendó las heridas". Bajarse del caballo y ensuciarse las manos.',
      },
      {
        titulo: 'Asociarnos a otros',
        desc: '"Cuídalo". Unir esfuerzos con otros grupos para transformar la realidad.',
      },
    ],
    destacados: {
      titulo: 'Las 5 notas distintivas',
      chips: ['Eclesial', 'Laical', 'Mariana', 'Vicenciana', 'Misionera'],
    },
  },
  {
    id: 'formacion',
    nombre: 'Formación',
    subtitulo: 'Hasta que Cristo sea formado en ti',
    icono: GraduationCap,
    imagen:
      'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=1200&q=80',
    cita: {
      texto:
        '"Formar es engendrar a Jesús en los otros, o más bien engendrar a los otros para Cristo."',
      fuente: 'San Bernardo',
    },
    descripcion: [
      'Te conviertes como el barro en manos del alfarero. La meta: madurar en Cristo (Ef 4,13) para transformar el mundo desde el servicio a los pobres.',
      'Catequesis, encuentros, retiros, cursos: todo lo que te ayuda a crecer íntegramente como persona, cristiano y vicenciano.',
    ],
    puntos: [
      {
        titulo: 'Maduración humano-cristiana',
        desc: 'Valores, criterios, proyecto de vida y unificación entre fe y vida.',
      },
      {
        titulo: 'Experiencia comunitaria y eclesial',
        desc: 'Vida en grupos, integración progresiva en parroquia y diócesis.',
      },
      {
        titulo: 'Espiritualidad mariana-vicenciana',
        desc: 'Vivir y orar como María, asumiendo el Magníficat y el servicio.',
      },
      {
        titulo: 'Compromiso social y misionero',
        desc: 'Análisis crítico-creyente, acción apostólica y disponibilidad misionera.',
      },
    ],
    destacados: {
      titulo: 'La desembocadura vocacional',
      chips: ['Laico', 'Consagrado', 'Otras instancias', 'Misionero seglar'],
    },
  },
]

export default function PilaresInteractivo() {
  const [activo, setActivo] = useState(0)
  const pilar = pilares[activo]
  const Icon = pilar.icono
  const sectionRef = useRef<HTMLElement>(null)

  // Mapea los hashes del hero a índices del array
  const hashToIndex: Record<string, number> = {
    comunidad: 0,
    espiritualidad: 1,
    apostolado: 2,
    formacion: 3,
  }

  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.replace('#', '')
      const idx = hashToIndex[hash]
      if (idx !== undefined) {
        setActivo(idx)
        // Pequeño delay para esperar que el DOM se actualice antes de scrollear
        setTimeout(() => {
          sectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }, 50)
      }
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section
      ref={sectionRef}
      id="pilares"
      className="relative overflow-hidden bg-gradient-to-br from-jmv-blue-dark via-blue-900 to-jmv-blue-dark py-16 sm:py-20"
    >
      <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-jmv-gold/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-jmv-red/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" delay={50}>
          <div className="mb-8 text-center sm:mb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-jmv-gold backdrop-blur">
              Fundamentos
            </span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Las cuatro <span className="text-jmv-gold">patas de la silla</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/75 sm:text-base">
              JMV es un hogar grande. Como una silla necesita sus cuatro patas
              para mantenerse firme, nuestra casa se sostiene sobre estos
              pilares. <em>&ldquo;Nadie puede poner otro cimiento que el ya
              puesto: Jesucristo&rdquo;</em> (1 Cor 3, 11).
            </p>
          </div>
        </ScrollReveal>

        {/* Tabs */}
        <ScrollReveal direction="up" delay={100}>
          <div className="mb-6 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
            {pilares.map((p, index) => {
              const PIcon = p.icono
              const selected = index === activo
              return (
                <button
                  key={p.id}
                  onClick={() => setActivo(index)}
                  className={`group flex items-center gap-3 rounded-xl border p-3 text-left transition-all sm:p-4 ${
                    selected
                      ? 'border-jmv-gold bg-jmv-gold/15 shadow-lg shadow-jmv-gold/10'
                      : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10'
                  } backdrop-blur`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all ${
                      selected
                        ? 'bg-jmv-gold text-jmv-blue-dark'
                        : 'bg-white/10 text-jmv-gold'
                    }`}
                  >
                    <PIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                      Pilar {index + 1}
                    </p>
                    <h3
                      className={`text-sm font-bold leading-tight sm:text-base ${
                        selected ? 'text-white' : 'text-white/80'
                      }`}
                    >
                      {p.nombre}
                    </h3>
                  </div>
                </button>
              )
            })}
          </div>
        </ScrollReveal>

        {/* Contenido del pilar activo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pilar.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="grid grid-cols-1 gap-6 overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur sm:p-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:p-8"
          >
            {/* Imagen */}
            <div className="relative h-56 overflow-hidden rounded-2xl sm:h-72 lg:h-auto lg:min-h-[480px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pilar.imagen}
                alt={pilar.nombre}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-jmv-blue-dark/95 via-jmv-blue-dark/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-jmv-gold text-jmv-blue-dark shadow-lg">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-jmv-gold">
                  Pilar {activo + 1}
                </p>
                <h3 className="text-2xl font-bold text-white sm:text-3xl">
                  {pilar.nombre}
                </h3>
                <p className="text-sm text-white/85">{pilar.subtitulo}</p>

                {/* Destacados (chips) */}
                <div className="mt-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-white/60">
                    {pilar.destacados.titulo}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {pilar.destacados.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-jmv-gold/40 bg-jmv-gold/10 px-2.5 py-0.5 text-[11px] font-semibold text-jmv-gold backdrop-blur"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido textual */}
            <div className="flex flex-col">
              {pilar.descripcion.map((parrafo, i) => (
                <p
                  key={i}
                  className={`text-base leading-7 text-white/85 sm:text-lg sm:leading-8 ${
                    i > 0 ? 'mt-3' : ''
                  }`}
                >
                  {parrafo}
                </p>
              ))}

              <div className="mt-5 rounded-xl border border-jmv-gold/20 bg-jmv-gold/5 p-4">
                <Quote className="mb-2 h-5 w-5 text-jmv-gold" />
                <blockquote className="text-sm italic leading-6 text-white/90">
                  {pilar.cita.texto}
                </blockquote>
                <cite className="mt-1 block text-xs font-semibold not-italic text-jmv-gold">
                  — {pilar.cita.fuente}
                </cite>
              </div>

              <ul className="mt-5 space-y-2.5">
                {pilar.puntos.map((punto, index) => (
                  <li
                    key={punto.titulo}
                    className="flex gap-3 rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/[0.07]"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-jmv-gold/20 text-xs font-bold text-jmv-gold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {punto.titulo}
                      </p>
                      <p className="text-xs leading-5 text-white/70 sm:text-sm sm:leading-6">
                        {punto.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
