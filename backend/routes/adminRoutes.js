const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const {
  getStats,
  getAllUsers,
  banUser,
  unbanUser,
  deleteUser,
  getAllGroups,
  deleteGroup,
  getAllEvents,
  approveEvent,
  denyEvent,
  deleteAdminEvent,
  getAllAdminClubs,
  approveClub,
  denyClub,
  deleteAdminClub,
  createAdmin,
  getAllAdmins,
  getAllForumPosts,
  deleteForumPost,
  getAllComments,
  deleteComment,
} = require('../controllers/adminController');

const router = express.Router();

// Apply authentication and admin role check to all admin routes
router.use(authMiddleware, adminOnly);

// Stats
router.get('/stats', getStats);

// Users management
router.get('/users', getAllUsers);
router.put('/users/:id/ban', banUser);
router.put('/users/:id/unban', unbanUser);
router.delete('/users/:id', deleteUser);

// Admins management
router.get('/admins', getAllAdmins);
router.post('/create-admin', createAdmin);

// Groups management
router.get('/groups', getAllGroups);
router.delete('/groups/:id', deleteGroup);

// Events management
router.get('/events', getAllEvents);
router.put('/events/:id/approve', approveEvent);
router.put('/events/:id/deny', denyEvent);
router.delete('/events/:id', deleteAdminEvent);

// Clubs management
router.get('/clubs', getAllAdminClubs);
router.put('/clubs/:id/approve', approveClub);
router.put('/clubs/:id/deny', denyClub);
router.delete('/clubs/:id', deleteAdminClub);

// Forum management
router.get('/forum/posts', getAllForumPosts);
router.delete('/forum/posts/:id', deleteForumPost);
router.get('/forum/comments', getAllComments);
router.delete('/forum/comments/:id', deleteComment);

module.exports = router;
