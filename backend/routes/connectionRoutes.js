const express = require('express');
const { sendConnectionRequest, getIncomingConnections, getSentConnections, acceptConnection, rejectConnection } = require('../controllers/connectionController');
const authMiddleware = require('../middleware/authMiddleware');
const alumniMiddleware = require('../middleware/alumniMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Student sends connection request to alumni
router.post('/:alumniId', sendConnectionRequest);

// Alumni gets incoming connection requests
router.get('/incoming', alumniMiddleware, getIncomingConnections);

// Student gets sent connection requests
router.get('/sent', getSentConnections);

// Alumni accepts a connection request
router.put('/:id/accept', alumniMiddleware, acceptConnection);

// Alumni rejects a connection request
router.put('/:id/reject', alumniMiddleware, rejectConnection);

module.exports = router;
