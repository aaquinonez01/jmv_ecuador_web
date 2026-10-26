import type { SlotAspect } from "@/lib/site-images";

export const ALT_MIN = 3;
export const ALT_MAX = 300;
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const ASPECT_HINT: Record<SlotAspect, string> = {
  "16/9": "Horizontal (16:9)",
  "3/2": "Horizontal (3:2)",
  "4/5": "Vertical (4:5)",
  "1/1": "Cuadrada (1:1)",
};
