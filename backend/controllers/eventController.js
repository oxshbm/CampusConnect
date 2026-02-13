const Event = require('../models/Event');
const User = require('../models/User');

const getApprovedEvents = async (req, res) => {
  try {
    const { category, locationType } = req.query;
    const filter = { status: 'approved' };

    if (category && category !== 'all') {
      filter.category = category;
    }
    if (locationType && locationType !== 'all') {
      filter.locationType = locationType;
    }

    const events = await Event.find(filter)
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email')
      .sort({ date: 1 });

    res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error('GetApprovedEvents error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, description, category, date, time, locationType, locationDetail, agenda, maxAttendees, contactInfo } = req.body;

    // Validate required fields
    if (!title || !description || !category || !date || !time || !locationType) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Validate date is in the future
    if (new Date(date) < new Date()) {
      return res.status(400).json({ success: false, message: 'Event date must be in the future' });
    }

    // Validate location detail if in-person
    if (locationType === 'in-person' && !locationDetail) {
      return res.status(400).json({ success: false, message: 'Location address is required for in-person events' });
    }

    const event = new Event({
      title,
      description,
      category,
      date,
      time,
      locationType,
      locationDetail,
      agenda,
      maxAttendees: maxAttendees || null,
      contactInfo,
      createdBy: req.user._id,
      status: 'pending',
      attendees: [],
    });

    await event.save();

    const populatedEvent = await Event.findById(event._id)
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email');

    res.status(201).json({
      success: true,
      data: populatedEvent,
    });
  } catch (error) {
    console.error('CreateEvent error:', error);
    res.status(500).json({ success: false, message: 'Failed to create event' });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('GetEventById error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch event' });
  }
};

const rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if user already attending
    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You are already attending this event' });
    }

    // Check max attendees
    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ success: false, message: 'Event is full' });
    }

    // Add user to attendees
    event.attendees.push(req.user._id);
    await event.save();

    const updatedEvent = await Event.findById(event._id)
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email');

    res.json({
      success: true,
      data: updatedEvent,
    });
  } catch (error) {
    console.error('RsvpEvent error:', error);
    res.status(500).json({ success: false, message: 'Failed to RSVP to event' });
  }
};

const cancelRsvp = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Remove user from attendees
    event.attendees = event.attendees.filter((id) => id.toString() !== req.user._id.toString());
    await event.save();

    const updatedEvent = await Event.findById(event._id)
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email');

    res.json({
      success: true,
      data: updatedEvent,
    });
  } catch (error) {
    console.error('CancelRsvp error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel RSVP' });
  }
};

module.exports = {
  getApprovedEvents,
  createEvent,
  getEventById,
  rsvpEvent,
  cancelRsvp,
};
