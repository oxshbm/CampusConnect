import { useNavigate } from 'react-router-dom';
import { useGroups } from '../hooks/useGroups';
import GroupForm from '../components/groups/GroupForm';

const CreateGroupPage = () => {
  const { createNewGroup, loading } = useGroups();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const result = await createNewGroup(formData);
      navigate(`/group/${result._id}`);
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  return (
    <div className="py-6 md:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent">
            ✨ Create New Study Group
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">Build a community of learners around your interests</p>
        </div>
        <div className="card p-4 md:p-8">
          <GroupForm initialData={null} onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default CreateGroupPage;
