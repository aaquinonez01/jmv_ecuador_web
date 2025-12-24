import Image from "next/image";
import { FileIcon, X } from "lucide-react";

export interface FilePreviewProps {
  file: File;
  url?: string;
  onRemove?: () => void;
  showMetadata?: boolean;
}

export default function FilePreview({
  file,
  url,
  onRemove,
  showMetadata = true,
}: FilePreviewProps) {
  const isImage = file.type.startsWith("image/");
  const fileSize = (file.size / 1024 / 1024).toFixed(2); // MB

  return (
    <div className="relative group border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50">
      {/* Preview */}
      <div className="relative aspect-video bg-gray-100">
        {isImage && url ? (
          <Image
            src={url}
            alt={file.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Remove Button */}
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            aria-label="Eliminar archivo"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Metadata */}
      {showMetadata && (
        <div className="p-3">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.name}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {fileSize} MB • {file.type.split("/")[1].toUpperCase()}
          </p>
        </div>
      )}
    </div>
  );
}
