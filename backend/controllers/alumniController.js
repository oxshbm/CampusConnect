const User = require('../models/User');

const getAlumni = async (req, res) => {
  try {
    const alumni = await User.find({ role: 'alumni' }).select('-password');
    res.json({
      success: true,
      data: alumni,
    });
  } catch (error) {
    console.error('Get alumni error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch alumni' });
  }
};

const getAlumniById = async (req, res) => {
  try {
    const alumni = await User.findById(req.params.id).select('-password');

    if (!alumni || alumni.role !== 'alumni') {
      return res.status(404).json({ success: false, message: 'Alumni not found' });
    }

    res.json({
      success: true,
      data: alumni,
    });
  } catch (error) {
    console.error('Get alumni by id error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch alumni profile' });
  }
};

const updateAlumniProfile = async (req, res) => {
  try {
    const { passingYear, currentStatus, currentCompany, jobTitle, location, linkedIn, bio } = req.body;

    const updatedFields = {};
    if (passingYear !== undefined) updatedFields.passingYear = passingYear;
    if (currentStatus) updatedFields.currentStatus = currentStatus;
    if (currentCompany !== undefined) updatedFields.currentCompany = currentCompany;
    if (jobTitle !== undefined) updatedFields.jobTitle = jobTitle;
    if (location !== undefined) updatedFields.location = location;
    if (linkedIn !== undefined) updatedFields.linkedIn = linkedIn;
    if (bio !== undefined) updatedFields.bio = bio;

    const alumni = await User.findByIdAndUpdate(
      req.user._id,
      updatedFields,
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      data: alumni,
    });
  } catch (error) {
    console.error('Update alumni profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

module.exports = { getAlumni, getAlumniById, updateAlumniProfile };
