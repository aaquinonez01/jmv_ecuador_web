"use client";

import { useState } from "react";
import { MapPin, Users, Crown, Building, Phone, Mail, Map } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

interface ZonaConsejo {
  nombre: string;
  coordinador: string;
  provincias: string[];
  jovenes: number;
  contacto: {
    telefono: string;
    email: string;
  };
  descripcion: string;
}

const zonasData: ZonaConsejo[] = [
  {
    nombre: "Zona 1 y 2",
    coordinador: "María González",
    provincias: ["San Antonio", "El Oasis", "Rumiloma", "Quito"],
    jovenes: 350,
    contacto: {
      telefono: "+593 99 123 4567",
      email: "zona.norte@jmvecuador.org",
    },
    descripcion:
      "Zona que abarca la región del Ecuador, con fuerte presencia en Quito y ciudades principales.",
  },
  {
    nombre: "Zona 3",
    coordinador: "Carlos Pérez",
    provincias: ["Cotopaxi", "Tungurahua", "Chimborazo"],
    jovenes: 280,
    contacto: {
      telefono: "+593 99 234 5678",
      email: "zona.centronorte@jmvecuador.org",
    },
    descripcion:
      "Zona que abarca la región del Ecuador, con fuerte presencia en Quito y ciudades principales.",
  },
  {
    nombre: "Zona Centro",
    coordinador: "Ana Rodríguez",
    provincias: ["Bolívar", "Los Ríos", "Cañar"],
    jovenes: 220,
    contacto: {
      telefono: "+593 99 345 6789",
      email: "zona.centro@jmvecuador.org",
    },
    descripcion:
      "Zona central que conecta la sierra con la costa, rica en diversidad cultural.",
  },
  {
    nombre: "Zona 4",
    coordinador: "Diego Mora",
    provincias: ["Azuay", "Loja", "El Oro"],
    jovenes: 310,
    contacto: {
      telefono: "+593 99 456 7890",
      email: "zona.sur@jmvecuador.org",
    },
    descripcion:
      "Zona sur con fuerte identidad cultural y proyectos de migración y frontera.",
  },
  {
    nombre: "Zona 5",
    coordinador: "Lucía Torres",
    provincias: ["Esmeraldas", "Manabí", "Santo Domingo"],
    jovenes: 200,
    contacto: {
      telefono: "+593 99 567 8901",
      email: "zona.costanorte@jmvecuador.org",
    },
    descripcion:
      "Región costera norte con énfasis en comunidades afrodescendientes y rurales.",
  },
  {
    nombre: "Zona 6",
    coordinador: "Roberto Silva",
    provincias: ["Guayas", "Santa Elena"],
    jovenes: 420,
    contacto: {
      telefono: "+593 99 678 9012",
      email: "zona.costacentro@jmvecuador.org",
    },
    descripcion:
      "La zona más poblada, con sede en Guayaquil y gran diversidad de proyectos urbanos.",
  },
];

