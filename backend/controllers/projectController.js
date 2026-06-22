const mongoose = require('mongoose');
const Project = require('../models/Project');
const User = require('../models/User');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const sameId = (a, b) => a?.toString() === b?.toString();

const normalizeTechStack = (techStack) => {
  if (!techStack) return [];
  const source = Array.isArray(techStack) ? techStack : String(techStack).split(',');
  return [...new Set(source.map((t) => t.trim().toLowerCase()).filter(Boolean))];
};

const sendError = (res, error, fallback) => {
  console.error(fallback, error);
  res.status(error.status || 500).json({ success: false, message: error.status ? error.message : fallback });
};

// Retrieve open projects with optional title and techStack query filters
const getOpenProjects = async (req, res) => {
  try {
    const { techStack, title } = req.query;
    const filter = { status: 'open' };

    if (title) {
      filter.title = { $regex: title.trim(), $options: 'i' };
    }

    if (techStack) {
      const normalized = normalizeTechStack(techStack);
      if (normalized.length > 0) {
        filter.techStack = { $in: normalized };
      }
    }

    const projects = await Project.find(filter)
      .populate('createdBy', 'name course year')
      .populate('members', 'name email course year')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch open projects');
  }
};

// Retrieve full details of a specific project
const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!isValidId(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project id' });
    }

    const project = await Project.findById(projectId)
      .populate('createdBy', 'name course year')
      .populate('members', 'name email course year')
      .populate('applications.user', 'name email course year');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch project details');
  }
};

// Create a new project (auto-adds creator to members)
const createProject = async (req, res) => {
  try {
    const { title, description, techStack, maxMembers, deadline } = req.body;

    if (!title || !description || !deadline) {
      return res.status(400).json({ success: false, message: 'Title, description, and deadline are required' });
    }

    const trimmedDescription = description.trim();
    if (trimmedDescription.length > 500) {
      return res.status(400).json({ success: false, message: 'Description cannot exceed 500 characters' });
    }

    const maxMembersNum = Number(maxMembers) || 5;
    if (maxMembersNum < 1) {
      return res.status(400).json({ success: false, message: 'Max members must be at least 1' });
    }

    const project = await Project.create({
      title: title.trim(),
      description: trimmedDescription,
      techStack: normalizeTechStack(techStack),
      maxMembers: maxMembersNum,
      deadline: new Date(deadline),
      createdBy: req.user._id,
      members: [req.user._id],
    });

    const populatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name course year')
      .populate('members', 'name email course year');

    res.status(201).json({
      success: true,
      data: populatedProject,
    });
  } catch (error) {
    sendError(res, error, 'Failed to create project');
  }
};

// Update project details (title, techStack, etc. - owner only)
const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!isValidId(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project id' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!sameId(project.createdBy, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only the project owner can perform this action' });
    }

    const { title, description, techStack, maxMembers, deadline, status } = req.body;

    if (description) {
      const trimmedDesc = description.trim();
      if (trimmedDesc.length > 500) {
        return res.status(400).json({ success: false, message: 'Description cannot exceed 500 characters' });
      }
      project.description = trimmedDesc;
    }

    if (maxMembers !== undefined) {
      const maxMembersNum = Number(maxMembers);
      if (isNaN(maxMembersNum) || maxMembersNum < 1) {
        return res.status(400).json({ success: false, message: 'Max members must be at least 1' });
      }
      if (maxMembersNum < project.members.length) {
        return res.status(409).json({ success: false, message: 'Max members cannot be lower than current member count' });
      }
      project.maxMembers = maxMembersNum;
    }

    if (title) project.title = title.trim();
    if (techStack !== undefined) project.techStack = normalizeTechStack(techStack);
    if (deadline) project.deadline = new Date(deadline);
    if (status) project.status = status;

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name course year')
      .populate('members', 'name email course year')
      .populate('applications.user', 'name email course year');

    res.json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    sendError(res, error, 'Failed to update project');
  }
};

// Delete a project and clean up memberships (owner only)
const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!isValidId(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project id' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!sameId(project.createdBy, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only the project owner can perform this action' });
    }

    await Project.findByIdAndDelete(projectId);

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    sendError(res, error, 'Failed to delete project');
  }
};

