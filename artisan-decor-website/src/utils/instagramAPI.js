/**
 * Instagram API Integration
 * Fetches posts from Instagram using Graph API through backend proxy
 * Credentials are stored in backend environment variables (Render)
 */

const INSTAGRAM_GRAPH_API = 'https://graph.instagram.com/v18.0';

/**
 * Fetch Instagram posts through backend proxy
 * @param {string} backendUrl - Your Render backend API URL
 * @param {number} limit - Number of posts to fetch (default: 4)
 * @returns {Promise<Array>} Array of Instagram posts with media_type, media_url, permalink, caption
 */
export const fetchInstagramPosts = async (backendUrl, limit = 4) => {
  try {
    if (!backendUrl) {
      throw new Error('Backend URL is required');
    }

    const response = await fetch(
      `${backendUrl}/api/instagram/posts?limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    // The backend returns already formatted posts
    return data.data || [];
  } catch (error) {
    // console.error('Error fetching Instagram posts:', error);
    return [];
  }
};

/**
 * Get Instagram profile URL
 * @param {string} instagramHandle - Instagram username/handle
 * @returns {string} Instagram profile URL
 */
export const getInstagramProfileUrl = (instagramHandle) => {
  return `https://www.instagram.com/${instagramHandle}`;
};
