import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_DOCKLY_API_URL || "https://us-cc.onrender.com/server/api";

console.log('🚀 ~ API_URL:', API_URL);
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}

if (!API_URL) {
  console.warn(
    '⚠️ API URL is missing. Define NEXT_PUBLIC_DOCKLY_API_URL in your environment variables. API calls will fail.'
  );
}

export const api = axios.create({
  baseURL: API_URL.endsWith('/') ? API_URL : `${API_URL}/`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30 seconds
});

api.interceptors.request.use(
  (config) => {
    // Auth
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('Dtoken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // 🔥 Start latency timer
    config.metadata = {
      startTime: performance.now(),
    };

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    const endTime = performance.now();
    const startTime = response.config.metadata?.startTime;

    if (startTime) {
      const duration = endTime - startTime;

      console.log(
        `API LATENCY → ${response.config.method?.toUpperCase()} ${response.config.url
        } : ${duration.toFixed(2)} ms`
      );
    }

    return response;
  },
  (error) => {
    if (error.config?.metadata?.startTime) {
      const duration = performance.now() - error.config.metadata.startTime;

      console.error(
        `API FAILED → ${error.config.method?.toUpperCase()} ${error.config.url
        } : ${duration.toFixed(2)} ms`
      );
    }

    return Promise.reject(error);
  }
);
