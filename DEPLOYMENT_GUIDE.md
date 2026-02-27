# CampusConnect Deployment Guide

Complete guide to deploy CampusConnect for free using:
- **Frontend**: Vercel (free tier)
- **Backend**: Render (free tier)
- **Database**: MongoDB Atlas (free M0 cluster)

> **Note**: Email verification is currently bypassed for v1 deployment. Users can sign up and login with any credentials without email verification. Email authentication will be re-added in a future release.

---

## Part 1: Pre-Deployment Setup

### 1.1 Environment Variables

You'll need to set up the following environment variables:
- `MONGODB_URI`: Your MongoDB connection string       // mongodb+srv://shubhamavhad0123:SNavhad@251021>@campustest01.xr3ttdt.mongodb.net/?appName=campustest01
- `JWT_SECRET`: A random 32+ character secret key for JWT signing   //9f565d5b03ebb7ad3f238ec2284eab3151fbb0451790d0eb7b9f5c71bc4b47ae
- `PORT`: Backend port (default: 5000)
- `CLIENT_URL`: Your frontend URL (updated after frontend deployment)    https://campus-connect-five-zeta.vercel.app/login

---

## Part 2: MongoDB Atlas Setup (Free Database)

1. **Create Account:**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Sign up with your email

2. **Create a Cluster:**
   - Click "Build a Cluster"
   - Select "M0" (free tier)
   - Choose any region near you
   - Click "Create Cluster" (takes ~3 minutes)

3. **Create Database User:**
   - Go to "Security" → "Database Access"
   - Click "Add New Database User"
   - Username: `campusconnect` (or any name)
   - Password: create a strong password, **save it**
   - Click "Add User"

4. **Allow Network Access:**
   - Go to "Security" → "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String:**
   - Go back to "Database"
   - Click "Connect" on your cluster
   - Select "Drivers" → "Node.js"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your credentials
   - Replace `myFirstDatabase` with `campusconnect`

   **Example:** `mongodb+srv://campusconnect:MyPassword123@cluster0.abc123.mongodb.net/campusconnect?retryWrites=true&w=majority`

   **Save this connection string** — you'll need it for Render.

---

## Part 3: Backend Deployment (Render)

### 3.1 Prepare Your Repository

1. **Commit all changes:**
   ```bash
   git add -A
   git commit -m "Remove email verification for v1 deployment"
   git push origin main
   ```

2. **Ensure your GitHub repo is public** (or private if you have Render Pro):
   - Go to GitHub → Your Repo → Settings → Visibility
   - Make it "Public" for free tier

### 3.2 Deploy to Render

1. **Go to render.com:**
   - Sign up with your GitHub account
   - Click "Connect Repository"
   - Select your CampusConnect repo

2. **Create Web Service:**
   - Click "New Web Service"
   - Select your repo
   - Configuration:
     - **Name**: `campusconnect-api` (or any name)
     - **Root Directory**: `backend`
     - **Runtime**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`

3. **Set Environment Variables:**
   - Click "Environment"
   - Add the following variables:

   ```
   MONGODB_URI=<your_mongodb_connection_string>
   JWT_SECRET=your_min_32_char_random_string_change_this_12345
   CLIENT_URL=http://localhost:5173
   PORT=5000
   NODE_ENV=production
   ```

   **For CLIENT_URL:** Leave as `http://localhost:5173` for now. Update it after deploying frontend.

4. **Deploy:**
   - Click "Deploy Web Service"
   - Wait 2-3 minutes for deployment
   - **Copy the Render URL** (e.g., `https://campusconnect-api.onrender.com`)
   - **Save this URL** — you'll need it for the frontend

### 3.3 Free Tier Sleep Warning

