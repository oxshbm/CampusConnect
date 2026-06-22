import axiosInstance from './axiosInstance';

export const getQuestions = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.append(key, value);
  });
  const response = await axiosInstance.get(`/forum?${query.toString()}`);
  return response.data;
};

export const getQuestion = async (id) => {
  const response = await axiosInstance.get(`/forum/${id}`);
  return response.data;
};

export const createQuestion = async (payload) => {
  const response = await axiosInstance.post('/forum', payload);
  return response.data;
};

export const voteOnQuestion = async (id, voteType) => {
  const response = await axiosInstance.post(`/forum/${id}/vote`, { voteType });
  return response.data;
};

export const deleteQuestion = async (id) => {
  const response = await axiosInstance.delete(`/forum/${id}`);
  return response.data;
};

export const addComment = async (questionId, content) => {
  const response = await axiosInstance.post(`/forum/${questionId}/comments`, { content });
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await axiosInstance.delete(`/forum/comments/${commentId}`);
  return response.data;
};
