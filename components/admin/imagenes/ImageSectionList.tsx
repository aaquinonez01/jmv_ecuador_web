"use client";

import Link from "next/link";
import { Section } from "@/types/admin/section";
import { ChevronRight } from "lucide-react";
import ProgressBar from "@/components/admin/ui/ProgressBar";

export interface ImageSectionListProps {
  sections: Section[];
}

export default function ImageSectionList({ sections }: ImageSectionListProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {sections.map((section) => {
        const uploadedImages = section.uploadedImages || 0;
        const totalImages = section.totalImages;
        const progress = (uploadedImages / totalImages) * 100;
        const isComplete = uploadedImages === totalImages;

        return (
          <Link
            key={section.id}
            href={`/admin/imagenes/${section.id}`}
            className="block bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-[#0066CC] hover:shadow-xl transition-all group"
          >
            <div className="flex items-start gap-5">
              {/* Icon */}
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#0066CC]/10 to-[#004C99]/10 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-3 transition-transform">
                {section.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#0066CC] transition-colors mb-1">
                      {section.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {section.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <div
                        className={`text-2xl font-bold ${
                          isComplete ? "text-green-600" : "text-[#0066CC]"
                        }`}
                      >
                        {uploadedImages}
                      </div>
                      <div className="text-xs text-gray-500">
                        de {totalImages}
                      </div>
                    </div>
                    {isComplete && (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-lg">✓</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <ProgressBar
                  progress={progress}
                  size="md"
                  color={isComplete ? "green" : "blue"}
                />

                {/* Subsections Info */}
                {section.hasSubsections && section.subsections && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {section.subsections.slice(0, 5).map((sub) => (
                      <span
                        key={sub.id}
                        className="text-xs bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1 rounded-full"
                      >
                        {sub.name}
                      </span>
                    ))}
                    {section.subsections.length > 5 && (
                      <span className="text-xs text-gray-500 px-3 py-1">
                        +{section.subsections.length - 5} más
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Arrow */}
              <ChevronRight className="w-7 h-7 text-gray-300 group-hover:text-[#0066CC] group-hover:translate-x-2 transition-all flex-shrink-0 self-center" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
