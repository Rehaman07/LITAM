/// <reference types="vite/client" />
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'https://litam-ol1m.onrender.com';

const api = axios.create({
  baseURL: `${API}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchPlacements = async (top?: number) => {
  const url = top ? `/student-placements/?top=${top}` : `/student-placements/`;
  const response = await api.get(url);
  return response.data;
};

export default api;
