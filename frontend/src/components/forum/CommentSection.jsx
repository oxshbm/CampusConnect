import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const toId = (value) => value?._id || value?.id || value;
const sameId = (a, b) => toId(a)?.toString() === toId(b)?.toString();

const CommentSection = ({ questionId, fetchComments: fetchCommentsProp, addComment: addCommentProp, deleteComment: deleteCommentProp, updateComment: updateCommentProp, onLikeComment: onLikeCommentProp, onCommentCountChange }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    loadComments();
  }, [questionId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await fetchCommentsProp(questionId);
      setComments(data || []);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const topLevelComments = comments.filter((c) => !c.parent);
  const getReplies = (parentId) => comments.filter((c) => c.parent && sameId(c.parent, parentId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    try {
      setSubmitting(true);
      const data = await addCommentProp(questionId, newComment.trim());
      setComments((prev) => [...prev, data]);
      setNewComment('');
      if (onCommentCountChange) onCommentCountChange(1);
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (parentId) => {
    if (!replyText.trim() || !user) return;
    try {
      setSubmitting(true);
      const data = await addCommentProp(questionId, replyText.trim(), parentId);
      setComments((prev) => [...prev, data]);
      setReplyText('');
      setReplyTo(null);
    } catch (err) {
      console.error('Failed to add reply:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const comment = comments.find((c) => c._id === commentId);
      await deleteCommentProp(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      if ((!comment || !comment.parent) && onCommentCountChange) onCommentCountChange(-1);
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const handleStartEdit = (comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
    setMenuOpenId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim()) return;
    try {
      const data = await updateCommentProp(commentId, { content: editContent.trim() });
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, content: data.content || editContent.trim() } : c))
      );
      setEditingId(null);
      setEditContent('');
    } catch (err) {
      console.error('Failed to update comment:', err);
    }
  };

  const handleLike = async (commentId) => {
    if (!user || !onLikeCommentProp) return;
    try {
      const data = await onLikeCommentProp(commentId);
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? { ...c, hasLiked: data.hasLiked, likeCount: data.likeCount }
            : c
        )
      );
    } catch (err) {
      console.error('Like failed:', err);
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

  const renderComment = (comment, isReply = false) => (
    <div
      key={comment._id}
      className={`flex items-start gap-3 p-3 rounded-lg ${
        isReply
          ? 'ml-8 bg-zinc-50/50 dark:bg-zinc-800/30'
          : 'bg-zinc-50 dark:bg-zinc-800/50'
      }`}
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
            <div className="relative">
              <button
                onClick={() => setMenuOpenId(menuOpenId === comment._id ? null : comment._id)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-lg leading-none px-0.5 transition-colors"
              >
                ⋯
              </button>
              {menuOpenId === comment._id && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpenId(null)} />
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 py-1 min-w-[130px] z-50">
                    <button
                      onClick={() => handleStartEdit(comment)}
                      className="w-full text-left px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => { setMenuOpenId(null); handleDelete(comment._id); }}
                      className="w-full text-left px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        {editingId === comment._id ? (
          <div className="mt-1 space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="input-field w-full text-sm min-h-[60px] resize-y"
              maxLength={2000}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleSaveEdit(comment._id)}
                className="btn-primary text-xs px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 hover:from-purple-700 hover:to-purple-800 dark:hover:from-purple-600 dark:hover:to-purple-700"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-xs px-3 py-1.5 rounded-lg font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1">{comment.content}</p>
        )}

        <div className="flex items-center gap-3 mt-2">
          {user && (
            <button
              onClick={() => handleLike(comment._id)}
              className={`text-xs transition-colors flex items-center gap-1 ${
                comment.hasLiked
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400'
              }`}
            >
              {comment.hasLiked ? '♥' : '♡'} {comment.likeCount || 0}
            </button>
          )}
          {!isReply && user && (
            <button
              onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
              className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Reply
            </button>
          )}
        </div>

        {replyTo === comment._id && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleReplySubmit(comment._id);
            }}
            className="flex gap-2 mt-2"
          >
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              maxLength={2000}
              className="input-field flex-1 text-sm"
              autoFocus
            />
            <button
              type="submit"
              disabled={submitting || !replyText.trim()}
              className="btn-primary text-xs px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 hover:from-purple-700 hover:to-purple-800 dark:hover:from-purple-600 dark:hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '...' : 'Reply'}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
        Comments ({topLevelComments.length})
      </h4>

      {loading ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading comments...</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {topLevelComments.length === 0 && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No comments yet. Be the first!</p>
          )}
          {topLevelComments.map((comment) => (
            <div key={comment._id}>
              {renderComment(comment)}
              {getReplies(comment._id).map((reply) => renderComment(reply, true))}
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
