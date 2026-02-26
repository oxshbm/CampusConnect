require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const existing = await User.findOne({ email: 'admin@campus.com' });
    if (existing) {
      console.log('✅ Admin already exists. No action needed.');
      process.exit(0);
    }

    const hashed = await bcrypt.hash('Admin@1234', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@campus.com',
      password: hashed,
      course: 'Administration',
      year: 1,
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@campus.com');
    console.log('Password: Admin@1234');
    console.log('⚠️  Please change this password after first login!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
}

seed();
