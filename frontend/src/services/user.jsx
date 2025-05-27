import api from './api';

export const getUserById = async (userId) => {
  const res = await api.get(`/auth/${userId}`);
  return res.data;
};

export const getUserName = async (userId) => {
  const res = await api.get(`/auth/username/${userId}`);
  return res.data;
};
