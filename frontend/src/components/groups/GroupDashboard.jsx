import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useGroups } from '../../hooks/useGroups';
import Spinner from '../common/Spinner';
import { useState } from 'react';

const toId = (value) => value?._id || value?.id || value;
const sameId = (a, b) => toId(a)?.toString() === toId(b)?.toString();

const GroupDashboard = ({ group }) => {
  const { user } = useAuth();
  const { leaveExistingGroup, deleteExistingGroup, loading } = useGroups();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const userId = user?.id || user?._id;
  const members = group.members || [];
  const isCreator = Boolean(group.isOwner || group.isCreator || (userId && sameId(group.createdBy, userId)));
  const isMember = Boolean(group.isMember || (userId && members.some((member) => sameId(member, userId))));
  const memberCount = group.memberCount ?? members.length;

  const handleLeave = async () => {
    if (!window.confirm('Are you sure you want to leave this group?')) return;
    try {
      setError('');
      await leaveExistingGroup(group._id);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to leave group');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this group? This cannot be undone.')) return;
    try {
      setError('');
      await deleteExistingGroup(group._id);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to delete group');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="card p-4 md:p-8 border-l-4 border-l-purple-600 dark:border-l-purple-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-zinc-900 dark:text-white">{group.name}</h1>
          <p className="text-purple-600 dark:text-purple-400 text-lg mt-2 font-semibold">📚 {group.subject}</p>
        </div>
        <div className="text-right">
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
            group.visibility === 'public'
              ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
              : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
          }`}>
            {group.visibility === 'public' ? '🌐 Public' : '🔒 Private'}
          </span>
        </div>
      </div>

      {group.description && (
        <p className="text-zinc-700 dark:text-zinc-300 mt-6 mb-6 text-lg leading-relaxed">{group.description}</p>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {group.semester && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          <span className="font-semibold">📅 Semester:</span> {group.semester}
        </p>
      )}

      {(group.tags || []).length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-3">🏷️ Tags:</p>
          <div className="flex flex-wrap gap-2">
            {(group.tags || []).map((tag) => (
              <span key={tag} className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-sm px-4 py-2 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-xl border border-blue-200 dark:border-blue-700">
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-300 mb-4 uppercase tracking-wide">📅 Meeting Details</p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {group.meetingType === 'virtual' ? (
              <span className="text-lg">💻</span>
            ) : (
              <span className="text-lg">📍</span>
            )}
            <span className="text-zinc-700 dark:text-zinc-300">
              {group.meetingType === 'virtual' ? 'Virtual Meeting' : 'In-Person Meeting'}
            </span>
          </div>

          {group.meetingType === 'in-person' && group.location && (
            <div className="flex items-center gap-3">
              <span className="text-lg">📍</span>
              <span className="text-zinc-700 dark:text-zinc-300">{group.location}</span>
            </div>
          )}

          {group.scheduleDays && group.scheduleDays.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-lg">📅</span>
              <span className="text-zinc-700 dark:text-zinc-300">{group.scheduleDays.join(', ')}</span>
            </div>
          )}

          {group.startTime && (
            <div className="flex items-center gap-3">
              <span className="text-lg">🕐</span>
              <span className="text-zinc-700 dark:text-zinc-300">{group.startTime}</span>
            </div>
          )}

          {group.duration && (
            <div className="flex items-center gap-3">
              <span className="text-lg">⏱️</span>
              <span className="text-zinc-700 dark:text-zinc-300">{group.duration}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 my-6 p-6 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl border border-purple-200 dark:border-purple-700">
        <div>
          <p className="text-sm text-purple-600 dark:text-purple-300 font-semibold uppercase tracking-wide">Members</p>
          <p className="text-2xl md:text-4xl font-bold text-purple-700 dark:text-purple-200 mt-2">{memberCount}</p>
        </div>
        <div>
          <p className="text-sm text-purple-600 dark:text-purple-300 font-semibold uppercase tracking-wide">Max Capacity</p>
          <p className="text-2xl md:text-4xl font-bold text-purple-700 dark:text-purple-200 mt-2">{group.maxMembers}</p>
        </div>
      </div>

      {isMember && !isCreator && (
        <button
          onClick={handleLeave}
          disabled={loading}
          className="btn-primary w-full bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 hover:from-red-700 hover:to-red-800 dark:hover:from-red-600 dark:hover:to-red-700"
        >
          👋 Leave Group
        </button>
      )}

      {isCreator && (
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="btn-primary flex-1 bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 hover:from-red-700 hover:to-red-800 dark:hover:from-red-600 dark:hover:to-red-700"
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupDashboard;
