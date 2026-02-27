import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useClubs } from '../hooks/useClubs';
import ClubForm from '../components/clubs/ClubForm';
import ClubMemberList from '../components/clubs/ClubMemberList';
import ClubPostCard from '../components/clubs/ClubPostCard';
import Spinner from '../components/common/Spinner';

const postTypes = ['announcement', 'event', 'update'];

export default function ClubDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const {
    fetchClubById,
    updateExistingClub,
    deleteExistingClub,
    addClubMember,
    removeClubMember,
    fetchClubPosts,
    createClubPost,
    deleteClubPost,
    loading,
    error,
  } = useClubs();

  const [club, setClub] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const [addMemberEmail, setAddMemberEmail] = useState('');
  const [addMemberError, setAddMemberError] = useState('');
  const [addMemberLoading, setAddMemberLoading] = useState(false);

  const [postFormData, setPostFormData] = useState({
    type: 'announcement',
    title: '',
    content: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
  });
  const [postFormError, setPostFormError] = useState('');
  const [postFormLoading, setPostFormLoading] = useState(false);

  const isLeader = user && club && (club.createdBy._id === user.id || club.createdBy._id === user._id);

  // Load club and posts
  useEffect(() => {
    const loadData = async () => {
      const clubData = await fetchClubById(id);
      if (clubData) {
        setClub(clubData);
        const postsData = await fetchClubPosts(id);
        setPosts(postsData);
      }
    };
    loadData();
  }, [id]);

  // Handle club update
  const handleClubUpdate = async (formData) => {
    try {
      const updatedClub = await updateExistingClub(id, formData);
      setClub(updatedClub);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update club:', error);
    }
  };

  // Handle add member
  const handleAddMember = async () => {
    if (!addMemberEmail.trim()) {
      setAddMemberError('Email is required');
      return;
    }

    setAddMemberLoading(true);
    setAddMemberError('');
    try {
      const updatedClub = await addClubMember(id, addMemberEmail);
      setClub(updatedClub);
      setAddMemberEmail('');
      setShowAddMember(false);
    } catch (error) {
      setAddMemberError(error.response?.data?.message || 'Failed to add member');
    } finally {
      setAddMemberLoading(false);
    }
  };

  // Handle remove member
  const handleRemoveMember = async (memberId) => {
    try {
      const updatedClub = await removeClubMember(id, memberId);
      setClub(updatedClub);
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  // Handle create post
  const handleCreatePost = async () => {
    setPostFormError('');

    if (!postFormData.title.trim()) {
      setPostFormError('Title is required');
      return;
    }
    if (!postFormData.content.trim()) {
      setPostFormError('Content is required');
      return;
    }
    if (postFormData.type === 'event' && !postFormData.eventDate) {
      setPostFormError('Event date is required for event posts');
      return;
    }

    setPostFormLoading(true);
    try {
      const newPost = await createClubPost(id, postFormData);
      setPosts([newPost, ...posts]); // Add to top of feed
      setPostFormData({
        type: 'announcement',
        title: '',
        content: '',
        eventDate: '',
        eventTime: '',
        eventLocation: '',
      });
      setShowCreatePost(false);
    } catch (error) {
      setPostFormError(error.response?.data?.message || 'Failed to create post');
    } finally {
      setPostFormLoading(false);
    }
  };

  // Handle delete post
  const handleDeletePost = async (postId) => {
    try {
      await deleteClubPost(id, postId);
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  if (loading && !club) {
    return <Spinner />;
  }

  if (!club) {
    return (
      <div className="card p-4 md:p-8 text-center">
        <p className="text-zinc-600 dark:text-zinc-400">Club not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Club Info Card */}
      <div className="card p-4 md:p-8 border-l-4 border-l-purple-600 dark:border-l-purple-400">
        {!isEditing ? (
          <>
            {/* Status Banners */}
            {club.status === 'pending' && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded text-yellow-800 dark:text-yellow-200 text-sm">
                ⏳ Your club is awaiting admin approval. Posts are not yet available.
              </div>
            )}
            {club.status === 'denied' && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded text-red-800 dark:text-red-200 text-sm">
                ❌ Your club registration was denied by an admin.
              </div>
            )}

            {/* Club Info */}
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              {club.name}
            </h1>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                {club.category}
              </span>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                club.status === 'approved'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : club.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {club.status.charAt(0).toUpperCase() + club.status.slice(1)}
              </span>
            </div>

            <p className="text-zinc-700 dark:text-zinc-300 mb-4 text-lg">
              {club.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-purple-50 dark:bg-purple-900 rounded">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Team Size</p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-300">{club.teamSize}</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900 rounded">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Members</p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-300">{club.members?.length || 0}</p>
              </div>
              {club.foundedYear && (
                <div className="p-3 bg-purple-50 dark:bg-purple-900 rounded">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Founded</p>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-300">{club.foundedYear}</p>
                </div>
              )}
              {club.contactEmail && (
                <div className="p-3 bg-purple-50 dark:bg-purple-900 rounded">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Email</p>
                  <p className="text-sm font-semibold text-purple-600 dark:text-purple-300 truncate">
                    {club.contactEmail}
                  </p>
                </div>
              )}
            </div>

            {/* Leader Actions */}
            {isLeader && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary"
                >
                  Edit Club Info
                </button>
                {club.status === 'approved' && (
                  <>
                    <button
                      onClick={() => setShowAddMember(!showAddMember)}
                      className="btn-secondary"
                    >
                      {showAddMember ? 'Cancel' : 'Add Member'}
                    </button>
                    <button
                      onClick={() => setShowCreatePost(!showCreatePost)}
                      className="btn-secondary"
                    >
                      {showCreatePost ? 'Cancel' : 'Create Post'}
                    </button>
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Edit Club Info</h2>
            <ClubForm
              initialData={club}
              onSubmit={handleClubUpdate}
              loading={loading}
            />
            <button
              onClick={() => setIsEditing(false)}
              className="mt-4 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              ← Back
            </button>
          </>
        )}
      </div>

      {/* Add Member Panel */}
      {showAddMember && isLeader && (
        <div className="card p-6 space-y-4">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Add Member</h3>
          {addMemberError && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200 rounded">
              {addMemberError}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter member's email"
              value={addMemberEmail}
              onChange={(e) => setAddMemberEmail(e.target.value)}
              className="input-field flex-1"
            />
            <button
              onClick={handleAddMember}
              disabled={addMemberLoading}
              className="btn-primary"
            >
              {addMemberLoading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      )}

      {/* Create Post Panel */}
      {showCreatePost && isLeader && (
        <div className="card p-6 space-y-4">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Create Post</h3>
          {postFormError && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200 rounded">
              {postFormError}
            </div>
          )}

          <div>
            <label className="label">Post Type</label>
            <select
              value={postFormData.type}
              onChange={(e) =>
                setPostFormData((prev) => ({
                  ...prev,
                  type: e.target.value,
                  eventDate: '',
                  eventTime: '',
                  eventLocation: '',
                }))
              }
              className="input-field w-full"
            >
              {postTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Title</label>
            <input
              type="text"
              placeholder="Post title"
              value={postFormData.title}
              onChange={(e) =>
                setPostFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="label">Content</label>
            <textarea
              placeholder="Post content"
              value={postFormData.content}
              onChange={(e) =>
                setPostFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              maxLength={2000}
              rows="4"
              className="input-field w-full resize-none"
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {postFormData.content.length}/2000
            </p>
          </div>

          {postFormData.type === 'event' && (
            <>
              <div>
                <label className="label">Event Date</label>
                <input
                  type="date"
                  value={postFormData.eventDate}
                  onChange={(e) =>
                    setPostFormData((prev) => ({ ...prev, eventDate: e.target.value }))
                  }
                  className="input-field w-full"
                  required
                />
              </div>

              <div>
                <label className="label">Event Time (Optional)</label>
                <input
                  type="time"
                  value={postFormData.eventTime}
                  onChange={(e) =>
                    setPostFormData((prev) => ({ ...prev, eventTime: e.target.value }))
                  }
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="label">Event Location (Optional)</label>
                <input
                  type="text"
                  placeholder="Where will the event be held?"
                  value={postFormData.eventLocation}
                  onChange={(e) =>
                    setPostFormData((prev) => ({
                      ...prev,
                      eventLocation: e.target.value,
                    }))
                  }
                  className="input-field w-full"
                />
              </div>
            </>
          )}

          <button
            onClick={handleCreatePost}
            disabled={postFormLoading}
            className="btn-primary w-full"
          >
            {postFormLoading ? 'Creating...' : 'Post'}
          </button>
        </div>
      )}

      {/* Members Section */}
      {club.members && club.members.length > 0 && (
        <ClubMemberList
          members={club.members}
          isLeader={isLeader}
          onRemove={handleRemoveMember}
          currentUserId={user?.id}
        />
      )}

      {/* Posts Feed */}
      {club.status === 'approved' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">📋 Club Feed</h2>
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <ClubPostCard
                  key={post._id}
                  post={post}
                  isLeader={isLeader}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          ) : (
            <div className="card p-4 md:p-8 text-center">
              <p className="text-zinc-600 dark:text-zinc-400">
                No posts yet. {isLeader ? 'Create the first post!' : 'Check back later for updates.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
