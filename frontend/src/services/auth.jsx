import { redirect } from 'react-router-dom';
import api from './api';

const CACHE_DURATION = 15 * 60 * 1000;

export const checkAuthStatus = async () => {
  const cachedTimestamp = localStorage.getItem('authTimestamp');
  const currentTime = Date.now();

  if (cachedTimestamp && currentTime - Number(cachedTimestamp) < CACHE_DURATION) {
    return true;
  }

  try {
    const res = await api.get('/auth/check');

    const isAuthenticated = res.data?.authenticated;

    if (isAuthenticated) {
      localStorage.setItem('authTimestamp', Date.now().toString());
      return true;
    } else {
      clearAuthData();
      return false;
    }
  } catch (err) {
    clearAuthData();
    return false;
  }
};
export const publicRouteLoader = async () => {
  const isAuthenticated = await checkAuthStatus();
  if (isAuthenticated) {
    return redirect('/dashboard');
  }
  return null;
};

export const protectedRouteLoader = async () => {
  const isAuthenticated = await checkAuthStatus();
  if (!isAuthenticated) {
    return redirect('/signin');
  }
  return null;
};

export const clearAuthData = async () => {
  localStorage.removeItem('authTimestamp');

  await api.post('/auth/signout').catch(() => {});
};

export const storeAuthToken = (token) => {
  if (!token) return;

  localStorage.setItem('authTimestamp', new Date().getTime().toString());

  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};
