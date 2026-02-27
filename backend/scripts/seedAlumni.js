require('dotenv').config({ path: `${__dirname}/../.env` });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const existing = await User.findOne({ email: 'alumni@campus.com' });
    if (existing) {
      console.log('✅ Alumni user already exists. No action needed.');
      process.exit(0);
    }

    const hashed = await bcrypt.hash('Alumni@1234', 10);
    await User.create({
      name: 'Demo Alumni',
      email: 'alumni@campus.com',
      password: hashed,
      role: 'alumni',
      course: 'Alumni',
      year: 1,
      passingYear: 2020,
      currentStatus: 'employed',
      currentCompany: 'Google',
      jobTitle: 'Software Engineer',
      location: 'San Francisco, USA',
      bio: 'B.Tech CSE graduate, currently working as a Software Engineer at Google. Happy to connect with students!',
    });

    console.log('✅ Alumni user created successfully!');
    console.log('Email: alumni@campus.com');
    console.log('Password: Alumni@1234');
    console.log('⚠️  Please change this password after first login!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding alumni:', error.message);
    process.exit(1);
  }
}

seed();
