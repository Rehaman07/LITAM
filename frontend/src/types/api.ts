export type ContentSectionKey =
  | "hero"
  | "notice"
  | "event"
  | "course"
  | "placement"
  | "recruiter"
  | "gallery"
  | "faculty"
  | "testimonial"
  | "student_life"
  | "about"
  | "stats"
  | "unique_feature"
  | "campus";

export interface UpdateItem {
  id: number;
  section: ContentSectionKey | string;
  title: string;
  message: string;
  image: string | null;
  attachment?: string | null;
  created_at: string;
}

export type SiteContent = Record<ContentSectionKey, UpdateItem[]>;

export interface Course {
  id: number;
  title: string;
  category: "BTECH" | "MTECH" | "DIPLOMA" | "POST_GRAD";
  code: string;
  duration: string;
  description: string;
  fee: string;
  eligibility: string;
  is_featured: boolean;
  created_at: string;
}

export interface EventItem {
  id: number;
  title: string;
  description: string;
  venue: string;
  date: string;
  image: string | null;
  is_featured: boolean;
  is_upcoming: boolean;
  created_at: string;
}

export interface TestimonialItem {
  id: number;
  quote: string;
  student_name: string;
  metadata: string;
  role_or_company: string;
  photo: string | null;
  rating: number;
  is_active: boolean;
  order: number;
  created_at: string;
}

export interface StudentPlacement {
  id: number;
  student_name: string;
  company_name: string;
  package_lpa: string;
  photo: string | null;
  year?: number;
  branch?: string;
  is_featured?: boolean;
  created_at: string;
}

export interface PlacementStats {
  id: number;
  highest_package: string;
  average_package: string;
  year: number;
  recruiters: number;
  training_hours: number;
  students_placed: number;
  created_at: string;
}

export interface ContactInquiryPayload {
  name: string;
  email?: string;
  phone: string;
  course_of_interest?: string;
  course?: string;
  message?: string;
}

export interface ContactInquiry extends ContactInquiryPayload {
  id: number;
  status: "NEW" | "PROCESSING" | "ANSWERED";
  timestamp: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: "ADMIN" | "ADMISSION_OFFICER" | "STUDENT";
  is_staff: boolean;
  is_superuser: boolean;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  description?: string;
  image: string | null;
  is_featured: boolean;
  created_at: string;
}

export type CampusGalleryItem = GalleryItem;
export type StudentGalleryItem = GalleryItem;

