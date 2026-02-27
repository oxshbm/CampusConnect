const Connection = require('../models/Connection');
const User = require('../models/User');

const sendConnectionRequest = async (req, res) => {
  try {
    const { alumniId } = req.params;
    const { message } = req.body;

    // Check if alumni exists and has alumni role
    const alumni = await User.findById(alumniId);
    if (!alumni || alumni.role !== 'alumni') {
      return res.status(404).json({ success: false, message: 'Alumni not found' });
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      student: req.user._id,
      alumni: alumniId,
    });

    if (existingConnection) {
      return res.status(400).json({ success: false, message: 'Connection request already exists' });
    }

    // Create connection request
    const connection = new Connection({
      student: req.user._id,
      alumni: alumniId,
      message: message || undefined,
      status: 'pending',
    });

    await connection.save();

    res.status(201).json({
      success: true,
      data: connection,
    });
  } catch (error) {
    console.error('Send connection request error:', error);
    res.status(500).json({ success: false, message: 'Failed to send connection request' });
  }
};

const getIncomingConnections = async (req, res) => {
  try {
    const connections = await Connection.find({ alumni: req.user._id })
      .populate('student', 'name email course year')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: connections,
    });
  } catch (error) {
    console.error('Get incoming connections error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch connections' });
  }
};

const getSentConnections = async (req, res) => {
  try {
    const connections = await Connection.find({ student: req.user._id })
      .populate('alumni', 'name email passingYear currentStatus currentCompany jobTitle')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: connections,
    });
  } catch (error) {
    console.error('Get sent connections error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch sent requests' });
  }
};

const acceptConnection = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await Connection.findById(id);

    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection not found' });
    }

    // Verify that the current user is the alumni
    if (connection.alumni.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    connection.status = 'accepted';
    await connection.save();

    res.json({
      success: true,
      data: connection,
    });
  } catch (error) {
    console.error('Accept connection error:', error);
    res.status(500).json({ success: false, message: 'Failed to accept connection' });
  }
};

const rejectConnection = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await Connection.findById(id);

    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection not found' });
    }

    // Verify that the current user is the alumni
    if (connection.alumni.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    connection.status = 'rejected';
    await connection.save();

    res.json({
      success: true,
      data: connection,
    });
  } catch (error) {
    console.error('Reject connection error:', error);
    res.status(500).json({ success: false, message: 'Failed to reject connection' });
  }
};

module.exports = { sendConnectionRequest, getIncomingConnections, getSentConnections, acceptConnection, rejectConnection };
