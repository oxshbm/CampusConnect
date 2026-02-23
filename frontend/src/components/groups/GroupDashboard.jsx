import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useGroups } from '../../hooks/useGroups';
import Spinner from '../common/Spinner';

const GroupDashboard = ({ group }) => {
  const { user } = useAuth();
  const { leaveExistingGroup, deleteExistingGroup, loading } = useGroups();
  const navigate = useNavigate();

  const isCreator = user && group.createdBy._id === user.id;
  const isMember = user && group.members.some((m) => m._id === user.id);

  const handleLeave = async () => {
    if (!window.confirm('Are you sure you want to leave this group?')) return;
    try {
      await leaveExistingGroup(group._id);
      navigate('/');
    } catch (error) {
      console.error('Failed to leave group:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this group? This cannot be undone.')) return;
    try {
      await deleteExistingGroup(group._id);
      navigate('/');
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="card p-8 border-l-4 border-l-purple-600 dark:border-l-purple-500">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">{group.name}</h1>
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

      {group.semester && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          <span className="font-semibold">📅 Semester:</span> {group.semester}
        </p>
      )}

      {group.tags.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-3">🏷️ Tags:</p>
          <div className="flex flex-wrap gap-2">
            {group.tags.map((tag) => (
              <span key={tag} className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-sm px-4 py-2 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 my-6 p-6 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl border border-purple-200 dark:border-purple-700">
        <div>
          <p className="text-sm text-purple-600 dark:text-purple-300 font-semibold uppercase tracking-wide">Members</p>
          <p className="text-4xl font-bold text-purple-700 dark:text-purple-200 mt-2">{group.members.length}</p>
        </div>
        <div>
          <p className="text-sm text-purple-600 dark:text-purple-300 font-semibold uppercase tracking-wide">Max Capacity</p>
          <p className="text-4xl font-bold text-purple-700 dark:text-purple-200 mt-2">{group.maxMembers}</p>
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