// Apply to join a project (non-members/non-owners only)
const applyToProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!isValidId(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project id' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Project is not open for applications' });
    }

    if (sameId(project.createdBy, req.user._id)) {
      return res.status(400).json({ success: false, message: 'You cannot apply to your own project' });
    }

    const isMember = project.members.some((memberId) => sameId(memberId, req.user._id));
    if (isMember) {
      return res.status(400).json({ success: false, message: 'You are already a member of this project' });
    }

    const existingAppIndex = project.applications.findIndex((app) => sameId(app.user, req.user._id));
    if (existingAppIndex !== -1) {
      const existingApp = project.applications[existingAppIndex];
      if (existingApp.status === 'pending') {
        return res.status(400).json({ success: false, message: 'You have already applied to this project' });
      } else if (existingApp.status === 'rejected') {
        // Allow re-applying by updating status back to pending
        existingApp.status = 'pending';
        existingApp.appliedAt = new Date();
      } else if (existingApp.status === 'approved') {
        return res.status(400).json({ success: false, message: 'Your application is already approved' });
      }
    } else {
      project.applications.push({
        user: req.user._id,
        status: 'pending',
      });
    }

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name course year')
      .populate('members', 'name email course year')
      .populate('applications.user', 'name email course year');

    res.json({
      success: true,
      data: populatedProject,
      message: 'Application submitted successfully',
    });
  } catch (error) {
    sendError(res, error, 'Failed to apply to project');
  }
};

// Leave a project (non-owner members only)
const leaveProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!isValidId(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project id' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (sameId(project.createdBy, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Project creators cannot leave their own project. Delete the project instead.' });
    }

    const memberIndex = project.members.findIndex((memberId) => sameId(memberId, req.user._id));
    if (memberIndex === -1) {
      return res.status(400).json({ success: false, message: 'You are not a member of this project' });
    }

    // Pull from members
    project.members.splice(memberIndex, 1);

    // Remove application reference so they can apply again if they leave
    project.applications = project.applications.filter((app) => !sameId(app.user, req.user._id));

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name course year')
      .populate('members', 'name email course year')
      .populate('applications.user', 'name email course year');

    res.json({
      success: true,
      data: populatedProject,
      message: 'Left project successfully',
    });
  } catch (error) {
    sendError(res, error, 'Failed to leave project');
  }
};

// Retrieve the list of pending applications (owner only)
const getApplications = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!isValidId(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project id' });
    }

    const project = await Project.findById(projectId)
      .populate('applications.user', 'name email course year');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!sameId(project.createdBy, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only the project owner can perform this action' });
    }

    res.json({
      success: true,
      data: project.applications,
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch applications');
  }
};

// Approve an applicant (owner only, adds to members)
const approveApplication = async (req, res) => {
  try {
    const { projectId, applicantId } = req.params;
    if (!isValidId(projectId) || !isValidId(applicantId)) {
      return res.status(400).json({ success: false, message: 'Invalid project id or applicant id' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!sameId(project.createdBy, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only the project owner can perform this action' });
    }

    // Find the application
    const application = project.applications.find((app) => sameId(app.user, applicantId));
    if (!application || application.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Pending application not found for this user' });
    }

    // Check if team is full
    if (project.members.length >= project.maxMembers) {
      return res.status(400).json({ success: false, message: 'Project has reached maximum member capacity' });
    }

    // Approve the application
    application.status = 'approved';

    // Add to members if not already there
    if (!project.members.some((memberId) => sameId(memberId, applicantId))) {
      project.members.push(applicantId);
    }

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name course year')
      .populate('members', 'name email course year')
      .populate('applications.user', 'name email course year');

    res.json({
      success: true,
      data: populatedProject,
      message: 'Application approved successfully',
    });
  } catch (error) {
    sendError(res, error, 'Failed to approve application');
  }
};

// Reject an applicant (owner only)
const rejectApplication = async (req, res) => {
  try {
    const { projectId, applicantId } = req.params;
    if (!isValidId(projectId) || !isValidId(applicantId)) {
      return res.status(400).json({ success: false, message: 'Invalid project id or applicant id' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!sameId(project.createdBy, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only the project owner can perform this action' });
    }

    // Find the application
    const application = project.applications.find((app) => sameId(app.user, applicantId));
    if (!application || application.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Pending application not found for this user' });
    }

    // Reject the application
    application.status = 'rejected';

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name course year')
      .populate('members', 'name email course year')
      .populate('applications.user', 'name email course year');

    res.json({
      success: true,
      data: populatedProject,
      message: 'Application rejected successfully',
    });
  } catch (error) {
    sendError(res, error, 'Failed to reject application');
  }
};

module.exports = {
  getOpenProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  applyToProject,
  leaveProject,
  getApplications,
  approveApplication,
  rejectApplication,
};
