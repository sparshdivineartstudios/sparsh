# Instagram Feed Integration Setup

The Instagram Feed section has been successfully integrated into your Home page! This replaces the previous "Featured Products" section and now displays your latest Instagram posts.

**✨ Credentials are now stored securely in your Render backend — NOT in frontend .env files!**

## 📱 What Was Changed

- **Replaced**: Featured Products section on the Home page
- **Added**: Instagram Feed component that fetches posts from your backend
- **Features**:
  - Shows 4 Instagram posts in a responsive grid
  - Hover effects with post captions, likes, and comments count
  - Clicking a post opens it on Instagram
  - "Follow Us on Instagram" button redirects to your Instagram profile
  - Smooth animations and dark mode support

## 🔑 Backend Setup Required (Render)

The **frontend ONLY** calls your backend. No credentials are stored on the frontend!

### Step 1: Get Instagram Credentials

1. **Instagram User ID**: From [Facebook Graph API Tester](https://developers.facebook.com/tools/explorer/)
2. **Access Token**: Generate from [Facebook Developers Portal](https://developers.facebook.com/) with these permissions:
   - `instagram_business_content_publish`
   - `instagram_graph_user_media`

### Step 2: Add to Render Environment Variables

1. Go to your Render dashboard → Select your backend service
2. Go to **Settings → Environment**
3. Add these variables:
   ```
   INSTAGRAM_USER_ID=your_user_id_here
   INSTAGRAM_ACCESS_TOKEN=your_access_token_here
   ```
4. Save and redeploy your backend

### Step 3: Create Backend Endpoint

Add this endpoint to your Render backend (e.g., `routes/instagram.js`):

```javascript
const express = require('express');
const router = express.Router();
const axios = require('axios');

const INSTAGRAM_GRAPH_API = 'https://graph.instagram.com/v18.0';

/**
 * GET /api/instagram/posts
 * Fetches Instagram posts using credentials from backend env variables
 */
router.get('/posts', async (req, res) => {
  try {
    const { limit = 4 } = req.query;
    const userId = process.env.INSTAGRAM_USER_ID;
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!userId || !accessToken) {
      return res.status(400).json({ error: 'Instagram credentials not configured' });
    }

    // Fetch from Instagram Graph API
    const response = await axios.get(
      `${INSTAGRAM_GRAPH_API}/${userId}/media`,
      {
        params: {
          fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count',
          access_token: accessToken,
          limit: limit
        }
      }
    );

    // Filter and format posts
    const posts = (response.data.data || [])
      .filter(post => post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM')
      .map(post => ({
        id: post.id,
        image: post.media_url,
        caption: post.caption || '',
        link: post.permalink,
        timestamp: post.timestamp,
        likes: post.like_count || 0,
        comments: post.comments_count || 0,
      }));

    res.json({ data: posts });
  } catch (error) {
    console.error('Instagram API error:', error);
    res.status(500).json({ error: 'Failed to fetch Instagram posts' });
  }
});

module.exports = router;
```

### Step 4: Register Route in Your Backend

In your main `server.js` or `app.js`:

```javascript
const instagramRoutes = require('./routes/instagram');

app.use('/api/instagram', instagramRoutes);
```

### Step 5: Redeploy Backend

Push changes to Render:
```bash
git add .
git commit -m "Add Instagram API endpoint"
git push
```

## 📝 Architecture

```
Frontend (React)
    ↓
    └─ InstagramFeed component calls API_URL/api/instagram/posts
       ↓
Render Backend
    ↓
    └─ Backend fetches from Instagram Graph API using env variables
       (Discord credentials stay SECURE on backend)
       ↓
       Returns formatted posts to frontend
       ↓
Frontend renders posts
```

## 📝 File Structure

```
Frontend:
src/
├── components/
│   └── InstagramFeed.jsx          # Main Instagram Feed component
├── utils/
│   └── instagramAPI.js            # API utils (calls backend)
└── pages/
    └── Home.jsx                   # Uses Instagram Feed

Backend (Render):
routes/
└── instagram.js                   # Instagram Graph API endpoint
```

## 🎨 Component Props

The `InstagramFeed` component on frontend (simplified):

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `instagramHandle` | string | No | `sparshdivineartstudio` | Your Instagram username (for profile link) |
| `postsLimit` | number | No | `4` | Number of posts to display |

## 🚀 How It Works

1. **Frontend**: InstagramFeed component mounts
2. **Frontend**: Calls `API_URL/api/instagram/posts?limit=4`
3. **Backend**: Receives request, fetches posts from Instagram using env variables
4. **Backend**: Returns formatted posts to frontend
5. **Frontend**: Renders posts with animations

**Important**: Instagram credentials NEVER leave your Render backend!

## ✨ Features

### Post Card Interactions:
- **Hover**: Shows post caption, likes count, and comments count
- **Click**: Opens the post on Instagram (external link)
- **Instagram Icon**: Appears on hover to indicate it's clickable

### Follow Button:
- Large CTA button at bottom to follow your Instagram profile
- Also appears in the header next to the title

### Responsive Design:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 4 columns (if you show 4 posts)

## 🔧 Customization

To change the number of posts displayed (in frontend):
```jsx
<InstagramFeed 
  postsLimit={6}  // Change this number
/>
```

To change the Instagram handle (for the profile link):
```jsx
<InstagramFeed 
  instagramHandle="your_handle_here"
/>
```

## 🛡️ Security

✅ **Credentials stored ONLY on Render backend** (not in frontend code or git)
✅ **Frontend env files NOT committed** (.env.local is in .gitignore)
✅ **Backend makes direct API calls** to Instagram
✅ **Frontend never sees your access token**

## ⚡ API Rate Limits

Instagram Graph API rate limits:
- 200 calls per user per hour
- Frontend makes 1 API call per page load (very efficient!)

## 🐛 Troubleshooting

**No posts showing?**
- Check backend logs: `heroku logs --tail` (or Render equivalent)
- Verify env variables are set on Render dashboard
- Test endpoint directly: `curl https://your-backend.onrender.com/api/instagram/posts`

**Backend returning error?**
- Make sure INSTAGRAM_USER_ID and INSTAGRAM_ACCESS_TOKEN are set
- Verify access token is valid and not expired
- Check Instagram Business Account is connected to app

**CORS errors?**
- Make sure your backend allows requests from your frontend domain
- Add CORS headers if needed

## 📞 Support

- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-graph-api)
- [Render Environment Variables](https://render.com/docs/environment-variables)

