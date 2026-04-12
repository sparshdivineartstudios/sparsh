# Render Backend Instagram Setup Guide

## 🔧 Backend Endpoint Setup (Render)

Copy this complete endpoint code to your Render backend.

### Step 1: Create `/routes/instagram.js` file

```javascript
const express = require('express');
const router = express.Router();
const axios = require('axios');

const INSTAGRAM_GRAPH_API = 'https://graph.instagram.com/v18.0';

/**
 * GET /api/instagram/posts
 * Fetches Instagram posts using credentials from backend env variables
 * 
 * Query Parameters:
 * - limit: Number of posts to fetch (default: 4, max: 50)
 * 
 * Response:
 * {
 *   "data": [
 *     { id, image, caption, link, timestamp, likes, comments }
 *   ]
 * }
 */
router.get('/posts', async (req, res) => {
  try {
    const { limit = 4 } = req.query;
    const userId = process.env.INSTAGRAM_USER_ID;
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    // Validate env variables exist
    if (!userId || !accessToken) {
      console.error('Missing Instagram credentials in environment variables');
      return res.status(400).json({ 
        error: 'Instagram credentials not configured',
        data: [] 
      });
    }

    // Fetch from Instagram Graph API
    const response = await axios.get(
      `${INSTAGRAM_GRAPH_API}/${userId}/media`,
      {
        params: {
          fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count',
          access_token: accessToken,
          limit: Math.min(limit, 50) // Max 50 posts
        }
      }
    );

    // Filter only image/carousel posts and format
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
    console.error('Instagram API error:', error.message);
    
    // Return empty array instead of error (frontend handles gracefully)
    return res.status(200).json({ 
      data: [],
      error: error.message 
    });
  }
});

module.exports = router;
```

### Step 2: Register Route in Your Main Server File

In your `server.js` or `app.js` (wherever you register other routes):

```javascript
// ... other imports
const instagramRoutes = require('./routes/instagram');

// ... other middleware like cors, bodyParser, etc

// Register Instagram route
app.use('/api/instagram', instagramRoutes);

// ... rest of your server setup
```

### Step 3: Add Environment Variables to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Select your backend service
3. Click on **Settings**
4. Go to **Environment**
5. Add these two variables:

| Key | Value |
|-----|-------|
| `INSTAGRAM_USER_ID` | Your Instagram Business Account ID |
| `INSTAGRAM_ACCESS_TOKEN` | Your long-lived access token |

Example:
```
INSTAGRAM_USER_ID=17841405822304914
INSTAGRAM_ACCESS_TOKEN=IGQVJYOWc1UEg2...
```

### Step 4: Test Locally (Optional)

Before pushing to Render, test locally:

```bash
# Create a .env file in backend root (don't commit!)
INSTAGRAM_USER_ID=your_id
INSTAGRAM_ACCESS_TOKEN=your_token

# Start your server
npm start

# Test the endpoint
curl "http://localhost:5000/api/instagram/posts?limit=4"
```

You should see Instagram posts returned as JSON.

### Step 5: Push to Render

```bash
git add .
git commit -m "Add Instagram API endpoint"
git push origin main  # or your branch
```

Render will automatically redeploy with the new code and env variables.

### Step 6: Verify on Frontend

- Frontend automatically calls your backend endpoint
- No frontend env variables needed!
- Check browser console if posts don't appear
- The frontend is at: `Home.jsx` using `InstagramFeed` component

## 🔍 Testing the Endpoint

Once deployed, test from any browser:

```
https://your-render-backend.onrender.com/api/instagram/posts?limit=4
```

Expected response:
```json
{
  "data": [
    {
      "id": "123456",
      "image": "https://...",
      "caption": "Post caption here",
      "link": "https://instagram.com/p/...",
      "timestamp": "2024-04-12T10:30:00+0000",
      "likes": 150,
      "comments": 25
    }
  ]
}
```

## 🛡️ Security Checklist

- ✅ Credentials stored ONLY on Render (not in code)
- ✅ Credentials NEVER sent to frontend
- ✅ Frontend doesn't have access token
- ✅ .env files not committed to git
- ✅ Backend makes direct calls to Instagram API

## 📊 API Rate Limit

Instagram Graph API limit: **200 calls per user per hour**

Your frontend makes **1 call per page reload**, so rate limiting is very unlikely to be an issue.

## 🐛 Troubleshooting

**Backend returns empty data?**
```bash
# Check env variables are set
echo $INSTAGRAM_USER_ID
echo $INSTAGRAM_ACCESS_TOKEN

# Check Render logs
# Dashboard → Settings → Logs
```

**Access Token Expired?**
- Generate a new one from Facebook Developers
- Update on Render dashboard
- Redeploy

**CORS errors on frontend?**
- Add CORS headers to your Express server (if not already present):
```javascript
const cors = require('cors');
app.use(cors());
```

**Endpoint not found (404)?**
- Make sure route is registered in main server file
- Check the path matches: `/api/instagram/posts`

## 📝 Complete Server Setup Example

Here's a minimal complete setup if you're starting from scratch:

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const instagramRoutes = require('./routes/instagram');
app.use('/api/instagram', instagramRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

That's it! Your Instagram feed is now backend-secure! 🚀
