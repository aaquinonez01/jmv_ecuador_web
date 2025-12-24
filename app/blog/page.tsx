import { Metadata } from "next";
import BlogClient from "./BlogClient";
import "./blog.css";

export const metadata: Metadata = {
  title: "Comunidad JMV | Juventudes Marianas Vicencianas Ecuador",
  description:
    "Comparte momentos, documentos y experiencias con la comunidad de Juventudes Marianas Vicencianas Ecuador. Únete a nuestra red de jóvenes comprometidos.",
  keywords: [
    "JMV Ecuador",
    "blog",
    "comunidad",
    "jóvenes",
    "formación",
    "documentos",
  ],
};

export default function BlogPage() {
  // Los posts ahora se obtienen dinámicamente desde el backend mediante el hook usePostsData en BlogClient

  // Posts trending (simulados)
  const trendingPosts = [
    {
      id: 8,
      title: "Campamento juvenil en la montaña",
      author: "Roberto Jiménez",
      category: "Momentos",
      likes: 203,
      comments: 67,
      shares: 41,
      engagement: 311,
    },
    {
      id: 7,
      title: "Seminario de liderazgo juvenil",
      author: "Carmen Vásquez",
      category: "Formación",
      likes: 156,
      comments: 45,
      shares: 38,
      engagement: 239,
    },
    {
      id: 10,
      title: "Encuentro de jóvenes vicencianos",
      author: "Luis Fernández",
      category: "Momentos",
      likes: 134,
      comments: 42,
      shares: 29,
      engagement: 205,
    },
    {
      id: 6,
      title: "Retiro de fin de semana",
      author: "Diego Morales",
      category: "Momentos",
      likes: 89,
      comments: 31,
      shares: 22,
      engagement: 142,
    },
    {
      id: 5,
      title: "Jornada de formación con 50 jóvenes",
      author: "Sofia Herrera",
      category: "Momentos",
      likes: 67,
      comments: 23,
      shares: 15,
      engagement: 105,
    },
  ];

  // Actividad reciente simulada
  const recentActivity = [
    {
      id: 1,
      type: "like" as const,
      user: "Ana Rodríguez",
      action: "le gustó tu publicación",
      postTitle: "Retiro espiritual JMV Norte",
      timestamp: "hace 5 minutos",
    },
    {
      id: 2,
      type: "comment" as const,
      user: "Carlos Mendoza",
      action: "comentó en",
      postTitle: "Espiritualidad Vicenciana - Libro",
      timestamp: "hace 15 minutos",
    },
    {
      id: 3,
      type: "share" as const,
      user: "María González",
      action: "compartió",
      postTitle: "Metodología de trabajo con jóvenes",
      timestamp: "hace 1 hora",
    },
    {
      id: 4,
      type: "post" as const,
      user: "Pedro Silva",
      action: "publicó un nuevo",
      postTitle: "Asamblea Nacional JMV",
      timestamp: "hace 2 horas",
      category: "Momentos",
    },
    {
      id: 5,
      type: "like" as const,
      user: "Sofia Herrera",
      action: "le gustó tu publicación",
      postTitle: "Documento metodología",
      timestamp: "hace 3 horas",
    },
  ];

  return (
    <BlogClient
      trendingPosts={trendingPosts}
      recentActivity={recentActivity}
    />
  );
}
