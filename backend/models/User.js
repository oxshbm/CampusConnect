const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    course: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },
    groupsJoined: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudyGroup',
      },
    ],
    role: {
      type: String,
      enum: ['user', 'admin', 'alumni'],
      default: 'user',
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    // Alumni-specific fields
    passingYear: {
      type: Number,
    },
    currentStatus: {
      type: String,
      enum: ['employed', 'self-employed', 'masters', 'phd', 'other'],
    },
    currentCompany: {
      type: String,
    },
    jobTitle: {
      type: String,
    },
    location: {
      type: String,
    },
    linkedIn: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
