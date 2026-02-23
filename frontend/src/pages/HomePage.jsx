import { useEffect, useState } from 'react';
import { useGroups } from '../hooks/useGroups';
import { useAuth } from '../hooks/useAuth';
import GroupCard from '../components/groups/GroupCard';
import CreateGroupModal from '../components/groups/CreateGroupModal';
import Spinner from '../components/common/Spinner';

const HomePage = () => {
  const { fetchPublicGroups, joinExistingGroup, loading } = useGroups();
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [subject, setSubject] = useState('');
  const [tags, setTags] = useState('');
  const [showModal, setShowModal] = useState(false);

  const loadGroups = async () => {
    const data = await fetchPublicGroups(subject, tags);
    setGroups(data);
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleFilter = () => {
    loadGroups();
  };

  const handleJoin = async (groupId) => {
    try {
      await joinExistingGroup(groupId);
      loadGroups();
    } catch (error) {
      console.error('Failed to join group:', error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-zinc-50 to-purple-50 dark:from-zinc-950 dark:to-zinc-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent mb-3">
              Study Groups
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">Discover and join study groups that match your interests</p>
          </div>
          {user && (
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 hover:from-purple-700 hover:to-purple-800 dark:hover:from-purple-600 dark:hover:to-purple-700 whitespace-nowrap"
            >
              ➕ Create Group
            </button>
          )}
        </div>

        <div className="card p-8 mb-12 border-l-4 border-l-purple-600 dark:border-l-purple-500">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">🔍 Search Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Search by subject..."
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., dsa, algorithms"
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

        {!loading && groups.length === 0 && (
          <div className="text-center py-16 card">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg font-medium">No groups found</p>
            <p className="text-zinc-500 dark:text-zinc-500 mt-2">Try adjusting your search criteria</p>
          </div>
        )}

        {!loading && groups.length > 0 && (
          <div>
            <div className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
              Found <span className="font-bold text-purple-600 dark:text-purple-400">{groups.length}</span> groups
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <GroupCard
                  key={group._id}
                  group={group}
                  onJoin={() => handleJoin(group._id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <CreateGroupModal
          onClose={() => setShowModal(false)}
          onCreated={loadGroups}
        />
      )}
    </div>
  );
};

export default HomePage;
