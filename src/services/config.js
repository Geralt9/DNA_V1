/**
 * The single switch between mock data and the real API.
 * Set VITE_USE_MOCKS=false in .env to talk to the backend.
 */
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

// TODO(backend): set VITE_API_URL in .env to the deployed Express API (no trailing slash).
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/+$/, '');
