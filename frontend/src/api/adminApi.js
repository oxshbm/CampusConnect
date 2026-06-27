import axiosInstance from './axiosInstance';

export const getAdminStats = async () => {
  return axiosInstance.get('/admin/stats');
};

export const getAllUsers = async () => {
  return axiosInstance.get('/admin/users');
};

export const banUser = async (id) => {
  return axiosInstance.put(`/admin/users/${id}/ban`);
};

export const unbanUser = async (id) => {
  return axiosInstance.put(`/admin/users/${id}/unban`);
};

export const deleteUser = async (id) => {
  return axiosInstance.delete(`/admin/users/${id}`);
};

export const getAllGroups = async () => {
  return axiosInstance.get('/admin/groups');
};

export const deleteGroup = async (id) => {
  return axiosInstance.delete(`/admin/groups/${id}`);
};

export const getAllAdminEvents = async () => {
  return axiosInstance.get('/admin/events');
};

export const approveEvent = async (id) => {
  return axiosInstance.put(`/admin/events/${id}/approve`);
};

export const denyEvent = async (id) => {
  return axiosInstance.put(`/admin/events/${id}/deny`);
};

export const deleteAdminEvent = async (id) => {
  return axiosInstance.delete(`/admin/events/${id}`);
};

export const getAllAdminClubs = async () => {
  return axiosInstance.get('/admin/clubs');
};

export const approveClub = async (id) => {
  return axiosInstance.put(`/admin/clubs/${id}/approve`);
};

export const denyClub = async (id) => {
  return axiosInstance.put(`/admin/clubs/${id}/deny`);
};

export const deleteAdminClub = async (id) => {
  return axiosInstance.delete(`/admin/clubs/${id}`);
};

export const getAllAdmins = async () => {
  return axiosInstance.get('/admin/admins');
};

export const createAdmin = async (name, email, password) => {
  return axiosInstance.post('/admin/create-admin', { name, email, password });
};

export const getAllForumPosts = async () => {
  return axiosInstance.get('/admin/forum/posts');
};

export const deleteForumPost = async (id) => {
  return axiosInstance.delete(`/admin/forum/posts/${id}`);
};

export const getAllComments = async () => {
  return axiosInstance.get('/admin/forum/comments');
};

export const deleteComment = async (id) => {
  return axiosInstance.delete(`/admin/forum/comments/${id}`);
};
