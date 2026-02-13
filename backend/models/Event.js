const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      enum: ['Academic', 'Cultural', 'Sports', 'Tech', 'Workshop', 'Other'],
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    locationType: {
      type: String,
      required: true,
      enum: ['virtual', 'in-person'],
    },
    locationDetail: {
      type: String,
      default: '',
    },
    agenda: {
      type: String,
      default: '',
      maxlength: 2000,
    },
    maxAttendees: {
      type: Number,
      default: null,
    },
    contactInfo: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'denied'],
      default: 'pending',
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

eventSchema.index({ status: 1, date: 1 });

module.exports = mongoose.model('Event', eventSchema);
