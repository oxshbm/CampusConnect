import axiosInstance from './axiosInstance';

export const getAlumni = async () => {
  const response = await axiosInstance.get('/alumni');
  return response.data;
};

export const getAlumniById = async (id) => {
  const response = await axiosInstance.get(`/alumni/${id}`);
  return response.data;
};

export const updateAlumniProfile = async (data) => {
  const response = await axiosInstance.put('/alumni/profile', data);
  return response.data;
};
