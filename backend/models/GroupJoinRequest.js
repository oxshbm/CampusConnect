const mongoose = require('mongoose');

const groupJoinRequestSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudyGroup',
      required: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

groupJoinRequestSchema.index(
  { group: 1, requester: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'pending' } }
);
groupJoinRequestSchema.index({ group: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('GroupJoinRequest', groupJoinRequestSchema);
