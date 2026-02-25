const Club = require('../models/Club');
const ClubPost = require('../models/ClubPost');
const User = require('../models/User');

const getApprovedClubs = async (req, res) => {
  try {
    const { name, category } = req.query;
    let filter = { status: 'approved' };

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    const clubs = await Club.find(filter)
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    res.json({ success: true, data: clubs });
  } catch (error) {
    console.error('GetApprovedClubs error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch clubs' });
  }
};

const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email course year');

    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    res.json({ success: true, data: club });
  } catch (error) {
    console.error('GetClubById error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch club' });
  }
};

const createClub = async (req, res) => {
  try {
    const { name, description, teamSize, category, contactEmail, foundedYear } = req.body;

    // Validation
    if (!name || !description || !teamSize || !category) {
      return res.status(400).json({ success: false, message: 'Name, description, teamSize, and category are required' });
    }

    if (teamSize < 1) {
      return res.status(400).json({ success: false, message: 'Team size must be at least 1' });
    }

    const newClub = new Club({
      name,
      description,
      teamSize,
      category,
      contactEmail: contactEmail || '',
      foundedYear: foundedYear || null,
      createdBy: req.user._id,
      status: 'pending',
      members: [req.user._id],
    });

    await newClub.save();

    const populatedClub = await Club.findById(newClub._id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email course year');

    res.status(201).json({ success: true, data: populatedClub });
  } catch (error) {
    console.error('CreateClub error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A club with this name already exists' });
    }

    res.status(500).json({ success: false, message: 'Failed to create club' });
  }
};

const updateClub = async (req, res) => {
  try {
    let club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    // Check if user is the leader
    if (club.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the club leader can edit club info' });
    }

    // Only allow updating these fields
    const { name, description, teamSize, category, contactEmail, foundedYear } = req.body;

    if (name) club.name = name;
    if (description) club.description = description;
    if (teamSize) club.teamSize = teamSize;
    if (category) club.category = category;
    if (contactEmail !== undefined) club.contactEmail = contactEmail;
    if (foundedYear !== undefined) club.foundedYear = foundedYear;

    await club.save();

    const updatedClub = await Club.findById(club._id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email course year');

    res.json({ success: true, data: updatedClub });
  } catch (error) {
    console.error('UpdateClub error:', error);

    // Handle duplicate key error on name change
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A club with this name already exists' });
    }

    res.status(500).json({ success: false, message: 'Failed to update club' });
  }
};

const deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    // Check if user is the leader
    if (club.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the club leader can delete the club' });
    }

    const clubName = club.name;

    // Cascade delete all posts for this club
    await ClubPost.deleteMany({ club: req.params.id });
    await Club.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: `Club "${clubName}" has been deleted` });
  } catch (error) {
    console.error('DeleteClub error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete club' });
  }
};

const addMember = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    // Check if user is the leader
    if (club.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the club leader can manage members' });
    }

    // Find user by email
    const targetUser = await User.findOne({ email: email.toLowerCase() });

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if already a member
    if (club.members.includes(targetUser._id)) {
      return res.status(400).json({ success: false, message: 'User is already a member of this club' });
    }

    club.members.push(targetUser._id);
    await club.save();

    const updatedClub = await Club.findById(club._id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email course year');

    res.json({ success: true, data: updatedClub });
  } catch (error) {
    console.error('AddMember error:', error);
    res.status(500).json({ success: false, message: 'Failed to add member' });
  }
};

const removeMember = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    // Check if user is the leader
    if (club.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the club leader can manage members' });
    }

    // Prevent removing self (the leader)
    if (req.params.userId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot remove yourself as the club leader' });
    }

    club.members = club.members.filter(memberId => memberId.toString() !== req.params.userId);
    await club.save();

    const updatedClub = await Club.findById(club._id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email course year');

    res.json({ success: true, data: updatedClub });
  } catch (error) {
    console.error('RemoveMember error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove member' });
  }
};

const createPost = async (req, res) => {
  try {
    const { type, title, content, eventDate, eventTime, eventLocation } = req.body;

    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    // Check if user is the leader
    if (club.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the club leader can create posts' });
    }

    // Check if club is approved
    if (club.status !== 'approved') {
      return res.status(403).json({ success: false, message: 'Club must be approved before posting' });
    }

    // Validation
    if (!type || !title || !content) {
      return res.status(400).json({ success: false, message: 'Type, title, and content are required' });
    }

    if (!['announcement', 'event', 'update'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid post type' });
    }

    if (type === 'event' && !eventDate) {
      return res.status(400).json({ success: false, message: 'Event posts require an event date' });
    }

    const newPost = new ClubPost({
      club: req.params.id,
      createdBy: req.user._id,
      type,
      title,
      content,
      eventDate: eventDate || null,
      eventTime: eventTime || '',
      eventLocation: eventLocation || '',
    });

    await newPost.save();

    const populatedPost = await ClubPost.findById(newPost._id).populate('createdBy', 'name email');

    res.status(201).json({ success: true, data: populatedPost });
  } catch (error) {
    console.error('CreatePost error:', error);
    res.status(500).json({ success: false, message: 'Failed to create post' });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await ClubPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check if user is the creator
    if (post.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the post creator can delete this post' });
    }

    await ClubPost.findByIdAndDelete(req.params.postId);

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('DeletePost error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete post' });
  }
};

const getPosts = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    // Only allow posts from approved clubs
    if (club.status !== 'approved') {
      return res.json({ success: true, data: [] });
    }

    const posts = await ClubPost.find({ club: req.params.id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: posts });
  } catch (error) {
    console.error('GetPosts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch posts' });
  }
};

module.exports = {
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
};
