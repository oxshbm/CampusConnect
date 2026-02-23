import { useState } from 'react';
import * as groupApi from '../api/groupApi';

export const useGroups = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPublicGroups = async (subject, tags) => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupApi.getPublicGroups(subject, tags);
      return response.data || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchMyGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupApi.getMyGroups();
      return response.data || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupById = async (groupId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupApi.getGroupById(groupId);
      return response.data || null;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createNewGroup = async (name, subject, description, semester, tags, visibility, maxMembers) => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupApi.createGroup(
        name,
        subject,
        description,
        semester,
        tags,
        visibility,
        maxMembers
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExistingGroup = async (groupId, name, subject, description, semester, tags, visibility, maxMembers) => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupApi.updateGroup(
        groupId,
        name,
        subject,
        description,
        semester,
        tags,
        visibility,
        maxMembers
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteExistingGroup = async (groupId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupApi.deleteGroup(groupId);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinExistingGroup = async (groupId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupApi.joinGroup(groupId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const leaveExistingGroup = async (groupId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupApi.leaveGroup(groupId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupMembers = async (groupId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupApi.getGroupMembers(groupId);
      return response.data || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchPublicGroups,
    fetchMyGroups,
    fetchGroupById,
    createNewGroup,
    updateExistingGroup,
    deleteExistingGroup,
    joinExistingGroup,
    leaveExistingGroup,
    fetchGroupMembers,
  };
};
