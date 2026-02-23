const StudyGroup = require('../models/StudyGroup');
const User = require('../models/User');

const getPublicGroups = async (req, res) => {
  try {
    const { subject, tags } = req.query;
    const filter = { visibility: 'public' };

    if (subject) {
      filter.subject = { $regex: subject, $options: 'i' };
    }
    if (tags) {
      const tagsArray = tags.split(',').map((tag) => tag.toLowerCase().trim());
      filter.tags = { $in: tagsArray };
    }

    const groups = await StudyGroup.find(filter)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    res.json({
      success: true,
      data: groups,
    });
  } catch (error) {
    console.error('GetPublicGroups error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch groups' });
  }
};

const getMyGroups = async (req, res) => {
  try {
    const groups = await StudyGroup.find({ members: req.user._id })
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    res.json({
      success: true,
      data: groups,
    });
  } catch (error) {
    console.error('GetMyGroups error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch groups' });
  }
};

const getGroupById = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    res.json({
      success: true,
      data: group,
    });
  } catch (error) {
    console.error('GetGroupById error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch group' });
  }
};

const createGroup = async (req, res) => {
  try {
    const { name, subject, description, semester, tags, visibility, maxMembers, meetingType, location, scheduleDays, startTime, duration } = req.body;

    if (!name || !subject) {
      return res.status(400).json({ success: false, message: 'Name and subject are required' });
    }

    const group = new StudyGroup({
      name,
      subject,
      description,
      semester,
      tags: tags ? tags.map((tag) => tag.toLowerCase()) : [],
      visibility: visibility || 'public',
      createdBy: req.user._id,
      members: [req.user._id],
      maxMembers: maxMembers || 30,
      meetingType: meetingType || 'virtual',
      location: location || '',
      scheduleDays: scheduleDays || [],
      startTime: startTime || '',
      duration: duration || '',
    });

    await group.save();

    // Add group to user's groupsJoined
    await User.findByIdAndUpdate(req.user._id, {
      $push: { groupsJoined: group._id },
    });

    const populatedGroup = await StudyGroup.findById(group._id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    res.status(201).json({
      success: true,
      data: populatedGroup,
    });
  } catch (error) {
    console.error('CreateGroup error:', error);
    res.status(500).json({ success: false, message: 'Failed to create group' });
  }
};

const updateGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only creator can update group' });
    }

    const { name, subject, description, semester, tags, visibility, maxMembers, meetingType, location, scheduleDays, startTime, duration } = req.body;

    if (name) group.name = name;
    if (subject) group.subject = subject;
    if (description) group.description = description;
    if (semester) group.semester = semester;
    if (tags) group.tags = tags.map((tag) => tag.toLowerCase());
    if (visibility) group.visibility = visibility;
    if (maxMembers) group.maxMembers = maxMembers;
    if (meetingType) group.meetingType = meetingType;
    if (location !== undefined) group.location = location;
    if (scheduleDays) group.scheduleDays = scheduleDays;
    if (startTime !== undefined) group.startTime = startTime;
    if (duration !== undefined) group.duration = duration;

    await group.save();

    const updatedGroup = await StudyGroup.findById(group._id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    res.json({
      success: true,
      data: updatedGroup,
    });
  } catch (error) {
    console.error('UpdateGroup error:', error);
    res.status(500).json({ success: false, message: 'Failed to update group' });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only creator can delete group' });
    }

    // Remove group from all members' groupsJoined
    await User.updateMany({ _id: { $in: group.members } }, { $pull: { groupsJoined: group._id } });

    // Delete group
    await StudyGroup.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Group deleted',
    });
  } catch (error) {
    console.error('DeleteGroup error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete group' });
  }
};

const joinGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    if (group.visibility === 'private') {
      return res.status(403).json({ success: false, message: 'Cannot join private group' });
    }

    // Check if already a member
    if (group.members.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Already a member' });
    }

    // Check if group is full
    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ success: false, message: 'Group is full' });
    }

    // Add user to group members
    group.members.push(req.user._id);
    await group.save();

    // Add group to user's groupsJoined
    await User.findByIdAndUpdate(req.user._id, {
      $push: { groupsJoined: group._id },
    });

    const updatedGroup = await StudyGroup.findById(group._id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    res.json({
      success: true,
      data: updatedGroup,
    });
  } catch (error) {
    console.error('JoinGroup error:', error);
    res.status(500).json({ success: false, message: 'Failed to join group' });
  }
};

const leaveGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Prevent creator from leaving
    if (group.createdBy.toString() === req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Creator cannot leave group, delete it instead' });
    }

    // Check if member
    if (!group.members.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Not a member of this group' });
    }

    // Remove user from group members
    group.members = group.members.filter((id) => id.toString() !== req.user._id.toString());
    await group.save();

    // Remove group from user's groupsJoined
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { groupsJoined: group._id },
    });

    const updatedGroup = await StudyGroup.findById(group._id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    res.json({
      success: true,
      data: updatedGroup,
    });
  } catch (error) {
    console.error('LeaveGroup error:', error);
    res.status(500).json({ success: false, message: 'Failed to leave group' });
  }
};

const getGroupMembers = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id).populate('members', 'name email course year');

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    res.json({
      success: true,
      data: group.members,
    });
  } catch (error) {
    console.error('GetGroupMembers error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch members' });
  }
};

module.exports = {
  getPublicGroups,
  getMyGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  getGroupMembers,
};
