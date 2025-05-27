import api from '@/services/api';
import { useState } from 'react';

export const useFetch = () => {
  const [fetchError, setFetchError] = useState(null);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      return res.data;
    } catch (e) {
      console.error(e);
      setFetchError(e.response.data.message);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await api.get('/posts/user');
      return res.data;
    } catch (e) {
      console.error(e);
      setFetchError(e.response.data.message);
    }
  };

  const fetchUserData = async () => {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch (e) {
      console.error(e);
      setFetchError(e.response.data.message);
    }
  };

  return { fetchPosts, fetchUserPosts, fetchError, setFetchError, fetchUserData };
};
