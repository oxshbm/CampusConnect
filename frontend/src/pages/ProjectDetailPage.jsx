import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../hooks/useAuth';
import ProjectDashboard from '../components/projects/ProjectDashboard';
import ProjectForm from '../components/projects/ProjectForm';
import ApplicationsList from '../components/projects/ApplicationsList';
import MemberList from '../components/groups/MemberList';
import Spinner from '../components/common/Spinner';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const {
    fetchProjectById,
    fetchApplications,
    updateExistingProject,
    approveApplicant,
    rejectApplicant,
    loading,
  } = useProjects();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const loadProjectData = async () => {
    const projectData = await fetchProjectById(id);
    setProject(projectData);
  };

  const loadApplications = async () => {
    if (isCreator) {
      const applicationsData = await fetchApplications(id);
      setApplications(applicationsData);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, [id]);

  useEffect(() => {
    loadApplications();
  }, [id, isCreator]);

  const isCreator = user && project && project.createdBy && project.createdBy._id === user.id;

  const handleUpdate = async (formData) => {
    try {
      const updated = await updateExistingProject(
        id,
        formData.title,
        formData.description,
        formData.techStack,
        formData.maxMembers,
        formData.deadline,
        formData.status
      );
      setProject(updated);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const updated = await updateExistingProject(
        id,
        project.title,
        project.description,
        project.techStack,
        project.maxMembers,
        project.deadline,
        newStatus
      );
      setProject(updated);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleApprove = async (applicantId) => {
    try {
      await approveApplicant(id, applicantId);
      await loadProjectData();
      await loadApplications();
    } catch (error) {
      console.error('Failed to approve applicant:', error);
    }
  };

  const handleReject = async (applicantId) => {
    try {
      await rejectApplicant(id, applicantId);
      await loadApplications();
    } catch (error) {
      console.error('Failed to reject applicant:', error);
    }
  };

  const handleRefreshProject = async () => {
    await loadProjectData();
  };

  if (loading || !project) return <Spinner />;

  const pendingApplicationCount = applications.filter((a) => a.status === 'pending').length;

  return (
    <div className="bg-gradient-to-b from-zinc-50 to-purple-50 dark:from-zinc-950 dark:to-zinc-900 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {!isEditing ? (
          <>
            {/* Tabs for creator */}
            {isCreator && (
              <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-700">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                    activeTab === 'details'
                      ? 'border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  📊 Details
                </button>
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                    activeTab === 'applications'
                      ? 'border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  📋 Applications {pendingApplicationCount > 0 && `(${pendingApplicationCount})`}
                </button>
              </div>
            )}

            {/* Details Tab */}
            {activeTab === 'details' && (
              <>
                <ProjectDashboard
                  project={project}
                  onStatusChange={handleStatusChange}
                  onApply={handleRefreshProject}
                />
                <MemberList members={project.members || []} />
              </>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && isCreator && (
              <ApplicationsList
                applications={applications}
                onApprove={handleApprove}
                onReject={handleReject}
                loading={loading}
              />
            )}

            {/* Edit button for creator */}
            {isCreator && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary w-full bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-700 dark:to-amber-800 hover:from-amber-700 hover:to-amber-800 dark:hover:from-amber-600 dark:hover:to-amber-700"
              >
                ✏️ Edit Project
              </button>
            )}
          </>
        ) : (
          <div className="card p-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent mb-6">
              ✏️ Edit Project
            </h2>
            <ProjectForm
              initialData={project}
              onSubmit={handleUpdate}
              loading={loading}
            />
            <button
              onClick={() => setIsEditing(false)}
              className="mt-6 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
            >
              ← Back to Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;
