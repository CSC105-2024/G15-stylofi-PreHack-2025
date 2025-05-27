import api from './api';

export const getUserById = async (userId) => {
  const res = await api.get(`/auth/${userId}`);
  return res.data;
};
