import OpengraphImage from "./opengraph-image";
import { SITE } from "@/lib/site";

// Misma imagen que Open Graph
export const alt = `${SITE.fullName}: ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default OpengraphImage;
