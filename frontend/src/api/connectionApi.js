import axiosInstance from './axiosInstance';

export const sendConnectionRequest = async (alumniId, message = '') => {
  const response = await axiosInstance.post(`/connections/${alumniId}`, { message });
  return response.data;
};

export const getIncomingConnections = async () => {
  const response = await axiosInstance.get('/connections/incoming');
  return response.data;
};

export const getSentConnections = async () => {
  const response = await axiosInstance.get('/connections/sent');
  return response.data;
};

export const acceptConnection = async (id) => {
  const response = await axiosInstance.put(`/connections/${id}/accept`);
  return response.data;
};

export const rejectConnection = async (id) => {
  const response = await axiosInstance.put(`/connections/${id}/reject`);
  return response.data;
};
