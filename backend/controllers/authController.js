const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudyGroup = require('../models/StudyGroup');
const Project = require('../models/Project');
const Club = require('../models/Club');
const Event = require('../models/Event');

const signup = async (req, res) => {
  try {
    const { name, email, password, course, year, branch, avatar } = req.body;

    // Validate input
    if (!name || !email || !password || !course || year === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (verified by default)
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      course,
      year,
      branch: branch || '',
      avatar: avatar || '',
      isVerified: true,
    });
    await user.save();

    // Sign JWT immediately
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      success: true,
      message: 'Signup successful! You are now logged in.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          course: user.course,
          year: user.year,
          branch: user.branch || '',
          avatar: user.avatar || '',
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Signup failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Email, password, and role required' });
    }

    // Find user (password verification skipped for student/alumni in v1, enforced for admin)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found. Please sign up first.' });
    }

    // Enforce password verification for admins
    if (user.role === 'admin') {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
      }
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact admin.',
      });
    }

    // Sign JWT with selected role (v1: allow any role for now)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          course: user.course,
          year: user.year,
          branch: user.branch || '',
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('groupsJoined');

    // Check if user is banned
    if (user.isBanned) {
      return res.status(401).json({ success: false, message: 'Account suspended.' });
    }

    const userId = req.user._id;

    // Fetch user-related entities
    const [groupsCreated, projects, clubs, events] = await Promise.all([
      StudyGroup.find({ createdBy: userId }),
      Project.find({ $or: [{ createdBy: userId }, { members: userId }] }),
      Club.find({ $or: [{ createdBy: userId }, { members: userId }] }),
      Event.find({ attendees: userId }),
    ]);

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        course: user.course,
        year: user.year,
        branch: user.branch || '',
        avatar: user.avatar || '',
        role: user.role,
        groupsJoined: user.groupsJoined || [],
        groupsCreated: groupsCreated || [],
        projects: projects || [],
        clubs: clubs || [],
        events: events || [],
      },
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
};

const updateMe = async (req, res) => {
  try {
    const { name, course, year, branch, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        ...(name && { name }), 
        ...(course && { course }), 
        ...(year !== undefined && { year }),
        ...(branch !== undefined && { branch }),
        ...(avatar !== undefined && { avatar })
      },
      { new: true }
    );

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        course: user.course,
        year: user.year,
        branch: user.branch || '',
        avatar: user.avatar || '',
      },
    });
  } catch (error) {
    console.error('UpdateMe error:', error);
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

const signupAlumni = async (req, res) => {
  try {
    const { name, email, password, passingYear, currentStatus, currentCompany, jobTitle, location, linkedIn, bio } = req.body;

    // Validate required fields
    if (!name || !email || !password || !passingYear || !currentStatus) {
      return res.status(400).json({ success: false, message: 'Missing required fields: name, email, password, passingYear, currentStatus' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create alumni user (verified by default)
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'alumni',
      passingYear,
      currentStatus,
      currentCompany: currentCompany || undefined,
      jobTitle: jobTitle || undefined,
      location: location || undefined,
      linkedIn: linkedIn || undefined,
      bio: bio || undefined,
      // Alumni don't have course/year (student fields)
      course: 'Alumni',
      year: 0,
      isVerified: true,
    });
    await user.save();

    // Sign JWT immediately
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      success: true,
      message: 'Alumni signup successful! You are now logged in.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          passingYear: user.passingYear,
          currentStatus: user.currentStatus,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Alumni signup error:', error);
    res.status(500).json({ success: false, message: 'Alumni signup failed' });
  }
};

module.exports = { signup, login, getMe, updateMe, signupAlumni };