export default function ConsejoZonales() {
  const [selectedZona, setSelectedZona] = useState(0);

  return (
    <section id="consejos-zonales" className="py-20 relative overflow-hidden">
      {/* Previous section background that fades out */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom right, #1e3a8a, var(--jmv-blue-dark), var(--jmv-blue))",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)",
        }}
      />
      {/* Current section background */}
      <div className="absolute inset-0 bg-gradient-to-br from-jmv-blue-dark via-blue-800 to-blue-700" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <ScrollReveal direction="up" delay={50}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium mb-6">
              <Building className="w-5 h-5 mr-2" />
              Organización Territorial
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Consejos <span className="text-jmv-gold">Zonales</span>
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto">
              JMV Ecuador se organiza en 6 zonas pastorales que abarcan todo el
              territorio nacional, cada una con liderazgo local y proyectos
              específicos para su región.
            </p>
          </div>
        </ScrollReveal>

        {/* Zones Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {zonasData.map((zona, index) => (
            <ScrollReveal key={index} direction="up" delay={100 + index * 30}>
              <button
                onClick={() => setSelectedZona(index)}
                className={`p-6 rounded-xl border transition-all duration-300 text-left w-full group ${
                  selectedZona === index
                    ? "bg-white text-jmv-blue border-jmv-gold shadow-lg scale-105"
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:scale-102"
                }`}
              >
                <div className="flex items-center mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mr-3 ${
                      selectedZona === index
                        ? "bg-jmv-blue text-jmv-gold"
                        : "bg-jmv-gold/20 text-jmv-gold"
                    }`}
                  >
                    <Map className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{zona.nombre}</h3>
                    <p className="text-sm opacity-70">{zona.coordinador}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm">{zona.jovenes} jóvenes</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {zona.provincias.length} provincias
                    </span>
                  </div>
                </div>

                <div className="text-xs opacity-60">
                  {zona.provincias.join(", ")}
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>

        {/* Selected Zone Details */}
        <ScrollReveal direction="up" delay={200}>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Zone Info */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-jmv-gold to-jmv-gold-dark rounded-full flex items-center justify-center mr-4">
                    <Map className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">
                      {zonasData[selectedZona].nombre}
                    </h3>
                    <p className="text-jmv-gold font-medium">
                      {zonasData[selectedZona].descripcion}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <Crown className="w-5 h-5 text-jmv-gold mr-3" />
                    <div>
                      <p className="text-white font-medium">
                        Coordinador Zonal
                      </p>
                      <p className="text-white/70">
                        {zonasData[selectedZona].coordinador}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-jmv-gold mr-3" />
                    <div>
                      <p className="text-white font-medium">Jóvenes Activos</p>
                      <p className="text-white/70">
                        {zonasData[selectedZona].jovenes} miembros
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-jmv-gold mr-3 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Provincias</p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {zonasData[selectedZona].provincias.map(
                          (provincia, idx) => (
                            <div
                              key={idx}
                              className="bg-white/5 px-3 py-1 rounded-lg border border-white/10"
                            >
                              <span className="text-white/70 text-sm">
                                {provincia}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-3">
                    Contacto
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-jmv-gold mr-3" />
                      <span className="text-white/70 text-sm">
                        {zonasData[selectedZona].contacto.telefono}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-jmv-gold mr-3" />
                      <span className="text-white/70 text-sm">
                        {zonasData[selectedZona].contacto.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ecuador Map Placeholder */}
              <div className="flex items-center justify-center">
                <div className="w-full h-96 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-jmv-gold mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">
                      {zonasData[selectedZona].nombre}
                    </h4>
                    <p className="text-white/70">Mapa Interactivo</p>
                    <p className="text-white/50 text-sm mt-2">Próximamente</p>
                    <div className="mt-4 text-center">
                      <div className="inline-block bg-jmv-gold/20 px-4 py-2 rounded-lg border border-jmv-gold/30">
                        <p className="text-jmv-gold font-semibold">
                          {zonasData[selectedZona].jovenes}
                        </p>
                        <p className="text-white/60 text-sm">Jóvenes Activos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Summary Stats */}
        <ScrollReveal direction="up" delay={300}>
          <div className="mt-16 bg-gradient-to-r from-jmv-blue to-jmv-red rounded-2xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative text-center">
              <Building className="w-16 h-16 text-jmv-gold mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-white mb-6">
                Presencia Nacional
              </h3>

              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div>
                  <div className="text-4xl font-bold text-jmv-gold mb-2">
                    {zonasData
                      .reduce((total, zona) => total + zona.jovenes, 0)
                      .toLocaleString()}
                  </div>
                  <div className="text-white/80">
                    Jóvenes en todas las zonas
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-jmv-gold mb-2">
                    24
                  </div>
                  <div className="text-white/80">Provincias del Ecuador</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-jmv-gold mb-2">
                    30
                  </div>
                  <div className="text-white/80">Años de experiencia</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
