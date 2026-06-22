const express = require('express');
const {
  getQuestions,
  getQuestion,
  createQuestion,
  voteOnQuestion,
  deleteQuestion,
  addComment,
  deleteComment,
} = require('../controllers/forumController');
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

router.get('/', optionalAuth, getQuestions);
router.get('/:id', optionalAuth, getQuestion);
router.post('/', authMiddleware, createQuestion);
router.post('/:id/vote', authMiddleware, voteOnQuestion);
router.delete('/:id', authMiddleware, deleteQuestion);
router.post('/:id/comments', authMiddleware, addComment);
router.delete('/comments/:commentId', authMiddleware, deleteComment);

module.exports = router;
