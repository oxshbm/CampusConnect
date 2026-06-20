const mongoose = require('mongoose');
const StudyGroup = require('../models/StudyGroup');
const GroupJoinRequest = require('../models/GroupJoinRequest');
const GroupMessage = require('../models/GroupMessage');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const sameId = (a, b) => a?.toString() === b?.toString();
const toId = (value) => value?._id || value;

const normalizeTags = (tags) => {
  if (!tags) return [];
  const source = Array.isArray(tags) ? tags : String(tags).split(',');
  return [...new Set(source.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
};

const normalizePayload = (body, existing = {}) => {
  const payload = {};
  const stringFields = ['name', 'subject', 'description', 'semester', 'visibility', 'meetingType', 'location', 'startTime', 'duration'];

  stringFields.forEach((field) => {
    if (body[field] !== undefined) {
      payload[field] = typeof body[field] === 'string' ? body[field].trim() : body[field];
    }
  });

  if (body.tags !== undefined) payload.tags = normalizeTags(body.tags);
  if (body.scheduleDays !== undefined) payload.scheduleDays = Array.isArray(body.scheduleDays) ? body.scheduleDays : [];
  if (body.maxMembers !== undefined) payload.maxMembers = Number(body.maxMembers);

  const next = { ...existing, ...payload };
  if (!next.name || !next.subject) {
    const error = new Error('Name and subject are required');
    error.status = 400;
    throw error;
  }

  if (next.maxMembers && (!Number.isInteger(next.maxMembers) || next.maxMembers < 1 || next.maxMembers > 100)) {
    const error = new Error('Max members must be between 1 and 100');
    error.status = 400;
    throw error;
  }

  if (next.meetingType === 'in-person' && !next.location) {
    const error = new Error('Location is required for in-person meetings');
    error.status = 400;
    throw error;
  }

  return payload;
};

const getPendingRequestMap = async (groups, userId) => {
  if (!userId || groups.length === 0) return new Map();
  const requests = await GroupJoinRequest.find({
    group: { $in: groups.map((group) => group._id) },
    requester: userId,
    status: 'pending',
  }).select('group status');

  return new Map(requests.map((request) => [request.group.toString(), request.status]));
};

const decorateGroup = (groupDoc, userId, requestStatus) => {
  const group = groupDoc.toObject ? groupDoc.toObject() : groupDoc;
  const members = group.members || [];
  const isOwner = Boolean(userId && sameId(toId(group.createdBy), userId));
  const isMember = Boolean(userId && members.some((member) => sameId(toId(member), userId)));
  const memberCount = members.length;
  const visibleMembers = isMember || isOwner
    ? members
    : members.map((member) => ({
        _id: member._id,
        name: member.name,
        course: member.course,
        year: member.year,
      }));

  return {
    ...group,
    members: visibleMembers,
    memberCount,
    isOwner,
    isCreator: isOwner,
    isMember,
    isFull: memberCount >= group.maxMembers,
    requestStatus: isMember || isOwner ? null : requestStatus || null,
  };
};

const getGroupOr404 = async (groupId) => {
  if (!isValidId(groupId)) {
    const error = new Error('Invalid group id');
    error.status = 400;
    throw error;
  }

  const group = await StudyGroup.findById(groupId)
    .populate('createdBy', 'name course year')
    .populate('members', 'name email course year');

  if (!group) {
    const error = new Error('Group not found');
    error.status = 404;
    throw error;
  }

  return group;
};

const requireOwner = (group, userId) => {
  if (!sameId(group.createdBy?._id || group.createdBy, userId)) {
    const error = new Error('Only the group owner can perform this action');
    error.status = 403;
    throw error;
  }
};

const requireMember = (group, userId) => {
  const isMember = group.members.some((member) => sameId(member._id || member, userId));
  if (!isMember) {
    const error = new Error('Only group members can access this');
    error.status = 403;
    throw error;
  }
};

const sendError = (res, error, fallback) => {
  console.error(fallback, error);
  res.status(error.status || 500).json({ success: false, message: error.status ? error.message : fallback });
};

const getPublicGroups = async (req, res) => {
  try {
    const { q, subject, tags, meetingType, page = 1, limit = 30 } = req.query;
    const filter = {};

    if (q) {
      const regex = { $regex: q.trim(), $options: 'i' };
      filter.$or = [{ name: regex }, { subject: regex }, { description: regex }, { tags: regex }];
    }
    if (subject) filter.subject = { $regex: subject.trim(), $options: 'i' };
    if (tags) filter.tags = { $in: normalizeTags(tags) };
    if (meetingType) filter.meetingType = meetingType;

    const safeLimit = Math.min(Math.max(Number(limit) || 30, 1), 50);
    const safePage = Math.max(Number(page) || 1, 1);
    const [groups, total] = await Promise.all([
      StudyGroup.find(filter)
        .populate('createdBy', 'name course year')
        .populate('members', 'name course year')
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit),
      StudyGroup.countDocuments(filter),
    ]);

    const requestMap = await getPendingRequestMap(groups, req.user?._id);
    res.json({
      success: true,
      data: groups.map((group) => decorateGroup(group, req.user?._id, requestMap.get(group._id.toString()))),
      pagination: { page: safePage, limit: safeLimit, total },
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch groups');
  }
};

const getMyGroups = async (req, res) => {
  try {
    const groups = await StudyGroup.find({ members: req.user._id })
      .populate('createdBy', 'name course year')
      .populate('members', 'name email course year')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: groups.map((group) => decorateGroup(group, req.user._id)),
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch groups');
  }
};

const getGroupById = async (req, res) => {
  try {
    const group = await getGroupOr404(req.params.id);
    const request = req.user
      ? await GroupJoinRequest.findOne({ group: group._id, requester: req.user._id, status: 'pending' })
      : null;

    res.json({
      success: true,
      data: decorateGroup(group, req.user?._id, request?.status),
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch group');
  }
};

const createGroup = async (req, res) => {
  try {
    const payload = normalizePayload(req.body, { maxMembers: 30, meetingType: 'virtual' });
    const group = await StudyGroup.create({
      ...payload,
      visibility: payload.visibility || 'public',
      createdBy: req.user._id,
      members: [req.user._id],
      maxMembers: payload.maxMembers || 30,
      meetingType: payload.meetingType || 'virtual',
      location: payload.location || '',
      scheduleDays: payload.scheduleDays || [],
      startTime: payload.startTime || '',
      duration: payload.duration || '',
    });

    const populatedGroup = await getGroupOr404(group._id);
    res.status(201).json({
      success: true,
      data: decorateGroup(populatedGroup, req.user._id),
    });
  } catch (error) {
    sendError(res, error, 'Failed to create group');
  }
};

const updateGroup = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid group id' });
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    requireOwner(group, req.user._id);

    const payload = normalizePayload(req.body, group.toObject());
    if (payload.maxMembers && payload.maxMembers < group.members.length) {
      return res.status(409).json({ success: false, message: 'Max members cannot be lower than current member count' });
    }

    Object.assign(group, payload);
    await group.save();

    const updatedGroup = await getGroupOr404(group._id);
    res.json({
      success: true,
      data: decorateGroup(updatedGroup, req.user._id),
    });
  } catch (error) {
    sendError(res, error, 'Failed to update group');
  }
};

const deleteGroup = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid group id' });
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    requireOwner(group, req.user._id);

    await Promise.all([
      GroupJoinRequest.deleteMany({ group: group._id }),
      GroupMessage.deleteMany({ group: group._id }),
      StudyGroup.findByIdAndDelete(group._id),
    ]);

    res.json({ success: true, message: 'Group deleted permanently' });
  } catch (error) {
    sendError(res, error, 'Failed to delete group');
  }
};

const requestToJoinGroup = async (req, res) => {
  try {
    const group = await getGroupOr404(req.params.id);
    const userId = req.user._id;

    if (group.members.some((member) => sameId(member._id, userId))) {
      return res.status(409).json({ success: false, message: 'You are already a member of this group' });
    }
    if (group.members.length >= group.maxMembers) {
      return res.status(409).json({ success: false, message: 'Group is full' });
    }

    const request = await GroupJoinRequest.findOneAndUpdate(
      { group: group._id, requester: userId, status: 'pending' },
      {
        $setOnInsert: {
          group: group._id,
          requester: userId,
          status: 'pending',
          message: (req.body.message || '').trim(),
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate('requester', 'name email course year');

    res.status(201).json({
      success: true,
      data: request,
      group: decorateGroup(group, userId, 'pending'),
      message: 'Join request sent to the group owner',
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Join request is already pending' });
    }
    sendError(res, error, 'Failed to request joining group');
  }
};

const cancelJoinRequest = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid group id' });
    const request = await GroupJoinRequest.findOneAndUpdate(
      { group: req.params.id, requester: req.user._id, status: 'pending' },
      { status: 'cancelled' },
      { new: true }
    );

    if (!request) return res.status(404).json({ success: false, message: 'Pending request not found' });
    res.json({ success: true, data: request });
  } catch (error) {
    sendError(res, error, 'Failed to cancel request');
  }
};

const getJoinRequests = async (req, res) => {
  try {
    const group = await getGroupOr404(req.params.id);
    requireOwner(group, req.user._id);

    const requests = await GroupJoinRequest.find({ group: group._id, status: 'pending' })
      .populate('requester', 'name email course year')
      .sort({ createdAt: 1 });

    res.json({ success: true, data: requests });
  } catch (error) {
    sendError(res, error, 'Failed to fetch join requests');
  }
};

const approveJoinRequest = async (req, res) => {
  try {
    if (!isValidId(req.params.requestId)) return res.status(400).json({ success: false, message: 'Invalid request id' });
    const group = await getGroupOr404(req.params.id);
    requireOwner(group, req.user._id);

    const request = await GroupJoinRequest.findOne({ _id: req.params.requestId, group: group._id, status: 'pending' });
    if (!request) return res.status(404).json({ success: false, message: 'Pending request not found' });

    const updatedGroup = await StudyGroup.findOneAndUpdate(
      {
        _id: group._id,
        members: { $ne: request.requester },
        $expr: { $lt: [{ $size: '$members' }, '$maxMembers'] },
      },
      { $addToSet: { members: request.requester } },
      { new: true }
    );

    if (!updatedGroup) {
      return res.status(409).json({ success: false, message: 'Group is full or user is already a member' });
    }

    request.status = 'approved';
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    await request.save();

    const populatedGroup = await getGroupOr404(group._id);
    res.json({ success: true, data: decorateGroup(populatedGroup, req.user._id), request });
  } catch (error) {
    sendError(res, error, 'Failed to approve request');
  }
};

const rejectJoinRequest = async (req, res) => {
  try {
    if (!isValidId(req.params.requestId)) return res.status(400).json({ success: false, message: 'Invalid request id' });
    const group = await getGroupOr404(req.params.id);
    requireOwner(group, req.user._id);

    const request = await GroupJoinRequest.findOneAndUpdate(
      { _id: req.params.requestId, group: group._id, status: 'pending' },
      { status: 'rejected', reviewedBy: req.user._id, reviewedAt: new Date() },
      { new: true }
    ).populate('requester', 'name email course year');

    if (!request) return res.status(404).json({ success: false, message: 'Pending request not found' });
    res.json({ success: true, data: request });
  } catch (error) {
    sendError(res, error, 'Failed to reject request');
  }
};

const transferOwnership = async (req, res) => {
  try {
    const group = await getGroupOr404(req.params.id);
    requireOwner(group, req.user._id);

    const { newOwnerId } = req.body;
    if (!isValidId(newOwnerId)) return res.status(400).json({ success: false, message: 'Valid newOwnerId is required' });
    if (sameId(newOwnerId, req.user._id)) return res.status(400).json({ success: false, message: 'New owner must be another member' });

    const isMember = group.members.some((member) => sameId(member._id, newOwnerId));
    if (!isMember) return res.status(400).json({ success: false, message: 'New owner must be a group member' });

    const updated = await StudyGroup.findByIdAndUpdate(group._id, { createdBy: newOwnerId }, { new: true });
    const populatedGroup = await getGroupOr404(updated._id);
    res.json({ success: true, data: decorateGroup(populatedGroup, req.user._id) });
  } catch (error) {
    sendError(res, error, 'Failed to transfer ownership');
  }
};

const leaveGroup = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid group id' });
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    if (sameId(group.createdBy, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Transfer ownership before leaving this group' });
    }
    if (!group.members.some((member) => sameId(member, req.user._id))) {
      return res.status(400).json({ success: false, message: 'Not a member of this group' });
    }

    group.members = group.members.filter((id) => !sameId(id, req.user._id));
    await group.save();

    const updatedGroup = await getGroupOr404(group._id);
    res.json({ success: true, data: decorateGroup(updatedGroup, req.user._id) });
  } catch (error) {
    sendError(res, error, 'Failed to leave group');
  }
};

const getGroupMembers = async (req, res) => {
  try {
    const group = await getGroupOr404(req.params.id);
    requireMember(group, req.user._id);
    res.json({ success: true, data: group.members });
  } catch (error) {
    sendError(res, error, 'Failed to fetch members');
  }
};

const getGroupMessages = async (req, res) => {
  try {
    const group = await getGroupOr404(req.params.id);
    requireMember(group, req.user._id);

    const messages = await GroupMessage.find({ group: group._id })
      .populate('sender', 'name')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ success: true, data: messages.reverse() });
  } catch (error) {
    sendError(res, error, 'Failed to fetch messages');
  }
};

const createGroupMessage = async (req, res) => {
  try {
    const group = await getGroupOr404(req.params.id);
    requireMember(group, req.user._id);

    const body = (req.body.body || '').trim();
    if (!body) return res.status(400).json({ success: false, message: 'Message cannot be empty' });

    const message = await GroupMessage.create({ group: group._id, sender: req.user._id, body });
    const populated = await message.populate('sender', 'name');
    req.app.get('io')?.to(`group:${group._id}`).emit('group:message', populated);

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    sendError(res, error, 'Failed to send message');
  }
};

module.exports = {
  getPublicGroups,
  getMyGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  requestToJoinGroup,
  cancelJoinRequest,
  getJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
  transferOwnership,
  leaveGroup,
  getGroupMembers,
  getGroupMessages,
  createGroupMessage,
};
