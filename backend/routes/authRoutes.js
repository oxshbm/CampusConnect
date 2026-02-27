const express = require('express');
const { signup, login, getMe, updateMe, signupAlumni } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/signup-alumni', signupAlumni);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateMe);

module.exports = router;
