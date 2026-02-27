const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    alumni: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    message: {
      type: String,
      maxlength: 300,
    },
  },
  { timestamps: true }
);

// Unique compound index on student and alumni
connectionSchema.index({ student: 1, alumni: 1 }, { unique: true });

module.exports = mongoose.model('Connection', connectionSchema);
