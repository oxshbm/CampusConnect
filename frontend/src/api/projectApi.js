import axiosInstance from './axiosInstance';

export const getOpenProjects = async (techStack, title) => {
  const params = new URLSearchParams();
  if (techStack) params.append('techStack', techStack);
  if (title) params.append('title', title);

  const response = await axiosInstance.get(`/projects?${params.toString()}`);
  return response.data;
};

export const getProjectById = async (projectId) => {
  const response = await axiosInstance.get(`/projects/${projectId}`);
  return response.data;
};

export const createProject = async (title, description, techStack, maxMembers, deadline, status) => {
  const response = await axiosInstance.post('/projects', {
    title,
    description,
    techStack,
    maxMembers,
    deadline,
    status,
  });
  return response.data;
};

export const updateProject = async (projectId, title, description, techStack, maxMembers, deadline, status) => {
  const response = await axiosInstance.put(`/projects/${projectId}`, {
    title,
    description,
    techStack,
    maxMembers,
    deadline,
    status,
  });
  return response.data;
};

export const deleteProject = async (projectId) => {
  const response = await axiosInstance.delete(`/projects/${projectId}`);
  return response.data;
};

export const applyToProject = async (projectId) => {
  const response = await axiosInstance.post(`/projects/${projectId}/apply`);
  return response.data;
};

export const leaveProject = async (projectId) => {
  const response = await axiosInstance.post(`/projects/${projectId}/leave`);
  return response.data;
};

export const getApplications = async (projectId) => {
  const response = await axiosInstance.get(`/projects/${projectId}/applications`);
  return response.data;
};

export const approveApplication = async (projectId, applicantId) => {
  const response = await axiosInstance.post(`/projects/${projectId}/applications/${applicantId}/approve`);
  return response.data;
};

export const rejectApplication = async (projectId, applicantId) => {
  const response = await axiosInstance.post(`/projects/${projectId}/applications/${applicantId}/reject`);
  return response.data;
};
