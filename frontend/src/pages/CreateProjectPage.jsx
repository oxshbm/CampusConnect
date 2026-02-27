import { useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import ProjectForm from '../components/projects/ProjectForm';

const CreateProjectPage = () => {
  const { createNewProject, loading } = useProjects();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const result = await createNewProject(
        formData.title,
        formData.description,
        formData.techStack,
        formData.maxMembers,
        formData.deadline,
        'open'
      );
      navigate(`/projects/${result._id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-zinc-50 to-purple-50 dark:from-zinc-950 dark:to-zinc-900 py-6 md:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent">
            🚀 Post a New Project
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Share your project idea and find talented teammates to build it
          </p>
        </div>
        <div className="card p-4 md:p-8">
          <ProjectForm initialData={null} onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;
