// For browser (client-side), use localhost
// For SSR (server-side), use container name
export const API_URL = typeof window !== 'undefined' 
  ? "http://localhost:5006" 
  : "http://backend:5006";
