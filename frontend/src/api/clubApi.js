import axiosInstance from './axiosInstance';

// Club CRUD
export const getApprovedClubs = async (params) => {
  return axiosInstance.get('/clubs', { params });
};

export const getClubById = async (id) => {
  return axiosInstance.get(`/clubs/${id}`);
};

export const createClub = async (data) => {
  return axiosInstance.post('/clubs', data);
};

export const updateClub = async (id, data) => {
  return axiosInstance.put(`/clubs/${id}`, data);
};

export const deleteClub = async (id) => {
  return axiosInstance.delete(`/clubs/${id}`);
};

// Member management
export const addMember = async (clubId, email) => {
  return axiosInstance.post(`/clubs/${clubId}/members`, { email });
};

export const removeMember = async (clubId, userId) => {
  return axiosInstance.delete(`/clubs/${clubId}/members/${userId}`);
};

// Post management
export const getClubPosts = async (clubId) => {
  return axiosInstance.get(`/clubs/${clubId}/posts`);
};

export const createPost = async (clubId, data) => {
  return axiosInstance.post(`/clubs/${clubId}/posts`, data);
};

export const deletePost = async (clubId, postId) => {
  return axiosInstance.delete(`/clubs/${clubId}/posts/${postId}`);
};
