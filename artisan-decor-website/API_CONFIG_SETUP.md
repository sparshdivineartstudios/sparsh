# API Configuration Setup

## Best Practice Implementation ✅

This project now uses environment-based API URL configuration to handle multiple deployment environments seamlessly.

### What Was Changed

1. **Created `.env` file** (Local Development)
   ```
   VITE_API_URL=http://localhost:5000
   ```

2. **Created `.env.production` file** (Production Deployment)
   ```
   VITE_API_URL=https://sparshdivineartstudio.me/api
   ```

3. **Created `src/utils/apiConfig.js`** - Centralized API Configuration
   - Reads environment variables via Vite's `import.meta.env`
   - Auto-detects production domain (sparshdivineartstudio.me)
   - Provides intelligent fallback to localhost:5000
   - Single source of truth for all API calls

4. **Updated All API-Using Files:**
   - ✅ `src/context/CartContext.jsx`
   - ✅ `src/context/AuthContext.jsx`
   - ✅ `src/pages/Register.jsx`
   - ✅ `src/pages/Products.jsx`
   - ✅ `src/pages/ProductDetails.jsx`
   - ✅ `src/utils/imageProxy.js`

### How It Works

**Environment Priority:**
1. Explicit `VITE_API_URL` environment variable
2. Auto-detection of production domain
3. Fallback to `http://localhost:5000`

### For Deployment

When deploying to production:
- Build the project: `npm run build`
- Vite automatically uses `.env.production` during the build
- Frontend will communicate with `https://sparshdivineartstudio.me/api`
- No code changes needed - just different env files!

### For Local Development

- The `.env` file sets `VITE_API_URL=http://localhost:5000`
- Your local dev server connects to local backend

### .env Files Security

- Added to `.gitignore` - sensitive data won't be committed
- `.env.production` contains production URLs (safe to commit)
- Never commit `.env` with real credentials/tokens

## No More Mixed Content Errors! 🎉

- **Before:** HTTP requests from HTTPS frontend → CORS & mixed content errors
- **After:** Automatic HTTPS on production, HTTP on local dev
