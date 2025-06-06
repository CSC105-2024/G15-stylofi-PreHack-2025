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

  const likePost = async (postId) => {
    try {
      const res = await api.put(`/posts/${postId}/like`);
      return res.data;
    } catch (e) {
      console.error(e);
      setFetchError(e.response?.data?.message || 'Error liking post');
      throw e;
    }
  };

  const unlikePost = async (postId) => {
    try {
      const res = await api.put(`/posts/${postId}/unlike`);
      return res.data;
    } catch (e) {
      console.error(e);
      setFetchError(e.response?.data?.message || 'Error unliking post');
      throw e;
    }
  };

  const checkLikeStatus = async (postId) => {
    try {
      const res = await api.get(`/posts/${postId}/like-status`);
      return res.data;
    } catch (e) {
      console.error(e);
      setFetchError(e.response?.data?.message || 'Error checking like status');
      return { success: false, isLiked: false };
    }
  };

  const deletePost = async (postId) => {
    try {
      const res = await api.delete(`/posts/${postId}`);
      return res.data;
    } catch (e) {
      console.error(e);
      setFetchError(e.response?.data?.msg || 'Failed to delete post');
      throw e;
    }
  };

  const updatePost = async (postId, data) => {
    try {
      const res = await api.put(`/posts/${postId}`, data);

      // Handle both old and new response formats
      if (res.status === 204) {
        // If you get 204, treat it as success but create the expected response structure
        return {
          success: true,
          data: null,
          msg: 'Post updated successfully',
        };
      }

      return res.data;
    } catch (e) {
      console.error(e);
      setFetchError(e.response?.data?.msg || e.response?.data?.message || 'Failed to update post');
      throw e;
    }
  };

  return {
    fetchPosts,
    fetchUserPosts,
    fetchError,
    setFetchError,
    fetchUserData,
    likePost,
    unlikePost,
    checkLikeStatus,
    deletePost,
    updatePost,
  };
};
