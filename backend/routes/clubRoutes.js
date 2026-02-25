const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getApprovedClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub,
  addMember,
  removeMember,
  createPost,
  deletePost,
  getPosts,
} = require('../controllers/clubController');

const router = express.Router();

// Public routes
router.get('/', getApprovedClubs);
router.get('/:id', getClubById);
router.get('/:id/posts', getPosts);

// Protected routes
router.post('/', authMiddleware, createClub);
router.put('/:id', authMiddleware, updateClub);
router.delete('/:id', authMiddleware, deleteClub);

// Member management (leader only, enforced in controller)
router.post('/:id/members', authMiddleware, addMember);
router.delete('/:id/members/:userId', authMiddleware, removeMember);

// Post management (leader only, enforced in controller)
router.post('/:id/posts', authMiddleware, createPost);
router.delete('/:id/posts/:postId', authMiddleware, deletePost);

module.exports = router;
