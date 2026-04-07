# Backend Setup on Render

For payment to work on the deployed site, make sure your Render backend has these environment variables set:

## Required Environment Variables on Render

```
RAZORPAY_KEY_ID=<your_razorpay_key_id>
RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>
MONGODB_URI=<your_mongodb_connection_string>
```

## Get Razorpay Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Navigate to **Settings → API Keys**
3. Copy:
   - **Key ID** (starts with `rzp_live_` or `rzp_test_`)
   - **Key Secret**

## Frontend Environment Variables

### For Local Testing

Create `.env.local` in the frontend:
```
VITE_API_URL=https://home-8zob.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_test_<your_test_key>
```

### For Production (Deployed)

Create `.env.production` in the frontend:
```
VITE_API_URL=https://home-8zob.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_live_<your_live_key>
```

## Troubleshooting

### Error: "Failed to fetch"

1. **Check Backend is Running**: Visit `https://home-8zob.onrender.com/api/orders` - should show some response
2. **Check Token**: Open DevTools → Application → Local Storage → Look for `token` key
3. **Check CORS**: Verify frontend URL is in backend CORS allowed origins
4. **Check Razorpay Keys**: Verify keys are set in Render environment variables

### Error: "Payment verification failed"

1. Razorpay key/secret might be wrong
2. Signature verification failing (check RAZORPAY_KEY_SECRET)
3. Order not found in database
