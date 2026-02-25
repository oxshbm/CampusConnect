const mongoose = require('mongoose');

const clubPostSchema = new mongoose.Schema(
  {
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['announcement', 'event', 'update'],
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    eventDate: {
      type: Date,
      default: null,
    },
    eventTime: {
      type: String,
      default: '',
    },
    eventLocation: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

clubPostSchema.index({ club: 1, createdAt: -1 });

module.exports = mongoose.model('ClubPost', clubPostSchema);
