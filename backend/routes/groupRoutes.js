const express = require('express');
const {
  getPublicGroups,
  getMyGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  getGroupMembers,
} = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getPublicGroups);

// Protected routes - IMPORTANT: /my-groups must come before /:id
router.get('/my-groups', authMiddleware, getMyGroups);
router.post('/', authMiddleware, createGroup);

// Single group routes
router.get('/:id', getGroupById);
router.put('/:id', authMiddleware, updateGroup);
router.delete('/:id', authMiddleware, deleteGroup);

// Group membership routes
router.post('/:id/join', authMiddleware, joinGroup);
router.post('/:id/leave', authMiddleware, leaveGroup);
router.get('/:id/members', authMiddleware, getGroupMembers);

module.exports = router;
