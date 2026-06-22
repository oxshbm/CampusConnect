import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getQuestion, addComment, deleteComment } from '../../api/forumApi';

const toId = (value) => value?._id || value?.id || value;
const sameId = (a, b) => toId(a)?.toString() === toId(b)?.toString();

const CommentSection = ({ questionId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [questionId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const res = await getQuestion(questionId);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    try {
      setSubmitting(true);
      const res = await addComment(questionId, newComment.trim());
      setComments((prev) => [...prev, res.data]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
        Comments ({comments.length})
      </h4>

      {loading ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading comments...</p>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {comments.length === 0 && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No comments yet. Be the first!</p>
          )}
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="flex items-start gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg"
            >
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300 text-sm font-bold shrink-0">
                {(comment.author?.name || '?')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      {comment.author?.name || 'Unknown'}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                  {user && sameId(comment.author?._id || comment.author, user) && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400 text-xs transition-colors"
                    >
                      🗑️
                    </button>
                  )}
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {user && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            maxLength={2000}
            className="input-field flex-1 text-sm"
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="btn-primary text-sm px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 hover:from-purple-700 hover:to-purple-800 dark:hover:from-purple-600 dark:hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '...' : 'Post'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;
