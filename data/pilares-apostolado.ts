export type ApostoladoItem = {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  ubicacion?: string;
  beneficiarios?: number;
};

export const apostoladoItems: ApostoladoItem[] = [
  {
    id: "campamento",
    titulo: "Campamento Misionero",
    descripcion:
      "Jornadas de servicio en comunidades rurales con jóvenes comprometidos.",
    imagen: "/images/events/evento_campamento.jpg",
    ubicacion: "Sierra ecuatoriana",
    beneficiarios: 180,
  },
  {
    id: "asamblea",
    titulo: "Asamblea Nacional 2024",
    descripcion:
      "Encuentro nacional para fortalecer el carisma vicenciano entre los jóvenes.",
    imagen: "/images/gallery/asamblea_2024.jpg",
    ubicacion: "Quito",
    beneficiarios: 250,
  },
  {
    id: "encuentro",
    titulo: "Encuentro Nacional 2025",
    descripcion:
      "Espacio de formación, oración y servicio para jóvenes vicencianos del país.",
    imagen: "/images/gallery/encuentro_nacional_2025.jpg",
    ubicacion: "Guayaquil",
    beneficiarios: 320,
  },
  {
    id: "adoracion",
    titulo: "Adoración del Santísimo",
    descripcion:
      "Momento espiritual que sostiene el compromiso apostólico de la juventud.",
    imagen: "/images/gallery/adoracion_santisimo.jpeg",
    ubicacion: "Casa de Retiros San Vicente de Paúl",
    beneficiarios: 90,
  },
];
