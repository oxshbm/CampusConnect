const express = require('express');
const {
  getOpenProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  applyToProject,
  leaveProject,
  getApplications,
  approveApplication,
  rejectApplication,
  getProjectMessages,
  createProjectMessage,
} = require('../controllers/projectController');
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

// Open route
router.get('/', optionalAuth, getOpenProjects);

// Protected create route
router.post('/', authMiddleware, createProject);

// Single project routes
router.get('/:projectId', optionalAuth, getProjectById);
router.put('/:projectId', authMiddleware, updateProject);
router.delete('/:projectId', authMiddleware, deleteProject);

// Membership routes
router.post('/:projectId/apply', authMiddleware, applyToProject);
router.post('/:projectId/leave', authMiddleware, leaveProject);

// Applications management routes (owner only)
router.get('/:projectId/applications', authMiddleware, getApplications);
router.post('/:projectId/applications/:applicantId/approve', authMiddleware, approveApplication);
router.post('/:projectId/applications/:applicantId/reject', authMiddleware, rejectApplication);

// Messaging routes
router.get('/:projectId/messages', authMiddleware, getProjectMessages);
router.post('/:projectId/messages', authMiddleware, createProjectMessage);

module.exports = router;
