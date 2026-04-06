/**
 * Centralized API configuration
 * Handles environment-specific API URLs
 */

export const getAPIUrl = () => {
  // First priority: explicit env variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Second priority: Detect if running on production domain
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'sparshdivineartstudio.me' || hostname === 'www.sparshdivineartstudio.me') {
      return 'https://sparshdivineartstudio.me/api';
    }
  }
  
  // Default: local development
  return 'http://localhost:5000';
};

export const API_URL = getAPIUrl();
