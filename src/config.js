// API Configuration
// For local development, this will use localhost
// For production, set VITE_API_URL environment variable

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
