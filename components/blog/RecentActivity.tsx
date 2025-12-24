"use client";

import {
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Camera,
  BookOpen,
  FileText,
} from "lucide-react";

interface ActivityItem {
  id: number;
  type: "like" | "comment" | "share" | "post";
  user: string;
  action: string;
  postTitle?: string;
  timestamp: string;
  category?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string, category?: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-4 h-4 text-jmv-red" />;
      case "comment":
        return <MessageCircle className="w-4 h-4 text-jmv-blue" />;
      case "share":
        return <Share2 className="w-4 h-4 text-jmv-gold" />;
      case "post":
        if (category === "Momentos")
          return <Camera className="w-4 h-4 text-jmv-gold" />;
        if (category === "Formación")
          return <BookOpen className="w-4 h-4 text-jmv-blue" />;
        if (category === "Documentos")
          return <FileText className="w-4 h-4 text-jmv-red" />;
        return <Camera className="w-4 h-4 text-jmv-blue" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "like":
        return "bg-jmv-red/10 text-jmv-red";
      case "comment":
        return "bg-jmv-blue/10 text-jmv-blue";
      case "share":
        return "bg-jmv-gold/10 text-jmv-gold";
      case "post":
        return "bg-jmv-blue/10 text-jmv-blue";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 xl:p-6 blog-content">
      <div className="flex items-center gap-3 mb-4 xl:mb-6">
        <div className="w-8 h-8 xl:w-10 xl:h-10 bg-jmv-blue/20 rounded-xl flex items-center justify-center">
          <Clock className="w-4 h-4 xl:w-5 xl:h-5 text-jmv-blue" />
        </div>
        <div>
          <h3 className="text-base xl:text-xl font-semibold text-jmv-blue">
            Actividad Reciente
          </h3>
          <p className="text-xs xl:text-sm text-gray-600">
            Lo que está pasando en JMV
          </p>
        </div>
      </div>

      <ul className="space-y-3 xl:space-y-4" role="list" aria-label="Lista de actividad reciente">
        {activities.map((activity) => (
          <li
            key={activity.id}
            className="flex items-start gap-2 xl:gap-3 p-2 xl:p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            role="listitem"
          >
            <div
              className={`w-6 h-6 xl:w-8 xl:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(
                activity.type
              )}`}
            >
              {getActivityIcon(activity.type, activity.category)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs xl:text-sm text-gray-900">
                <span className="font-medium text-jmv-blue">
                  {activity.user}
                </span>{" "}
                {activity.action}
                {activity.postTitle && (
                  <span className="font-medium text-gray-700">
                    {" "}
                    "{activity.postTitle}"
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                {activity.timestamp}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No hay actividad reciente</p>
        </div>
      )}
    </div>
  );
}
