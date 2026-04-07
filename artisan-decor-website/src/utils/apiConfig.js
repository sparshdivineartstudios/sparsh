/**
 * Centralized API configuration
 * Handles environment-specific API URLs
 */

export const getAPIUrl = () => {
  // First priority: explicit env variable
  if (import.meta.env.VITE_API_URL) {
    console.log('📌 Using VITE_API_URL:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  // Second priority: Detect if running on production domain
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'sparshdivineartstudio.me' || hostname === 'www.sparshdivineartstudio.me') {
      console.log('📌 Using production domain:', hostname);
      return 'https://home-8zob.onrender.com';
    }
  }
  
  // Default: render backend
  console.log('📌 Using default render backend');
  return 'https://home-8zob.onrender.com';
};

// Use a getter to ensure we always fetch the latest URL
export const API_URL = getAPIUrl();
