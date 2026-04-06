/**
 * Convert Google Drive URLs to use backend proxy for CORS compatibility
 */
import { API_URL } from './apiConfig';

export const getProxyImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  const apiBase = API_URL;

  // If it's already a proxy URL, return as-is
  if (imageUrl.includes('/api/drive/file/')) {
    return imageUrl;
  }

  // Extract file ID from Google Drive URL
  // Formats: 
  // - https://drive.google.com/uc?id=FILE_ID
  // - https://drive.google.com/uc?export=view&id=FILE_ID
  // - FILE_ID directly
  let fileId = null;

  if (imageUrl.includes('drive.google.com')) {
    const match = imageUrl.match(/[?&]id=([^&]+)/);
    fileId = match ? match[1] : null;
  } else if (imageUrl.match(/^[a-zA-Z0-9_-]{20,}$/)) {
    // Looks like a bare file ID
    fileId = imageUrl;
  }

  if (fileId) {
    return `${apiBase}/api/drive/file/${fileId}`;
  }

  // Fall back to original URL if can't parse
  return imageUrl;
};
