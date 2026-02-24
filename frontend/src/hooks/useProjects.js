import { useState } from 'react';
import * as projectApi from '../api/projectApi';

export const useProjects = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOpenProjects = async (techStack, title) => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectApi.getOpenProjects(techStack, title);
      return response.data || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectById = async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectApi.getProjectById(projectId);
      return response.data || null;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createNewProject = async (title, description, techStack, maxMembers, deadline, status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectApi.createProject(
        title,
        description,
        techStack,
        maxMembers,
        deadline,
        status
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExistingProject = async (projectId, title, description, techStack, maxMembers, deadline, status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectApi.updateProject(
        projectId,
        title,
        description,
        techStack,
        maxMembers,
        deadline,
        status
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteExistingProject = async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectApi.deleteProject(projectId);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const applyToExistingProject = async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectApi.applyToProject(projectId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const leaveExistingProject = async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectApi.leaveProject(projectId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectApi.getApplications(projectId);
      return response.data || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const approveApplicant = async (projectId, applicantId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectApi.approveApplication(projectId, applicantId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectApplicant = async (projectId, applicantId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectApi.rejectApplication(projectId, applicantId);
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
    fetchOpenProjects,
    fetchProjectById,
    createNewProject,
    updateExistingProject,
    deleteExistingProject,
    applyToExistingProject,
    leaveExistingProject,
    fetchApplications,
    approveApplicant,
    rejectApplicant,
  };
};