Free Render instances sleep after 15 minutes of inactivity. They'll wake up when you visit, but there's a ~30 sec delay. This is normal. To keep it awake, you can:
- Visit the API URL daily
- Use a free service like [UptimeRobot](https://uptimerobot.com) to ping it every 5 minutes

---

## Part 4: Frontend Deployment (Vercel)

### 4.1 Deploy to Vercel

1. **Go to vercel.com:**
   - Sign up with GitHub
   - Click "Import Project"
   - Select your CampusConnect repo

2. **Configure Project:**
   - **Root Directory**: `frontend`
   - Click "Deploy"
   - Wait 2-3 minutes

3. **After Deploy - Set Environment Variables:**
   - Go to "Settings" → "Environment Variables"
   - Add:
     ```
     VITE_API_URL=<your_render_backend_url>/api
     ```
     Example: `VITE_API_URL=https://campusconnect-api.onrender.com/api`

4. **Redeploy with New Env Var:**
   - Go to "Deployments"
   - Click "Redeploy" on the latest deployment
   - Or commit a dummy change to main to trigger redeploy

5. **Copy Vercel URL:**
   - Your frontend is now live at the Vercel URL (shown at top)
   - Example: `https://campusconnect.vercel.app`

### 4.2 Update Backend with Frontend URL

1. **Go back to Render:**
   - Dashboard → Your Web Service
   - Click "Environment"
   - Edit `CLIENT_URL` variable
   - Change to your Vercel URL: `https://campusconnect.vercel.app`
   - Click "Save"

2. **Auto-redeploy:**
   - Render will auto-redeploy with the new env var

---

## Part 5: Testing the Deployment

### 5.1 Test Backend APIs

Open Postman or use `curl`:

```bash
# Test API is up
curl https://campusconnect-api.onrender.com/api/auth/me

# Should return 401 (no token), which is expected
```

### 5.2 Test Student Signup

1. **Visit your Vercel frontend URL**
2. **Click "Sign up as Student"**
3. **Fill the form with any credentials and submit**
4. **Should be immediately logged in and redirected to home**

### 5.3 Test Alumni Signup

1. **Click "Register as Alumni"**
2. **Fill form with any credentials and submit**
3. **Should be immediately logged in to alumni portal**

### 5.4 Test Login

1. **Logout**
2. **Login with the credentials you created**
3. **Should be logged in successfully**

---

## Part 6: Post-Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Backend URL is set in frontend env vars
- [ ] Frontend URL is set in backend env vars
- [ ] Test signup as student
- [ ] Test signup as alumni
- [ ] Test login
- [ ] Test CORS (no "blocked by CORS" errors)
- [ ] **Share your live URL** with others!

---

## Part 7: Troubleshooting

### Issue: "MongoDB connection timeout"

**Solution:**
- Check connection string is correct
- Make sure IP whitelist includes `0.0.0.0/0`
- Check database user credentials
- Verify the database name in connection string is `campusconnect`

### Issue: Render instance keeps sleeping

**Solution:**
- Upgrade to Render Starter plan ($7/month, no sleep) or
- Use a free uptime monitor like [UptimeRobot](https://uptimerobot.com) to ping your backend every 5 minutes

### Issue: CORS errors in console

**Solution:**
- Verify `CLIENT_URL` env var on Render matches your Vercel URL exactly
- Vercel URL should include `https://` but no trailing slash

### Issue: 404 on frontend routes

**Solution:**
- Vercel needs to be configured to route all requests to index.html
- This usually auto-configures for React apps, but if not:
  - Create `vercel.json` in frontend root:
    ```json
    {
      "rewrites": [
        { "source": "/(.*)", "destination": "/index.html" }
      ]
    }
    ```
  - Commit and redeploy

---

## Part 8: Optional Upgrades

### Upgrade Backend (Remove Sleep)
- Render Starter Plan: $7/month, free tier has 15-min sleep timeout
- Railway: $5/month free credit
- Fly.io: Free tier with always-on option

### Upgrade Database
- MongoDB Atlas paid tiers: $57+/month for larger databases
- Current free tier: 512MB limit (enough for ~50k documents)

### Add Email Authentication (Future)
When you're ready to add email verification:
- Set up Gmail SMTP credentials (see old deployment guide)
- Re-enable OTP verification endpoints
- Update signup forms with OTP verification UI

---

## Summary

You now have:
✅ Immediate login without email verification
✅ Free deployment on Vercel + Render + MongoDB Atlas
✅ Live production URL to share with anyone

**Total Cost**: $0 (until you hit usage limits or want to remove sleep timeout)

Happy deploying! 🚀
