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
  created_at: string;
}

export type SiteContent = Record<ContentSectionKey, UpdateItem[]>;

export interface StudentPlacement {
  id: number;
  student_name: string;
  company_name: string;
  package_lpa: string;
  photo: string | null;
  created_at: string;
}

export interface ContactInquiryPayload {
  name: string;
  email?: string;
  phone: string;
  course: string;
  message?: string;
}

export interface ContactInquiry extends ContactInquiryPayload {
  id: number;
  created_at: string;
}
