const express = require('express');
const {
  getPublicGroups,
  getMyGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  requestToJoinGroup,
  cancelJoinRequest,
  getJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
  transferOwnership,
  leaveGroup,
  getGroupMembers,
  getGroupMessages,
  createGroupMessage,
  joinGroup,
  addGroupMember,
  removeGroupMember,
} = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return next();

    const decoded = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (user && !user.isBanned) req.user = user;
    return next();
  } catch (error) {
    return next();
  }
};

// Public routes
router.get('/', optionalAuth, getPublicGroups);

// Protected routes - IMPORTANT: /my-groups must come before /:id
router.get('/my-groups', authMiddleware, getMyGroups);
router.post('/', authMiddleware, createGroup);

// Single group routes
router.get('/:id', optionalAuth, getGroupById);
router.put('/:id', authMiddleware, updateGroup);
router.delete('/:id', authMiddleware, deleteGroup);

// Group membership routes
router.post('/:id/join', authMiddleware, joinGroup);
router.post('/:id/requests', authMiddleware, requestToJoinGroup);
router.delete('/:id/requests/me', authMiddleware, cancelJoinRequest);
router.get('/:id/requests', authMiddleware, getJoinRequests);
router.post('/:id/requests/:requestId/approve', authMiddleware, approveJoinRequest);
router.post('/:id/requests/:requestId/reject', authMiddleware, rejectJoinRequest);
router.post('/:id/transfer-ownership', authMiddleware, transferOwnership);
router.post('/:id/leave', authMiddleware, leaveGroup);
router.get('/:id/members', authMiddleware, getGroupMembers);
router.post('/:id/members', authMiddleware, addGroupMember);
router.delete('/:id/members/:userId', authMiddleware, removeGroupMember);
router.get('/:id/messages', authMiddleware, getGroupMessages);
router.post('/:id/messages', authMiddleware, createGroupMessage);

module.exports = router;
