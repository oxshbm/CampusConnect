require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@campusconnect.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';
    const adminName = process.env.ADMIN_NAME || 'Admin';

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = new User({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      course: 'Administration',
      year: 1,
      role: 'admin',
      isBanned: false,
    });

    await admin.save();
    console.log('Admin created successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
