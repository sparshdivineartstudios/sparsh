export const fetchInstagramPosts = async (backendUrl, limit = 4) => {
  try {
    const response = await fetch(`${backendUrl}/api/instagram/posts?limit=${limit}`);
    if (!response.ok) throw new Error('Backend failed');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Fetch Error:', error);
    return [];
  }
};

export const getInstagramProfileUrl = (handle) => `https://www.instagram.com/${handle}`;