const mongoose = require('mongoose');

const studyGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    semester: {
      type: String,
    },
    tags: [
      {
        type: String,
        lowercase: true,
      },
    ],
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    maxMembers: {
      type: Number,
      default: 30,
    },
  },
  { timestamps: true }
);

// Indexes for efficient querying
studyGroupSchema.index({ subject: 1, visibility: 1 });
studyGroupSchema.index({ tags: 1 });

module.exports = mongoose.model('StudyGroup', studyGroupSchema);
