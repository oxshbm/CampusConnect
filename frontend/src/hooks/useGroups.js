import { useState } from 'react';
import * as groupApi from '../api/groupApi';

export const useGroups = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getErrorMessage = (err) => err.response?.data?.message || err.message || 'Something went wrong';

  const fetchPublicGroups = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupApi.getPublicGroups(filters);
      return response.data || [];
    } catch (err) {
      setError(getErrorMessage(err));
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
      setError(getErrorMessage(err));
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
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createNewGroup = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupApi.createGroup(payload);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExistingGroup = async (groupId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupApi.updateGroup(groupId, payload);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err));
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
      setError(getErrorMessage(err));
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
      return response.group || response.data;
    } catch (err) {
      setError(getErrorMessage(err));
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
      setError(getErrorMessage(err));
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
      setError(getErrorMessage(err));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const requestToJoinExistingGroup = async (groupId, message = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupApi.requestToJoinGroup(groupId, message);
      return response.group || response.data;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelExistingJoinRequest = async (groupId) => {
    setLoading(true);
    setError(null);
    try {
      return await groupApi.cancelJoinRequest(groupId);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinRequests = async (groupId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupApi.getJoinRequests(groupId);
      return response.data || [];
    } catch (err) {
      setError(getErrorMessage(err));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const approveExistingJoinRequest = async (groupId, requestId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupApi.approveJoinRequest(groupId, requestId);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectExistingJoinRequest = async (groupId, requestId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupApi.rejectJoinRequest(groupId, requestId);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const transferExistingOwnership = async (groupId, newOwnerId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupApi.transferOwnership(groupId, newOwnerId);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupMessages = async (groupId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupApi.getGroupMessages(groupId);
      return response.data || [];
    } catch (err) {
      setError(getErrorMessage(err));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const sendExistingGroupMessage = async (groupId, body) => {
    setError(null);
    try {
      const response = await groupApi.sendGroupMessage(groupId, body);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const addMemberToExistingGroup = async (groupId, email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupApi.addGroupMember(groupId, email);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMemberFromExistingGroup = async (groupId, userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupApi.removeGroupMember(groupId, userId);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
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
    requestToJoinExistingGroup,
    cancelExistingJoinRequest,
    fetchJoinRequests,
    approveExistingJoinRequest,
    rejectExistingJoinRequest,
    transferExistingOwnership,
    leaveExistingGroup,
    fetchGroupMembers,
    fetchGroupMessages,
    sendExistingGroupMessage,
    addMemberToExistingGroup,
    removeMemberFromExistingGroup,
  };
};
