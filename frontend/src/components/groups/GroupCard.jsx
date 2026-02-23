import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const GroupCard = ({ group, onJoin }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMember = user && group.members.some((m) => m.id === user.id);

  const handleJoin = () => {
    if (onJoin) {
      onJoin();
    }
  };

  return (
    <div className="card p-6 flex flex-col hover:shadow-xl dark:hover:shadow-purple-900/50 hover:border-purple-200 dark:hover:border-purple-700 hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
      <Link to={`/group/${group._id}`} className="block flex-1">
        <div className="mb-3">
          <div className="inline-block bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800 px-3 py-1 rounded-full text-xs font-semibold text-purple-600 dark:text-purple-300 mb-3">
            📚 {group.subject}
          </div>
        </div>
        <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors line-clamp-2">
          {group.name}
        </h3>
      </Link>

      {group.description && (
        <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-3 line-clamp-2 flex-1">{group.description}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {group.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs px-3 py-1 rounded-full font-medium">
            {tag}
          </span>
        ))}
        {group.tags.length > 3 && (
          <span className="text-zinc-500 dark:text-zinc-400 text-xs px-2 py-1">+{group.tags.length - 3}</span>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center text-sm border-t border-zinc-100 dark:border-zinc-700 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">👥</span>
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">{group.members.length}</span>
          <span className="text-zinc-500 dark:text-zinc-400">members</span>
        </div>
        <span className="text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-3 py-1 rounded-full font-medium">
          {group.visibility === 'public' ? '🌐 Public' : '🔒 Private'}
        </span>
      </div>

      <div className="mt-4">
        {user && !isMember && (
          <button
            onClick={handleJoin}
            className="btn-primary w-full"
          >
            ➕ Join Group
          </button>
        )}
        {isMember && (
          <Link
            to={`/group/${group._id}`}
            className="btn-primary w-full text-center block bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 hover:from-green-700 hover:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700"
          >
            ✓ View Group
          </Link>
        )}
      </div>
    </div>
  );
};

export default GroupCard;
