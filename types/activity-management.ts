export interface ActivityCatalogItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  active: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActivityRelation {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  icon?: string | null;
}

export interface ActivityImageItem {
  id: string;
  url: string;
  alt?: string | null;
  filename?: string | null;
  order: number;
}

export interface ActivityDocumentItem {
  id: string;
  name: string;
  fileUrl: string;
  fileType?: string | null;
  documentType?: string | null;
  order: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  summary?: string | null;
  location?: string | null;
  participantsLabel?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  coverImageUrl?: string | null;
  published: boolean;
  featured: boolean;
  showInActivitiesPage: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
  pillar?: ActivityRelation | null;
  type?: ActivityRelation | null;
  gallery: ActivityImageItem[];
}

export interface UpcomingActivityItem {
  id: string;
  title: string;
  summary?: string | null;
  description: string;
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  maxRegistrationDate?: string | null;
  externalUrl?: string | null;
  participantsLabel?: string | null;
  registrationStatus?: string | null;
  countdownTargetType?: string | null;
  coverImageUrl?: string | null;
  published: boolean;
  featuredInHome: boolean;
  showInHome: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
  pillar?: ActivityRelation | null;
  type?: ActivityRelation | null;
  documents: ActivityDocumentItem[];
}

export interface PaginatedResponse<T> {
  total: number;
  items: T[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  location?: string | null;
  quote: string;
  rating: number;
  imageUrl?: string | null;
  active: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TestimonialPayload {
  name: string;
  role: string;
  location?: string;
  quote: string;
  rating?: number;
  active?: boolean;
  displayOrder?: number;
  image?: File | null;
}

export interface ActivityCatalogPayload {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  icon?: string;
  active?: boolean;
}

export interface ActivityPayload {
  title: string;
  description: string;
  summary?: string;
  location?: string;
  participantsLabel?: string;
  startDate?: string;
  endDate?: string;
  pillarId?: string;
  typeId?: string;
  published?: boolean;
  featured?: boolean;
  showInActivitiesPage?: boolean;
  displayOrder?: number;
  coverImage?: File | null;
  gallery?: File[];
}

export type UpcomingRegistrationStatus =
  | "draft"
  | "programado"
  | "inscripciones_abiertas"
  | "inscripciones_cerradas"
  | "proximo";

export type UpcomingCountdownTarget = "event" | "registration_close";

export interface UpcomingDocumentInput {
  file: File;
  documentType: string;
}

export interface UpcomingActivityPayload {
  title: string;
  description: string;
  summary?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  maxRegistrationDate?: string;
  externalUrl?: string;
  participantsLabel?: string;
  registrationStatus?: UpcomingRegistrationStatus | string;
  countdownTargetType?: UpcomingCountdownTarget | string;
  pillarId?: string;
  typeId?: string;
  published?: boolean;
  featuredInHome?: boolean;
  showInHome?: boolean;
  displayOrder?: number;
  coverImage?: File | null;
  documents?: UpcomingDocumentInput[];
}
