import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProjectCard = ({ project, onApply }) => {
  const { user } = useAuth();

  const isCreator = user && project.createdBy && project.createdBy._id === user.id;
  const isMember = user && project.members && project.members.some((m) => m._id === user.id);
  const hasPendingApplication =
    user &&
    project.applications &&
    project.applications.some((a) => a.user === user.id && a.status === 'pending');
  const isProjectOpen = project.status === 'open';

  const getStatusBadgeClass = () => {
    switch (project.status) {
      case 'open':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'in_progress':
        return 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300';
      case 'completed':
        return 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300';
      default:
        return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300';
    }
  };

  const getStatusLabel = () => {
    switch (project.status) {
      case 'open':
        return '🟢 Open';
      case 'in_progress':
        return '🟡 In Progress';
      case 'completed':
        return '⚫ Completed';
      default:
        return project.status;
    }
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleApply = () => {
    if (onApply) {
      onApply(project._id);
    }
  };

  return (
    <div className="card p-6 flex flex-col hover:shadow-xl dark:hover:shadow-purple-900/50 hover:border-purple-200 dark:hover:border-purple-700 hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
      <Link to={`/projects/${project._id}`} className="block flex-1">
        <div className="mb-3">
          <span className={`inline-block ${getStatusBadgeClass()} px-3 py-1 rounded-full text-xs font-semibold mb-3`}>
            {getStatusLabel()}
          </span>
        </div>
        <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors line-clamp-2">
          {project.title}
        </h3>
      </Link>

      {project.description && (
        <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-3 line-clamp-2 flex-1">
          {project.description}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {project.techStack && project.techStack.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs px-3 py-1 rounded-full font-medium"
          >
            {tech}
          </span>
        ))}
        {project.techStack && project.techStack.length > 3 && (
          <span className="text-zinc-500 dark:text-zinc-400 text-xs px-2 py-1">
            +{project.techStack.length - 3}
          </span>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center text-sm border-t border-zinc-100 dark:border-zinc-700 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">👥</span>
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            {project.members ? project.members.length : 0}
          </span>
          <span className="text-zinc-500 dark:text-zinc-400">/ {project.maxMembers}</span>
        </div>
        <span className="text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-3 py-1 rounded-full font-medium">
          📅 {formatDeadline(project.deadline)}
        </span>
      </div>

      <div className="mt-4">
        {isCreator ? (
          <Link
            to={`/projects/${project._id}`}
            className="btn-primary w-full text-center block bg-gradient-to-r from-orange-600 to-orange-700 dark:from-orange-700 dark:to-orange-800 hover:from-orange-700 hover:to-orange-800 dark:hover:from-orange-600 dark:hover:to-orange-700"
          >
            👨‍💼 Manage Project
          </Link>
        ) : isMember ? (
          <Link
            to={`/projects/${project._id}`}
            className="btn-primary w-full text-center block bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 hover:from-green-700 hover:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700"
          >
            ✓ View Project
          </Link>
        ) : hasPendingApplication ? (
          <button
            disabled
            className="btn-primary w-full opacity-50 cursor-not-allowed bg-gradient-to-r from-yellow-600 to-yellow-700"
          >
            ⏳ Applied
          </button>
        ) : !isProjectOpen ? (
          <button
            disabled
            className="btn-primary w-full opacity-50 cursor-not-allowed"
          >
            🔒 Closed
          </button>
        ) : (
          <button
            onClick={handleApply}
            className="btn-primary w-full"
          >
            ➕ Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
