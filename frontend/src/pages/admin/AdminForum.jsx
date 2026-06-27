import { useEffect, useState, useCallback } from 'react';
import { getAllForumPosts, deleteForumPost, getAllComments, deleteComment } from '../../api/adminApi';

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

const AdminForum = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedPost, setSelectedPost] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchAllComments();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getAllForumPosts();
      if (response.data.success) {
        setPosts(response.data.data);
        setFilteredPosts(response.data.data);
      } else {
        setError('Failed to fetch forum posts');
      }
    } catch (err) {
      setError('Error fetching forum posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllComments = async () => {
    try {
      const response = await getAllComments();
      if (response.data.success) {
        setAllComments(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const postComments = useCallback(() => {
    if (!selectedPost) return [];
    return allComments.filter((c) => c.question?.id === selectedPost.id);
  }, [selectedPost, allComments]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.createdBy?.name?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  const handleRowClick = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleDeletePost = async (postId, postTitle) => {
    if (!window.confirm(`Delete forum post "${postTitle}"? This will also delete all its comments.`)) return;

    try {
      setActionLoading(postId);
      const response = await deleteForumPost(postId);
      if (response.data.success) {
        setSelectedPost(null);
        fetchPosts();
        fetchAllComments();
        alert('Forum post deleted successfully');
      }
    } catch (err) {
      alert('Error deleting forum post');
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment? This action cannot be undone.')) return;

    try {
      setActionLoading(commentId);
      const response = await deleteComment(commentId);
      if (response.data.success) {
        fetchAllComments();
        fetchPosts();
        alert('Comment deleted successfully');
      }
    } catch (err) {
      alert('Error deleting comment');
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleCloseModal();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin text-4xl">🔄</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-2">
          Forum Management
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">Monitor and moderate forum posts and comments</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="card p-6">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="input-field w-full"
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-100 dark:bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">Author</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">Tags</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">Upvotes</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">Comments</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                    No forum posts found
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    onClick={() => handleRowClick(post)}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                  >
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm font-medium text-zinc-900 dark:text-white max-w-xs truncate">
                      {post.title}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {post.createdBy?.name || 'Unknown'}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="flex gap-1 flex-wrap">
                        {post.tags?.slice(0, 3).map((tag) => (
                          <span key={tag} className="inline-block px-2 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded text-xs text-zinc-600 dark:text-zinc-400">
                            {tag}
                          </span>
                        ))}
                        {post.tags?.length > 3 && (
                          <span className="text-xs text-zinc-400">+{post.tags.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      ↑ {post.upvotes}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      💬 {post.commentCount}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Showing {filteredPosts.length} of {posts.length} posts
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 p-6 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white pr-4">
                {selectedPost.title}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-2xl font-bold transition-colors shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className="text-2xl leading-none text-zinc-400">▲</span>
                  <span className={`text-base font-bold ${selectedPost.upvotes - selectedPost.downvotes > 0 ? 'text-purple-600 dark:text-purple-400' : selectedPost.upvotes - selectedPost.downvotes < 0 ? 'text-red-500 dark:text-red-400' : 'text-zinc-600 dark:text-zinc-400'}`}>
                    {selectedPost.upvotes - selectedPost.downvotes}
                  </span>
                  <span className="text-2xl leading-none text-zinc-400">▼</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                    <span>Posted by {selectedPost.createdBy?.name || 'Unknown'} {timeAgo(selectedPost.createdAt)}</span>
                  </div>

                  <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                    {selectedPost.content}
                  </p>

                  {selectedPost.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedPost.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs px-3 py-1 rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4">
                    <button
                      onClick={() => handleDeletePost(selectedPost.id, selectedPost.title)}
                      disabled={actionLoading === selectedPost.id}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {actionLoading === selectedPost.id ? 'Deleting...' : 'Delete Post'}
                    </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                    <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm mb-4">
                      Comments ({postComments().length})
                    </h4>

                    {postComments().length === 0 ? (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">No comments yet.</p>
                    ) : (
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {postComments().map((comment) => (
                          <div
                            key={comment.id}
                            className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50"
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
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  disabled={actionLoading === comment.id}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded font-medium transition-colors disabled:opacity-50 shrink-0"
                                >
                                  {actionLoading === comment.id ? '...' : 'Delete'}
                                </button>
                              </div>
                              <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminForum;
