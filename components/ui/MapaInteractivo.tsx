'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Phone, Mail, MapPin, Users, Calendar, ExternalLink } from 'lucide-react'

// Fix para los iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

// Crear iconos personalizados para JMV
const createCustomIcon = (color: string, type: 'active' | 'zonal' | 'formation') => {
  const iconHtml = `
    <div style="
      background: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      font-size: 12px;
    ">
      ${type === 'active' ? 'JMV' : type === 'zonal' ? 'Z' : 'F'}
    </div>
  `
  
  return L.divIcon({
    html: iconHtml,
    className: 'custom-jmv-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  })
}

// Datos de las comunidades JMV en Ecuador
const comunidadesJMV = [
  // REGIÓN SIERRA NORTE
  {
    id: 1,
    nombre: "JMV Quito - Centro",
    tipo: 'zonal' as const,
    provincia: "Pichincha",
    ciudad: "Quito",
    direccion: "Av. 12 de Octubre N24-563 y Cordero",
    coordenadas: [-0.1807, -78.4678] as [number, number],
    coordinador: "Ana María Vásquez",
    telefono: "+593 99 456 7890",
    email: "quito@jmvecuador.org",
    miembros: 85,
    fundacion: "1995",
    actividades: ["Retiros", "Misiones urbanas", "Formación juvenil"],
    descripcion: "Comunidad fundadora y sede nacional de JMV Ecuador"
  },
  {
    id: 2,
    nombre: "JMV Ibarra",
    tipo: 'active' as const,
    provincia: "Imbabura",
    ciudad: "Ibarra",
    direccion: "Parroquia San Francisco",
    coordenadas: [0.3516, -78.1225] as [number, number],
    coordinador: "Carlos Andrade",
    telefono: "+593 98 765 4321",
    email: "ibarra@jmvecuador.org",
    miembros: 32,
    fundacion: "2001",
    actividades: ["Misiones rurales", "Catequesis", "Ayuda social"],
    descripcion: "Comunidad activa en la provincia de Imbabura"
  },
  {
    id: 3,
    nombre: "JMV Latacunga",
    tipo: 'active' as const,
    provincia: "Cotopaxi",
    ciudad: "Latacunga",
    direccion: "Parroquia La Catedral",
    coordenadas: [-0.9218, -78.6164] as [number, number],
    coordinador: "María José Torres",
    telefono: "+593 97 654 3210",
    email: "latacunga@jmvecuador.org",
    miembros: 28,
    fundacion: "2003",
    actividades: ["Campamentos", "Formación", "Misiones"],
    descripcion: "Comunidad comprometida con la juventud cotopaxi"
  },
  
  // REGIÓN SIERRA CENTRO
  {
    id: 4,
    nombre: "JMV Ambato",
    tipo: 'zonal' as const,
    provincia: "Tungurahua",
    ciudad: "Ambato",
    direccion: "Parroquia La Merced",
    coordenadas: [-1.2490, -78.6067] as [number, number],
    coordinador: "Diego Morales",
    telefono: "+593 96 543 2109",
    email: "ambato@jmvecuador.org",
    miembros: 64,
    fundacion: "1998",
    actividades: ["Retiros zonales", "Misiones", "Formación de líderes"],
    descripcion: "Centro zonal para la región sierra centro"
  },
  {
    id: 5,
    nombre: "JMV Riobamba",
    tipo: 'active' as const,
    provincia: "Chimborazo",
    ciudad: "Riobamba",
    direccion: "Parroquia San Alfonso",
    coordenadas: [-1.6635, -78.6547] as [number, number],
    coordinador: "Lucía Vega",
    telefono: "+593 95 432 1098",
    email: "riobamba@jmvecuador.org",
    miembros: 41,
    fundacion: "2000",
    actividades: ["Misiones indígenas", "Alfabetización", "Salud comunitaria"],
    descripcion: "Trabajo pastoral con comunidades indígenas"
  },
  
  // REGIÓN SIERRA SUR
  {
    id: 6,
    nombre: "JMV Cuenca",
    tipo: 'zonal' as const,
    provincia: "Azuay",
    ciudad: "Cuenca",
    direccion: "Parroquia El Sagrario",
    coordenadas: [-2.9001, -79.0059] as [number, number],
    coordinador: "Ana Lucía Morocho",
    telefono: "+593 94 321 0987",
    email: "cuenca@jmvecuador.org",
    miembros: 72,
    fundacion: "1997",
    actividades: ["Patrimonio cultural", "Misiones rurales", "Juventud universitaria"],
    descripcion: "Centro zonal para la región sierra sur"
  },
  {
    id: 7,
    nombre: "JMV Loja",
    tipo: 'active' as const,
    provincia: "Loja",
    ciudad: "Loja",
    direccion: "Catedral San José",
    coordenadas: [-3.9929, -79.2041] as [number, number],
    coordinador: "Fernando Ochoa",
    telefono: "+593 93 210 9876",
    email: "loja@jmvecuador.org",
    miembros: 35,
    fundacion: "2002",
    actividades: ["Frontera solidaria", "Educación popular", "Ecología"],
    descripcion: "Trabajo fronterizo y compromiso ecológico"
  },
  
  // REGIÓN COSTA
  {
    id: 8,
    nombre: "JMV Guayaquil",
    tipo: 'zonal' as const,
    provincia: "Guayas",
    ciudad: "Guayaquil",
    direccion: "Parroquia San Vicente de Paúl",
    coordenadas: [-2.1894, -79.8890] as [number, number],
    coordinador: "Roberto Salinas",
    telefono: "+593 92 109 8765",
    email: "guayaquil@jmvecuador.org",
    miembros: 96,
    fundacion: "1996",
    actividades: ["Misiones suburbanas", "Educación popular", "Microcréditos"],
    descripcion: "Centro zonal costa y trabajo en sectores marginales"
  },
  {
    id: 9,
    nombre: "JMV Manta",
    tipo: 'active' as const,
    provincia: "Manabí",
    ciudad: "Manta",
    direccion: "Parroquia La Merced",
    coordenadas: [-0.9677, -80.7088] as [number, number],
    coordinador: "Sandra Vélez",
    telefono: "+593 91 098 7654",
    email: "manta@jmvecuador.org",
    miembros: 29,
    fundacion: "2004",
    actividades: ["Pesca artesanal", "Mujeres emprendedoras", "Niñez"],
    descripcion: "Trabajo con comunidades pesqueras"
  },
  {
    id: 10,
    nombre: "JMV Machala",
    tipo: 'active' as const,
    provincia: "El Oro",
    ciudad: "Machala",
    direccion: "Catedral Sagrado Corazón",
    coordenadas: [-3.2581, -79.9553] as [number, number],
    coordinador: "Miguel Herrera",
    telefono: "+593 90 987 6543",
    email: "machala@jmvecuador.org",
    miembros: 38,
    fundacion: "1999",
    actividades: ["Agricultores", "Cooperativas", "Migración"],
    descripcion: "Apoyo a productores bananeros y migrantes"
  },
  
  // REGIÓN ORIENTE
  {
    id: 11,
    nombre: "JMV Puyo",
    tipo: 'active' as const,
    provincia: "Pastaza",
    ciudad: "Puyo",
    direccion: "Parroquia El Rosario",
    coordenadas: [-1.4835, -78.0069] as [number, number],
    coordinador: "Carmen Tanguila",
    telefono: "+593 89 876 5432",
    email: "puyo@jmvecuador.org",
    miembros: 24,
    fundacion: "2005",
    actividades: ["Pueblos originarios", "Conservación", "Turismo comunitario"],
    descripcion: "Trabajo intercultural amazónico"
  },
  {
    id: 12,
    nombre: "JMV Macas",
    tipo: 'formation' as const,
    provincia: "Morona Santiago",
    ciudad: "Macas",
    direccion: "Parroquia Purísima",
    coordenadas: [-2.3088, -78.1139] as [number, number],
    coordinador: "José Tankamash",
    telefono: "+593 88 765 4321",
    email: "macas@jmvecuador.org",
    miembros: 15,
    fundacion: "2008",
    actividades: ["Identidad shuar", "Medicina ancestral", "Defensa territorial"],
    descripcion: "Comunidad en formación con pueblos amazónicos"
  },
  
  // COMUNIDADES ADICIONALES
  {
    id: 13,
    nombre: "JMV Santo Domingo",
    tipo: 'active' as const,
    provincia: "Santo Domingo de los Tsáchilas",
    ciudad: "Santo Domingo",
    direccion: "Parroquia San Miguel",
    coordenadas: [-0.2533, -79.1745] as [number, number],
    coordinador: "Patricia Luna",
    telefono: "+593 87 654 3210",
    email: "santodomingo@jmvecuador.org",
    miembros: 43,
    fundacion: "2006",
    actividades: ["Jóvenes migrantes", "Capacitación técnica", "Deporte"],
    descripción: "Trabajo con jóvenes en situación de migración interna"
  }
]

// Límites geográficos de Ecuador (más ajustados)
const ECUADOR_BOUNDS: [[number, number], [number, number]] = [
  [1.67, -81.0],  // Esquina noreste (frontera Colombia, límite oeste Galápagos)
  [-5.01, -75.19] // Esquina suroeste (frontera Perú, límite este)
]

// Componente para configurar restricciones del mapa
function MapController() {
  const map = useMap()
  
  useEffect(() => {
    // Configurar límites máximos para Ecuador
    map.setMaxBounds(ECUADOR_BOUNDS)
    
    // Centrar el mapa en Ecuador
    map.setView([-1.8312, -78.1834], 7)
    
    // Configurar niveles de zoom (más cercano)
    map.setMinZoom(7)   // Zoom mínimo más cercano para ver solo Ecuador
    map.setMaxZoom(15)  // Zoom máximo para detalles locales
    
    // Ajustar la vista inicial a los límites de Ecuador (más ajustado)
    map.fitBounds(ECUADOR_BOUNDS, { 
      padding: [10, 10],  // Padding reducido para vista más cercana
      maxZoom: 8          // Zoom máximo al ajustar bounds
    })
  }, [map])
  
  return null
}

interface ComunidadPopupProps {
  comunidad: typeof comunidadesJMV[0]
}

function ComunidadPopup({ comunidad }: ComunidadPopupProps) {
  const tipoLabels = {
    active: 'Comunidad Activa',
    zonal: 'Sede Zonal', 
    formation: 'En Formación'
  }

  const tipoColors = {
    active: 'text-red-600',
    zonal: 'text-yellow-600',
    formation: 'text-blue-600'
  }

  return (
    <div className="p-4 max-w-sm">
      <div className="mb-3">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{comunidad.nombre}</h3>
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${tipoColors[comunidad.tipo]} bg-gray-100`}>
          {tipoLabels[comunidad.tipo]}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-start">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium">{comunidad.ciudad}, {comunidad.provincia}</div>
            <div className="text-xs">{comunidad.direccion}</div>
          </div>
        </div>
        
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{comunidad.miembros} miembros activos</span>
        </div>
        
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>Fundada en {comunidad.fundacion}</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-sm text-gray-700 mb-3">{comunidad.descripcion}</p>
        
        <div className="mb-3">
          <h4 className="font-semibold text-sm text-gray-800 mb-1">Actividades principales:</h4>
          <div className="flex flex-wrap gap-1">
            {comunidad.actividades.map((actividad, idx) => (
              <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {actividad}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
        <div className="flex items-center text-sm">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <span className="text-white font-bold text-xs">
              {comunidad.coordinador.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-800">{comunidad.coordinador}</div>
            <div className="text-xs text-gray-500">Coordinador/a</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <a 
            href={`tel:${comunidad.telefono}`}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Phone className="w-4 h-4 mr-2" />
            <span>{comunidad.telefono}</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
          
          <a 
            href={`mailto:${comunidad.email}`}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Mail className="w-4 h-4 mr-2" />
            <span>{comunidad.email}</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default function MapaInteractivo() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center">
        <div className="text-gray-600">Cargando mapa interactivo...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-96 rounded-2xl overflow-hidden shadow-lg">
      <MapContainer
        center={[-1.8312, -78.1834]}
        zoom={8}
        minZoom={7}
        maxZoom={15}
        maxBounds={ECUADOR_BOUNDS}
        bounceAtZoomLimits={true}
        style={{ height: '100%', width: '100%' }}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController />
        
        {comunidadesJMV.map((comunidad) => {
          const iconColor = {
            active: '#ef4444', // rojo
            zonal: '#f59e0b',  // dorado
            formation: '#3b82f6' // azul
          }[comunidad.tipo]
          
          return (
            <Marker
              key={comunidad.id}
              position={comunidad.coordenadas}
              icon={createCustomIcon(iconColor, comunidad.tipo)}
            >
              <Popup
                maxWidth={320}
                className="custom-popup"
              >
                <ComunidadPopup comunidad={comunidad} />
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}