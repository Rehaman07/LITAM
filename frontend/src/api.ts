/// <reference types="vite/client" />
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: `${API}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchPlacements = async (top?: number) => {
  const url = `/litam/placements/`;
  const response = await api.get(url);
  // Optional: slice if top is provided
  return top ? response.data.slice(0, top) : response.data;
};

export const fetchCourses = async () => {
  const response = await api.get('/litam/courses/');
  return response.data;
};

export default api;
