/// <reference types="vite/client" />
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'https://litam-ol1m.onrender.com';

const api = axios.create({
  baseURL: `${API}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

