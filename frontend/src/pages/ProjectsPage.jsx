import { useEffect, useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../hooks/useAuth';
import ProjectCard from '../components/projects/ProjectCard';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import Spinner from '../components/common/Spinner';

const ProjectsPage = () => {
  const { fetchOpenProjects, applyToExistingProject, loading } = useProjects();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [techStack, setTechStack] = useState('');
  const [showModal, setShowModal] = useState(false);

  const loadProjects = async () => {
    const data = await fetchOpenProjects(techStack, title);
    setProjects(data);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleFilter = () => {
    loadProjects();
  };

  const handleApply = async (projectId) => {
    try {
      await applyToExistingProject(projectId);
      loadProjects();
    } catch (error) {
      console.error('Failed to apply to project:', error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-zinc-50 to-purple-50 dark:from-zinc-950 dark:to-zinc-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent mb-3">
              Project Partner
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              Discover exciting projects and join amazing teams
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 hover:from-purple-700 hover:to-purple-800 dark:hover:from-purple-600 dark:hover:to-purple-700 whitespace-nowrap"
            >
              🚀 Post a Project
            </button>
          )}
        </div>

        <div className="card p-8 mb-12 border-l-4 border-l-purple-600 dark:border-l-purple-500">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">🔍 Search Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Project Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Search by project title..."
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Tech Stack</label>
              <input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="e.g., React, Node.js"
                className="input-field"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFilter}
                className="btn-primary w-full"
              >
                🔎 Search
              </button>
            </div>
          </div>
        </div>

        {loading && <Spinner />}

        {!loading && projects.length === 0 && (
          <div className="text-center py-16 card">
            <div className="text-5xl mb-4">🚀</div>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg font-medium">No projects found</p>
            <p className="text-zinc-500 dark:text-zinc-500 mt-2">Try adjusting your search criteria or post a new project</p>
          </div>
        )}

        {!loading && projects.length > 0 && (
          <div>
            <div className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
              Found <span className="font-bold text-purple-600 dark:text-purple-400">{projects.length}</span> projects
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onApply={handleApply}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreated={loadProjects}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
