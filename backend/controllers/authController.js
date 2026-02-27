const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signup = async (req, res) => {
  try {
    const { name, email, password, course, year } = req.body;

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

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      course,
      year,
    });
    await user.save();

    // Sign JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          course: user.course,
          year: user.year,
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
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact admin.',
      });
    }

    // Sign JWT
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

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        course: user.course,
        year: user.year,
        groupsJoined: user.groupsJoined,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
};

const updateMe = async (req, res) => {
  try {
    const { name, course, year } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...(name && { name }), ...(course && { course }), ...(year !== undefined && { year }) },
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

    // Create alumni user
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
    });
    await user.save();

    // Sign JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          passingYear: user.passingYear,
          currentStatus: user.currentStatus,
          currentCompany: user.currentCompany,
          jobTitle: user.jobTitle,
          location: user.location,
          linkedIn: user.linkedIn,
          bio: user.bio,
        },
      },
    });
  } catch (error) {
    console.error('Alumni signup error:', error);
    res.status(500).json({ success: false, message: 'Alumni signup failed' });
  }
};

module.exports = { signup, login, getMe, updateMe, signupAlumni };
