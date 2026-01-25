// API Configuration
// For local development, this will use localhost
// For production, set VITE_API_URL environment variable

export const API_URL = import.meta.env.VITE_API_URL || 'https://2ndstreet-backend.vercel.app/api';
