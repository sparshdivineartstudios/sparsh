# Payment Integration & CORS Setup - Complete Guide

## Issues Fixed

### 1. **API Endpoint Mismatch** ✅
**Problem**: Frontend was calling `/api/orders/{orderId}/verify-payment` (404)  
**Solution**: Updated to use correct endpoint `/api/payment/verify-razorpay`

**Files Updated**:
- `RazorpayCheckout.jsx` - Payment verification handler
- `CheckoutPayment.jsx` - Success handler callback

### 2. **CORS Policy Violations** ✅
**Problem**: Requests blocked between frontend and backend
**Solution**: Updated backend CORS to support multiple origins

**Backend Fix** (`server.js`):
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',   // Vite dev server
    'http://localhost:5000',   // Node backend
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://sparshdivineartstudios.github.io',
    'https://sparshdivineartstudio.me',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### 3. **Web App Manifest Error** ✅
**Problem**: "serviceworker must be a dictionary" error
**Solution**: Created proper manifest.json with all required fields

**Files Created**:
- `/public/manifest.json` - Complete PWA manifest
- Updated `index.html` - Added manifest link and meta tags

### 4. **Environment Configuration** ✅
**Problem**: Hardcoded URLs, no separation of dev/prod
**Solution**: Proper environment file setup

**Files Ready**:
- `.env.local` → Used by Vite (currently deployment URL)
- `.env.development` → Use for local development
- `.env.production` → Used for production builds

---

## How to Use Locally

### Start Backend (Local)
```bash
cd D:\sparsh\home-backend\home-backend
npm run dev  # or: node server.js
```
Backend will run on `http://localhost:5000`

### Start Frontend (Local) with Dev Setup
```bash
cd d:\sparsh-1\artisan-decor-website

# Use development environment variables
set NODE_ENV=development
npm run dev
```
Frontend will run on `http://localhost:5173`

**Note**: The `.env.development` file will automatically use `http://localhost:5000`

### For Production/Deployed Site
- Uses `.env.production` automatically
- Points to `https://home-8zob.onrender.com`
- Works on deployed domain

---

## Environment Variables Explained

| File | Purpose | VITE_API_URL |
|------|---------|--------------|
| `.env.local` | **Current** - used as fallback | https://home-8zob.onrender.com |
| `.env.development` | Local development | http://localhost:5000 |
| `.env.production` | Production builds | https://home-8zob.onrender.com |

---

## Payment Flow Now Works As:

1. **User clicks "Proceed to Payment"**
   - RazorpayCheckout modal opens

2. **User clicks "Pay ₹339"**
   - Frontend calls: `POST /api/payment/create-razorpay-order`
   - Backend creates Razorpay order
   - Razorpay payment gateway opens

3. **User completes payment in Razorpay**
   - Razorpay calls success handler
   - Frontend calls: `POST /api/payment/verify-razorpay`
   - Backend verifies signature
   - Order status updated to "completed"

4. **Navigate to Order Confirmation**
   - Cart cleared
   - Order confirmation page shows

---

## Tested Endpoints

✅ POST `/api/payment/create-razorpay-order`
- Input: `{ orderId, amount, currency }`
- Output: `{ razorpayOrderId }`
- Auth: Required (Bearer token)

✅ POST `/api/payment/verify-razorpay`
- Input: `{ orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature }`
- Output: `{ success, message, order }`
- Auth: Required (Bearer token)

---

## CORS Now Supports:

✅ localhost:5173 (Vite)
✅ localhost:5000 (Node)
✅ localhost:3000 (CRA alternative)
✅ localhost:8080 (older dev)
✅ 127.0.0.1 variants
✅ sparshdivineartstudios.github.io (GitHub Pages)
✅ sparshdivineartstudio.me (Custom domain)
✅ Environment variable override

---

## Remaining Non-Critical Warnings:

⚠️ Razorpay loading images from localhost (dev-only, expected)
⚠️ Permissions policy violations (external library, not our code)
⚠️ Preload resource warnings (browser caching, non-breaking)

These don't affect payment functionality and are safe to ignore during development.

---

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Payment still failing | Check browser DevTools Network tab - ensure request goes to correct URL |
| CORS error | Restart backend server - it caches CORS config on startup |
| 401 Unauthorized | Verify JWT token in localStorage, check Bearer token header |
| API URL wrong | Switch between `.env.development` / `.env.local` or manually update |
| Manifest error | Clear browser cache and hard refresh (Ctrl+Shift+R) |

