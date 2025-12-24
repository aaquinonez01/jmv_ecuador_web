import type { User } from "@/types/user";

export const CURRENT_USER: User = {
  id: "maria-gonzalez",
  name: "María González",
  email: "maria.gonzalez@jmvecuador.org",
  role: "Coordinadora Zonal Norte",
  avatar: "/images/testimonials/maria.jpg",
  bio: "Apasionada por el servicio a los más necesitados y la formación de jóvenes. Coordinando la Zona Norte de JMV Ecuador desde 2020.",
  location: "Quito, Ecuador",
  zone: "Norte",
  joinedDate: "Enero 2020",
  stats: {
    posts: 5,
    followers: 234,
    following: 156,
  },
  social: {
    facebook: "https://facebook.com/mariagonzalez",
    instagram: "https://instagram.com/mariagonzalez",
  },
};

export const USERS: Record<string, User> = {
  "maria-gonzalez": CURRENT_USER,
  "carlos-mendoza": {
    id: "carlos-mendoza",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@jmvecuador.org",
    role: "Formador JMV",
    avatar: "/images/testimonials/carlos.jpg",
    bio: "Dedicado a la formación espiritual y el acompañamiento de jóvenes en su camino de fe.",
    location: "Guayaquil, Ecuador",
    zone: "Costa",
    joinedDate: "Marzo 2019",
    stats: {
      posts: 32,
      followers: 189,
      following: 142,
    },
  },
  "ana-rodriguez": {
    id: "ana-rodriguez",
    name: "Ana Rodríguez",
    email: "ana.rodriguez@jmvecuador.org",
    role: "Miembro JMV",
    avatar: "/images/testimonials/ana.jpg",
    bio: "Joven comprometida con el servicio a los más necesitados.",
    location: "Cuenca, Ecuador",
    zone: "Sur",
    joinedDate: "Julio 2021",
    stats: {
      posts: 18,
      followers: 95,
      following: 78,
    },
  },
  "pedro-silva": {
    id: "pedro-silva",
    name: "Pedro Silva",
    email: "pedro.silva@jmvecuador.org",
    role: "Coordinador Nacional",
    avatar: "/images/testimonials/pedro.jpg",
    bio: "Coordinador Nacional de JMV Ecuador. Trabajando por la juventud del país.",
    location: "Quito, Ecuador",
    zone: "Nacional",
    joinedDate: "Enero 2018",
    stats: {
      posts: 67,
      followers: 456,
      following: 234,
    },
    social: {
      facebook: "https://facebook.com/pedrosilva",
      instagram: "https://instagram.com/pedrosilva",
      twitter: "https://twitter.com/pedrosilva",
    },
  },
  "sofia-herrera": {
    id: "sofia-herrera",
    name: "Sofia Herrera",
    email: "sofia.herrera@jmvecuador.org",
    role: "Coordinadora Zonal Sur",
    avatar: "/images/testimonials/sofia.jpg",
    bio: "Coordinando la zona sur con amor y dedicación. La juventud es el presente de la Iglesia.",
    location: "Loja, Ecuador",
    zone: "Sur",
    joinedDate: "Junio 2019",
    stats: {
      posts: 41,
      followers: 298,
      following: 187,
    },
  },
  "diego-morales": {
    id: "diego-morales",
    name: "Diego Morales",
    email: "diego.morales@jmvecuador.org",
    role: "Formador JMV",
    avatar: "/images/testimonials/diego.jpg",
    bio: "Formador comprometido con el desarrollo integral de la juventud.",
    location: "Ambato, Ecuador",
    zone: "Centro",
    joinedDate: "Febrero 2020",
    stats: {
      posts: 28,
      followers: 167,
      following: 134,
    },
  },
  "carmen-vasquez": {
    id: "carmen-vasquez",
    name: "Carmen Vásquez",
    email: "carmen.vasquez@jmvecuador.org",
    role: "Coordinadora Nacional de Formación",
    avatar: "/images/testimonials/carmen.jpg",
    bio: "Responsable de la formación a nivel nacional. Cada joven es un tesoro para la Iglesia.",
    location: "Quito, Ecuador",
    zone: "Nacional",
    joinedDate: "Septiembre 2017",
    stats: {
      posts: 54,
      followers: 389,
      following: 245,
    },
  },
  "roberto-jimenez": {
    id: "roberto-jimenez",
    name: "Roberto Jiménez",
    email: "roberto.jimenez@jmvecuador.org",
    role: "Coordinador Zonal Oriente",
    avatar: "/images/testimonials/roberto.jpg",
    bio: "Sirviendo en la zona oriente con pasión y entrega.",
    location: "Puyo, Ecuador",
    zone: "Oriente",
    joinedDate: "Mayo 2020",
    stats: {
      posts: 35,
      followers: 201,
      following: 156,
    },
  },
  "patricia-lopez": {
    id: "patricia-lopez",
    name: "Patricia López",
    email: "patricia.lopez@jmvecuador.org",
    role: "Secretaria Nacional",
    avatar: "/images/testimonials/patricia.jpg",
    bio: "Secretaria Nacional de JMV Ecuador. Organizando y documentando nuestra misión.",
    location: "Quito, Ecuador",
    zone: "Nacional",
    joinedDate: "Abril 2019",
    stats: {
      posts: 29,
      followers: 178,
      following: 145,
    },
  },
  "luis-fernandez": {
    id: "luis-fernandez",
    name: "Luis Fernández",
    email: "luis.fernandez@jmvecuador.org",
    role: "Coordinador de Pastoral Juvenil",
    avatar: "/images/testimonials/luis.jpg",
    bio: "Coordinador de Pastoral Juvenil. Acompañando a los jóvenes en su crecimiento espiritual.",
    location: "Quito, Ecuador",
    zone: "Norte",
    joinedDate: "Noviembre 2018",
    stats: {
      posts: 38,
      followers: 256,
      following: 189,
    },
  },
};

export function getUserById(id: string): User | undefined {
  return USERS[id];
}

export function getAllUsers(): User[] {
  return Object.values(USERS);
}
