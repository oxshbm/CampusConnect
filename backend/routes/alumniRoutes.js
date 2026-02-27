const express = require('express');
const { getAlumni, getAlumniById, updateAlumniProfile } = require('../controllers/alumniController');
const authMiddleware = require('../middleware/authMiddleware');
const alumniMiddleware = require('../middleware/alumniMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all alumni - any authenticated user can access
router.get('/', getAlumni);

// Get single alumni profile - any authenticated user can access
router.get('/:id', getAlumniById);

// Update own alumni profile - alumni only
router.put('/profile', alumniMiddleware, updateAlumniProfile);

module.exports = router;
