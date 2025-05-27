import api from './api';

export const getUserName = async (userId) => {
  const res = await api.get(`/auth/username/${userId}`);
  return res.data;
};
