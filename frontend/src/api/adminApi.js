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
