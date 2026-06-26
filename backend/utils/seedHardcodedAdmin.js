const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedHardcodedAdmin = async () => {
  try {
    const email = 'admin404@gmail.com';
    const existingAdmin = await User.findOne({ email: email.toLowerCase() });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin404', 10);
      await User.create({
        name: 'System Admin',
        email: email.toLowerCase(),
        password: hashedPassword,
        course: 'Administration',
        year: 1,
        role: 'admin',
        isVerified: true,
      });
      console.log('✅ Hardcoded Admin seeded successfully (admin404@gmail.com / admin404).');
    } else {
      console.log('ℹ️ Hardcoded Admin already exists.');
    }
  } catch (error) {
    console.error('❌ Error seeding hardcoded admin:', error);
  }
};

module.exports = seedHardcodedAdmin;
