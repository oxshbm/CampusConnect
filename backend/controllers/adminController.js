const User = require('../models/User');
const StudyGroup = require('../models/StudyGroup');

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGroups = await StudyGroup.countDocuments();
    const bannedUsers = await User.countDocuments({ isBanned: true });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalGroups,
        bannedUsers,
      },
    });
  } catch (error) {
    console.error('GetStats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort('-createdAt');

    // Add groupsJoined count to each user
    const usersWithCounts = users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      course: user.course,
      year: user.year,
      role: user.role,
      isBanned: user.isBanned,
      createdAt: user.createdAt,
      groupsJoinedCount: user.groupsJoined.length,
    }));

    res.json({
      success: true,
      data: usersWithCounts,
    });
  } catch (error) {
    console.error('GetAllUsers error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

const banUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { isBanned: true }, { new: true }).select(
      '-password'
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: `User ${user.name} has been banned.`,
      data: user,
    });
  } catch (error) {
    console.error('BanUser error:', error);
    res.status(500).json({ success: false, message: 'Failed to ban user' });
  }
};

const unbanUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { isBanned: false }, { new: true }).select(
      '-password'
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: `User ${user.name} has been unbanned.`,
      data: user,
    });
  } catch (error) {
    console.error('UnbanUser error:', error);
    res.status(500).json({ success: false, message: 'Failed to unban user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting the admin him/herself
    if (id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Remove user from all groups
    await StudyGroup.updateMany({ members: id }, { $pull: { members: id } });

    // Delete all groups created by this user
    await StudyGroup.deleteMany({ createdBy: id });

    // Delete the user
    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: `User ${user.name} has been deleted.`,
    });
  } catch (error) {
    console.error('DeleteUser error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

const getAllGroups = async (req, res) => {
  try {
    const groups = await StudyGroup.find()
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    // Format group response
    const formattedGroups = groups.map((group) => ({
      id: group._id,
      name: group.name,
      subject: group.subject,
      description: group.description,
      createdBy: {
        id: group.createdBy._id,
        name: group.createdBy.name,
        email: group.createdBy.email,
      },
      membersCount: group.members.length,
      maxMembers: group.maxMembers,
      visibility: group.visibility,
      createdAt: group.createdAt,
    }));

    res.json({
      success: true,
      data: formattedGroups,
    });
  } catch (error) {
    console.error('GetAllGroups error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch groups' });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const group = await StudyGroup.findById(id);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Remove group from all members' groupsJoined
    await User.updateMany({ groupsJoined: id }, { $pull: { groupsJoined: id } });

    // Delete the group
    await StudyGroup.findByIdAndDelete(id);

    res.json({
      success: true,
      message: `Group "${group.name}" has been deleted.`,
    });
  } catch (error) {
    console.error('DeleteGroup error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete group' });
  }
};

module.exports = {
  getStats,
  getAllUsers,
  banUser,
  unbanUser,
  deleteUser,
  getAllGroups,
  deleteGroup,
};
