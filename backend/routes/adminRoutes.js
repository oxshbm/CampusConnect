const express = require('express');
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
} = require('../controllers/adminController');

const router = express.Router();

// Testing: no auth required for now. Auth will be added back later.

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

module.exports = router;
