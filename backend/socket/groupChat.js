const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudyGroup = require('../models/StudyGroup');
const GroupMessage = require('../models/GroupMessage');

const sameId = (a, b) => a?.toString() === b?.toString();

const registerGroupChat = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication required'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user || user.isBanned) return next(new Error('Authentication failed'));

      socket.user = user;
      return next();
    } catch (error) {
      return next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('group:join', async ({ groupId }, callback) => {
      try {
        const group = await StudyGroup.findById(groupId).select('members');
        if (!group) throw new Error('Group not found');
        if (!group.members.some((member) => sameId(member, socket.user._id))) {
          throw new Error('Only group members can join chat');
        }

        socket.join(`group:${group._id}`);
        callback?.({ success: true });
      } catch (error) {
        callback?.({ success: false, message: error.message });
      }
    });

    socket.on('group:message', async ({ groupId, body }, callback) => {
      try {
        const text = (body || '').trim();
        if (!text) throw new Error('Message cannot be empty');

        const group = await StudyGroup.findById(groupId).select('members');
        if (!group) throw new Error('Group not found');
        if (!group.members.some((member) => sameId(member, socket.user._id))) {
          throw new Error('Only group members can send messages');
        }

        const message = await GroupMessage.create({
          group: group._id,
          sender: socket.user._id,
          body: text,
        });
        const populated = await message.populate('sender', 'name');

        io.to(`group:${group._id}`).emit('group:message', populated);
        callback?.({ success: true, data: populated });
      } catch (error) {
        callback?.({ success: false, message: error.message });
      }
    });
  });
};

module.exports = registerGroupChat;
