/// <reference types="vite/client" />
import axios from "axios";
import type {
  ContactInquiryPayload,
  Course,
  EventItem,
  PlacementStats,
  SiteContent,
  StudentPlacement,
  TestimonialItem,
  UpdateItem,
  User,
} from "./types/api";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function asArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === "object" && "results" in payload) {
    const results = (payload as { results?: unknown }).results;
    return Array.isArray(results) ? (results as T[]) : [];
  }

  return [];
}

const api = axios.create({
  baseURL: `${API}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Updates & Legacy content
export async function fetchSiteContent(): Promise<SiteContent> {
  const response = await api.get<SiteContent>("/updates/content/");
  return response.data;
}

export async function fetchUpdates(params?: {
  search?: string;
  category?: string;
  limit?: number;
}): Promise<UpdateItem[]> {
  try {
    const response = await api.get<UpdateItem[]>("/updates/", { params });
    return asArray<UpdateItem>(response.data);
  } catch (error) {
    console.warn("Falling back to litam news API", error);
    const response = await api.get<UpdateItem[]>("/litam/news/", { params });
    return asArray<UpdateItem>(response.data);
  }
}

// LitAM Domain API calls
export async function fetchCourses(category?: string): Promise<Course[]> {
  const params = category ? { category } : undefined;
  const response = await api.get<Course[]>("/litam/courses/", { params });
  return asArray<Course>(response.data);
}

export async function fetchEvents(upcomingOnly = false): Promise<EventItem[]> {
  const params = upcomingOnly ? { upcoming: "true" } : undefined;
  const response = await api.get<EventItem[]>("/litam/events/", { params });
  return asArray<EventItem>(response.data);
}

export async function fetchTestimonials(): Promise<TestimonialItem[]> {
  const response = await api.get<TestimonialItem[]>("/litam/testimonials/");
  return asArray<TestimonialItem>(response.data);
}

export async function fetchStudentPlacements(top?: number): Promise<StudentPlacement[]> {
  const params = top !== undefined ? { top } : undefined;
  try {
    const response = await api.get<StudentPlacement[]>("/litam/student-placements/", { params });
    const data = asArray<StudentPlacement>(response.data);
    if (data.length > 0) return data;
  } catch (e) {
    console.warn("Fallback to updates student-placements", e);
  }
  const response = await api.get<StudentPlacement[]>("/updates/student-placements/", { params });
  return asArray<StudentPlacement>(response.data);
}

export async function fetchPlacementStats(): Promise<PlacementStats | null> {
  try {
    const response = await api.get<PlacementStats[]>("/litam/placements/");
    const list = asArray<PlacementStats>(response.data);
    return list.length > 0 ? list[0] : null;
  } catch {
    return null;
  }
}

export async function submitContactInquiry(data: ContactInquiryPayload): Promise<void> {
  const payload = {
    name: data.name,
    email: data.email || "",
    phone: data.phone,
    course_of_interest: data.course_of_interest || data.course || "General Inquiry",
    course: data.course || data.course_of_interest || "General Inquiry",
    message: data.message || "",
  };

  try {
    await api.post("/litam/inquiries/", payload);
  } catch (error) {
    console.warn("Litam inquiry post failed, calling fallback updates endpoint", error);
    await api.post("/updates/contact-inquiries/", payload);
  }
}

// User & Auth APIs
export async function loginUser(username: string, password: string): Promise<User> {
  const response = await api.post<User>("/litam/auth/login/", { username, password });
  return response.data;
}

export async function logoutUser(): Promise<void> {
  await api.post("/litam/auth/logout/");
}

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const response = await api.get<User>("/litam/auth/me/");
    return response.data;
  } catch {
    return null;
  }
}

/** @deprecated Use fetchStudentPlacements instead */
export const fetchPlacements = fetchStudentPlacements;

export default api;
