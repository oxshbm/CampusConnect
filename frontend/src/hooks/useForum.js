import { useState, useCallback } from 'react';
import * as forumApi from '../api/forumApi';

export const useForum = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuestions = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await forumApi.getQuestions(params);
      return response.data || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQuestion = useCallback(async (id) => {
    setError(null);
    try {
      const response = await forumApi.getQuestion(id);
      return response.data || null;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  const fetchComments = useCallback(async (questionId) => {
    setError(null);
    try {
      const response = await forumApi.getComments(questionId);
      return response.data || [];
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, []);

  const createQuestion = useCallback(async (payload) => {
    setError(null);
    try {
      const response = await forumApi.createQuestion(payload);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  }, []);

  const voteOnQuestion = useCallback(async (id, voteType) => {
    setError(null);
    try {
      const response = await forumApi.voteOnQuestion(id, voteType);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  }, []);

  const deleteQuestion = useCallback(async (id) => {
    setError(null);
    try {
      const response = await forumApi.deleteQuestion(id);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  }, []);

  const addComment = useCallback(async (questionId, content, parent = null) => {
    setError(null);
    try {
      const response = await forumApi.addComment(questionId, content, parent);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  }, []);

  const deleteComment = useCallback(async (commentId) => {
    setError(null);
    try {
      const response = await forumApi.deleteComment(commentId);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  }, []);

  const toggleBookmark = useCallback(async (id) => {
    setError(null);
    try {
      const response = await forumApi.toggleBookmark(id);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  }, []);

  const votePoll = useCallback(async (id, optionIndex) => {
    setError(null);
    try {
      const response = await forumApi.votePoll(id, optionIndex);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  }, []);

  const likeComment = useCallback(async (commentId) => {
    setError(null);
    try {
      const response = await forumApi.likeComment(commentId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  }, []);

  return {
    loading,
    error,
    fetchQuestions,
    fetchQuestion,
    fetchComments,
    createQuestion,
    voteOnQuestion,
    deleteQuestion,
    addComment,
    deleteComment,
    toggleBookmark,
    votePoll,
    likeComment,
  };
};
