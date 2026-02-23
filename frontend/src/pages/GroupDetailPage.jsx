import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGroups } from '../hooks/useGroups';
import GroupDashboard from '../components/groups/GroupDashboard';
import MemberList from '../components/groups/MemberList';
import GroupForm from '../components/groups/GroupForm';
import Spinner from '../components/common/Spinner';
import { useAuth } from '../hooks/useAuth';

const GroupDetailPage = () => {
  const { id } = useParams();
  const { fetchGroupById, updateExistingGroup, loading } = useGroups();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadGroup = async () => {
      const data = await fetchGroupById(id);
      setGroup(data);
    };
    loadGroup();
  }, [id, fetchGroupById]);

  const handleUpdate = async (formData) => {
    try {
      const updated = await updateExistingGroup(
        id,
        formData.name,
        formData.subject,
        formData.description,
        formData.semester,
        formData.tags,
        formData.visibility,
        formData.maxMembers
      );
      setGroup(updated);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update group:', error);
    }
  };

  if (loading || !group) return <Spinner />;

  const isCreator = user && group.createdBy._id === user.id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-purple-50 dark:from-zinc-950 dark:to-zinc-900 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {!isEditing ? (
          <>
            <GroupDashboard group={group} />
            <MemberList members={group.members} />
          </>
        ) : (
          <div className="card p-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent mb-6">
              ✏️ Edit Group
            </h2>
            <GroupForm
              initialData={group}
              onSubmit={handleUpdate}
              loading={loading}
            />
            <button
              onClick={() => setIsEditing(false)}
              className="mt-6 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
            >
              ← Back to Group
            </button>
          </div>
        )}

        {isCreator && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary w-full bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-700 dark:to-amber-800 hover:from-amber-700 hover:to-amber-800 dark:hover:from-amber-600 dark:hover:to-amber-700"
          >
            ✏️ Edit Group
          </button>
        )}
      </div>
    </div>
  );
};

export default GroupDetailPage;
