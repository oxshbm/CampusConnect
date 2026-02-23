# CampusConnect

A lightweight campus collaboration MVP for students to discover, create, and manage academic study groups. Built with Node.js/Express (backend) and React (frontend).

## Features

- **User Authentication**: Sign up, login, and profile management with JWT tokens
- **Study Groups**: Create, browse, filter, and join study groups
- **Group Management**: Full CRUD operations for group creators
- **Member System**: Join/leave groups, view member lists
- **Filtering**: Search groups by subject and tags

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS

## Project Structure

```
CampusConnect/
├── backend/           # Express API server
│   ├── config/        # Database configuration
│   ├── controllers/   # Route handlers
│   ├── middleware/    # Auth middleware
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API routes
│   ├── server.js      # Entry point
│   ├── package.json
│   ├── .env           # Environment variables
│   └── .gitignore
│
└── frontend/          # React application
    ├── public/        # Static files
    ├── src/
    │   ├── api/       # API client functions
    │   ├── components/# React components
    │   ├── context/   # Auth context
    │   ├── hooks/     # Custom hooks
    │   ├── pages/     # Page components
    │   ├── utils/     # Utility functions
    │   ├── App.jsx    # Router setup
    │   └── main.jsx   # Entry point
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── .env           # Environment variables
    └── .gitignore
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or Atlas connection)
- npm or yarn

### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**
   - Copy `.env.example` to `.env` (already done)
   - Update `MONGODB_URI` if needed
   - Ensure `JWT_SECRET` is set (min 32 chars)
   - Update `CLIENT_URL` if frontend is on different port

3. **Start the server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   App will be available at `http://localhost:5173`

## Environment Variables

### Backend (`.env`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campusconnect
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
CLIENT_URL=http://localhost:5173
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `PUT /api/auth/me` - Update user profile (requires auth)

### Study Groups
- `GET /api/groups` - List public groups (with optional filters)
- `GET /api/groups/my-groups` - Get user's joined groups (requires auth)
- `GET /api/groups/:id` - Get group details
- `POST /api/groups` - Create new group (requires auth)
- `PUT /api/groups/:id` - Update group (creator only, requires auth)
- `DELETE /api/groups/:id` - Delete group (creator only, requires auth)
- `POST /api/groups/:id/join` - Join a group (requires auth)
- `POST /api/groups/:id/leave` - Leave a group (requires auth)
- `GET /api/groups/:id/members` - Get group members (requires auth)

## Usage Guide

### User Flow

1. **Sign Up**
   - Visit `/signup`
   - Enter name, email, password, course, and academic year
   - Redirected to home page after successful registration

2. **Browse Groups**
   - Home page shows all public study groups
   - Filter by subject or tags
   - Click "Join Group" to become a member

3. **Create a Group**
   - Click "Create Group" in navbar
   - Fill in group details (name, subject, description, etc.)
   - Group is created with you as the creator/member

4. **Manage Your Groups**
   - View group details, member list
   - Leave groups you've joined (creators cannot leave)
   - Edit or delete groups you created

5. **Profile Management**
   - Update name, course, and academic year
   - View groups you've joined

## Security Features

- ✅ JWT-based authentication with 7-day expiry
- ✅ Bcrypt password hashing (10 salt rounds)
- ✅ CORS protection
- ✅ Sensitive data exclusion (password field not selected by default)
- ✅ Role-based access (creator-only operations)
- ✅ Environment variable protection (.env in .gitignore)

## Testing the Application

### Manual Testing with Postman

1. **Sign Up**
   ```
   POST http://localhost:5000/api/auth/signup
   Body: {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123",
     "course": "Computer Science",
     "year": 2
   }
   ```

2. **Login**
   ```
   POST http://localhost:5000/api/auth/login
   Body: {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

3. **Create Group** (use Bearer token from login)
   ```
   POST http://localhost:5000/api/groups
   Headers: Authorization: Bearer <token>
   Body: {
     "name": "DSA Study Group",
     "subject": "Data Structures",
     "description": "Study group for data structures",
     "tags": ["dsa", "algorithms"]
   }
   ```

4. **Browse Groups**
   ```
   GET http://localhost:5000/api/groups
   GET http://localhost:5000/api/groups?subject=Data&tags=dsa
   ```

### Browser Testing

1. Start both backend and frontend servers
2. Navigate to `http://localhost:5173`
3. Test full flow: signup → browse → create group → join group → leave → logout

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or accessible
- Check `MONGODB_URI` in backend `.env`
- Verify network connectivity for MongoDB Atlas

### CORS Errors
- Ensure `CLIENT_URL` in backend `.env` matches frontend URL
- Check that frontend is sending requests to correct `VITE_API_URL`

### 401 Unauthorized
- Token may have expired (7 day expiry)
- Re-login to get new token
- Check that token is properly stored in localStorage

### Port Already in Use
- Change `PORT` in backend `.env`
- Or kill process using the port

## Future Enhancements

- Real-time chat for study groups
- Study session scheduling
- Resource sharing (documents, links)
- Group analytics and statistics
- Email notifications
- Two-factor authentication
- Advanced search and recommendations

## Security Notes

⚠️ **Never commit `.env` files** - they contain sensitive secrets

Before deploying to production:
- Use strong, random `JWT_SECRET`
- Implement rate limiting
- Add input validation and sanitization
- Use HTTPS
- Enable HTTPS for CORS origins
- Consider implementing refresh tokens
- Add logging and monitoring

## License

This project is provided as-is for educational purposes.

## Support

For issues or questions, please refer to the implementation plan or create an issue in the repository.
