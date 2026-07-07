/// <reference types="vite/client" />
import axios from 'axios';

const defaultBaseURL = import.meta.env.PROD
  ? 'https://litam-ol1m.onrender.com/api'
  : '/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || defaultBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

