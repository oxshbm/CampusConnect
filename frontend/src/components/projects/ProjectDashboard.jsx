import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useProjects } from '../../hooks/useProjects';
import Spinner from '../common/Spinner';

const ProjectDashboard = ({ project, onStatusChange, onApply }) => {
  const { user } = useAuth();
  const { leaveExistingProject, deleteExistingProject, applyToExistingProject, loading } = useProjects();
  const navigate = useNavigate();

  const isCreator = user && project.createdBy && project.createdBy._id === user.id;
  const isMember = user && project.members && project.members.some((m) => m._id === user.id);

  const handleStatusChange = async (newStatus) => {
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm('Are you sure you want to leave this project?')) return;
    try {
      await leaveExistingProject(project._id);
      navigate('/projects');
    } catch (error) {
      console.error('Failed to leave project:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This cannot be undone.')) return;
    try {
      await deleteExistingProject(project._id);
      navigate('/projects');
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleApply = async () => {
    try {
      await applyToExistingProject(project._id);
      if (onApply) {
        onApply();
      }
    } catch (error) {
      console.error('Failed to apply:', error);
    }
  };

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

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <Spinner />;

  return (
    <div className="card p-8 border-l-4 border-l-purple-600 dark:border-l-purple-500">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">{project.title}</h1>
        </div>
        <div className="text-right">
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getStatusBadgeClass()}`}>
            {project.status === 'open'
              ? '🟢 Open'
              : project.status === 'in_progress'
              ? '🟡 In Progress'
              : '⚫ Completed'}
          </span>
        </div>
      </div>

      {project.description && (
        <p className="text-zinc-700 dark:text-zinc-300 mt-6 mb-6 text-lg leading-relaxed">
          {project.description}
        </p>
      )}

      {project.techStack && project.techStack.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-3">💻 Tech Stack:</p>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-sm px-4 py-2 rounded-full font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-xl border border-blue-200 dark:border-blue-700">
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-300 mb-4 uppercase tracking-wide">
          📅 Project Details
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-lg">📅</span>
            <span className="text-zinc-700 dark:text-zinc-300">
              Deadline: {formatDeadline(project.deadline)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg">👥</span>
            <span className="text-zinc-700 dark:text-zinc-300">
              Team Size: {project.members ? project.members.length : 0} / {project.maxMembers} members
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 my-6 p-6 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl border border-purple-200 dark:border-purple-700">
        <div>
          <p className="text-sm text-purple-600 dark:text-purple-300 font-semibold uppercase tracking-wide">
            Current Members
          </p>
          <p className="text-4xl font-bold text-purple-700 dark:text-purple-200 mt-2">
            {project.members ? project.members.length : 0}
          </p>
        </div>
        <div>
          <p className="text-sm text-purple-600 dark:text-purple-300 font-semibold uppercase tracking-wide">
            Team Capacity
          </p>
          <p className="text-4xl font-bold text-purple-700 dark:text-purple-200 mt-2">{project.maxMembers}</p>
        </div>
      </div>

      {isCreator && (
        <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 rounded-lg">
          <label className="label text-orange-900 dark:text-orange-100">📊 Project Status</label>
          <select
            value={project.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="input-field mt-2"
          >
            <option value="open">🟢 Open (Accepting Applications)</option>
            <option value="in_progress">🟡 In Progress (Active)</option>
            <option value="completed">⚫ Completed</option>
          </select>
        </div>
      )}

      {!isCreator && isMember && (
        <button
          onClick={handleLeave}
          disabled={loading}
          className="btn-primary w-full bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 hover:from-red-700 hover:to-red-800 dark:hover:from-red-600 dark:hover:to-red-700"
        >
          👋 Leave Project
        </button>
      )}

      {!isCreator && !isMember && project.status === 'open' && (
        <button
          onClick={handleApply}
          disabled={loading}
          className="btn-primary w-full"
        >
          ➕ Apply to Join
        </button>
      )}

      {isCreator && (
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="btn-primary flex-1 bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 hover:from-red-700 hover:to-red-800 dark:hover:from-red-600 dark:hover:to-red-700"
          >
            🗑️ Delete Project
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectDashboard;
