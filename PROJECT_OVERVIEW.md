# CampusConnect - Project Overview

## 🎯 What is CampusConnect?

A lightweight campus collaboration platform where students can:
- Discover study groups for their courses
- Create and manage study groups
- Join groups and connect with peers
- Find study partners based on course and interests

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CampusConnect MVP                         │
├──────────────────────────┬──────────────────────────────────┤
│      FRONTEND (React)     │       BACKEND (Express)         │
├──────────────────────────┼──────────────────────────────────┤
│                          │                                  │
│  ┌────────────────────┐  │   ┌──────────────────────────┐  │
│  │   User Interface   │  │   │   API Endpoints          │  │
│  │   - Pages          │  │   │   - /auth/*              │  │
│  │   - Components     │  │   │   - /groups/*            │  │
│  │   - Styling        │  │   │                          │  │
│  └────────────────────┘  │   └──────────────────────────┘  │
│           ↓              │              ↓                   │
│  ┌────────────────────┐  │   ┌──────────────────────────┐  │
│  │  State Management  │  │   │   Controllers            │  │
│  │  - Auth Context    │  │   │   - Auth Logic           │  │
│  │  - useGroups Hook  │  │   │   - Group Logic          │  │
│  └────────────────────┘  │   └──────────────────────────┘  │
│           ↓              │              ↓                   │
│  ┌────────────────────┐  │   ┌──────────────────────────┐  │
│  │  HTTP Client       │  │   │   Middleware             │  │
│  │  (Axios)           │  │   │   - JWT Auth             │  │
│  │  - Interceptors    │  │   │   - CORS                 │  │
│  └────────────────────┘  │   └──────────────────────────┘  │
│           │              │              ↓                   │
│           └──────────────┼──────→  ┌──────────────────────┐ │
│                          │         │   Data Models        │ │
│                          │         │   - User             │ │
│                          │         │   - StudyGroup       │ │
│                          │         │   - Relationships    │ │
│                          │         └──────────────────────┘ │
│                          │              ↓                   │
│                          │         ┌──────────────────────┐ │
│                          │         │   MongoDB Database   │ │
│                          │         │   - collections      │ │
│                          │         │   - indexes          │ │
│                          │         └──────────────────────┘ │
│                          │                                  │
└──────────────────────────┴──────────────────────────────────┘
```

## 📱 User Interface Map

```
┌─────────────────────────────────────────────────────────────┐
│                        Navbar                                │
│    [Logo] [Home] [Create Group] [Profile] [User] [Logout]   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────┐  ┌──────────────────┐  ┌────────────┐
│   AUTHENTICATION        │  │   GROUP PAGES    │  │  PROFILE   │
├─────────────────────────┤  ├──────────────────┤  ├────────────┤
│                         │  │                  │  │            │
│  1. Login Page          │  │ 1. Home Page     │  │ Profile    │
│     - Email input       │  │    - Group list  │  │ - View/Edit│
│     - Password input    │  │    - Search      │  │   info     │
│     - Submit button     │  │    - Filter      │  │ - Groups   │
│                         │  │                  │  │   joined   │
│  2. Signup Page         │  │ 2. Create Page   │  │            │
│     - Name input        │  │    - Form fields │  │ Actions:   │
│     - Email input       │  │    - Save button │  │ - Edit     │
│     - Password input    │  │                  │  │ - Logout   │
│     - Course input      │  │ 3. Group Detail  │  │            │
│     - Year select       │  │    - Title       │  └────────────┘
│     - Submit button     │  │    - Members     │
│                         │  │    - Actions     │
│  Actions:              │  │    (Join/Leave)  │
│  - Sign up → Home     │  │                  │
│  - Login → Home       │  │ Actions:         │
│                         │  │ - Browse groups  │
│                         │  │ - Create group   │
│                         │  │ - Join/Leave     │
│                         │  │ - View details   │
└─────────────────────────┘  └──────────────────┘
```

## 🔄 Data Flow Diagram

### Authentication Flow
```
User Sign Up
    ↓
Frontend Form Validation
    ↓
POST /api/auth/signup
    ↓
Backend Validation → Hash Password → Create User
    ↓
Generate JWT Token
    ↓
Response with token + user data
    ↓
Frontend stores token (localStorage)
    ↓
Update AuthContext
    ↓
Redirect to Home
```

### Group Creation Flow
```
User clicks "Create Group"
    ↓
Form validation
    ↓
POST /api/groups
    ↓
Backend verifies JWT
    ↓
Create StudyGroup doc
    ↓
Add creator as first member
    ↓
Push group ID to User.groupsJoined
    ↓
Response with group data
    ↓
Frontend updates state
    ↓
Redirect to group detail page
```

### Join Group Flow
```
User clicks "Join"
    ↓
POST /api/groups/:id/join
    ↓
Backend verifies JWT
    ↓
Check visibility (must be public)
    ↓
Check if already member
    ↓
Check if group not full
    ↓
Push user to group.members
    ↓
Push group to user.groupsJoined
    ↓
Response with updated group
    ↓
Frontend updates local state
    ↓
Show "Leave Group" button
```

## 🗂️ File Organization

### Backend Structure
```
backend/
├── server.js                 ← Express app entry point
├── config/
│   └── db.js                ← MongoDB connection
├── models/
│   ├── User.js              ← User schema
│   └── StudyGroup.js        ← StudyGroup schema
├── controllers/
│   ├── authController.js    ← Auth logic
│   └── groupController.js   ← Group logic
├── middleware/
│   └── authMiddleware.js    ← JWT verification
├── routes/
│   ├── authRoutes.js        ← Auth endpoints
│   └── groupRoutes.js       ← Group endpoints
├── .env                     ← Secrets (never commit!)
└── package.json             ← Dependencies
```

### Frontend Structure
```
frontend/src/
├── App.jsx                  ← Router setup
├── main.jsx                 ← React entry point
├── index.css                ← Tailwind CSS
├── api/
│   ├── axiosInstance.js     ← HTTP client
│   ├── authApi.js           ← Auth API functions
│   └── groupApi.js          ← Group API functions
├── context/
│   └── AuthContext.jsx      ← Global auth state
├── hooks/
│   ├── useAuth.js           ← Auth hook
│   └── useGroups.js         ← Groups hook
├── pages/
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── HomePage.jsx
│   ├── CreateGroupPage.jsx
│   ├── GroupDetailPage.jsx
│   └── ProfilePage.jsx
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   └── SignupForm.jsx
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Spinner.jsx
│   └── groups/
│       ├── GroupCard.jsx
│       ├── GroupForm.jsx
│       ├── GroupDashboard.jsx
│       └── MemberList.jsx
└── utils/
    └── tokenStorage.js      ← Token persistence
```

## 🔐 Security Layers

```
Request Incoming
    ↓
[1] CORS Check
    - Only from CLIENT_URL
    ↓
[2] Route Check
    - Public vs Protected
    ↓
[3] If Protected:
    - JWT Verification
    - Token validation
    - User lookup
    ↓
[4] Authorization Check
    - Role verification
    - Ownership verification
    ↓
[5] Business Logic
    - Data validation
    - State checks
    ↓
[6] Database Operation
    - Create/Read/Update/Delete
    ↓
Response Outgoing
    - Exclude sensitive data
    - Include success flag
```

## 📊 Data Model Relationships

```
┌──────────────────┐              ┌──────────────────────┐
│      User        │              │    StudyGroup        │
├──────────────────┤              ├──────────────────────┤
│ _id              │◄─────────────►│ _id                  │
│ name             │  1:M many     │ name                 │
│ email            │  createdBy    │ subject              │
│ password         │               │ description          │
│ course           │               │ createdBy (ref User) │
│ year             │  many:many    │ members (ref User[]) │
│ groupsJoined[]   │◄─────────────►│ visibility           │
│                  │               │ tags                 │
│ created/updated  │               │ maxMembers           │
│ at               │               │ created/updated at   │
└──────────────────┘               └──────────────────────┘
```

## 🌐 API Response Format

All API responses follow this structure:

**Success:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "...",
    "..."
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🔐 Authentication System

```
JWT Token Structure:
┌─────────────┬─────────────┬──────────────────┐
│   Header    │   Payload   │   Signature      │
├─────────────┼─────────────┼──────────────────┤
│ typ: JWT    │ id: userId  │ HMAC-SHA256      │
│ alg: HS256  │ exp: 7 days │ (JWT_SECRET)     │
│             │ iat: issue  │                  │
│             │ time        │                  │
└─────────────┴─────────────┴──────────────────┘
        ↓
Stored in localStorage as 'campusconnect_token'
        ↓
Sent in Authorization header:
Authorization: Bearer <token>
        ↓
Verified by authMiddleware on protected routes
```

## 📈 Scalability Considerations

✅ **Current:**
- Single MongoDB instance
- In-memory state management
- Direct API calls

🚀 **Future:**
- Database replication
- Caching layer (Redis)
- WebSocket for real-time
- Message queue (RabbitMQ)
- Microservices split
- CDN for static assets

## 🎓 Learning Path

For developers using this project:

1. **Frontend Basics** → Understand React components
2. **Backend Basics** → Understand Express routing
3. **Authentication** → Understand JWT flow
4. **Data Modeling** → Understand Mongoose schemas
5. **API Integration** → Understand Axios interceptors
6. **State Management** → Understand Context API
7. **Advanced** → Add real-time, caching, etc.

## 📝 Feature Checklist

- [x] User Authentication (signup/login/logout)
- [x] Password Security (bcrypt hashing)
- [x] Token Management (JWT, localStorage)
- [x] Protected Routes
- [x] Study Group Creation
- [x] Group Browsing & Filtering
- [x] Group Membership Management
- [x] Creator-Only Operations (edit/delete)
- [x] Member Lists
- [x] Profile Management
- [x] Error Handling
- [x] Loading States
- [x] Form Validation
- [x] Responsive UI (Tailwind CSS)

## 🎯 Performance Metrics

Expected Performance:
- Signup: < 500ms
- Login: < 300ms
- Load groups: < 500ms
- Create group: < 400ms
- Join group: < 300ms

Optimization Ready For:
- Database query optimization
- API response compression
- Frontend code splitting
- Lazy loading components
- Image optimization

---

**CampusConnect is now ready for development and deployment! 🚀**
