const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  getStats,
  getAllUsers,
  banUser,
  unbanUser,
  deleteUser,
  getAllGroups,
  deleteGroup,
} = require('../controllers/adminController');

const router = express.Router();

// All routes require authentication and admin role
router.use(authMiddleware, adminMiddleware);

// Stats
router.get('/stats', getStats);

// Users management
router.get('/users', getAllUsers);
router.put('/users/:id/ban', banUser);
router.put('/users/:id/unban', unbanUser);
router.delete('/users/:id', deleteUser);

// Groups management
router.get('/groups', getAllGroups);
router.delete('/groups/:id', deleteGroup);

module.exports = router;
