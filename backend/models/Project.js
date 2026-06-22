const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    techStack: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    maxMembers: {
      type: Number,
      default: 5,
      min: [1, 'Max members must be at least 1'],
    },
    deadline: {
      type: Date,
      required: [true, 'Project deadline is required'],
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'completed'],
      default: 'open',
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
    applications: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          default: 'pending',
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to auto-initialize members array with createdBy
projectSchema.pre('save', function (next) {
  if (this.isNew && this.createdBy && (!this.members || this.members.length === 0)) {
    this.members = [this.createdBy];
  }
  next();
});

// Indexes for query optimization
projectSchema.index({ status: 1 });
projectSchema.index({ techStack: 1 });
projectSchema.index({ createdBy: 1 });
projectSchema.index({ title: 'text', description: 'text', techStack: 'text' });

module.exports = mongoose.model('Project', projectSchema);
