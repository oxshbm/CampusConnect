# CampusConnect - Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# If using MongoDB locally
mongod
```

Or update `MONGODB_URI` in `backend/.env` to use MongoDB Atlas.

### Step 3: Start Backend Server
```bash
npm run dev
```
You should see:
```
MongoDB connected: localhost
Server running on port 5000
```

### Step 4: In a New Terminal - Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 5: Start Frontend Server
```bash
npm run dev
```
You should see:
```
Local:   http://localhost:5173/
```

### Step 6: Open in Browser
Visit `http://localhost:5173` and you're ready to go!

## 📝 First Steps

1. **Sign Up** with test credentials:
   - Name: John Doe
   - Email: john@example.com
   - Password: test123
   - Course: Computer Science
   - Year: 2

2. **Create a Study Group**
   - Click "Create Group" in navbar
   - Fill in: Name, Subject, Description
   - Click "Save Group"

3. **Browse Other Groups**
   - Go to Home
   - Filter by subject or tags
   - Click "Join Group"

4. **View Your Profile**
   - Click "Profile" to see your details
   - Edit your information anytime

## 🧪 Test with Postman

**Login first to get a token:**
```
POST http://localhost:5000/api/auth/login
Body:
{
  "email": "john@example.com",
  "password": "test123"
}
```

**Response will contain a `token` - use it for all protected routes:**
```
Authorization: Bearer <your_token_here>
```

## 📁 Project Structure Overview

```
CampusConnect/
├── backend/          ← Express API
│   ├── controllers/  ← Business logic
│   ├── models/       ← MongoDB schemas (User, StudyGroup)
│   ├── routes/       ← API endpoints
│   ├── middleware/   ← JWT authentication
│   └── server.js     ← Express app
│
└── frontend/         ← React app
    ├── src/
    │   ├── api/      ← API client functions
    │   ├── pages/    ← Full pages (Login, Home, etc)
    │   ├── components/ ← Reusable components
    │   ├── context/  ← Auth state management
    │   └── App.jsx   ← Router setup
    └── vite.config.js
```

## 🔐 Environment Variables

**Backend** (`backend/.env`):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campusconnect
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
CLIENT_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```
VITE_API_URL=http://localhost:5000/api
```

## 🛠️ Available Scripts

**Backend:**
```bash
npm run dev    # Start server with nodemon
npm start      # Start server
```

**Frontend:**
```bash
npm run dev     # Start Vite dev server
npm run build   # Build for production
npm run preview # Preview production build
```

## ✅ Verification Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173
- [ ] Can sign up with new account
- [ ] Can log in with credentials
- [ ] Can browse public groups on home page
- [ ] Can create a new study group
- [ ] Can join a public group
- [ ] Can view group members
- [ ] Can leave a group
- [ ] Can log out
- [ ] Refreshing page keeps you logged in (token persisted)

## 🐛 Common Issues

**"Cannot POST /api/auth/signup"**
- Backend server not running
- Check if running on correct port

**"Network Error" in frontend**
- Frontend and backend not both running
- Check `VITE_API_URL` in frontend `.env`

**"MongoDB connection failed"**
- MongoDB not running
- Invalid `MONGODB_URI` in `.env`

**"Invalid token" error**
- Token expired (7 day expiry)
- Need to login again

## 📚 Full Documentation

See `README.md` for comprehensive documentation including:
- Detailed API endpoints
- Database schemas
- Security features
- Deployment guide
- Future enhancements

## 🎯 Next Steps

After verifying everything works:

1. Explore the codebase
2. Test all features in browser
3. Try API endpoints with Postman
4. Read through the implementation code
5. Consider the security checklist items

Happy coding! 🚀
