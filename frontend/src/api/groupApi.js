import axiosInstance from './axiosInstance';

export const getPublicGroups = async (subject, tags) => {
  const params = new URLSearchParams();
  if (subject) params.append('subject', subject);
  if (tags) params.append('tags', tags);

  const response = await axiosInstance.get(`/groups?${params.toString()}`);
  return response.data;
};

export const getMyGroups = async () => {
  const response = await axiosInstance.get('/groups/my-groups');
  return response.data;
};

export const getGroupById = async (groupId) => {
  const response = await axiosInstance.get(`/groups/${groupId}`);
  return response.data;
};

export const createGroup = async (name, subject, description, semester, tags, visibility, maxMembers) => {
  const response = await axiosInstance.post('/groups', {
    name,
    subject,
    description,
    semester,
    tags,
    visibility,
    maxMembers,
  });
  return response.data;
};

export const updateGroup = async (groupId, name, subject, description, semester, tags, visibility, maxMembers) => {
  const response = await axiosInstance.put(`/groups/${groupId}`, {
    name,
    subject,
    description,
    semester,
    tags,
    visibility,
    maxMembers,
  });
  return response.data;
};

export const deleteGroup = async (groupId) => {
  const response = await axiosInstance.delete(`/groups/${groupId}`);
  return response.data;
};

export const joinGroup = async (groupId) => {
  const response = await axiosInstance.post(`/groups/${groupId}/join`);
  return response.data;
};

export const leaveGroup = async (groupId) => {
  const response = await axiosInstance.post(`/groups/${groupId}/leave`);
  return response.data;
};

export const getGroupMembers = async (groupId) => {
  const response = await axiosInstance.get(`/groups/${groupId}/members`);
  return response.data;
};
