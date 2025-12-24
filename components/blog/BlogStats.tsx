"use client";

import {
  Users,
  BookOpen,
  Camera,
  FileText,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";

interface BlogStatsProps {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  categoryStats: {
    momentos: number;
    formacion: number;
    documentos: number;
  };
}

export default function BlogStats({
  totalPosts,
  totalLikes,
  totalComments,
  totalShares,
  categoryStats,
}: BlogStatsProps) {
  const stats = [
    {
      label: "Publicaciones",
      value: totalPosts,
      icon: BookOpen,
      color: "text-jmv-blue",
      bgColor: "bg-jmv-blue/10",
    },
    {
      label: "Me gusta",
      value: totalLikes,
      icon: Heart,
      color: "text-jmv-red",
      bgColor: "bg-jmv-red/10",
    },
    {
      label: "Comentarios",
      value: totalComments,
      icon: MessageCircle,
      color: "text-jmv-gold",
      bgColor: "bg-jmv-gold/10",
    },
    {
      label: "Compartidos",
      value: totalShares,
      icon: Share2,
      color: "text-jmv-blue",
      bgColor: "bg-jmv-blue/10",
    },
  ];

  const categoryData = [
    {
      name: "Momentos",
      count: categoryStats.momentos,
      icon: Camera,
      color: "text-jmv-gold",
      bgColor: "bg-jmv-gold/10",
    },
    {
      name: "Formación",
      count: categoryStats.formacion,
      icon: BookOpen,
      color: "text-jmv-blue",
      bgColor: "bg-jmv-blue/10",
    },
    {
      name: "Documentos",
      count: categoryStats.documentos,
      icon: FileText,
      color: "text-jmv-red",
      bgColor: "bg-jmv-red/10",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
      <h3 className="text-xl font-semibold text-jmv-blue mb-6 text-center">
        Estadísticas del Blog
      </h3>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="text-center">
              <div
                className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-2`}
              >
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Estadísticas por categoría */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4 text-center">
          Publicaciones por Categoría
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categoryData.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <div
                  className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${category.color}`} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {category.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {category.count} publicaciones
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
