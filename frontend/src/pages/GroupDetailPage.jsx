import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGroups } from '../hooks/useGroups';
import GroupDashboard from '../components/groups/GroupDashboard';
import MemberList from '../components/groups/MemberList';
import GroupForm from '../components/groups/GroupForm';
import JoinRequestsPanel from '../components/groups/JoinRequestsPanel';
import GroupChat from '../components/groups/GroupChat';
import Spinner from '../components/common/Spinner';
import { useAuth } from '../hooks/useAuth';

const toId = (value) => value?._id || value?.id || value;
const sameId = (a, b) => toId(a)?.toString() === toId(b)?.toString();

const GroupDetailPage = () => {
  const { id } = useParams();
  const {
    fetchGroupById,
    updateExistingGroup,
    joinExistingGroup,
    requestToJoinExistingGroup,
    cancelExistingJoinRequest,
    fetchJoinRequests,
    approveExistingJoinRequest,
    rejectExistingJoinRequest,
    transferExistingOwnership,
    addMemberToExistingGroup,
    removeMemberFromExistingGroup,
    loading,
  } = useGroups();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadGroup = async () => {
    try {
      setHasLoaded(false);
      setError('');
      setNotice('');
      const data = await fetchGroupById(id);
      setGroup(data);
      if (data?.isOwner) {
        const pending = await fetchJoinRequests(id);
        setRequests(pending);
      } else {
        setRequests([]);
      }
    } catch (error) {
      setGroup(null);
      setRequests([]);
      setError(error.response?.data?.message || error.message || 'Failed to fetch group');
    } finally {
      setHasLoaded(true);
    }
  };

  useEffect(() => {
    loadGroup();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      setError('');
      const updated = await updateExistingGroup(id, formData);
      setGroup(updated);
      setIsEditing(false);
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to update group');
    }
  };

  const handleRequestJoin = async () => {
    try {
      setError('');
      const updated = await requestToJoinExistingGroup(id);
      setGroup((prev) => ({ ...prev, ...updated }));
      setNotice('Join request sent to the group owner.');
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to request access');
    }
  };

  const handleJoin = async () => {
    try {
      setError('');
      const updated = await joinExistingGroup(id);
      setGroup((prev) => ({ ...prev, ...updated, isMember: true }));
      setNotice('Joined group successfully.');
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to join group');
    }
  };

  const handleInvite = async (email) => {
    try {
      setError('');
      setNotice('');
      const updated = await addMemberToExistingGroup(id, email);
      setGroup(updated);
      setNotice('Member added successfully.');
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to add member');
    }
  };

  const handleKick = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      setError('');
      setNotice('');
      const updated = await removeMemberFromExistingGroup(id, userId);
      setGroup(updated);
      setNotice('Member removed successfully.');
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to remove member');
    }
  };

  const handleCancelRequest = async () => {
    try {
      setError('');
      await cancelExistingJoinRequest(id);
      setGroup((prev) => ({ ...prev, requestStatus: null }));
      setNotice('Join request cancelled.');
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to cancel request');
    }
  };

  const handleApprove = async (requestId) => {
    try {
      setError('');
      const updated = await approveExistingJoinRequest(id, requestId);
      setGroup(updated);
      setRequests((prev) => prev.filter((request) => request._id !== requestId));
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      setError('');
      await rejectExistingJoinRequest(id, requestId);
      setRequests((prev) => prev.filter((request) => request._id !== requestId));
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to reject request');
    }
  };

  const handleTransfer = async () => {
    if (!selectedOwner) return;
    try {
      setError('');
      const updated = await transferExistingOwnership(id, selectedOwner);
      setGroup(updated);
      setNotice('Ownership transferred.');
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to transfer ownership');
    }
  };

  if (loading || !hasLoaded) return <Spinner />;

  if (!group) {
    return (
      <div className="bg-gradient-to-b from-zinc-50 to-purple-50 dark:from-zinc-950 dark:to-zinc-900 py-6 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card p-4 md:p-8 border-l-4 border-l-red-600">
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-3">Group Unavailable</h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              {error || 'This group could not be loaded.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const userId = user?.id || user?._id;
  const isCreator = Boolean(group.isOwner || group.isCreator || (userId && sameId(group.createdBy, userId)));
  const isMember = Boolean(group.isMember || group.members?.some((member) => sameId(member, userId)));
  const canRequest = user && !isMember && !isCreator && group.requestStatus !== 'pending' && !group.isFull;
  const canSeePrivateTools = isMember || isCreator;

  return (
    <div className="bg-gradient-to-b from-zinc-50 to-purple-50 dark:from-zinc-950 dark:to-zinc-900 py-6 md:py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {!isEditing ? (
          <>
            <GroupDashboard group={group} />
            {notice && (
              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-200 rounded-lg">
                {notice}
              </div>
            )}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg">
                {error}
              </div>
            )}

            {!canSeePrivateTools && (
              <div className="card p-4 md:p-8 border-l-4 border-l-purple-600 dark:border-l-purple-500">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Access</h2>
                {canRequest && (
                  <button
                    onClick={group.visibility === 'public' ? handleJoin : handleRequestJoin}
                    disabled={loading}
                    className="btn-primary w-full"
                  >
                    {group.visibility === 'public' ? 'Join Group' : 'Request to Join'}
                  </button>
                )}
                {group.requestStatus === 'pending' && (
                  <div className="space-y-3">
                    <p className="text-amber-700 dark:text-amber-300 font-semibold">Your request is pending owner approval.</p>
                    <button onClick={handleCancelRequest} disabled={loading} className="btn-primary w-full bg-gradient-to-r from-zinc-600 to-zinc-700">
                      Cancel Request
                    </button>
                  </div>
                )}
                {group.isFull && !group.requestStatus && (
                  <p className="text-zinc-600 dark:text-zinc-400">This group is full.</p>
                )}
              </div>
            )}

            {isCreator && (
              <>
                <JoinRequestsPanel
                  requests={requests}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  loading={loading}
                />

                <div className="card p-4 md:p-8 border-l-4 border-l-purple-600">
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">➕ Add Member</h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const email = e.target.email.value.trim();
                      if (email) {
                        handleInvite(email);
                        e.target.reset();
                      }
                    }}
                    className="flex flex-col md:flex-row gap-3"
                  >
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Enter student email..."
                      className="input-field flex-1"
                    />
                    <button type="submit" disabled={loading} className="btn-primary">
                      Add Student
                    </button>
                  </form>
                </div>

                <div className="card p-4 md:p-8 border-l-4 border-l-blue-600">
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Transfer Ownership</h2>
                  <div className="flex flex-col md:flex-row gap-3">
                    <select
                      value={selectedOwner}
                      onChange={(e) => setSelectedOwner(e.target.value)}
                      className="input-field flex-1"
                    >
                      <option value="">Select a member</option>
                      {group.members
                        .filter((member) => !sameId(member, userId))
                        .map((member) => (
                          <option key={member._id || member.id} value={member._id || member.id}>
                            {member.name}
                          </option>
                        ))}
                    </select>
                    <button onClick={handleTransfer} disabled={!selectedOwner || loading} className="btn-primary">
                      Transfer
                    </button>
                  </div>
                </div>
              </>
            )}

            {canSeePrivateTools && (
              <MemberList
                members={group.members}
                onKick={isCreator ? handleKick : null}
                ownerId={group.createdBy?._id || group.createdBy}
              />
            )}
            {canSeePrivateTools && <GroupChat group={group} />}
          </>
        ) : (
          <div className="card p-4 md:p-8">
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
