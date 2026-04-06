# Razorpay Integration Setup

## Frontend (.env.local)
```
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

## Get your Razorpay Keys
1. Visit: https://dashboard.razorpay.com/
2. Login to your account
3. Go to Settings → API Keys
4. Copy your Key ID (public key) and use it in .env.local

## Backend Routes Needed

The backend should have these endpoints for payment processing:

### 1. Create Razorpay Order
**POST** `/api/payment/create-razorpay-order`
- Auth: Required (Bearer token)
- Body:
  ```json
  {
    "orderId": "order_id_from_db",
    "amount": 5000,
    "currency": "INR"
  }
  ```
- Response:
  ```json
  {
    "razorpayOrderId": "order_xxxxxxxxx"
  }
  ```

### 2. Verify Razorpay Payment
**POST** `/api/payment/verify-razorpay`
- Auth: Required (Bearer token)
- Body:
  ```json
  {
    "orderId": "order_id_from_db",
    "razorpayPaymentId": "pay_xxxxxxxxx",
    "razorpayOrderId": "order_xxxxxxxxx",
    "razorpaySignature": "signature_xxxxxxxxx"
  }
  ```
- Response:
  ```json
  {
    "success": true,
    "message": "Payment verified"
  }
  ```

## Checkout Flow

1. **Cart** (`/cart`) - User reviews cart items
2. **Login Check** - Redirects to login if not authenticated
3. **Shipping** (`/checkout/shipping`) - Collect delivery address
4. **Review** (`/checkout/review`) - Review order before payment
5. **Payment** (`/checkout/payment`) - Razorpay payment gateway
6. **Confirmation** (`/order-confirmation`) - Order success page

## Environment Variables

Make sure these are set in your backend:
- `RAZORPAY_KEY_ID` - Your Razorpay public key
- `RAZORPAY_KEY_SECRET` - Your Razorpay secret key
- `RAZORPAY_WEBHOOK_SECRET` - For webhook signature verification (optional)

## Notes

- All checkout routes require authentication (user must be logged in)
- Cart is stored in localStorage initially
- Payment status updates come from Razorpay webhook verification
- Order details are fetched from MongoDB via backend API
