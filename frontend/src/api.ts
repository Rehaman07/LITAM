/// <reference types="vite/client" />
import axios from "axios";
import type {
  ContactInquiryPayload,
  SiteContent,
  StudentPlacement,
  UpdateItem,
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
});

export async function fetchSiteContent(): Promise<SiteContent> {
  const response = await api.get<SiteContent>("/updates/content/");
  return response.data;
}

export async function fetchUpdates(): Promise<UpdateItem[]> {
  const response = await api.get<UpdateItem[]>("/updates/");
  return asArray<UpdateItem>(response.data);
}

export async function fetchStudentPlacements(top?: number): Promise<StudentPlacement[]> {
  const params = top !== undefined ? { top } : undefined;
  const response = await api.get<StudentPlacement[]>("/updates/student-placements/", { params });
  return asArray<StudentPlacement>(response.data);
}

export async function submitContactInquiry(data: ContactInquiryPayload): Promise<void> {
  await api.post("/updates/contact-inquiries/", data);
}

/** @deprecated Use fetchStudentPlacements instead */
export const fetchPlacements = fetchStudentPlacements;

export default api;
