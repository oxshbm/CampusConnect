const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Project = require('../models/Project');
const ProjectMessage = require('../models/ProjectMessage');

const sameId = (a, b) => a?.toString() === b?.toString();

const registerProjectChat = (io) => {
  io.use(async (socket, next) => {
    // If user is already set by another middleware (e.g. groupChat), avoid re-fetching
    if (socket.user) return next();

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
    socket.on('project:join', async ({ projectId }, callback) => {
      try {
        const project = await Project.findById(projectId).select('members');
        if (!project) throw new Error('Project not found');
        if (!project.members.some((member) => sameId(member, socket.user._id))) {
          throw new Error('Only project members can join chat');
        }

        socket.join(`project:${project._id}`);
        callback?.({ success: true });
      } catch (error) {
        callback?.({ success: false, message: error.message });
      }
    });

    socket.on('project:message', async ({ projectId, body }, callback) => {
      try {
        const text = (body || '').trim();
        if (!text) throw new Error('Message cannot be empty');

        const project = await Project.findById(projectId).select('members');
        if (!project) throw new Error('Project not found');
        if (!project.members.some((member) => sameId(member, socket.user._id))) {
          throw new Error('Only project members can send messages');
        }

        const message = await ProjectMessage.create({
          project: project._id,
          sender: socket.user._id,
          body: text,
        });
        const populated = await message.populate('sender', 'name');

        io.to(`project:${project._id}`).emit('project:message', populated);
        callback?.({ success: true, data: populated });
      } catch (error) {
        callback?.({ success: false, message: error.message });
      }
    });
  });
};

module.exports = registerProjectChat;
