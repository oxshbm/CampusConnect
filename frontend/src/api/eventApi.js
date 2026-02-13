import axiosInstance from './axiosInstance';

export const getApprovedEvents = async (params) => {
  return axiosInstance.get('/events', { params });
};

export const createEvent = async (data) => {
  return axiosInstance.post('/events', data);
};

export const getEventById = async (id) => {
  return axiosInstance.get(`/events/${id}`);
};

export const rsvpEvent = async (id) => {
  return axiosInstance.post(`/events/${id}/rsvp`);
};

export const cancelRsvp = async (id) => {
  return axiosInstance.delete(`/events/${id}/rsvp`);
};
