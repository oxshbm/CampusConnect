import axiosInstance from './axiosInstance';

export const getPublicGroups = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.append(key, value);
  });

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

export const createGroup = async (payload) => {
  const response = await axiosInstance.post('/groups', payload);
  return response.data;
};

export const updateGroup = async (groupId, payload) => {
  const response = await axiosInstance.put(`/groups/${groupId}`, payload);
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

export const requestToJoinGroup = async (groupId, message = '') => {
  const response = await axiosInstance.post(`/groups/${groupId}/requests`, { message });
  return response.data;
};

export const cancelJoinRequest = async (groupId) => {
  const response = await axiosInstance.delete(`/groups/${groupId}/requests/me`);
  return response.data;
};

export const getJoinRequests = async (groupId) => {
  const response = await axiosInstance.get(`/groups/${groupId}/requests`);
  return response.data;
};

export const approveJoinRequest = async (groupId, requestId) => {
  const response = await axiosInstance.post(`/groups/${groupId}/requests/${requestId}/approve`);
  return response.data;
};

export const rejectJoinRequest = async (groupId, requestId) => {
  const response = await axiosInstance.post(`/groups/${groupId}/requests/${requestId}/reject`);
  return response.data;
};

export const transferOwnership = async (groupId, newOwnerId) => {
  const response = await axiosInstance.post(`/groups/${groupId}/transfer-ownership`, { newOwnerId });
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

export const getGroupMessages = async (groupId) => {
  const response = await axiosInstance.get(`/groups/${groupId}/messages`);
  return response.data;
};

export const sendGroupMessage = async (groupId, body) => {
  const response = await axiosInstance.post(`/groups/${groupId}/messages`, { body });
  return response.data;
};

export const addGroupMember = async (groupId, email) => {
  const response = await axiosInstance.post(`/groups/${groupId}/members`, { email });
  return response.data;
};

export const removeGroupMember = async (groupId, userId) => {
  const response = await axiosInstance.delete(`/groups/${groupId}/members/${userId}`);
  return response.data;
};
