# Security Guide - Sparsh Divine Art Studio

## 🚨 CRITICAL: You Committed Secrets to Public Git!

Your `.env.production` file containing the Razorpay key is exposed in your public GitHub repository.

### Immediate Actions Required:

#### 1. **Regenerate Razorpay Key** (URGENT!)
- Go to: https://dashboard.razorpay.com/settings/api-keys
- Delete the exposed key: `rzp_test_SaKx7Z7bvOLgZA`
- Generate a new test key
- Update in your hosting platform's environment variables (NOT in code)

#### 2. **Remove `.env.production` from Git History**

Option A - Using `git filter-branch` (recommended):
```bash
# Remove .env.production from entire git history
git filter-branch --tree-filter 'rm -f .env.production' HEAD

# Force push to update remote
git push --force (use with caution!)
```

Option B - Using BFG Repo-Cleaner (easier):
```bash
# Download BFG from https://rtyley.github.io/bfg-repo-cleaner/
bfg --delete-files .env.production
git reflog expire --expire=now --all
git gc --prune=now
git push --force
```

#### 3. **Add All `.env*` Files to `.gitignore`**
```bash
# Already done ✅
# Updated .gitignore to exclude all env files
```

---

## 🔐 Securely Store Secrets (FOREVER)

### Option 1: Vercel / Netlify / GitHub Pages Environment Variables
If hosting on these platforms, store in their Settings → Environment Variables:
- `VITE_API_URL`
- `VITE_RAZORPAY_KEY_ID` (NEW TEST KEY)

### Option 2: Docker Secrets or Hosting Platform
If using Docker/custom server:
```bash
# Pass as environment variables at deploy time
docker run -e VITE_API_URL=... -e VITE_RAZORPAY_KEY_ID=... app
```

### Option 3: GitHub Secrets (for CI/CD)
```yaml
# In .github/workflows/deploy.yml
env:
  VITE_API_URL: ${{ secrets.VITE_API_URL }}
  VITE_RAZORPAY_KEY_ID: ${{ secrets.VITE_RAZORPAY_KEY_ID }}
```

---

## ✅ What I've Fixed

### 1. Updated `.gitignore`
Added all env files to prevent future commits:
```
.env
.env.local
.env.*.local
.env.production
.env.development
.env.*.production
.env.*.development
```

### 2. Added Password Visibility Toggle
- **Login.jsx** ✅ Eye icon to show/hide password
- **Register.jsx** ✅ Eye icon to show/hide password

### 3. Enhanced Scroll-to-Top
- ✅ Auto scroll to top on route changes
- ✅ Visible button appears when scrolled down 300px
- ✅ Smooth scroll animation
- ✅ Works on all pages

---

## 🌐 About Making Repo Private After Deployment

**YES, you can make repo private after deployment** ✅

**Why it works:**
- Deployment files are already on your hosting server
- Git repo accessibility doesn't affect a deployed site
- Only future git pulls/clones would be blocked

**Things to consider:**
- CI/CD pipelines might break if they depend on GitHub access
- Collaborators lose access to the code
- You keep the benefit that committed secrets are still cached by GitHub

---

## 🛡️ Additional Security Recommendations

### 1. Use Environment-Specific Configs
```javascript
// ✅ Correct - reads from env at build time
const apiUrl = import.meta.env.VITE_API_URL

// ❌ Wrong - hardcoded secrets
const apiUrl = 'https://home-8zob.onrender.com'
const razorpayKey = 'rzp_test_...'
```

### 2. Review What's Exposed
Run this to see all env vars in your history:
```bash
git log --all --full-history -- .env.production | head -20
```

### 3. Audit GitHub for Exposed Secrets
- Go to: Settings → Security → Secret scanning
- GitHub will alert you if leaked credentials are detected

### 4. Monitor Your Razorpay Account
- Check transaction logs for unauthorized payments
- Set up webhook alerts for suspicious activity

### 5. Consider These Practices
- Never commit `.env*` files to ANY git repo
- Use `.gitignore` template: https://github.com/github/gitignore/blob/main/Node.gitignore
- Use secrets management tools for teams (HashiCorp Vault, AWS Secrets Manager)
- Rotate keys periodically (every 3-6 months)

---

## 📋 Deployment Checklist

Before deploying to sparshdivineartstudio.me:

- [ ] Regenerate Razorpay key
- [ ] Remove `.env.production` from git history
- [ ] Verify `.gitignore` includes all env files
- [ ] Set environment variables on hosting platform
- [ ] Test that Razorpay payment works with new key
- [ ] Run git history cleanup
- [ ] Force push to GitHub
- [ ] Rebuild and redeploy

---

## 🔍 Verify Security

After cleanup, verify secrets are gone:
```bash
# Search entire git history for api keys
git log --all -S "rzp_" 

# Should return NOTHING if cleanup was successful
# If it shows results, secrets are still in history!
```

---

## 📚 Resources

- [GitHub Security Best Practices](https://github.com/security)
- [Razorpay Security](https://razorpay.com/security-standards/)
- [OWASP Secret Management](https://owasp.org/www-community/attacks/Sensitive_Data_Exposure)
- [12 Factor App - Config](https://12factor.net/config)

---

**Status:** ⚠️ **ACTION REQUIRED** - Regenerate Razorpay key and clean git history
