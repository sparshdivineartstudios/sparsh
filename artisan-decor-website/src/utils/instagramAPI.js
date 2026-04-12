/**
 * Fetch Instagram posts through backend proxy
 */
export const fetchInstagramPosts = async (backendUrl, limit = 4) => {
  try {
    if (!backendUrl) throw new Error('Backend URL is missing in config');

    const response = await fetch(`${backendUrl}/api/instagram/posts?limit=${limit}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('❌ Instagram Fetch Error:', error.message);
    return [];
  }
};

export const getInstagramProfileUrl = (handle) => `https://www.instagram.com/${handle}`;