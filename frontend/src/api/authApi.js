import axiosInstance from './axiosInstance';

export const signup = async (name, email, password, course, year) => {
  const response = await axiosInstance.post('/auth/signup', {
    name,
    email,
    password,
    course,
    year,
  });
  return response.data;
};

export const login = async (email, password, role = 'user') => {
  const response = await axiosInstance.post('/auth/login', {
    email,
    password,
    role,
  });
  return response.data;
};

export const getMe = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};

export const updateMe = async (name, course, year) => {
  const response = await axiosInstance.put('/auth/me', {
    name,
    course,
    year,
  });
  return response.data;
};

export const signupAlumni = async (data) => {
  const response = await axiosInstance.post('/auth/signup-alumni', data);
  return response.data;
};
