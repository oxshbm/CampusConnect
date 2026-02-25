import { useState } from 'react';
import * as clubApi from '../api/clubApi';

export const useClubs = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApprovedClubs = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await clubApi.getApprovedClubs(params);
      return response.data?.data || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchClubById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await clubApi.getClubById(id);
      return response.data?.data || null;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createNewClub = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await clubApi.createClub(data);
      return response.data?.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExistingClub = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await clubApi.updateClub(id, data);
      return response.data?.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteExistingClub = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await clubApi.deleteClub(id);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addClubMember = async (clubId, email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await clubApi.addMember(clubId, email);
      return response.data?.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeClubMember = async (clubId, userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await clubApi.removeMember(clubId, userId);
      return response.data?.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchClubPosts = async (clubId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await clubApi.getClubPosts(clubId);
      return response.data?.data || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createClubPost = async (clubId, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await clubApi.createPost(clubId, data);
      return response.data?.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteClubPost = async (clubId, postId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await clubApi.deletePost(clubId, postId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchApprovedClubs,
    fetchClubById,
    createNewClub,
    updateExistingClub,
    deleteExistingClub,
    addClubMember,
    removeClubMember,
    fetchClubPosts,
    createClubPost,
    deleteClubPost,
  };
};
